export const formatDate = (date: Date | string) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const isDateChanged = (date1: Date | string, date2: Date | string) => {
  return new Date(date1).getTime() !== new Date(date2).getTime();
};
