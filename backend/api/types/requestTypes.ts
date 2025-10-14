export type rulesAndMsgsRequest = {
    title: string
    description: string
}
export type roomRequest = {
    name: string
    description: string
}
export type bookingRequest = {
    user_id: string
    room_id: string
    booking_date: string
}
export type idRequest = {
    id: string
}