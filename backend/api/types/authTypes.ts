export type TokenPayload = {
  user_id: string;
  email: string;
  type: string;
};
export type UserDatabaseModel = {
  id: string;
  name: string;
  email: string;
  password: string;
  apt_nr: string;
  role?: string;
};
export type UserUpdateModel = {
  name: string;
  email: string;
  apt_nr: string
  updated_at: string;
};
export type SignupRequest = {
  name: string;
  email: string;
  apt_nr: string;
  password: string;
  role: string;
};
export type LoginRequest = {
  email: string;
  password: string;
};
export type User = {
  id: string;
  name: string;
  email: string;
  apt_nr: string;
  password: string;
  role: string;
};
export type Password = {
  password: string
}