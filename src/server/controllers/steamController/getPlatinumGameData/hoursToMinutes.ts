const hoursToMinutes = (minutes: number): string => {
	const moveMinutesToIntPart = (timeInHours: number) => timeInHours * 100;
	const moveMinutesToDecimalPart = (timeInHours: number) => timeInHours / 100;

	const anHourInMinutes = 60;
	const timeInHours = minutes / anHourInMinutes;
	const hoursWithMinutes = moveMinutesToIntPart(timeInHours);
	const roundedHoursWithMinutes = Math.round(hoursWithMinutes);

	const formatedHourWithMinutes = moveMinutesToDecimalPart(
		roundedHoursWithMinutes
	).toFixed(2);

	return formatedHourWithMinutes;
};

export default hoursToMinutes;
