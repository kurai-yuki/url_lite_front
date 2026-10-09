import type { CreateShortLinkRequest } from "../types/create-short-link-request";
import type { Link } from "../types/link";
import type { UserLink } from "../types/user-link";
import { api } from "./axios-config";

const URL_PREFIX = "link";

export async function getLinkById(id: string): Promise<Link> {
  const { data } = await api.get<Link>(`${URL_PREFIX}/${id}`);

  return data;
}

export async function getUserLinksByUsername(
  username: string,
): Promise<UserLink[]> {
  const { data } = await api.get<UserLink[]>(`${URL_PREFIX}/user/${username}`);

  return data;
}

export async function createShortLink(
  body: CreateShortLinkRequest,
): Promise<Link> {
  const { data } = await api.post<Link>(URL_PREFIX, body);

  return data;
}

export async function deleteUserLink(id: string): Promise<void> {
  await api.delete(`${URL_PREFIX}/${id}`);
}
