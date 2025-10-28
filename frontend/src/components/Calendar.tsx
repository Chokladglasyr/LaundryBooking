import { useState } from "react";
import LeftArrow from "../assets/left.png";
import RightArrow from "../assets/right.png";

function Calendar() {
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
  const [selectedTime, setSelectedTime] = useState(0);

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

  const handleDatePick = (day: number) => {
    const pickedDate = new Date(currentYear, currentMonth, day);

    if (pickedDate >= today) {
      setSelectedDate(pickedDate);
    }
  };
  const handleTimePick = (time: number) => {
    setSelectedTime(time);
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
                    : new Date(currentYear, currentMonth, day + 1) >= today
                      ? "valid-days"
                      : "invalid-days"
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
      <div className="booking-container">
        <div className="timeslots-container">
          <button
            onClick={() => handleTimePick(1)}
            className={selectedTime === 1 ? "timeslot-selected" : "timeslot"}
            value={1}
          >
            8-12
          </button>
          <button
            onClick={() => handleTimePick(2)}
            className={selectedTime === 2 ? "timeslot-selected" : "timeslot"}
            value={2}
          >
            12-17
          </button>
          <button
            onClick={() => handleTimePick(3)}
            className={selectedTime === 3 ? "timeslot-selected" : "timeslot"}
            value={3}
          >
            17-21
          </button>
        </div>
        <button className="primary-btn-booking" id="book-time">
          BOKA
        </button>
      </div>
    </>
  );
}
export default Calendar;
