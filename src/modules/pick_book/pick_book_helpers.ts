import { Page} from 'puppeteer';

export function getISBN (page: Page): Promise<string | undefined> {
  return page.evaluate(() => {
    const bookDataBox = document.querySelector('#bookDataBox')?.children;
    if (!bookDataBox) throw new Error('Book details could not be found on Goodreads book page.');

    let ISBN;
    for (let i = 0; i < bookDataBox.length; i++) {
      const dataRowTitle = bookDataBox[i].getElementsByClassName('infoBoxRowTitle')[0]?.textContent;
      const dataRowItem = bookDataBox[i].getElementsByClassName('infoBoxRowItem')[0]?.textContent;
      if (!dataRowTitle || !dataRowItem) continue;

      if (/ISBN/g.test(dataRowTitle)) {
        ISBN = dataRowItem.trim().slice(0, 10);
        break;
      }
    }
    return ISBN;
  });
}

export function getLinkToRandomBook (page: Page): Promise<string> {
  return page.evaluate(() => {
    const nomineeLinks = document.querySelectorAll('.pollAnswer__bookLink');
    const randomPick = Math.floor(Math.random() * nomineeLinks.length);

    if (nomineeLinks.length === 0 || !nomineeLinks[randomPick].getAttribute('href')) {
      throw new Error('Could not find any book links for the selected genre in Goodreads\' best-of nominees page');
    }

    return nomineeLinks[randomPick].getAttribute('href')!;
  });
}