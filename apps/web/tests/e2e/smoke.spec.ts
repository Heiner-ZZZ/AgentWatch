import { expect, test } from "@playwright/test";

test("marketing page renders AgentWatch headline", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /observabilidad enterprise para agentes ai y automatizaciones/i,
    }),
  ).toBeVisible();
});
