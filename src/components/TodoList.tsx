import React from "react";
import { useTodos } from "../hooks";
import { TodoItem } from "./TodoItem";
import { AddTodoForm } from "./AddTodoForm";
import { Loader } from "./Loader";

export const TodoList: React.FC = () => {
  const { loading, error, statistics, clearError } = useTodos();

  return (
    <div className="todo-list">
      <header className="todo-header">
        <h1>ToDo List</h1>
        <p>
          Всего задач: {statistics.total} | Выполнено: {statistics.completed} |
          Осталось: {statistics.incomplete}
        </p>
      </header>

      <AddTodoForm />

      {error && (
        <div className="error-message">
          <p>Ошибка: {error}</p>
          <button onClick={clearError} className="error-close">
            ✕
          </button>
        </div>
      )}

      {loading && <Loader />}

      <div className="todos-container">
        {statistics.incompleteTodos.length > 0 && (
          <section className="todos-section">
            <h2>Активные задачи ({statistics.incomplete})</h2>
            <div className="todos-list">
              {statistics.incompleteTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          </section>
        )}

        {statistics.completedTodos.length > 0 && (
          <section className="todos-section">
            <h2>Выполненные задачи ({statistics.completed})</h2>
            <div className="todos-list">
              {statistics.completedTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          </section>
        )}

        {statistics.total === 0 && !loading && (
          <div className="empty-state">
            <p>У вас пока нет задач. Добавьте первую задачу выше!</p>
          </div>
        )}
      </div>
    </div>
  );
};
