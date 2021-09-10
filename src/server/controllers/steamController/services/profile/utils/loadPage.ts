import cheerio from "cheerio";

const loadPage = (htmlPage: string) => {
	return cheerio.load(htmlPage);
};

export default loadPage;
