import { test, expect } from "@playwright/test";

test("choosing a package preselects it in the form and sends the lead to WhatsApp", async ({
  page,
  context,
}) => {
  let waUrl = "";
  await context.route("https://wa.me/**", (route) => {
    waUrl = route.request().url();
    route.abort();
  });

  await page.goto("/writing");
  // No payment links on this page; the only path is the form.
  await expect(page.locator("a[href*='paystack']")).toHaveCount(0);

  await page.getByTestId("choose-mid").click();
  // The button lands on the form card, not the receipts above it.
  await expect(page.getByTestId("w-name")).toBeInViewport();
  await expect(page.getByTestId("w-step")).toContainText("Step 1 of 3");

  // Step 1 won't move on until all three questions are answered.
  await page.getByTestId("w-next").click();
  await expect(page.getByText(/answer all three questions/i)).toBeVisible();

  await page.getByTestId("w-name").fill("Amaka Obi");
  await page.getByTestId("w-role").fill("Customer service");
  await page.getByText("Both", { exact: true }).click();
  await page.getByTestId("w-next").click();

  // Step 2 keeps the level picked on the card.
  await expect(page.getByTestId("w-step")).toContainText("Step 2 of 3");
  await expect(page.getByTestId("w-package")).toHaveValue("mid");
  await expect(page.getByTestId("w-price")).toContainText("Your total: ₦15,000");
  await page.getByTestId("w-cover").click();
  await expect(page.getByTestId("w-price")).toContainText("Your total: ₦20,000");

  // Not ticking the price box still blocks the submit.
  await page.getByTestId("w-submit").click();
  await expect(page.getByText(/tick the price box/i)).toBeVisible();
  await expect(page.getByTestId("w-confirm")).toContainText(
    "I understand my CV and cover letter cost ₦20,000 and I'm ready to pay now."
  );
  await page.getByTestId("w-confirm").click();

  // The details step leads to the deposit page, not straight to WhatsApp.
  await page.getByTestId("w-submit").click();
  await expect(page).toHaveURL(/\/writing\/deposit\?/);
  await expect(page.getByRole("heading", { name: "Pay your ₦3,000 deposit" })).toBeVisible();
  await expect(page.getByTestId("deposit-summary")).toContainText("₦17,000");
  await expect(page.getByTestId("w-banks")).toContainText("1000577565");
  await expect(page.getByTestId("w-banks")).toContainText("1311340458");
  await expect(page.getByTestId("w-banks")).toContainText("1028248447");

  await page.getByTestId("w-send").click();
  await expect(page.getByText(/name of the person who sent the money/i)).toBeVisible();
  await page.getByTestId("w-paid-from").fill("Amaka Obi");

  const popupPromise = context.waitForEvent("page");
  await page.getByTestId("w-send").click();
  await popupPromise;

  await expect.poll(() => waUrl).toContain("https://wa.me/2348074071356");
  const text = decodeURIComponent(new URL(waUrl).searchParams.get("text") ?? "");
  expect(text).toContain("I'm Amaka Obi");
  expect(text).toContain("Customer service");
  expect(text).toContain("CV + cover letter, Mid career, 4 to 7 years (₦20,000)");
  expect(text).toContain("I understand my CV and cover letter cost ₦20,000 and I'm ready to pay now.");
  expect(text).toContain("I've paid my ₦3,000 deposit from the account of Amaka Obi.");
});

test("the deposit page sends visitors without answers back to the form", async ({ page }) => {
  await page.goto("/writing/deposit");
  await expect(page.getByTestId("deposit-missing")).toBeVisible();
  await expect(page.getByTestId("w-banks")).toHaveCount(0);
});

test("change my answers on the deposit page refills the form", async ({ page }) => {
  await page.goto("/writing/deposit?p=senior&cl=0&name=Amaka+Obi&role=Admin&loc=Both");
  await expect(page.getByRole("heading", { name: "Pay your ₦5,000 deposit" })).toBeVisible();
  await expect(page.getByTestId("deposit-summary")).toContainText("₦25,000");
  await page.getByText("Change my answers").click();
  await expect(page.getByTestId("w-name")).toHaveValue("Amaka Obi");
  await expect(page.getByTestId("w-name")).toBeInViewport();
  await page.getByTestId("w-next").click();
  await expect(page.getByTestId("w-package")).toHaveValue("senior");
});
