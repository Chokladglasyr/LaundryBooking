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

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const sweFirstDayOfMonth = (firstDayOfMonth + 6) % 7;

  const prevMonth = () => {
    setCurrentMonth((prevMonth) =>(prevMonth === 0 ? 11 : prevMonth -1))
    setCurrentYear((prevYear) =>(currentMonth === 11 ? prevYear -1 : prevYear))
  }
  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth +1))
    setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear +1 : prevYear))
  }

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
              <button className="valid-days" key={index + 1}>
                {day + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default Calendar;
