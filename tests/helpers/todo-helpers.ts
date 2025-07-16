import { Page, Locator, expect } from "@playwright/test";

export class TodoHelpers {
  readonly page: Page;
  readonly addTodoInput: Locator;
  readonly addTodoDescription: Locator;
  readonly addTodoButton: Locator;
  readonly cancelButton: Locator;
  readonly todoItems: Locator;
  readonly todoList: Locator;
  readonly activeTodosSection: Locator;
  readonly completedTodosSection: Locator;
  readonly loader: Locator;
  readonly errorMessage: Locator;
  readonly statisticsText: Locator;

  constructor(page: Page) {
    this.page = page;

    // Форма добавления задач
    this.addTodoInput = page.locator(
      'input[placeholder="Добавить новую задачу..."]'
    );
    this.addTodoDescription = page.locator(
      'textarea[placeholder="Описание (необязательно)"]'
    );
    this.addTodoButton = page.locator("button.add-btn");
    this.cancelButton = page.locator("button.cancel-btn");

    // Элементы списка задач
    this.todoItems = page.locator(".todo-item");
    this.todoList = page.locator(".todo-list");
    this.activeTodosSection = page
      .locator(".todos-section")
      .filter({ hasText: "Активные задачи" });
    this.completedTodosSection = page
      .locator(".todos-section")
      .filter({ hasText: "Выполненные задачи" });

    // Состояния загрузки и ошибок
    this.loader = page.locator(".loader");
    this.errorMessage = page.locator(".error-message");

    // Статистика
    this.statisticsText = page.locator(".todo-header p");
  }

  async goto() {
    await this.page.goto("/");
    // Ждем загрузки данных
    await this.page.waitForLoadState("networkidle");
  }

  async addTodo(title: string, description?: string) {
    // Кликаем на поле ввода для раскрытия формы
    await this.addTodoInput.click();
    await this.addTodoInput.fill(title);

    if (description) {
      await expect(this.addTodoDescription).toBeVisible();
      await this.addTodoDescription.fill(description);
    }

    await this.addTodoButton.click();

    // Ждем завершения загрузки
    await this.waitForLoaderToDisappear();
  }

  async toggleTodoComplete(todoIndex: number) {
    const todoItem = this.todoItems.nth(todoIndex);
    const checkbox = todoItem.locator('input[type="checkbox"]');
    await checkbox.click();
    await this.waitForLoaderToDisappear();
  }

  async editTodo(todoIndex: number, newTitle: string, newDescription?: string) {
    const todoItem = this.todoItems.nth(todoIndex);
    const editButton = todoItem.locator("button.edit-btn");

    await editButton.click();

    // Ждем появления формы редактирования
    const editForm = todoItem.locator("form");
    await expect(editForm).toBeVisible();

    const titleInput = editForm.locator('input[type="text"]');
    const descriptionTextarea = editForm.locator("textarea");
    const saveButton = editForm.locator("button.save-btn");

    await titleInput.fill(newTitle);

    if (newDescription !== undefined) {
      await descriptionTextarea.fill(newDescription);
    }

    await saveButton.click();
    await this.waitForLoaderToDisappear();
  }

  async deleteTodo(todoIndex: number) {
    const todoItem = this.todoItems.nth(todoIndex);
    const deleteButton = todoItem.locator("button.delete-btn");

    // Настраиваем одноразовый обработчик диалога подтверждения
    this.page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Вы уверены");
      await dialog.accept();
    });

    await deleteButton.click();
    await this.waitForLoaderToDisappear();
  }

  async cancelTodoEdit(todoIndex: number) {
    const todoItem = this.todoItems.nth(todoIndex);
    const editButton = todoItem.locator("button.edit-btn");

    await editButton.click();

    const editForm = todoItem.locator("form");
    const cancelButton = editForm.locator("button.cancel-btn");

    await cancelButton.click();
  }

  async waitForLoaderToDisappear() {
    // Ждем появления лоадера (если есть)
    try {
      await this.loader.waitFor({ state: "visible", timeout: 1000 });
    } catch {
      // Лоадер может не появиться, это нормально
    }

    // Ждем исчезновения лоадера
    await this.loader.waitFor({ state: "hidden", timeout: 10000 });
  }

  async getTodoByTitle(title: string) {
    return this.todoItems.filter({ hasText: title });
  }

  async expectTodoCount(count: number) {
    await expect(this.todoItems).toHaveCount(count);
  }

  async expectActiveTodoCount(count: number) {
    if (count === 0) {
      await expect(this.activeTodosSection).not.toBeVisible();
    } else {
      await expect(this.activeTodosSection).toBeVisible();
      await expect(this.activeTodosSection.locator(".todo-item")).toHaveCount(
        count
      );
    }
  }

  async expectCompletedTodoCount(count: number) {
    if (count === 0) {
      await expect(this.completedTodosSection).not.toBeVisible();
    } else {
      await expect(this.completedTodosSection).toBeVisible();
      await expect(
        this.completedTodosSection.locator(".todo-item")
      ).toHaveCount(count);
    }
  }

  async expectStatistics(total: number, completed: number, remaining: number) {
    await expect(this.statisticsText).toContainText(`Всего задач: ${total}`);
    await expect(this.statisticsText).toContainText(`Выполнено: ${completed}`);
    await expect(this.statisticsText).toContainText(`Осталось: ${remaining}`);
  }

  async expectEmptyState() {
    await expect(this.page.locator(".empty-state")).toBeVisible();
    await expect(this.page.locator(".empty-state")).toContainText(
      "У вас пока нет задач"
    );
  }
}
