export type TokenPayload = {
    user_id: string
    email: string
    type: string
}
export type UserDatabaseModel = {
    id: string
    name: string
    email: string
    password: string
    apt_nr: string
    created_at: string
}
export type SignupRequest = {
    name: string
    email: string
    apt_nr: string
    password: string
}
export type LoginRequest = {
    email: string
    password: string
}