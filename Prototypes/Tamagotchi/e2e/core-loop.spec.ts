import { expect, test, type Page } from "@playwright/test";
import { lesson } from "../src/demo/lesson";
import {
  FOOD_PER_FEEDING,
  INITIAL_STATE,
  MIN_READ_MS,
} from "../src/pagi/config";
import { copy } from "../src/pagi/copy";

const READING_MARGIN_MS = 300;

interface Expected {
  wordBites: number;
  stars: number;
  food: number;
}

function avatar(page: Page) {
  return page.getByRole("button", { name: copy.avatarLabel });
}

function panel(page: Page) {
  return page.getByRole("region", { name: copy.name });
}

function sentence(page: Page, id: string) {
  const match = lesson.pages.flat().find((candidate) => candidate.id === id);
  if (!match) throw new Error(`No sentence with id ${id} in the lesson`);
  return page.getByRole("button", { name: match.text, exact: true });
}

async function expectPanelShows(page: Page, expected: Expected) {
  const stat = (label: string) =>
    panel(page).locator(`dt:text-is("${label}") + dd`);
  await expect(stat(copy.wordBites)).toHaveText(String(expected.wordBites));
  await expect(stat(copy.stars)).toHaveText(String(expected.stars));
  await expect(
    panel(page).getByRole("meter", { name: copy.needs.food }),
  ).toHaveAttribute("aria-valuenow", String(expected.food));
}

async function expectPagi(page: Page, expected: Expected) {
  await avatar(page).click();
  await expectPanelShows(page, expected);
  await page.keyboard.press("Escape");
  await expect(panel(page)).toBeHidden();
}

test("reading, searching, feeding and a toets", async ({ page }) => {
  test.setTimeout(60_000);
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const { wordBites, stars, needs } = INITIAL_STATE;
  await page.goto("/");
  await expectPagi(page, { wordBites, stars, food: needs.food });

  await page.getByRole("button", { name: "Start les" }).click();
  for (let pageNumber = 1; pageNumber <= lesson.pages.length; pageNumber++) {
    await page.waitForTimeout(MIN_READ_MS + READING_MARGIN_MS);
    await page.getByRole("button", { name: "Volgende pagina" }).click();
  }
  const afterReading = wordBites + lesson.pages.length;
  await expectPagi(page, { wordBites: afterReading, stars, food: needs.food });

  const [causeQuestion, timeQuestion] = lesson.questions;
  await sentence(page, "s1").click();
  await expect(sentence(page, "s1")).toHaveClass(/missed/);
  await expectPagi(page, { wordBites: afterReading, stars, food: needs.food });
  await sentence(page, causeQuestion.answerId).click();
  await expect(sentence(page, causeQuestion.answerId)).toHaveClass(/found/);
  await expectPagi(page, {
    wordBites: afterReading,
    stars: stars + 1,
    food: needs.food,
  });
  await sentence(page, timeQuestion.answerId).click();
  await expect(sentence(page, timeQuestion.answerId)).toHaveClass(/found/);
  await expectPagi(page, {
    wordBites: afterReading,
    stars: stars + 2,
    food: needs.food,
  });

  await avatar(page).click();
  await panel(page).getByRole("button", { name: copy.feed }).click();
  await expectPanelShows(page, {
    wordBites: afterReading - 1,
    stars: stars + 2,
    food: needs.food + FOOD_PER_FEEDING,
  });
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Terug naar het overzicht" }).click();
  await page.getByRole("button", { name: "Start toets" }).click();
  await expect(avatar(page)).toBeHidden();
  await page.getByRole("radio", { name: "Op de zolder" }).check();
  await page.getByRole("button", { name: "Inleveren" }).click();
  await expect(avatar(page)).toBeVisible();

  expect(pageErrors).toEqual([]);
});
