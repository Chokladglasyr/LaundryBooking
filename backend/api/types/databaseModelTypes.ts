export type RuleDatabaseModel = {
    id: string
    title: string
    description: string
}
export type MessageDatabaseModel = {
    id: string
    title: string
    description: string
}
export type RoomDatabaseModel = {
    id: string
    name: string
    description: string
}
export type BookingDatabaseModel = {
    id: string
    user_id: string
    room_id: string
}