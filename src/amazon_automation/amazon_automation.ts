import { BookRecommendation } from '../types';
import config from '../config';
import chromeLauncher from './chrome_launcher';
import { buildSearchUrlFrom, launchLocalChrome, launchHeadless, findLinkToPreferredFormat, parameterizeTitle, getBookLinkByFormatPreference } from './amazon_automation_helpers';

export default async function amazonAutomation (book: BookRecommendation) {
  let chromeBrowser;
  let fallbackToHeadless = false;

  // Launch Chrome, if fails launch Chromium
  try {
    chromeBrowser = await launchLocalChrome();
  } catch (err) {
    console.log('Automation failed to launch Chrome from the provided path. Reverting to Chromium, will try to launch the book\'s page in Chrome later.');
    fallbackToHeadless = true;
    chromeBrowser = await launchHeadless();
  }

  const chromePage = await chromeBrowser.newPage();

  // Construct URL from ISBN - if ISBN doesn't exist, search by title in Amazon
  if (book.ISBN) {
    await chromePage.goto(config.amazonBaseUrl + config.amazonPrintSubDir + book.ISBN);
  } else {
    const titleSearchParameter = parameterizeTitle(book.bookTitle);
    await chromePage.goto(buildSearchUrlFrom(titleSearchParameter));

    const bookLink = await getBookLinkByFormatPreference(chromePage, ['Paperback', 'Hardcover']);
    await chromePage.goto(config.amazonBaseUrl + bookLink);
  }

  // If running in headless, try launching the book's url with chrome-launcher. If that fails as well, print page's url to console.
  if (fallbackToHeadless) {
    const url = chromePage.url();

    try {
      await chromeLauncher(url);
    } catch (err) {
      console.log('Could not launch the recommended book\'s page with Chrome. \nWhy don\'t you check it out yourself via the link below? Otherwise I won\'t be able to complete this assignment within 2021.');
      console.log(url);
      await chromePage.close();
      return;
    }
  }

  // Add book to cart (if not directly sold from Amazon, get the first buying option and add that to cart)
  try {
    await chromePage.click('#add-to-cart-button');
  } catch {
    await chromePage.click('a[title="See All Buying Options"]');
    await chromePage.waitForSelector('input[name="submit.addToCart"]', {visible: true});
    await chromePage.click('input[name="submit.addToCart"]');
  }

  // Navigate to checkout
  await chromePage.waitForSelector('#hlb-ptc-btn-native', {visible: true});
  await chromePage.click('#hlb-ptc-btn-native');
}