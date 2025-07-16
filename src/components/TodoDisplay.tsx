import React from "react";
import type { Todo } from "../types";
import { formatDate, isDateChanged } from "../utils";

interface TodoDisplayProps {
  todo: Todo;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TodoDisplay: React.FC<TodoDisplayProps> = ({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggleComplete}
        />
        <div className="todo-text">
          <h3>{todo.title}</h3>
          {todo.description && <p>{todo.description}</p>}
          <small>
            Создано: {formatDate(todo.createdAt)}
            {isDateChanged(todo.updatedAt, todo.createdAt) &&
              ` • Обновлено: ${formatDate(todo.updatedAt)}`}
          </small>
        </div>
      </div>
      <div className="todo-actions">
        <button onClick={onEdit} className="edit-btn">
          Редактировать
        </button>
        <button onClick={onDelete} className="delete-btn">
          Удалить
        </button>
      </div>
    </div>
  );
};
