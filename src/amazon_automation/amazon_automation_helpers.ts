import * as puppeteer from 'puppeteer';
import config from '../config';

export function launchLocalChrome () {
  return puppeteer.launch({
    headless: false,
    args: ['--start-maximized'],
    defaultViewport: null,
    executablePath: config.chromeExecutablePath
  });
}

export function launchHeadless () {
  return puppeteer.launch({
    args:[
      '--disable-gpu',
      '--no-sandbox',
      '--no-zygote',
      '--single-process'
    ]
  });
}

export function parameterizeTitle (title: string) {
  return new URLSearchParams(title).toString().slice(0, -1);
}

export function buildSearchUrlFrom (searchTerm: string) {
  const queryTemplate = config.amazonQueryFormat;
  return queryTemplate.replace('{{SEARCHPLACEHOLDER}}', searchTerm);
}

export function findLinkToPreferredFormat (formats: string[], links: HTMLCollectionOf<HTMLAnchorElement>) {
  for (let i = 0; i < formats.length; i++) {
    for (let j = 0; j < links.length; j++) {
      if (links[j].textContent === formats[i]) {
        return links[j].getAttribute('href');
      }
    }
  }
}

export function getBookLinkByFormatPreference (page: puppeteer.Page, formats: string[]) {
  return page.evaluate(() => {
    const links = document.querySelector('div[data-index="0"]').getElementsByTagName('a');
    const formatLink = findLinkToPreferredFormat(formats, links);
    return formatLink;
  });
}