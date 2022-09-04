export function addTodo(data) {
  const { category, text, priority } = data;

  return fetch(process.env.REACT_APP_SERVER_URL + "/todo/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category, text, priority }),
  });
}

export function getTodos() {
  return fetch(process.env.REACT_APP_SERVER_URL + "/todo/list");
}

export function deleteTodo(_id) {

  return fetch(process.env.REACT_APP_SERVER_URL + "/todo/" + _id, {
    method: "DELETE",
  });
}

export function updateTodo(data) {
  const {_id, category, text, priority } = data;

  return fetch(process.env.REACT_APP_SERVER_URL + "/todo/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({_id, category, text, priority }),
  });
}
