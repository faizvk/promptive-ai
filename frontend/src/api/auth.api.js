import api from "./api";

export const signup = async (data) => {
  const response = await api.post("/signup", data);
  return response.data;
};

export const login = async (data) => {
  const response = await api.post("/login", data);

  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};
