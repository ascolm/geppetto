import { Page} from 'puppeteer';
import config from '../config';
import { BookRecommendation } from '../types';
import { getISBN, getLinkToRandomBook } from './pick_book_helpers';

export default async function pickBookForCategory (page: Page, categoryLink: string): Promise<BookRecommendation> {
  const categoryPage = config.goodreadsBaseUrl + categoryLink;
  await page.goto(categoryPage);

  const goodreadsLink = await getLinkToRandomBook(page);
  await page.goto(config.goodreadsBaseUrl + goodreadsLink);

  const bookTitle = await page.evaluate(() => document.querySelector('#bookTitle').textContent.trim());
  const ISBN = await getISBN(page);

  return {bookTitle, ISBN};
}