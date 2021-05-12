import { Page} from 'puppeteer';
import config from './config';

type BookRecommendation = {bookTitle: string, ISBN?: string}

export default async function pickBookForCategory (page: Page, categoryLink: string): Promise<BookRecommendation> {
  await page.goto(config.goodreadsBaseUrl + categoryLink);
  const goodreadsLink = await page.evaluate(() => {
    const nomineeLinks = document.querySelectorAll('.pollAnswer__bookLink');
    const randomPick = Math.floor(Math.random() * nomineeLinks.length);

    return nomineeLinks[randomPick].getAttribute('href');
  });

  await page.goto(config.goodreadsBaseUrl + goodreadsLink);

  const bookTitle = await page.evaluate(() => document.querySelector('#bookTitle').textContent.trim());

  const ISBN = await page.evaluate(() => {
    const bookDataBox = document.querySelector('#bookDataBox').children;
    let ISBN;
    // TODO: ERROR HANDLING
    for (let i = 0; i < bookDataBox.length; i++) {
      const dataRowTitle = bookDataBox[i].getElementsByClassName('infoBoxRowTitle')[0]?.textContent;

      if (/ISBN/g.test(dataRowTitle) && bookDataBox[i].getElementsByClassName('infoBoxRowItem')[0]) {
        ISBN = bookDataBox[i].getElementsByClassName('infoBoxRowItem')[0].textContent.trim().slice(0, 10);
        break;
      }
    }

    return ISBN;
  });

  return {bookTitle, ISBN};
}


