import { Page} from 'puppeteer';

export default async function getCategories (page: Page) {
  return page.evaluate(() => {
    type Choice = {title: string, value: string};
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
