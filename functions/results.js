import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

exports.handler = async function(event, context) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.goto('https://spacejelly.dev/');

  await page.focus('#search-query')
  await page.keyboard.type('api');

  const results = await page.$$eval('#search-query + div a', (links) => {
    return links.map(link => {
      return {
        text: link.innerText,
        href: link.href
      }
    });
  });

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'Ok',
      results
    })
  };
}