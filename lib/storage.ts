// LocalStorage utilities for storing child's name

const STORAGE_KEY = "kid_app_child_name";

export const saveChildName = (name: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, name.trim());
  }
};

export const getChildName = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(STORAGE_KEY);
  }
  return null;
};

export const clearChildName = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
};

