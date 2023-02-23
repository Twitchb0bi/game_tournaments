import React, { useEffect, useState, useCallback } from "react";
import { Input } from "reactstrap";
import CardGame from "../../components/CardGame/CardGame";
import Loading from "../../components/Loading/Loading";
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
	const [allGames, setAllGames] = useState([]);
	const [loading, setLoading] = useState(true);

	//Funzione che ottiene i nomi dei gioci dal server
	const getGames = async (text = "", page = 1) => {
		let response = await fetch(
			"https://api.rawg.io/api/games?key=aefc184c81b84e7b8078acaddba70abc&tags=multiplayer&page=" +
				page +
				"&search=" +
				text +
				"&search_precise=true&search_exact=false&tags=multiplayer&page_size=30&dates=2023-1-1.2023-01-01&exclude_additions=true&ordering=-metacritic&metacritic=70,100&platforms=4,187,1,18,186,5,6,14,16"
		);
		if (response.status === 200) {
			let data = await response.json();

			setAllGames(data.results);
			setLoading(false);
		} else {
			setLoading(false);
		}
	};

	//Ottengo i giochi al caricamento della pagina
	useEffect(() => {
		getGames();
	}, []);

	let debounceTimer;
	const debounce = useCallback(async (callback) => {
		window.clearTimeout(debounceTimer);
		debounceTimer = window.setTimeout(callback, 250);
	}, []);

	return (
		<div className={style.container_home}>
			<div className={style.container_header_home}>
				<h1 className="text_white">Where you want to compete?</h1>

				<Input
					placeholder="Search the game"
					bsSize={"lg"}
					onChange={(e) => {
						setLoading(true);
						debounce(() => getGames(e.target.value));
					}}
					className={style.input_search}
				/>
			</div>
			<div className="separator" />

			{loading ? (
				<Loading />
			) : (
				<div className={style.container_cards_games} data-aos="fade-up">
					{allGames.map((game) => (
						<CardGame
							key={game.id.toString()}
							background={game.short_screenshots[1]?.image}
							img={game.background_image}
							id={game.id.toString()}
							title={game.name}
						/>
					))}
				</div>
			)}
		</div>
	);
}
