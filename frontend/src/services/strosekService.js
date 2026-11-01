import api from "./api";

export const vrniVse = () => api.get("/stroski");
export const vrniEnega = (id) => api.get(`/stroski/${id}`);
export const dodaj = (strosek) => api.post("/stroski", strosek);
export const posodobi = (id, strosek) => api.put(`/stroski/${id}`, strosek);
export const izbrisi = (id) => api.delete(`/stroski/${id}`);
