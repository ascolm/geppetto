import * as puppeteer from 'puppeteer';
import  * as prompts from 'prompts';
import config from './config';
import getCategories from './get_categories';
import pickBookForCategory from './pick_book_for_category';

(async () => {
  const browser = await puppeteer.launch({
    args:[
      '--disable-gpu',
      '--no-sandbox',
      '--no-zygote',
      '--single-process'
    ]
  });

  const page = await browser.newPage();

  await page.goto(config.goodreadsBestOfUrl);

  const categoryLinks = await getCategories(page);

  const response = await prompts({
    type: 'select',
    name: 'value',
    message: 'Choose a book category',
    choices: categoryLinks,
    initial: 0
  });

  const bookToRecommend = await pickBookForCategory(page, response.value);

  console.log(bookToRecommend);

  await browser.close();
})();