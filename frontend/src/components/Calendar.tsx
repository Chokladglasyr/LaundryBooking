import { useEffect, useRef, useState } from "react";
import LeftArrow from "../assets/left.png";
import RightArrow from "../assets/right.png";
import type { BookingType, CalendarProps, User } from "../store/types";
import { useLoaderData } from "react-router-dom";
import axios from "axios";

function Calendar({ room_id }: CalendarProps) {
  const daysOfWeek = ["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"];
  const monthsOfYear = [
    "Januari",
    "Februari",
    "Mars",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "Augusti",
    "September",
    "Oktober",
    "November",
    "December",
  ];
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState(0);
  const user = useLoaderData<User>();

  const timeslotRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const sweFirstDayOfMonth = (firstDayOfMonth + 6) % 7;

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear((prevYear) =>
      currentMonth === 0 ? prevYear - 1 : prevYear
    );
  };
  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear((prevYear) =>
      currentMonth === 11 ? prevYear + 1 : prevYear
    );
  };

  useEffect(() => {
    let cancel = false;
    if (message) {
      const messageTimer = setTimeout(() => {
        setMessage(null);
      }, 1000);
      return () => {
        clearTimeout(messageTimer);
      };
    }
    const fetchBookings = async () => {
      try {
        const res = await axios.get("/bookings", { withCredentials: true });
        if (!cancel) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        if (err instanceof Error) {
          if (
            axios.isAxiosError(err) &&
            err.response?.data.message === "No bookings found."
          ) {
            console.error("Hittade inga bokningar i db.");
          }
        }
      }
    };
    fetchBookings();

    return () => {
      cancel = true;
    };
  }, [message]);

  useEffect(() => {
    const resetSelectedTime = (e: MouseEvent) => {
      if (
        timeslotRef.current &&
        !timeslotRef.current.contains(e.target as Node)
      ) {
        setSelectedTime(0);
      }
    };
    document.addEventListener("mousedown", resetSelectedTime);
    return () => {
      document.removeEventListener("mousedown", resetSelectedTime);
    };
  }, []);

  if (!bookings) {
    console.log("Error, no bookings found.");
  }

  const roomBookings = bookings?.filter(
    (booking) => booking.room_id === room_id
  );
  const dates = roomBookings.map((booking) => booking.booking_date);
  const isDayBooked = (day: number) => {
    return dates.some((date) => {
      const d = new Date(date);
      return (
        d.getFullYear() === currentYear &&
        d.getMonth() === currentMonth &&
        d.getDate() === day + 1
      );
    });
  };
  const handleDatePick = (day: number) => {
    const pickedDate = new Date(currentYear, currentMonth, day);

    if (pickedDate >= today) {
      setSelectedDate(pickedDate);
    }
  };
  const handleTimePick = (time: number) => {
    setSelectedTime(time);
  };

  const isTimeslotBooked = (timeslot: string) => {
    const timeslotBooked = roomBookings.filter(
      (booking) =>
        new Date(booking.booking_date).toLocaleDateString() ===
          selectedDate.toLocaleDateString() &&
        booking.booking_timeslot === timeslot
    );
    if (!timeslotBooked || timeslotBooked.length === 0) {
      return false;
    } else {
      const usersBooking = timeslotBooked[0] as BookingType;
      if (usersBooking.user_id === user.id) {
        return 1;
      } else {
        return 2;
      }
    }
  };

  const classnameForTimeslot = (timeslot: number) => {
    const bookedStatus = isTimeslotBooked(timeslot.toString());
    if (selectedTime === timeslot && bookedStatus === 1) {
      return "timeslot-invalid-selected";
    } else if (selectedTime === timeslot) {
      return "timeslot-selected";
    } else if (bookedStatus) {
      return "timeslot-invalid";
    } else {
      return "timeslot";
    }
  };

  const selectedTimeslotIsUsers =
    selectedTime !== 0 && isTimeslotBooked(selectedTime.toString()) === 1;

  const createBooking = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      const newBooking = {
        user_id: user.id,
        room_id: room_id,
        booking_date: selectedDate,
        booking_timeslot: selectedTime,
      };
      const res = await axios.post("/booking", newBooking, {
        withCredentials: true,
      });
      if (res.status === 201) {
        setMessage("Ny tid bokad!");
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    } catch (err) {
      if (err instanceof Error) {
        if (axios.isAxiosError(err) && err.response?.status === 409) {
          setMessage("Du har en aktiv bokning.");
        }
        console.error("fel,", err);
      }
    }
  };
  const deleteBooking = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const deleteBooking = {
        user_id: user.id,
        room_id: room_id,
        booking_date: new Date(selectedDate).toLocaleDateString("sv-SE", {
          timeZone: "Europe/Stockholm",
        }),
        booking_timeslot: selectedTime,
      };
      const res = await axios.delete("/booking", {
        data: deleteBooking,
        withCredentials: true,
      });
      if (res.status === 200) {
        setMessage("Du har avbokat din tid.");
        location.reload();
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error deleting booking: ", err);
      }
    }
  };

  return (
    <>
      <div className="calendar-app">
        <div className="calendar">
          <div className="navigate-date">
            <button onClick={prevMonth} className="left">
              <img src={LeftArrow} alt="left arrows" />{" "}
            </button>
            <div className="heading">
              <h2 className="month">{monthsOfYear[currentMonth]}</h2>
              <h2 className="year">{currentYear}</h2>
            </div>
            <button onClick={nextMonth} className="right">
              <img src={RightArrow} alt="right arrows" />
            </button>
          </div>
          <div className="weekdays">
            {daysOfWeek.map((day, index) => (
              <span key={index}>{day}</span>
            ))}
          </div>
          <div className="days">
            {[...Array(sweFirstDayOfMonth).keys()].map((_, index) => (
              <span key={`empty-${index}`} />
            ))}
            {[...Array(daysInMonth).keys()].map((day, index) => (
              <button
                onClick={() => handleDatePick(day + 1)}
                className={
                  new Date(currentYear, currentMonth, day + 1).getTime() ===
                  selectedDate.getTime()
                    ? "valid-days-selected"
                    : new Date(currentYear, currentMonth, day + 1) < today
                      ? "invalid-days"
                      : isDayBooked(day)
                        ? "valid-days-with-booking"
                        : "valid-days"
                }
                id={
                  day + 1 === currentDate.getDate() &&
                  currentMonth === currentDate.getMonth() &&
                  currentYear === currentDate.getFullYear()
                    ? "current-day"
                    : ""
                }
                key={index + 1}
              >
                {day + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div ref={timeslotRef} className="booking-container">
        <div className="timeslots-container">
          <button
            onClick={() => handleTimePick(1)}
            className={classnameForTimeslot(1)}
            value={1}
            disabled={
              !isTimeslotBooked("1")
                ? false
                : isTimeslotBooked("1") === 1
                  ? false
                  : true
            }
          >
            {selectedDate.getDay() === 0 || selectedDate.getDay() === 6
              ? "9-13"
              : "8-12"}
          </button>
          <button
            onClick={() => handleTimePick(2)}
            className={classnameForTimeslot(2)}
            value={2}
            disabled={
              !isTimeslotBooked("2")
                ? false
                : isTimeslotBooked("2") === 1
                  ? false
                  : true
            }
          >
            {selectedDate.getDay() === 0 || selectedDate.getDay() === 6
              ? "13-17"
              : "12-17"}
          </button>
          <button
            onClick={() => handleTimePick(3)}
            className={classnameForTimeslot(3)}
            value={3}
            disabled={
              !isTimeslotBooked("3")
                ? false
                : isTimeslotBooked("3") === 1
                  ? false
                  : true
            }
          >
            {selectedDate.getDay() === 0 || selectedDate.getDay() === 6
              ? "17-20"
              : "17-21"}
          </button>
        </div>
        <div className="booking-btn-container">
          {message && <p className="booking-msg">{message}</p>}
          <button
            type="button"
            onClick={(e) => {
              if (!selectedTimeslotIsUsers) {
                createBooking(e);
              } else {
                deleteBooking(e);
              }
            }}
            className="primary-btn-booking"
            id="book-time"
          >
            {selectedTimeslotIsUsers ? "AVBOKA" : "BOKA"}
          </button>
        </div>
      </div>
    </>
  );
}
export default Calendar;
