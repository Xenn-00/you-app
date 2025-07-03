import dayjs from "dayjs";

export function getZodiacFromBirthday(birthday: string): string {
  const year = dayjs(birthday).year();
  const zodiacList = [
    "Rat",
    "Ox",
    "Tiger",
    "Rabbit",
    "Dragon",
    "Snake",
    "Horse",
    "Goat",
    "Monkey",
    "Rooster",
    "Dog",
    "Pig",
  ];
  const baseYear = 2020; // 2020 was year of the Rat
  const index = Math.abs(year - baseYear + 12) % 12;
  return zodiacList[index];
}
