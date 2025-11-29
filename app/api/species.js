import { apiClient } from ".";

export const getSpecies = () => {
  return apiClient.get("/api/species");
};
