import { useState, useCallback } from "react";

interface UseTodoFormOptions {
  initialTitle?: string;
  initialDescription?: string;
  onSubmit?: (title: string, description?: string) => void;
  onCancel?: () => void;
}

export const useTodoForm = (options: UseTodoFormOptions = {}) => {
  const {
    initialTitle = "",
    initialDescription = "",
    onSubmit,
    onCancel,
  } = options;

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [isExpanded, setIsExpanded] = useState(false);

  const resetForm = useCallback(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setIsExpanded(false);
  }, [initialTitle, initialDescription]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (title.trim()) {
        onSubmit?.(title.trim(), description.trim() || undefined);
        resetForm();
      }
    },
    [title, description, onSubmit, resetForm]
  );

  const handleCancel = useCallback(() => {
    resetForm();
    onCancel?.();
  }, [resetForm, onCancel]);

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  return {
    title,
    setTitle,
    description,
    setDescription,
    isExpanded,
    setIsExpanded,
    handleSubmit,
    handleCancel,
    handleExpand,
    resetForm,
    isValid: title.trim().length > 0,
  };
};
