import puppeteer from "puppeteer";

export const handler = async (event, context) => {
  let browser = null;
  try {
    // Launch with minimal options
    browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto('https://spacejelly.dev/', { waitUntil: 'networkidle0' });

    const title = await page.title();
    const description = await page.$eval('meta[name="description"]', element => element.content);

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