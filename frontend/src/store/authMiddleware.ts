import axios from "axios";
import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { userContext } from "./UserContext";

export async function authMiddleware({context}: LoaderFunctionArgs) {
    const res = await axios.get('http://localhost:3000/me', {withCredentials: true})
    console.log(res.data.user[0])
    if(!res.data.user[0]) {
        throw redirect('/')
    }
    context.set(userContext, res.data.user[0])
}