# Booking system for laundry items.
Go to...   
+ [Deployments](#deployments)  
+ [Design](#design)  
+ [API design](#api-design)
   - [ER diagram](#er-diagram)
   - [Endpoints](#endpoints)  
   - [Reponse examples](#response-examples)  

## Install
+ ```git clone https://github.com/Chokladglasyr/LaundryBooking.git```
+ ```bun install```
+ ```cd backend && bun install```
+ ```cd frontend && bun install```
  
## Problem

This project replaces the current manual laundry item booking system, where residents write their names on a paper sheet, with a digital solution.  
The existing system is unreliable, anyone can erase or change bookings, residents must visit the laundry item to check available times and there is no way to enfore the one-booking-per-person rule. The new system aims to make booking, rescheduling and monitoring fair and efficient for all residents.

## Techstack

- [Bun](https://bun.com/docs)
- ESLint
  - Prettier
  - Airbnb Style Guide

### Backend
See backend [README](./backend/README.md)

- [PostgreSQL](https://www.postgresql.org/docs/)
- [SendGrid](https://www.twilio.com/docs/sendgrid)
- [JWT](jwt.io/introduction)
- [Fastify](https://fastify.dev/docs/latest/)

### Frontend
See frontend [README](./frontend/README.md)

- [React](https://react.dev/)
- [Axios](https://react.dev/)

## Deployments

Netlify for [frontend](https://fantastic-dragon-d3d623.netlify.app)  
Render for [backend](https://laundrybooking.onrender.com/)

## Design

[View Figma Board](https://www.figma.com/board/IKHKqr4RaCf8KjO0XaHlmD/Booking-system?node-id=0-1&t=4wGbw7552KR8bFFD-1)  
Includes:  
- User research
  - User personas
  - User stories
- Roadmap
- User flow

[View Figma](https://www.figma.com/design/0i8Cehotj7ylUQIQWph6PI/Bokningssystem?node-id=1-415&t=s9LBz3jB47NRtSe3-1)  
Includes:  
+ LoFi
+ HiFi

### API Design
#### ER diagram
<img src="./assets/ER.png">

## Endpoints:
### Misc
| Method | Endpoint                        | Description                                     |
| :----- | :------------------------------ | :---------------------------------------------- |
| `GET`  | `/search`                       | Search user by name, email, or apartment number |
| `GET`  | `/booking/health?id=:user_id`   | Check if a user has an active booking           |
| `GET`  | `/getpasswordreset?id=:user_id` | Create a password reset request                 |
| `GET`  | `/resetpassword?id=:reset_id`   | Validate and update user password               |
  
### Authentication
| Method | Endpoint  | Description                           |
| :----- | :-------- | :------------------------------------ |
| `POST` | `/login`  | Log in a user (creates JWT + cookies) |
| `GET`  | `/logout` | Log out a user (clears cookies)       |
| `GET`  | `/me`     | Get logged-in user info               |

### Users
| Method   | Endpoint            | Description       |
| :------- | :------------------ | :---------------- |
| `GET`    | `/users`            | Get all users     |
| `GET`    | `/user?id=:user_id` | Get a user by ID  |
| `POST`   | `/user`             | Create a new user |
| `PUT`    | `/user?id=:user_id` | Update a user     |
| `DELETE` | `/user?id=:user_id` | Delete a user     |

### Items = [bookings, rooms, rules, posts]
| Method   | Endpoint            | Description                              |
| :------- | :------------------ | :--------------------------------------- |
| `GET`    | `/items`            | Get all items                            |
| `POST`   | `/item`             | Create a new item                        |
| `PUT`    | `/item?id=:item_id` | Update an item *(cannot update booking)* |
| `DELETE` | `/item?id=:item_id` | Delete an item                           |


## Response examples:

POST /user

```
{
	"message": "New user created",
	"user": {
		"name": "ida",
		"email": "testing@testing6.com",
		"apt_nr": "1205",
		"role": "user"
	}
}
```
GET /getpasswordreset?id=user_id  

```
{
	"message": "New request to reset password created.",
	"request": {
		"id": "460af6d1-8348-42bb-9b49-026fa54e6f74",
		"user_id": "088adcce-d734-40c9-9b4f-53119d8377d2",
		"user_email": "bajs@bajsaaaaaa.com",
		"created_at": "2025-11-09T19:41:54.156Z"
	}
}
```
POST /booking  
```
{
	"message": "User already has an active booking."
}
```

### Status codes:
`200 OK`: Request ok
`201 Created`: User/item/Booking created  
`400 Unauthorized`: If something is missing in the parameters  
`401 Unauthorized`: If a user tries to access an admin feature  
`404 Not Found`: If user/item/booking is not found  
`409 Conflict`: If user tries to save a booking when they have one active   
`500 Internal Server Error`: If something happens on server side
