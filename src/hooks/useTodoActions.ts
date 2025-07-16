import { useAppDispatch } from "../store/hooks";
import { createTodo, updateTodo, deleteTodo } from "../store/todoSlice";
import type { CreateTodoRequest, UpdateTodoRequest } from "../types";

export const useTodoActions = () => {
  const dispatch = useAppDispatch();

  const handleCreateTodo = (todoData: CreateTodoRequest) => {
    dispatch(createTodo(todoData));
  };

  const handleUpdateTodo = (updateData: UpdateTodoRequest) => {
    dispatch(updateTodo(updateData));
  };

  const handleDeleteTodo = (id: string, confirmMessage?: string) => {
    const message =
      confirmMessage || "Вы уверены, что хотите удалить эту задачу?";
    if (window.confirm(message)) {
      dispatch(deleteTodo(id));
    }
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    dispatch(updateTodo({ id, completed: !completed }));
  };

  return {
    createTodo: handleCreateTodo,
    updateTodo: handleUpdateTodo,
    deleteTodo: handleDeleteTodo,
    toggleComplete: handleToggleComplete,
  };
};
