// utils/getUserFromCookie.ts
import Cookies from "js-cookie";

export function getUserFromCookie() {
  const userCookie = Cookies.get("user");
  return userCookie ? JSON.parse(userCookie) : null;
}