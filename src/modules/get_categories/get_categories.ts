import { Page} from 'puppeteer';
import { Choice } from '../../types';

export default async function getCategories (page: Page): Promise<Choice[]> {
  return page.evaluate(() => {
    const categoryChoices: Choice[] = [];

    const categoryNodes = document.querySelectorAll('div.category');

    categoryNodes.forEach(category => {
      let categoryName: string | null = null;
      let categoryLink: string | null = null;

      try {
        categoryName = category.children[0].children[0].textContent;
        categoryLink = category.children[0].getAttribute('href');
      } catch {
        console.warn('Some categories could not be fetched from Goodreads.');
      }

      if (categoryName && categoryLink) {
        categoryChoices.push({title: categoryName.trim(), value: categoryLink});
      }
    });

    if (categoryChoices.length === 0) throw new Error('No categories found from Goodreads page.');

    return categoryChoices;
  });
}
