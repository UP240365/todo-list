import { Task } from "../types/task";

const API_URL = "http://192.168.100.12:3000/todos";

export const getTasks = async (): Promise<Task[]> => {
  const res = await fetch(API_URL);
  const data = await res.json();
  return data.data || data;
};

export const createTask = async (task: {
  title: string;
  description: string;
}) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  return res.json();
};

export const deleteTask = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
};

export const updateTask = async (
  id: number,
  task: { title: string; description: string; completed: number }
) => {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
};

export const getTaskById = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

export const toggleTask = async (id: number) => {
  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
  });
};