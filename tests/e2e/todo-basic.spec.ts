import { test, expect } from "@playwright/test";
import { TodoHelpers } from "../helpers/todo-helpers";

test.describe("Todo App - Основная функциональность", () => {
  let todoHelpers: TodoHelpers;

  test.beforeEach(async ({ page }) => {
    todoHelpers = new TodoHelpers(page);
    await todoHelpers.goto();
  });

  test("Загрузка приложения и отображение начальных данных", async () => {
    // Проверяем заголовок
    await expect(todoHelpers.page.locator("h1")).toHaveText("ToDo List");

    // Ждем загрузки задач (у нас есть 2 мокированных задачи)
    await todoHelpers.waitForLoaderToDisappear();

    // Проверяем, что задачи загружены
    await todoHelpers.expectTodoCount(2);
    await todoHelpers.expectActiveTodoCount(2);
    await todoHelpers.expectCompletedTodoCount(0);

    // Проверяем статистику
    await todoHelpers.expectStatistics(2, 0, 2);
  });

  test("Добавление новой задачи с названием", async () => {
    await todoHelpers.waitForLoaderToDisappear();

    const initialCount = await todoHelpers.todoItems.count();

    await todoHelpers.addTodo("Новая тестовая задача");

    // Проверяем, что задача добавилась
    await todoHelpers.expectTodoCount(initialCount + 1);

    // Проверяем, что новая задача отображается
    const newTodo = await todoHelpers.getTodoByTitle("Новая тестовая задача");
    await expect(newTodo).toBeVisible();

    // Проверяем обновленную статистику
    await todoHelpers.expectStatistics(initialCount + 1, 0, initialCount + 1);
  });

  test("Добавление задачи с названием и описанием", async () => {
    await todoHelpers.waitForLoaderToDisappear();

    const title = "Задача с описанием";
    const description = "Подробное описание задачи";

    await todoHelpers.addTodo(title, description);

    // Проверяем, что задача создалась с описанием
    const newTodo = await todoHelpers.getTodoByTitle(title);
    await expect(newTodo).toBeVisible();
    await expect(newTodo.locator("p")).toContainText(description);
  });

  test("Отметка задачи как выполненной", async () => {
    await todoHelpers.waitForLoaderToDisappear();

    // Отмечаем первую задачу как выполненную
    await todoHelpers.toggleTodoComplete(0);

    // Проверяем, что задача переместилась в выполненные
    await todoHelpers.expectActiveTodoCount(1);
    await todoHelpers.expectCompletedTodoCount(1);

    // Проверяем обновленную статистику
    await todoHelpers.expectStatistics(2, 1, 1);

    // Проверяем, что у задачи есть класс completed
    const completedTodo = todoHelpers.completedTodosSection
      .locator(".todo-item")
      .first();
    await expect(completedTodo).toHaveClass(/completed/);
  });

  test("Снятие отметки выполнения с задачи", async () => {
    await todoHelpers.waitForLoaderToDisappear();

    // Сначала отмечаем задачу как выполненную
    await todoHelpers.toggleTodoComplete(0);
    await todoHelpers.expectCompletedTodoCount(1);

    // Теперь снимаем отметку
    const completedTodo = todoHelpers.completedTodosSection
      .locator(".todo-item")
      .first();
    const checkbox = completedTodo.locator('input[type="checkbox"]');
    await checkbox.click();
    await todoHelpers.waitForLoaderToDisappear();

    // Проверяем, что задача вернулась в активные
    await todoHelpers.expectActiveTodoCount(2);
    await todoHelpers.expectCompletedTodoCount(0);

    // Проверяем статистику
    await todoHelpers.expectStatistics(2, 0, 2);
  });

  test("Редактирование задачи", async () => {
    await todoHelpers.waitForLoaderToDisappear();

    const newTitle = "Отредактированное название";
    const newDescription = "Новое описание";

    await todoHelpers.editTodo(0, newTitle, newDescription);

    // Проверяем, что задача обновилась
    const editedTodo = await todoHelpers.getTodoByTitle(newTitle);
    await expect(editedTodo).toBeVisible();
    await expect(editedTodo.locator("p")).toContainText(newDescription);

    // Проверяем, что количество задач не изменилось
    await todoHelpers.expectTodoCount(2);
  });

  test("Отмена редактирования задачи", async () => {
    await todoHelpers.waitForLoaderToDisappear();

    // Получаем исходное название первой задачи
    const originalTitle = await todoHelpers.todoItems
      .first()
      .locator("h3")
      .textContent();

    await todoHelpers.cancelTodoEdit(0);

    // Проверяем, что название не изменилось
    const todoTitle = await todoHelpers.todoItems
      .first()
      .locator("h3")
      .textContent();
    expect(todoTitle).toBe(originalTitle);
  });

  test("Удаление задачи", async () => {
    await todoHelpers.waitForLoaderToDisappear();

    const initialCount = await todoHelpers.todoItems.count();

    await todoHelpers.deleteTodo(0);

    // Проверяем, что задача удалилась
    await todoHelpers.expectTodoCount(initialCount - 1);

    // Проверяем обновленную статистику
    await todoHelpers.expectStatistics(initialCount - 1, 0, initialCount - 1);
  });

  test("Попытка добавить пустую задачу", async () => {
    await todoHelpers.waitForLoaderToDisappear();

    const initialCount = await todoHelpers.todoItems.count();

    // Пытаемся добавить задачу с пустым названием
    await todoHelpers.addTodoInput.click();
    await todoHelpers.addTodoButton.click();

    // Проверяем, что задача не добавилась (браузер должен показать валидационную ошибку)
    await todoHelpers.expectTodoCount(initialCount);
  });

  test("Отмена добавления задачи", async () => {
    await todoHelpers.waitForLoaderToDisappear();

    // Начинаем добавлять задачу
    await todoHelpers.addTodoInput.click();
    await todoHelpers.addTodoInput.fill("Тестовая задача");

    // Проверяем, что форма раскрылась
    await expect(todoHelpers.addTodoDescription).toBeVisible();
    await expect(todoHelpers.cancelButton).toBeVisible();

    // Отменяем
    await todoHelpers.cancelButton.click();

    // Проверяем, что форма свернулась и поле очистилось
    await expect(todoHelpers.addTodoDescription).not.toBeVisible();
    await expect(todoHelpers.addTodoInput).toHaveValue("");
  });

  test("Состояние загрузки при операциях", async () => {
    await todoHelpers.waitForLoaderToDisappear();

    // Добавляем задачу и проверяем появление лоадера
    await todoHelpers.addTodoInput.click();
    await todoHelpers.addTodoInput.fill("Задача с лоадером");

    // Кликаем кнопку и сразу проверяем лоадер
    await todoHelpers.addTodoButton.click();

    // Лоадер должен появиться и исчезнуть
    await todoHelpers.waitForLoaderToDisappear();

    // Проверяем, что задача добавилась
    const newTodo = await todoHelpers.getTodoByTitle("Задача с лоадером");
    await expect(newTodo).toBeVisible();
  });
});
