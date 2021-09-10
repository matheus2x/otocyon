import { ProfileValues, ValuesIndexes } from "../protocols";

const getProfileValues = (pageSelector: cheerio.Root): ProfileValues => {
	const getValues = (_: number, element: cheerio.Element) => {
		return pageSelector(element).attr("value");
	};

	const inputsLocation = "div#guide > input";
	const profileValues: cheerio.Element[] = pageSelector(inputsLocation)
		.map(getValues)
		.toArray();

	const valuesIndexes: ValuesIndexes = {
		nickname: 4,
		steamID: 3,
	};

	return {
		nickname: profileValues[valuesIndexes.nickname],
		steamID: profileValues[valuesIndexes.steamID],
	};
};

export default getProfileValues;
