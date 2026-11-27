import { expect, test, type Page } from "@playwright/test";
import { demoText, lesson } from "../src/demo/lesson";
import { FEED_AMOUNT, INITIAL_STATE, MIN_READ_MS } from "../src/pagi/config";
import { copy } from "../src/pagi/copy";

const READING_MARGIN_MS = 300;

interface Expected {
  wordBites: number;
  stars: number;
  food: number;
}

function avatar(page: Page) {
  return page.getByRole("button", { name: copy.panel.open });
}

function panel(page: Page) {
  return page.getByRole("region", { name: copy.panel.title });
}

function sentence(page: Page, id: string) {
  const match = lesson.pages.flat().find(([sentenceId]) => sentenceId === id);
  if (!match) throw new Error(`No sentence with id ${id} in the lesson`);
  return page.getByRole("button", { name: match[1], exact: true });
}

async function expectPanelShows(page: Page, expected: Expected) {
  await expect(
    panel(page).getByText(copy.panel.brokjes(expected.wordBites), {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    panel(page).getByText(copy.panel.sterren(expected.stars), { exact: true }),
  ).toBeVisible();
  await expect(
    panel(page).getByRole("progressbar", { name: copy.panel.honger }),
  ).toHaveJSProperty("value", expected.food);
}

async function expectPagi(page: Page, expected: Expected) {
  await avatar(page).click();
  await expectPanelShows(page, expected);
  await page.keyboard.press("Escape");
  await expect(panel(page)).toBeHidden();
}

async function clickButton(page: Page, name: string) {
  await page.getByRole("button", { name, exact: true }).click();
}

test("reading, searching, feeding and a toets", async ({ page }) => {
  test.setTimeout(60_000);
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const start = {
    wordBites: INITIAL_STATE.wordBites,
    stars: INITIAL_STATE.stars,
    food: INITIAL_STATE.needs.food,
  };
  await page.goto("/");
  await expectPagi(page, start);

  await clickButton(page, demoText.startLesson);
  await clickButton(page, demoText.nextPage);
  await expectPagi(page, start);

  await clickButton(page, demoText.backToLessons);
  await clickButton(page, demoText.startLesson);
  for (let pageNumber = 1; pageNumber <= lesson.pages.length; pageNumber++) {
    await page.waitForTimeout(MIN_READ_MS + READING_MARGIN_MS);
    const isLastPage = pageNumber === lesson.pages.length;
    await clickButton(page, isLastPage ? demoText.toSearch : demoText.nextPage);
  }
  const afterReading = {
    ...start,
    wordBites: start.wordBites + lesson.pages.length,
  };
  await expectPagi(page, afterReading);

  const [causeQuestion, orderQuestion] = lesson.questions;
  await sentence(page, "s1").click();
  await expect(sentence(page, "s1")).toHaveAttribute("data-state", "missed");
  await expectPagi(page, afterReading);

  await sentence(page, causeQuestion.answer).click();
  await expect(sentence(page, causeQuestion.answer)).toHaveAttribute(
    "data-state",
    "found",
  );
  await expectPagi(page, { ...afterReading, stars: 1 });

  await clickButton(page, demoText.nextQuestion);
  await sentence(page, orderQuestion.answer).click();
  const afterSearch = { ...afterReading, stars: 2 };
  await expectPagi(page, afterSearch);
  await clickButton(page, demoText.finishLesson);

  await avatar(page).click();
  await panel(page).getByRole("button", { name: copy.panel.feed }).click();
  await expectPanelShows(page, {
    ...afterSearch,
    wordBites: afterSearch.wordBites - 1,
    food: afterSearch.food + FEED_AMOUNT,
  });
  await page.keyboard.press("Escape");

  await clickButton(page, demoText.startToets);
  await expect(avatar(page)).toBeHidden();
  await page.getByRole("radio").first().check();
  await clickButton(page, demoText.submitToets);
  await expect(avatar(page)).toBeVisible();

  expect(pageErrors).toEqual([]);
});
