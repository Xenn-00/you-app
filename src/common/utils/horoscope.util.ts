import dayjs from "dayjs";

const HOROSCOPES = [
  { name: "Capricorn", from: "01-01", to: "01-19" },
  { name: "Aquarius", from: "01-20", to: "02-18" },
  { name: "Pisces", from: "02-19", to: "03-20" },
  { name: "Aries", from: "03-21", to: "04-19" },
  { name: "Taurus", from: "04-20", to: "05-20" },
  { name: "Gemini", from: "05-21", to: "06-20" },
  { name: "Cancer", from: "06-21", to: "07-22" },
  { name: "Leo", from: "07-23", to: "08-22" },
  { name: "Virgo", from: "08-23", to: "09-22" },
  { name: "Libra", from: "09-23", to: "10-22" },
  { name: "Scorpio", from: "10-23", to: "11-21" },
  { name: "Sagittarius", from: "11-22", to: "12-21" },
  { name: "Capricorn", from: "12-22", to: "12-31" },
];
export function getHoroscopeFromBirthday(birthday: string): string {
  const date = dayjs(birthday);
  const target = date.format("MM-DD");

  const match = HOROSCOPES.find(({ from, to }) => {
    return target >= from && target <= to;
  });

  return match?.name ?? "Unknown";
}
