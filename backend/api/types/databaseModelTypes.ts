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
export type MessageDatabaseModel = {
    id: string
    title: string
    description: string
}
export type MessageUpdateModel = {
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
    booking_date: Date
    booking_timeslot: string
}
