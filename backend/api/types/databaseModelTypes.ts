import { StringAsNumber } from "fastify/types/utils"

export type RuleDatabaseModel = {
    id: string
    title: string
    description: string
}
export type RuleUpdateModel = {
    title: string
    description: string
    updated_at: string
}
export type PostDatabaseModel = {
    id: string
    title: string
    description: string
}
export type PostUpdateModel = {
    title: string
    description: string
    updated_at: string
}
export type RoomDatabaseModel = {
    id: string
    name: string
    description: string
}
export type RoomUpdateModel = {
    name: string
    description: string
    updated_at: string
}
export type BookingDatabaseModel = {
    id: string
    user_id: string
    room_id: string
    booking_date: string
    booking_timeslot: string
}
export type resetPasswordDatabaseModel = {
    id: string
    user_id: string
    user_email: string
    created_at: string
}
