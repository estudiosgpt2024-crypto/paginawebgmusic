import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addCalendarMonths } from "../../prisma/add-calendar-months.js";

function localParts(date: Date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    milliseconds: date.getMilliseconds(),
  };
}

describe("addCalendarMonths", () => {
  it("suma meses calendario conservando la hora local en fecha normal", () => {
    const from = new Date(2026, 2, 15, 14, 30, 45, 123);
    const result = addCalendarMonths(from, 6);

    assert.deepEqual(localParts(result), {
      year: 2026,
      month: 9,
      day: 15,
      hours: 14,
      minutes: 30,
      seconds: 45,
      milliseconds: 123,
    });
  });

  it("usa el último día del mes destino cuando el día original no existe", () => {
    const from = new Date(2026, 7, 31, 9, 15, 0, 0);
    const result = addCalendarMonths(from, 6);

    assert.deepEqual(localParts(result), {
      year: 2027,
      month: 2,
      day: 28,
      hours: 9,
      minutes: 15,
      seconds: 0,
      milliseconds: 0,
    });
  });

  it("ajusta fin de mes en año bisiesto", () => {
    const from = new Date(2023, 7, 31, 18, 0, 0, 0);
    const result = addCalendarMonths(from, 6);

    assert.deepEqual(localParts(result), {
      year: 2024,
      month: 2,
      day: 29,
      hours: 18,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
  });

  it("cruza año conservando hora local", () => {
    const from = new Date(2026, 10, 20, 23, 59, 59, 999);
    const result = addCalendarMonths(from, 6);

    assert.deepEqual(localParts(result), {
      year: 2027,
      month: 5,
      day: 20,
      hours: 23,
      minutes: 59,
      seconds: 59,
      milliseconds: 999,
    });
  });
});
