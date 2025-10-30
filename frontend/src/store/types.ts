export type RoomType = {
  id: string;
  name: string;
  description: string;
};
export type RuleType = {
  id: string;
  title: string;
  description: string;
};
export type BookingType = {
  id: string
  user_id: string
  room_id: string
  booking_date: Date
  booking_timeslot: string

}
export type PostType = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};
export type User = {
  id: string;
  name: string;
  email: string;
  apt_nr: string;
};
export type LoginProps = {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>
};
export type CalendarProps = {
  room_id: string | null
}
export type LogoProps = {
  path: string
}
