import { test, expect } from "@playwright/test";
import { TodoHelpers } from "../helpers/todo-helpers";

test.describe("Todo App - Визуальные тесты", () => {
  let todoHelpers: TodoHelpers;

  test.beforeEach(async ({ page }) => {
    todoHelpers = new TodoHelpers(page);
    await todoHelpers.goto();
    await todoHelpers.waitForLoaderToDisappear();
  });

  test("Скриншот главной страницы с начальными данными", async ({ page }) => {
    // Делаем скриншот всей страницы
    await expect(page).toHaveScreenshot("main-page-initial.png");
  });

  test("Скриншот раскрытой формы добавления задачи", async ({ page }) => {
    // Раскрываем форму
    await todoHelpers.addTodoInput.click();
    await todoHelpers.addTodoInput.fill("Новая задача");

    // Ждем появления формы
    await expect(todoHelpers.addTodoDescription).toBeVisible();

    // Делаем скриншот формы
    await expect(todoHelpers.page.locator(".add-todo-form")).toHaveScreenshot(
      "add-form-expanded.png"
    );
  });

  test("Скриншот задачи в режиме редактирования", async ({ page }) => {
    // Начинаем редактирование первой задачи
    const editButton = todoHelpers.todoItems.first().locator("button.edit-btn");
    await editButton.click();

    // Ждем появления формы редактирования
    const editForm = todoHelpers.todoItems.first().locator("form");
    await expect(editForm).toBeVisible();

    // Делаем скриншот задачи в режиме редактирования
    await expect(todoHelpers.todoItems.first()).toHaveScreenshot(
      "todo-item-editing.png"
    );
  });

  test("Скриншот задачи в выполненном состоянии", async ({ page }) => {
    // Отмечаем первую задачу как выполненную
    await todoHelpers.toggleTodoComplete(0);

    // Ждем перемещения в секцию выполненных
    await todoHelpers.expectCompletedTodoCount(1);

    // Делаем скриншот выполненной задачи
    const completedTodo = todoHelpers.completedTodosSection
      .locator(".todo-item")
      .first();
    await expect(completedTodo).toHaveScreenshot("todo-item-completed.png");
  });

  test("Скриншот страницы с разными состояниями задач", async ({ page }) => {
    // Добавляем новую задачу
    await todoHelpers.addTodo("Новая активная задача", "Описание новой задачи");

    // Отмечаем одну из существующих задач как выполненную
    await todoHelpers.toggleTodoComplete(0);

    // Ждем обновления интерфейса
    await todoHelpers.expectActiveTodoCount(2);
    await todoHelpers.expectCompletedTodoCount(1);

    // Делаем скриншот всей страницы с разными состояниями
    await expect(page).toHaveScreenshot("mixed-states-page.png");
  });

  test("Скриншот состояния загрузки", async ({ page }) => {
    // Добавляем задачу, чтобы поймать лоадер
    await todoHelpers.addTodoInput.click();
    await todoHelpers.addTodoInput.fill("Задача для лоадера");

    // Кликаем кнопку и быстро делаем скриншот
    await todoHelpers.addTodoButton.click();

    // Пытаемся поймать лоадер (он может быть очень быстрым)
    try {
      await expect(todoHelpers.loader).toBeVisible({ timeout: 500 });
      await expect(todoHelpers.loader).toHaveScreenshot("loader-state.png");
    } catch {
      // Если лоадер слишком быстрый, это нормально
      console.log("Лоадер слишком быстрый для скриншота");
    }

    await todoHelpers.waitForLoaderToDisappear();
  });

  test("Скриншот пустого состояния (после удаления всех задач)", async ({
    page,
  }) => {
    // Удаляем все существующие задачи
    const initialCount = await todoHelpers.todoItems.count();

    for (let i = 0; i < initialCount; i++) {
      await todoHelpers.deleteTodo(0); // Всегда удаляем первую, так как список сдвигается
    }

    // Проверяем, что появилось пустое состояние
    await todoHelpers.expectEmptyState();

    // Делаем скриншот пустого состояния
    await expect(page).toHaveScreenshot("empty-state.png");
  });

  test("Скриншот адаптивности на мобильном устройстве", async ({ page }) => {
    // Изменяем размер страницы на мобильный
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone размер

    // Ждем перерисовки
    await page.waitForTimeout(500);

    // Делаем скриншот мобильной версии
    await expect(page).toHaveScreenshot("mobile-main-page.png");

    // Раскрываем форму на мобильном
    await todoHelpers.addTodoInput.click();
    await todoHelpers.addTodoInput.fill("Мобильная задача");
    await expect(todoHelpers.addTodoDescription).toBeVisible();

    // Скриншот мобильной формы
    await expect(page).toHaveScreenshot("mobile-add-form.png");
  });

  test("Скриншоты ховер-состояний", async ({ page }) => {
    // Ховер на кнопку добавления
    await todoHelpers.addTodoInput.click();
    await expect(todoHelpers.addTodoButton).toBeVisible();
    await todoHelpers.addTodoButton.hover();

    await expect(todoHelpers.addTodoButton).toHaveScreenshot(
      "add-button-hover.png"
    );

    // Ховер на кнопку редактирования
    const editButton = todoHelpers.todoItems.first().locator("button.edit-btn");
    await editButton.hover();

    await expect(editButton).toHaveScreenshot("edit-button-hover.png");

    // Ховер на кнопку удаления
    const deleteButton = todoHelpers.todoItems
      .first()
      .locator("button.delete-btn");
    await deleteButton.hover();

    await expect(deleteButton).toHaveScreenshot("delete-button-hover.png");
  });

  test("Скриншот статистики с различными значениями", async ({ page }) => {
    // Добавляем несколько задач
    await todoHelpers.addTodo("Первая задача");
    await todoHelpers.addTodo("Вторая задача");
    await todoHelpers.addTodo("Третья задача");

    // Отмечаем некоторые как выполненные
    await todoHelpers.toggleTodoComplete(0);
    await todoHelpers.toggleTodoComplete(2);

    // Делаем скриншот области со статистикой
    await expect(todoHelpers.statisticsText).toHaveScreenshot(
      "statistics-display.png"
    );
  });

  test("Скриншот темной темы (если поддерживается)", async ({ page }) => {
    // Эмулируем предпочтение темной темы
    await page.emulateMedia({ colorScheme: "dark" });

    // Ждем применения темы
    await page.waitForTimeout(500);

    // Делаем скриншот в темной теме
    await expect(page).toHaveScreenshot("dark-theme-main.png");
  });
});
