import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  Todo,
  TodoState,
  CreateTodoRequest,
  UpdateTodoRequest,
} from "../types";

const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Изучить Redux Toolkit",
    description: "Познакомиться с современным способом работы с Redux",
    completed: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "Создать ToDo приложение",
    description: "Разработать простое приложение для управления задачами",
    completed: false,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateId = () => Date.now().toString();

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  await delay(1000);
  return mockTodos;
});

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (todoData: CreateTodoRequest) => {
    await delay(800);
    const newTodo: Todo = {
      id: generateId(),
      title: todoData.title,
      description: todoData.description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newTodo;
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (updateData: UpdateTodoRequest) => {
    await delay(600);
    return {
      ...updateData,
      updatedAt: new Date(),
    };
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id: string) => {
    await delay(500);
    return id;
  }
);

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки задач";
      })

      .addCase(createTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos.push(action.payload);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка создания задачи";
      })

      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.todos.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) {
          state.todos[index] = { ...state.todos[index], ...action.payload };
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка обновления задачи";
      })

      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка удаления задачи";
      });
  },
});

export const { clearError } = todoSlice.actions;
export default todoSlice.reducer;
