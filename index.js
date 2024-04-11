const { chromium } = require("playwright");
const fs = require("fs");

async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");

  // wait for the articles to load
  await page.waitForSelector(".athing .title");

  // get the titles and URLs of the top 10 articles
  const articles = await page.$$eval(".athing", links => {
    return links.slice(0, 10).map(link => {
      const titleElement = link.querySelector('.title a');
      const title = titleElement ? titleElement.innerText.trim() : '';
      const urlElement = link.querySelector('.title a');
      const url = urlElement ? urlElement.href : '';
      return { title, url };
    });
  });

  // save the articles to a CSV file
  const csvContent = articles.map(article => `${article.title},${article.url}`).join("\n");
  fs.writeFileSync("hacker_news_articles.csv", csvContent);

  console.log("Articles saved to hacker_news_articles.csv");

  // close browser
  await browser.close();
}

(async () => {
  try {
    await saveHackerNewsArticles();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
