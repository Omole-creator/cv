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

  await page.getByTestId("w-submit").click();
  await expect(page.getByText(/answer all five questions/i)).toBeVisible();

  await page.getByTestId("w-name").fill("Amaka Obi");
  await page.getByTestId("w-role").fill("Customer service");
  await page.getByText("Both", { exact: true }).click();
  await page.getByTestId("w-duration").selectOption("3 to 6 months");

  const popupPromise = context.waitForEvent("page");
  await page.getByTestId("w-submit").click();
  await popupPromise;

  await expect.poll(() => waUrl).toContain("https://wa.me/2348074071356");
  const text = decodeURIComponent(new URL(waUrl).searchParams.get("text") ?? "");
  expect(text).toContain("I'm Amaka Obi");
  expect(text).toContain("Customer service");
  expect(text).toContain("Standard, The Get-Found System (₦50,000)");
});
