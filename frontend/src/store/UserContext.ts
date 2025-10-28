import { createContext } from "react-router-dom";
import type { User } from "./types";


export const userContext = createContext<User | null>(null)