import "./Todo.css";

import * as React from "react";
import { useSelector, useDispatch } from "react-redux";

import { Modal } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import edit_note from "../../edit_note_black_24dp.svg";
import delete_black from "../../delete_black_24dp.svg";
import TodoForm from "./TodoForm";
import {
  getTodos as getTodosR,
  addTodo as addTodoR,
  selectTodos as selectTodosR,
  deleteTodo as deleteTodoR,
  updateTodo as updateTodoR,
  sortTodos as sortTodosR
} from "./todoSlice";

export default function Todo() {
  const todos = useSelector(selectTodosR);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getTodosR());
  });

  const [open, setOpen] = React.useState(false);
 
  const methodProp = React.useRef(null);
  const updatedTodoData = React.useRef({});

  const setUpdatedTodoData = (data) => {
    const { category, text, priority } = data;
    updatedTodoData.current = { category, text, priority };
    methodProp.current === "addTodo" ? addTodo() : updateTodo();
    updatedTodoData.current = {};
    methodProp.current = null;
    setOpen(false);
  };

  const addTodo = async () => {
    methodProp.current = "addTodo";
    const { category, text, priority } = updatedTodoData.current;

    if (!category || !text || !priority) return setOpen(true);

    dispatch(addTodoR({ category, text, priority }));
  };

  const deleteTodo = async (_id) => {
    dispatch(deleteTodoR(_id));
  };

  const updateTodo = async (_id) => {
    _id
      ? (methodProp.current = `updateTodo?_id=${_id}`)
      : (_id = new URLSearchParams(
          methodProp.current.substring(methodProp.current.indexOf("?"))
        ).get("_id"));

    const { category, text, priority } = updatedTodoData.current;

    if (!category && !text && !priority) {
      return setOpen(true);
    }

    const data = { _id, category, text, priority };

    dispatch(updateTodoR(data));
  };

  const sortTodos = (e) => {
    const sortBy = e.target.value;
    
    dispatch(sortTodosR(sortBy));
    
  };

  const TodoFormWrapper = React.forwardRef((props, ref) => (
    <div {...props} ref={ref}>
      <TodoForm method={methodProp.current} updateFunc={setUpdatedTodoData} />
    </div>
  ));

  return (
    <div className="todos-wrapper">
      {/** @abstract add todo and sort todo list buttons */}
      <div className="buttons">
        <Button
          onClick={() => {
            addTodo();
          }}
          variant="contained"
          disableElevation
        >
          NEW TODO
        </Button>
        <select
          onChange={(e) => {
            sortTodos(e);
          }}
          name="sort"
          id="sort"
        >
          <option value="">SORT</option>
          <option value="category">category</option>
          <option value="text">text</option>
          <option value="priority">priority</option>
        </select>
      </div>
      {/** @abstract todo list */}
      <List sx={{ width: "400px", bgcolor: "background.paper" }}>
        {todos?.length &&
          todos?.map((e, i) => (
            <ListItem
              key={i}
              secondaryAction={
                <Avatar>
                  <div className="edit-wrapper">
                    <img
                      onClick={() => {
                        updateTodo(e._id);
                      }}
                      src={edit_note}
                      alt="edit"
                    />
                    <img
                      onClick={() => {
                        deleteTodo(e._id);
                      }}
                      src={delete_black}
                      alt="delete"
                    />
                  </div>
                </Avatar>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <div>{e.priority}</div>
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={e.category} secondary={e.text} />
            </ListItem>
          ))}
      </List>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <TodoFormWrapper></TodoFormWrapper>
      </Modal>
    </div>
  );
}
