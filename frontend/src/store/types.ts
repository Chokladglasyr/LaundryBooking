import { createContext } from "react";

export type Rooms = {
    id: string
    name: string
    description: string
}
export type Posts = {
    id: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
}
export type User = {
    id: string
    name: string
    email: string
    apt_nr: string
}
export type LoginProps = {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
export type UserContextType = {
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
export const UserContext = createContext<UserContextType | null>(null)