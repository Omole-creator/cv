import { test, expect } from "@playwright/test";
import path from "node:path";

const fixture = (name: string) => path.join(__dirname, "fixtures", name);

async function uploadFile(page: import("@playwright/test").Page, fileName: string) {
  await page.getByTestId("cv-file-input").setInputFiles(fixture(fileName));
}

test("logo is visible and no price is present on initial load", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("img[alt='JobMingle']").first()).toBeVisible();
  await expect(page.locator("body")).not.toContainText("₦7,500");
  await expect(page.locator("body")).not.toContainText("₦");
});

test("a docx with a table and an em dash surfaces both hard-gate failures", async ({ page }) => {
  await page.goto("/");
  await uploadFile(page, "table-and-emdash.docx");
  await expect(page.getByTestId("report")).toBeVisible({ timeout: 15_000 });
  const report = page.getByTestId("report");
  await expect(report).toContainText(/dash/i);
  await expect(report).toContainText(/table/i);
});

test("a well quantified pdf scores decently with no hard gates", async ({ page }) => {
  await page.goto("/");
  await uploadFile(page, "quantified.pdf");
  await expect(page.getByTestId("report")).toBeVisible({ timeout: 15_000 });
  const scoreText = await page.getByTestId("score-ring").getAttribute("aria-label");
  const score = Number(scoreText?.match(/\d+/)?.[0] ?? 0);
  expect(score).toBeGreaterThanOrEqual(60);
  await expect(page.getByText(/critical failures/i)).toHaveCount(0);
});

test("a photo upload is flagged as unreadable by ATS, without crashing", async ({ page }) => {
  await page.goto("/");
  await uploadFile(page, "photo.jpg");
  await expect(page.getByTestId("report")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId("report")).toContainText(/photo|scanned|image|text/i);
});

test("price stays hidden until the form is filled in, never before", async ({ page }) => {
  await page.goto("/");
  await uploadFile(page, "quantified.pdf");
  await expect(page.getByTestId("report")).toBeVisible({ timeout: 15_000 });
  await expect(page.locator("body")).not.toContainText("₦");

  await page.getByTestId("primary-cta").click();
  await expect(page.getByTestId("request-form")).toBeVisible();
  await expect(page.locator("body")).not.toContainText("₦");

  // Once they've picked a band and a service, showing the price live is
  // expected, standard checkout-style UX behind a deliberate click.
  await page.getByTestId("band-senior").check();
  await page.getByTestId("service-cv").check();
  await expect(page.getByTestId("form-quote")).toContainText("₦15,000");
});

test("the request form sends a spaced, priced WhatsApp message and rotates numbers", async ({
  page,
  context,
}) => {
  // wa.me is a real external service that redirects; intercept and abort the
  // navigation so the test asserts on the URL our own code built, not on
  // whatever wa.me redirects to over the network.
  const requestedUrls: string[] = [];
  await context.route("https://wa.me/**", async (route) => {
    requestedUrls.push(route.request().url());
    await route.abort();
  });

  await page.goto("/");
  await uploadFile(page, "quantified.pdf");
  await expect(page.getByTestId("report")).toBeVisible({ timeout: 15_000 });

  await page.getByTestId("primary-cta").click();
  await page.getByTestId("form-name").fill("Amaka Obi");
  await page.getByTestId("band-senior").check();
  await page.getByTestId("service-cv").check();

  await page.getByTestId("form-submit").click();
  await expect.poll(() => requestedUrls.length).toBeGreaterThanOrEqual(1);

  const url1 = new URL(requestedUrls[0]);
  const phone1 = url1.pathname.replace("/", "");
  const message1 = decodeURIComponent(url1.searchParams.get("text") ?? "");

  expect(["2348074071356", "2349031738326"]).toContain(phone1);
  expect(message1).toContain("Amaka Obi");
  expect(message1).toContain("₦15,000");
  expect(message1).toContain("\n\n");

  await page.getByTestId("form-submit").click();
  await expect.poll(() => requestedUrls.length).toBeGreaterThanOrEqual(2);

  const phone2 = new URL(requestedUrls[1]).pathname.replace("/", "");
  expect(phone2).not.toBe(phone1);
});

test("the general contact button targets the fixed number with no price", async ({ page }) => {
  await page.goto("/");
  const href = await page.getByTestId("general-whatsapp-cta").getAttribute("href");
  expect(href).toBeTruthy();
  const url = new URL(href!);
  expect(url.pathname).toBe("/2349031738326");
  const text = decodeURIComponent(url.searchParams.get("text") ?? "");
  expect(text).not.toContain("₦");
});

test("the score card can be saved as an image", async ({ page }) => {
  await page.goto("/");
  await uploadFile(page, "quantified.pdf");
  await expect(page.getByTestId("report")).toBeVisible({ timeout: 15_000 });

  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("score-card-save").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain("jobmingle");
});
