export const zeroPad = (num, places) => String(num).padStart(places, "0");

export const removeDashesAndUnderscores = (text) => text.replace(/[\-_]/g, " ");

export const cleanText = (text) => text.replace(/[^ -~]+/g, " ");

export const cleanTextAndRemoveDashesAndUnderscores = (text) =>
	removeDashesAndUnderscores(cleanText(text));

let informazioniGioco = {};
export const getInformazioniGioco = async () => {
	const url = "https://omgvamp-hearthstone-v1.p.rapidapi.com/info";
	const response = await fetch(url, {
		headers: {
			"X-RapidAPI-Key": "3588e18175msh335e698497820a3p1a0fefjsn286ca30853ce",
			"X-RapidAPI-Host": "omgvamp-hearthstone-v1.p.rapidapi.com",
		},
	});
	if (response.status === 200) {
		const json = await response.json();
		informazioniGioco = json;
	} else {
	}
};
//Funzione che ottiene le informazioni del gioco in base alla tipologia richiesta dal json ottenuto
//Se tipo è null allora ritorna tutto il json, altrimenti ritorna solo la tipologia richiesta
export const getInformazioneGiocoSpecifica = (tipo = null) => {
	if (tipo === null) return informazioniGioco;
	return informazioniGioco[tipo];
};
