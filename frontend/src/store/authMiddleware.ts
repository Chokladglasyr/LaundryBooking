import axios from "axios";
import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { userContext } from "./UserContext";

export async function authMiddleware({ context }: LoaderFunctionArgs) {
  try {
    const res = await axios.get("http://localhost:3000/me", {
      withCredentials: true,
    });

    if (!res.data.user[0]) {
      throw redirect("/");
    }
    context.set(userContext, res.data.user[0]);
    console.log(res.data.user[0]);
    return res.data.user[0];
  } catch (err) {
    if (err instanceof Error) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        throw redirect("/");
      }
    }
  }
}
export async function authLoader({ context }: LoaderFunctionArgs) {
  const user = context.get(userContext);
  return user;
}
