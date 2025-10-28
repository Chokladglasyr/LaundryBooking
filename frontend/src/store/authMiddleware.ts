import axios from "axios";
import { redirect } from "react-router-dom";
import { userContext } from "./UserContext";

export async function authMiddleware({context}) {
    const res = await axios.get('http://localhost:3000/me', {withCredentials: true})
    console.log(res.data.user[0])
    if(!res) {
        // throw redirect('/')
        console.log("hej")
    }
    context.set(userContext, res.data.user[0])
}