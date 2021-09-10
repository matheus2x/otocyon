import cheerio from "cheerio";

export interface ProfileValues {
	nickname: cheerio.Element;
	steamID: cheerio.Element;
}

export interface ProfileData extends ProfileValues {
	avatarImg: string | undefined;
	profileURL: string | undefined;
}

export interface ValuesIndexes {
	nickname: number;
	steamID: number;
}
