import api from "./api";

export const getSessions = async () => {
  const response = await api.get("/sessions/");
  return response.data;
};

export const createSession = async (session) => {
  const response = await api.post("/sessions/", session);
  return response.data;
};

export const getSession = async (id) => {
  const response = await api.get(`/sessions/${id}/`);
  return response.data;
};

export const reserveEquipment = async (id, equipment) => {
  const response = await api.post(
    `/sessions/${id}/reserve-equipment/`,
    equipment
  );

  return response.data;
};