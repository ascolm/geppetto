import { Page} from 'puppeteer';
import { Choice } from './types';

export default async function getCategories (page: Page): Promise<Choice[]> {
  return page.evaluate(() => {
    const categoryChoices: Choice[] = [];

    const categoryNodes = document.querySelectorAll('div.category');

    categoryNodes.forEach(category => {
      const categoryName = category.children[0].children[0].textContent;
      const categoryLink = category.children[0].getAttribute('href');
      categoryChoices.push({title: categoryName.trim(), value: categoryLink});
    });

    return categoryChoices;
  });
}
