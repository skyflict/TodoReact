export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
}

export interface UpdateTodoRequest {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
}
