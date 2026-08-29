import api from "./api";

export const getTemplates = async () => {
  const response = await api.get("/studio/templates/");
  return response.data;
};

export const generateSlides = async (data) => {
  const response = await api.post(
    "/studio/generate-slides/",
    data
  );

  return response.data;
};