import { BrowserSDK } from "./sdk/sdk.js";
import { chromium } from "playwright";
import dotenv from "dotenv";
dotenv.config();

const MAX_TIMEOUT = 45000;
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

export async function getSellerInfo(url: string) {
  const sdk = new BrowserSDK(process.env.BROWSER_API_KEY!);
  let browser: any = null;

  try {
    console.log("💻 Creating Browser.cash session...");
    await sdk.createSession({ region: "gcp-usc1-1" });
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

    console.log("🔍 Loading store:", url);
    await page.goto(url, { waitUntil: "networkidle" });

    // Click "All items" tab if exists
    const allItemsTab = await page.$('a[href*="Store-Items"]');
    if (allItemsTab) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle" }),
        allItemsTab.click(),
      ]);
      console.log("📄 Navigated to All Items tab");
    }

    // Set filters: Buy It Now + New
    const buyingFormatBtn = await page.$(
      'span.filter-menu-button:has-text("Buying Format") button'
    );
    if (buyingFormatBtn) {
      await buyingFormatBtn.click();
      await delay(500);
      const buyItNow = await page.$(
        'span.filter-menu-button__text:has-text("Buy It Now")'
      );
      if (buyItNow) {
        await buyItNow.click();
        await delay(500);
      }
    }

    const conditionBtn = await page.$(
      'span.filter-menu-button:has-text("Condition") button'
    );
    if (conditionBtn) {
      await conditionBtn.click();
      await delay(500);
      const newCondition = await page.$(
        'span.filter-menu-button__text:has-text("New")'
      );
      if (newCondition) {
        await newCondition.click();
        await delay(500);
      }
    }

    // Scroll slowly to load items
    let first10Items: { title: string | null; link: string | null }[] = [];
    await page.waitForTimeout(1000); // stabilize
    for (let i = 0; i < 30; i++) {
      const cards = await page.$$(".str-items-grid .str-item-card");
      if (cards.length >= 10) break;
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(500);
    }

    // Seller info
    let sellerName: string | null = null;
    try {
      await page.waitForSelector(".str-seller-card__store-name a", {
        timeout: 8000,
      });
      sellerName = await page.$eval(
        ".str-seller-card__store-name a",
        (el: HTMLElement) => (el as HTMLElement).innerText.trim()
      );
    } catch {}

    const sellerLogo =
      (await page
        .$eval(".str-header__logo--img", (el: { getAttribute: (arg0: string) => any; }) => el.getAttribute("src"))
        .catch(() => null)) || null;

    let spans: (string | null)[] = [];
    try {
      await page.waitForSelector(".str-seller-card__store-stats-content", {
        timeout: 8000,
      });
      spans = await page.$$eval(
        ".str-seller-card__store-stats-content .str-text-span.BOLD",
        (els: any[]) => els.map((e) => e.textContent?.trim() || null)
      );
    } catch {}

    // Overview/About tab
    try {
      const aboutTab = await page.$('div[role="tab"]:has-text("About")');
      if (aboutTab) {
        await Promise.all([page.waitForTimeout(500), aboutTab.click()]);
      }
    } catch {}

    let overview: string | null = null;
    try {
      overview = await page.$eval(
        ".str-about-section, .str-about-content",
        (el: { textContent: string; }) => el.textContent?.trim()
      );
    } catch {}

    // Get first 10 items
    first10Items = await page.$$eval(
      ".str-items-grid .str-item-card",
      (cards: { querySelector: (arg0: string) => HTMLAnchorElement; }[]) =>
        cards.slice(0, 10).map((card: { querySelector: (arg0: string) => HTMLAnchorElement; }) => {
          const linkEl = card.querySelector("a") as HTMLAnchorElement;
          return { title: linkEl?.textContent?.trim() || null, link: linkEl?.href || null };
        })
    );

    const result = {
      store_url: url,
      seller_name: sellerName,
      seller_logo: sellerLogo,
      overview,
      feedback: spans?.[0] ?? null,
      items_sold: parseCompact(spans?.[1] ?? null),
      followers: parseCompact(spans?.[2] ?? null),
      first_10_items: first10Items,
      last_checked: new Date().toISOString(),
    };

    console.log("✅ Store scrape complete:", result);
    return result;
  } catch (error) {
    console.error("❌ Error during scraping:", error);
    throw error;
  } finally {
    try {
      if (browser) await browser.close();
      await sdk.endSession();
    } catch {}
  }
}

// Example usage
if (require.main === module) {
  getSellerInfo("https://www.ebay.ca/str/surplusbydesign")
    .then(console.log)
    .catch(console.error);
}