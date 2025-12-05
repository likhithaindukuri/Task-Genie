import API from "./api";

export const getTasks = async (userId) => {
  const response = await API.get(`/tasks/${userId}`);
  return response.data;
};

export const addTask = async (userId, task) => {
  const response = await API.post(`/tasks/${userId}`, task);
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

