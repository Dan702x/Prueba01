import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const currentYear = new Date().getFullYear();
const startYear = 2000;
const endYear = currentYear + 100;
const years = [];
for (let i = startYear; i <= endYear; i++) {
  years.push(i);
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];


export default function DatePickerHeader({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) {
  return (
    <div className="custom-datepicker-header">
      <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      <div className="custom-datepicker-dropdowns">
        <select
          className="custom-datepicker-select"
          value={months[date.getMonth()]}
          onChange={({ target: { value } }) =>
            changeMonth(months.indexOf(value))
          }
        >
          {monthNames.map((option, index) => (
            <option key={option} value={months[index]}>
              {option}
            </option>
          ))}
        </select>

        <select
          className="custom-datepicker-select"
          value={date.getFullYear()}
          onChange={({ target: { value } }) => changeYear(value)}
        >
          {years.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}