export type rulesAndPostsRequest = {
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
    booking_timeslot: string
}
export type idRequest = {
    id: string
}
export type searchRequest = {
    name: string
    column: string
}