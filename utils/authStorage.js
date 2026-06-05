import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "useToken";

export const saveToken = async (token) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async () => {
  await SecureStore.getItemAsync(token);
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync();
};
