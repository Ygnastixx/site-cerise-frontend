import api from "./api";

export const getInventory = async () => {
  const response = await api.get("/inventory/");
  return response.data;
};

export const createEquipment = async (equipment) => {
  const response = await api.post("/inventory/", equipment);
  return response.data;
};

export const updateEquipment = async (id, equipment) => {
  const response = await api.put(`/inventory/${id}/`, equipment);
  return response.data;
};

export const deleteEquipment = async (id) => {
  await api.delete(`/inventory/${id}/`);
};