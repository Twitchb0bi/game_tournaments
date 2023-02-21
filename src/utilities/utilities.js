export const zeroPad = (num, places) => String(num).padStart(places, "0");

export const removeDashesAndUnderscores = (text) => text.replace(/[\-_]/g, " ");

export const cleanText = (text) => text.replace(/[^ -~]+/g, " ");

export const cleanTextAndRemoveDashesAndUnderscores = (text) =>
	removeDashesAndUnderscores(cleanText(text));
