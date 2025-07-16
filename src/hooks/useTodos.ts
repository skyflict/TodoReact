import { useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchTodos, clearError } from "../store/todoSlice";

export const useTodos = () => {
  const dispatch = useAppDispatch();
  const { todos, loading, error } = useAppSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const statistics = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed);
    const incomplete = todos.filter((todo) => !todo.completed);

    return {
      total: todos.length,
      completed: completed.length,
      incomplete: incomplete.length,
      completedTodos: completed,
      incompleteTodos: incomplete,
    };
  }, [todos]);

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    todos,
    loading,
    error,
    statistics,
    clearError: handleClearError,
  };
};
