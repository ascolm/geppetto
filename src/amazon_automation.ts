import * as puppeteer from 'puppeteer';
import { BookRecommendation } from './types';
import config from './config';
import chromeLauncher from './chrome_launcher';
import { buildAmazonQuery } from './helpers';

export default async function amazonAutomation (book: BookRecommendation) {
  let chromeBrowser;
  let fallbackToHeadless = false;

  try {
    chromeBrowser = await puppeteer.launch({
      headless: false,
      args: ['--start-maximized'],
      defaultViewport: null,
      executablePath: config.chromeExecutablePath
    });
  } catch (err) {
    console.log('Automation failed to launch Chrome from the provided path. Reverting to Chromium, will try to launch the book\'s page in Chrome later.');
    fallbackToHeadless = true;

    chromeBrowser = await puppeteer.launch({
      args:[
        '--disable-gpu',
        '--no-sandbox',
        '--no-zygote',
        '--single-process'
      ]
    });
  }

  const chromePage = await chromeBrowser.newPage();

  if (book.ISBN) {
    await chromePage.goto(config.amazonBaseUrl + config.amazonPrintSubDir + book.ISBN);
  } else {
    const titleSearchParameter = new URLSearchParams(book.bookTitle).toString().slice(0, -1);
    await chromePage.goto(buildAmazonQuery(titleSearchParameter));

    const bookLink = await chromePage.evaluate(() => {
      function findFormatLink (formats: string[], links: HTMLCollectionOf<HTMLAnchorElement>) {
        for (let i = 0; i < formats.length; i++) {
          for (let j = 0; j < links.length; j++) {
            if (links[j].textContent === formats[i]) {
              return links[j].getAttribute('href');
            }
          }
        }
      }
      const links = document.querySelector('div[data-index="0"]').getElementsByTagName('a');
      const formatLink = findFormatLink (['Paperback', 'Hardcover'], links);
      return formatLink;
    });

    await chromePage.goto(config.amazonBaseUrl + bookLink);
  }

  if (fallbackToHeadless) {
    const url = chromePage.url();

    try {
      await chromeLauncher(url);
    } catch (err) {
      console.log('Could not launch the recommended book\'s page with Chrome. \n Why don\'t you check it out yourself via the link below? Otherwise I won\'t be able to complete this assignment within 2021.');
      console.log(url);
    }
  }

  try {
    await chromePage.click('#add-to-cart-button');
  } catch {
    await chromePage.click('a[title="See All Buying Options"]');
    await chromePage.waitForSelector('input[name="submit.addToCart"]', {visible: true});
    await chromePage.click('input[name="submit.addToCart"]');
  }

  await chromePage.waitForSelector('#hlb-ptc-btn-native', {visible: true});
  await chromePage.click('#hlb-ptc-btn-native');
}
