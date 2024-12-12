import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";

// Configure chromium
chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

export const handler = async (event, context) => {
  let browser = null;

  try {
    console.log("Launching browser...");
    const path = process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath());
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: path,
      headless: chromium.headless,
    });

    console.log("Creating new page...");
    const page = await browser.newPage();

    await page.goto('https://spacejelly.dev/', { waitUntil: 'networkidle0' });
    console.log('Page loaded');

    const title = await page.title();
    const description = await page.$eval('meta[name="description"]', element => element.content);
    console.log('Data extracted:', { title, description });

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'Ok',
        page: {
          title,
          description
        }
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 'Error',
        message: error.message
      })
    };
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};