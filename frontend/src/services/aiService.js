import API from "./api";

export const generateDescription = async (userId, title) => {
  const response = await API.post(
    `/ai/generate-description/${userId}?title=${encodeURIComponent(title)}`
  );
  return response.data;
};

