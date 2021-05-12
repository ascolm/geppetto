import * as puppeteer from 'puppeteer';
import config from '../../config';

export function launchLocalChrome (): Promise<puppeteer.Browser> {
  return puppeteer.launch({
    headless: false,
    args: ['--start-maximized'],
    defaultViewport: null,
    executablePath: config.chromeExecutablePath
  });
}

export function launchHeadless (): Promise<puppeteer.Browser> {
  return puppeteer.launch({
    args:[
      '--disable-gpu',
      '--no-sandbox',
      '--no-zygote',
      '--single-process'
    ]
  });
}

export function parameterizeTitle (title: string): string {
  return new URLSearchParams(title).toString().slice(0, -1);
}

export function buildSearchUrlFrom (searchTerm: string): string {
  const queryTemplate = config.amazonQueryFormat;
  return queryTemplate.replace('{{SEARCHPLACEHOLDER}}', searchTerm);
}

export function findLinkToPreferredFormat (formats: string[], links: HTMLCollectionOf<HTMLAnchorElement>): string {
  for (let i = 0; i < formats.length; i++) {
    for (let j = 0; j < links.length; j++) {
      const linkDescription = links[j].textContent;
      const linkHref = links[j].getAttribute('href');

      if (linkDescription === formats[i] && linkHref) {
        return links[j].getAttribute('href')!;
      }
    }
  }

  throw new Error ('No link found to preferred format on Amazon\'s search results page');
}

export function getBookLinkByFormatPreference (page: puppeteer.Page, formats: string[]): Promise<string> {
  return page.evaluate(() => {
    const links = document.querySelector('div[data-index="0"]')?.getElementsByTagName('a');

    if (!links || links.length === 0) {
      throw new Error('Could not get a link to the chosen book format from Amazon\'s search results page.');
    }

    const formatLink = findLinkToPreferredFormat(formats, links);
    return formatLink;
  });
}