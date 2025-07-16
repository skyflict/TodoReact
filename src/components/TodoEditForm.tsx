import React from "react";

interface TodoEditFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const TodoEditForm: React.FC<TodoEditFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="todo-item editing">
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название задачи"
          autoFocus
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание (необязательно)"
          rows={2}
        />
        <div className="todo-actions">
          <button type="submit" className="save-btn">
            Сохранить
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};
