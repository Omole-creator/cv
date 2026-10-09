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

  await page.getByTestId("choose-standard").click();
  await expect(page.getByTestId("w-package")).toHaveValue("standard");

  await expect(page.getByTestId("w-price")).toContainText("Your package: Standard, ₦50,000");
  await page.getByTestId("w-submit").click();
  await expect(page.getByText(/answer all four questions/i)).toBeVisible();

  await page.getByTestId("w-name").fill("Amaka Obi");
  await page.getByTestId("w-role").fill("Customer service");
  await page.getByText("Both", { exact: true }).click();

  // Not ticking the price box still blocks the submit.
  await page.getByTestId("w-submit").click();
  await expect(page.getByText(/tick the price box/i)).toBeVisible();
  await expect(page.getByTestId("w-confirm")).toContainText(
    "I understand Standard costs ₦50,000 and I'm ready to pay now."
  );
  await page.getByTestId("w-confirm").click();

  // The details step leads to the deposit, not straight to WhatsApp.
  await page.getByTestId("w-submit").click();
  await expect(page.getByText("Pay your ₦5,000 deposit")).toBeVisible();
  await expect(page.getByTestId("w-banks")).toContainText("1000577565");
  await expect(page.getByTestId("w-banks")).toContainText("1311340458");

  await page.getByTestId("w-send").click();
  await expect(page.getByText(/name on the account you paid from/i).last()).toBeVisible();
  await page.getByTestId("w-paid-from").fill("Amaka Obi");

  const popupPromise = context.waitForEvent("page");
  await page.getByTestId("w-send").click();
  await popupPromise;

  await expect.poll(() => waUrl).toContain("https://wa.me/2348074071356");
  const text = decodeURIComponent(new URL(waUrl).searchParams.get("text") ?? "");
  expect(text).toContain("I'm Amaka Obi");
  expect(text).toContain("Customer service");
  expect(text).toContain("Standard, The Get-Found System (₦50,000)");
  expect(text).toContain("I understand Standard costs ₦50,000 and I'm ready to pay now.");
  expect(text).toContain("I've paid my ₦5,000 deposit from the account of Amaka Obi.");
});
