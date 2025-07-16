import { useState } from "react";
import type { Todo } from "../types";
import { useTodoActions } from "./useTodoActions";
import { useTodoForm } from "./useTodoForm";

export const useTodoEdit = (todo: Todo) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateTodo } = useTodoActions();

  const formProps = useTodoForm({
    initialTitle: todo.title,
    initialDescription: todo.description || "",
    onSubmit: (title, description) => {
      updateTodo({
        id: todo.id,
        title,
        description,
      });
      setIsEditing(false);
    },
    onCancel: () => {
      setIsEditing(false);
    },
  });

  const startEditing = () => {
    setIsEditing(true);
    formProps.setTitle(todo.title);
    formProps.setDescription(todo.description || "");
    formProps.setIsExpanded(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    formProps.resetForm();
  };

  return {
    isEditing,
    startEditing,
    cancelEditing,
    formProps,
  };
};
