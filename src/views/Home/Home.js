import React, { useEffect, useState } from "react";
import CardGame from "../../components/CardGame/CardGame";
import { getInformazioneGiocoSpecifica } from "../../utilities/utilities";

import style from "./Home.module.css";

let arr = [
	{
		id: 1,
		title: "Rocket League",
		img: "copertinaRocketLeague.jpg",
	},
	{ id: 2, title: "League of Legends", img: "copertinaLoL.jpg" },
	{ id: 3, title: "Apex", img: "copertinaApex.jpg" },
	{ id: 4, title: "Fortnite", img: "copertinaFortnite.jpg" },
	{ id: 5, title: "Warzone 2", img: "copertinaWarzone2.jpg" },
	{ id: 6, title: "Valorant", img: "copertinaValorant.jpg" },
	{ id: 7, title: "CSGO", img: "copertinaCSGO.jpg" },
	{ id: 8, title: "Dota 2", img: "copertinaDota2.jpg" },
	{ id: 9, title: "Fifa 23", img: "copertinaFifa23.jpg" },
	{ id: 10, title: "GTA 5", img: "copertinaGta5.jpg" },
	{ id: 11, title: "Minecraft ", img: "copertinaMinecraft.jpg" },
	{ id: 12, title: "Hearthstone", img: "copertinaHearthstone.jpg" },
];
export default function Home() {
	const [classiEroi, setClassiEroi] = useState([]);

	useEffect(() => {
		//Funzione che ottiene gli eroi, se le classi non sono presenti utilizzo un array vuoto
		setClassiEroi(getInformazioneGiocoSpecifica("classes") || []);
	}, []);
	console.log("ciao");
	return (
		<div className={style.container_cards_games}>
			{arr.map((game) => (
				<CardGame img={game.img} id={game.id} title={game.title} />
			))}
		</div>
	);
}
