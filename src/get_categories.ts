import { Page} from 'puppeteer';
import { Choice } from './types';

export default async function getCategories (page: Page): Promise<Choice[]> {
  return page.evaluate(() => {
    const categoryChoices: Choice[] = [];

    const categoryNodes = document.querySelectorAll('div.category');

    categoryNodes.forEach(category => {
      let categoryName = category.children[0].children[0].textContent;
      if (/^\n.*\n$/.test(categoryName)) {
        categoryName = categoryName.slice(1, categoryName.length - 1);
      }

      const categoryLink = category.children[0].getAttribute('href');
      categoryChoices.push({title: categoryName, value: categoryLink});
    });

    return categoryChoices;
  });
}
