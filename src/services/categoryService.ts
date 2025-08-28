import api from "./api";
import type { Category, NewCategory } from "../types";

export const getCategories = async (type = ""): Promise<Category[]> => {
  try {
    const response = await api.get(`/categories${type ? `?type=${type}` : ""}`);

    
    const data = response.data;
    
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data && Array.isArray(data.categories)) {
      return data.categories;
    }
    
    return [];
  } catch (error) {
    console.error("Erreur categories:", error);
    return [];
  }
};

export const createCategory = async (categoryData: NewCategory): Promise<Category> => {
  const response = await api.post("/categories", categoryData);
  return response.data.categorie || response.data;
};

export const updateCategory = async (id: number, categoryData: NewCategory): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data.categorie || response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};
