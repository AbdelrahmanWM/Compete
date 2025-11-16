import { BrowserSDK } from "./sdk/sdk.js";
import { chromium } from "playwright";
import dotenv from "dotenv";
dotenv.config();

const MAX_TIMEOUT = 20000;
const SELECTOR_TIMEOUT = 10000;

function parseCompact(str: string | null): number | null {
  if (!str) return null;
  const s = str.toUpperCase();
  if (s.endsWith("K")) return Number(s.replace("K", "")) * 1000;
  if (s.endsWith("M")) return Number(s.replace("M", "")) * 1_000_000;
  const numMatch = str.replace(/,/g, "").match(/[\d.]+/);
  return numMatch ? Number(numMatch[0]) : null;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function scrapeEbayProduct(itemUrl: string) {
  const sdk = new BrowserSDK(process.env.BROWSER_API_KEY!);
  let browser: any = null;

  try {
    console.log("💻 Creating Browser.cash session...");
    const session = await sdk.createSession({ region: "gcp-usc1-1" });
    const cdp = await sdk.getBrowserCDPUrl();

    console.log("🔗 Connecting Playwright to Browser.cash...");
    browser = await chromium.connectOverCDP(cdp);
    const context = await browser.newContext({
      viewport: { width: 1400, height: 900 },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121 Safari/537.36",
      javaScriptEnabled: true,
      locale: "en-CA",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(MAX_TIMEOUT);

    console.log("🌐 Loading product URL:", itemUrl);
    try {
      await page.goto(itemUrl, {
        waitUntil: "domcontentloaded",
        timeout: MAX_TIMEOUT,
      });
      await page
        .waitForSelector("h1[itemprop='name']", {
          timeout: SELECTOR_TIMEOUT,
        })
        .catch(() => console.warn("⚠ Title selector not found, continuing..."));
    } catch {
      console.warn("⚠ Navigation timeout, continuing anyway…");
    }

    await delay(50);

    await page.evaluate(async () => {
      const viewportHeight = window.innerHeight;
      const totalHeight = document.body.scrollHeight;
      for (let y = 0; y < totalHeight; y += viewportHeight) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 20));
      }
    });
    await delay(50);

    const popupSelectors = [
      'button:has-text("Continue")',
      'button:has-text("No Thanks")',
      'button[aria-label="Close"]',
      ".overlay-close",
    ];
    for (const sel of popupSelectors) {
      try {
        const el = await page.$(sel);
        if (el) {
          console.log("🟡 Closing popup →", sel);
          await el.click({ force: true });
          await delay(50);
        }
      } catch {}
    }

    const botCheck = await page.$("text='Check your browser before accessing'");
    if (botCheck) {
      console.log("⚠ eBay blocked automated access.");
      return null;
    }

    // --- SCRAPE FIELDS ---

    const title =
      (await page
        .$eval("h1[itemprop='name']", (el) => el.textContent?.trim())
        .catch(() => null)) ||
      (await page
        .$eval('div[data-testid="x-item-title"] h1 span', (el) =>
          el.textContent?.trim()
        )
        .catch(() => null));

    const priceStr =
      (await page
        .$eval('span[itemprop="price"]', (el) => el.textContent)
        .catch(() => null)) ||
      (await page
        .$eval(
          'div[data-testid="x-price-primary"] span',
          (el) => el.textContent
        )
        .catch(() => null));

    let price: number | null = null;
    let currency: string | null = null;

    if (priceStr) {
      const numMatch = priceStr.replace(/,/g, "").match(/[\d.]+/);
      price = numMatch ? Number(numMatch[0]) : null;

      const currencyMatch = priceStr.match(/^([^\d]*)/);
      if (currencyMatch) {
        const curr = currencyMatch[1].trim();
        if (curr.includes("US")) currency = "USD";
        else if (curr.includes("C")) currency = "CAD";
        else currency = curr || null;
      }
    }

    const shippingStr =
      (await page
        .$eval("span[data-testid='shipping-cost']", (el) => el.textContent)
        .catch(() => null)) ||
      (await page
        .$eval(
          "div.ux-labels-values--shipping span.ux-textspans--BOLD",
          (el) => el.textContent
        )
        .catch(() => "0"));

    const shipping_cost = shippingStr?.toLowerCase().includes("free")
      ? 0
      : parseCompact(shippingStr);

    const condition =
      (await page
        .$eval(
          'div[data-testid="x-item-condition"] div.x-item-condition-text span.ux-textspans',
          (el) => el.textContent?.trim()
        )
        .catch(() => null)) ||
      (await page
        .$eval('div[itemprop="itemCondition"]', (el) => el.textContent?.trim())
        .catch(() => null));

    const quantityAvailable =
      (await page
        .$eval('span[itemprop="inventoryLevel"]', (el) =>
          parseInt(el.textContent || "0")
        )
        .catch(() => null)) ||
      (await page
        .$eval(
          'div[data-testid="x-quantity"] span.ux-textspans--SECONDARY',
          (el) => {
            const match = (el.textContent || "").match(/\d+/);
            return match ? Number(match[0]) : null;
          }
        )
        .catch(() => null));

    const totalSold =
      (await page
        .$eval('span[itemprop="soldQuantity"]', (el) => {
          const match = (el.textContent || "").match(/[\d,]+/);
          return match ? Number(match[0].replace(/,/g, "")) : null;
        })
        .catch(() => null)) ||
      (await page
        .$eval(
          'div[data-testid="x-quantity"] span.ux-textspans--BOLD',
          (el) => {
            const match = (el.textContent || "").match(/\d+/);
            return match ? Number(match[0]) : null;
          }
        )
        .catch(() => null));

    const image =
      (await page
        .$eval("img[itemprop='image']", (el) => el.getAttribute("src"))
        .catch(() => null)) ||
      (await page
        .$eval("div.ux-image-carousel-container img", (el) =>
          el.getAttribute("src")
        )
        .catch(() => null));

    // ⭐ NEW FIELD 1: Last 24h signal (raw text)
    const last24hoursText = await page
      .$eval(
        'div[data-testid="x-ebay-signal"] .ux-textspans',
        (el) => el.textContent?.trim() || null
      )
      .catch(() => null);

    // ⭐ NEW FIELD 2: Watchers count (raw number inside button)
    const watchersCount = await page
      .$eval("button.x-watch-heart-btn span.x-watch-heart-btn-text", (el) => {
        const t = el.textContent?.trim() || "";
        const m = t.match(/\d+/);
        return m ? Number(m[0]) : null;
      })
      .catch(() => null);

    const result = {
      product: {
        title,
        ebay_item_id: itemUrl.split("/itm/")[1]?.split("/")[0] || null,
        product_url: itemUrl,
        price,
        currency,
        shipping_cost,
        condition,
        quantity_available: quantityAvailable,
        total_sold_listing: totalSold,
        last_24_hours: last24hoursText, // ⭐ TEXT ONLY
        watchers_count: watchersCount, // ⭐ NUMBER
        images: image ? [image] : [],
      },
      timestamp: new Date().toISOString(),
    };

    console.log("✅ Product scrape complete:", result);

    return result;
  } catch (error) {
    console.error("❌ Error during scraping:", error);
    throw error;
  } finally {
    try {
      if (browser) await browser.close();
    } catch {}

    try {
      await sdk.endSession();
    } catch {}
  }
}

if (require.main === module) {
  scrapeEbayProduct("https://www.ebay.ca/itm/286422982038")
    .then(console.log)
    .catch(console.error);
}
