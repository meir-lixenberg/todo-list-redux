import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteTodo as deleteTodoAPI,
  addTodo as addTodoAPI,
  getTodos as getTodosAPI,
  updateTodo as updateTodoAPI,
} from "./todoAPI";

const initialState = {
  value: [],
  status: "idle",
};

export const selectTodos = (state) => state.counter.value;

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    sortTodos: (state, action) => {
      const sortBy = action.payload;

      let func;
      if (sortBy === "priority") {
        func = (a, b) =>
          a.priority > b.priority ? 1 : b.priority > a.priority ? -1 : 0;
      }
      if (sortBy === "text") {
        func = (a, b) => a.text.localeCompare(b.text);
      }
      if (sortBy === "category") {
        func = (a, b) => a.category.localeCompare(b.category);
      }

      const sortedTodos = [...state.value].sort(func);

      state.value = [...sortedTodos];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTodo.fulfilled, (state, action) => {
        state.status = "idle";
        state.value = [...state.value, action.payload];
      })
      .addCase(getTodos.fulfilled, (state, action) => {
        state.status = "idle";
        state.value = [...action.payload];
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.status = "idle";
        const newTodos = state.value.filter(function (item) {
          return item._id !== action.payload._id;
        });
        state.value = [...newTodos];
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.status = "idle";
        const newTodos = state.value.map(function (item) {
          return item._id !== action.payload._id ? item : action.payload;
        });
        state.value = [...newTodos];
      });
  },
});

export const { sortTodos } = todoSlice.actions;

export const getTodos = createAsyncThunk("todo/getTodos", async (data) => {
  let response = await getTodosAPI(data);
  response = await response.json();
  return response.data;
});

export const addTodo = createAsyncThunk("todo/addTodo", async (data) => {
  let response = await addTodoAPI(data);
  response = await response.json();
  return response.data;
});

export const updateTodo = createAsyncThunk("todo/updateTodo", async (data) => {
  let response = await updateTodoAPI(data);
  response = await response.json();
  return response.data;
});

export const deleteTodo = createAsyncThunk("todo/deleteTodo", async (_id) => {
  let response = await deleteTodoAPI(_id);
  response = await response.json();
  return response.data;
});

export default todoSlice.reducer;
