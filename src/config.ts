const config = {
  goodreadsBestOfUrl: 'https://www.goodreads.com/choiceawards/best-books-2020',
  goodreadsBaseUrl: 'https://www.goodreads.com',
  chromeExecutablePath: 'zz/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  amazonQueryFormat: 'https://www.amazon.com/s?k={{SEARCHPLACEHOLDER}}&i=stripbooks-intl-ship',  // {{SEARCHPLACEHOLDER}} gets replaced with search term in the associated helper function
  amazonBaseUrl: 'https://www.amazon.com',
  amazonPrintSubDir: '/dp/'
};

export default config;