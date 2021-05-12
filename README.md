# Geppetto

App overview:
  - This app runs in CLI and makes use of Puppeteer for automation.
  - Gets a list of categories from Goodreads best-of page (using Chromium, as Goodreads API is deprecated).
  - Prompts user to choose a category in CLI (using npm package 'prompt').
  - Picks a random book from that category's best-of nomineees in Goodreads.
  - Launches chrome, goes into Amazon, finds the book (either via ISBN or title), adds it to cart (either sold directly from Amazon or third parties) and proceeds to checkout.
    - If Puppeteer fails to launch the local Chrome executable, the program continues the automation in Chromium to get the Amazon url of the selected book.
    - Tries to launch the book's url in Chrome, this time using npm chrome-launcher (which has a built-in logic to find a local Chrome executable).
    - If that also fails, prints the URL to console instead and expresses discontent.

Setup instructions:

1. Clone the repo
```
git clone https://github.com/ascolm/geppetto.git
cd geppetto
```

2. Install dependencies
```
npm install
```

3. Open src/config.ts file and change the value of "chromeExecutablePath" property to the path of your local Chrome executable.

4. Launch the app:
```
npm start
```
