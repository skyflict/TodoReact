import React from "react";
import { useTodoActions, useTodoForm } from "../hooks";

export const AddTodoForm: React.FC = () => {
  const { createTodo } = useTodoActions();

  const {
    title,
    setTitle,
    description,
    setDescription,
    isExpanded,
    handleSubmit,
    handleCancel,
    handleExpand,
  } = useTodoForm({
    onSubmit: (title, description) => {
      createTodo({ title, description });
    },
  });

  return (
    <div className="add-todo-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Добавить новую задачу..."
            onFocus={handleExpand}
            required
          />
        </div>

        {isExpanded && (
          <>
            <div className="form-group">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Описание (необязательно)"
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="add-btn">
                Добавить задачу
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="cancel-btn"
              >
                Отмена
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
