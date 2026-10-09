import type { User } from "../types/user";
import { api } from "./axios-config";

const URL_PREFIX = "user";

export async function getUserByusername(username: string): Promise<User> {
  const { data } = await api.get<User>(`${URL_PREFIX}/${username}`);

  return data;
}

export async function createUser(username: string): Promise<User> {
  const body = { username };

  const { data } = await api.post<User>(URL_PREFIX, body);
  return data;
}
