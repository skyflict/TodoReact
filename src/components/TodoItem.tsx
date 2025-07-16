import React from "react";
import type { Todo } from "../types";
import { useTodoActions, useTodoEdit } from "../hooks";
import { TodoDisplay } from "./TodoDisplay";
import { TodoEditForm } from "./TodoEditForm";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { toggleComplete, deleteTodo } = useTodoActions();
  const { isEditing, startEditing, formProps } = useTodoEdit(todo);

  const handleToggleComplete = () => {
    toggleComplete(todo.id, todo.completed);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  if (isEditing) {
    return (
      <TodoEditForm
        title={formProps.title}
        setTitle={formProps.setTitle}
        description={formProps.description}
        setDescription={formProps.setDescription}
        onSubmit={formProps.handleSubmit}
        onCancel={formProps.handleCancel}
      />
    );
  }

  return (
    <TodoDisplay
      todo={todo}
      onToggleComplete={handleToggleComplete}
      onEdit={startEditing}
      onDelete={handleDelete}
    />
  );
};
