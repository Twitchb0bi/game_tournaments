import Cookies from "js-cookie";

export const zeroPad = (num, places) => String(num).padStart(places, "0");

export const removeDashesAndUnderscores = (text) => text.replace(/[\-_]/g, " ");

export const cleanText = (text) => text.replace(/[^ -~]+/g, " ");

export const cleanTextAndRemoveDashesAndUnderscores = (text) =>
	removeDashesAndUnderscores(cleanText(text));

export const URL_BASE = "http://games.robertofoti.com:8090";

//Funzione che mi restituisce una data nel formato corretto
export const ottieniFormatoDataCorretto = (data) => {
	const dataCorretta = new Date(data);
	if (!dataCorretta) return null;
	const giorno = zeroPad(dataCorretta.getDate(), 2);
	const mese = zeroPad(dataCorretta.getMonth() + 1, 2);
	const anno = dataCorretta.getFullYear();
	const ora = zeroPad(dataCorretta.getHours(), 2);
	const minuti = zeroPad(dataCorretta.getMinutes(), 2);
	const secondi = zeroPad(dataCorretta.getSeconds(), 2);
	return `${giorno}/${mese}/${anno} ${ora}:${minuti}:${secondi}`;
};

//Funzione che mi restituisce il formato corretto per l`entry fee
export const ottieniFormatoEntryFeeCorretto = (entryFee) => {
	if (entryFee === 0) return "Free";
	return `${entryFee} €`;
};

export const getToken = () => Cookies.get("token");

export const handleResponse = (response, navigate) => {
	if (response.status == 403 || response.status == 401) {
		Cookies.remove("token");
		Cookies.remove("username");
		navigate("/login");
		return false;
	}
	return true;
};
export function timeSince(data) {
	let date = new Date(data);
	if (!date) return null;
	var seconds = Math.floor((new Date() - date) / 1000);

	var interval = seconds / 31536000;

	if (interval > 1) {
		return Math.floor(interval) + " years";
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return Math.floor(interval) + " months";
	}
	interval = seconds / 86400;
	if (interval > 1) {
		return Math.floor(interval) + " days";
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return Math.floor(interval) + " hours";
	}
	interval = seconds / 60;
	if (interval > 1) {
		return Math.floor(interval) + " minutes";
	}
	return Math.floor(seconds) + " seconds";
}
