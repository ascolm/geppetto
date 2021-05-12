import { Page} from 'puppeteer';

export function getISBN (page: Page) {
  return page.evaluate(() => {
    const bookDataBox = document.querySelector('#bookDataBox').children;
    let ISBN;
    for (let i = 0; i < bookDataBox.length; i++) {
      const dataRowTitle = bookDataBox[i].getElementsByClassName('infoBoxRowTitle')[0]?.textContent;

      if (/ISBN/g.test(dataRowTitle) && bookDataBox[i].getElementsByClassName('infoBoxRowItem')[0]) {
        ISBN = bookDataBox[i].getElementsByClassName('infoBoxRowItem')[0].textContent.trim().slice(0, 10);
        break;
      }
    }
    return ISBN;
  });
}

export function getLinkToRandomBook (page: Page) {
  return page.evaluate(() => {
    const nomineeLinks = document.querySelectorAll('.pollAnswer__bookLink');
    const randomPick = Math.floor(Math.random() * nomineeLinks.length);

    return nomineeLinks[randomPick].getAttribute('href');
  });
}