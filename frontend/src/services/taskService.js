import API from "./api";

export const getTasks = async () => {
  const response = await API.get("/tasks/");
  return response.data;
};

export const addTask = async (task) => {
  const response = await API.post("/tasks/", task);
  return response.data;
};

export const updateTask = async (taskId, task) => {
  const response = await API.put(`/tasks/${taskId}`, task);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await API.delete(`/tasks/${taskId}`);
  return response.data;
};

