import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "reactstrap";
import CardGame from "../../components/CardGame/CardGame";
import Loading from "../../components/Loading/Loading";
import { getToken, handleResponse, URL_BASE } from "../../utilities/utilities";
import style from "./Home.module.css";

export default function Home() {
	const [viewedGames, setViewedGames] = useState([]);
	const allGames = useRef([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	//Funzione che ottiene i nomi dei gioci dal server
	const getGames = async (text = "", page = 1) => {
		const url = URL_BASE + "/game";
		let response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + getToken(),
			},
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			let data = await response.json();
			setViewedGames(data);
			allGames.current = data;
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

	//Funzione che filtra i giochi in base al testo inserito
	const filterGames = (text) => {
		if (text == "") {
			setViewedGames(allGames.current);
			setLoading(false);
			return;
		}
		let filteredGames = allGames.current.filter((game) => {
			return game.name.toLowerCase().includes(text.toLowerCase());
		});
		setViewedGames(filteredGames);
		setLoading(false);
	};
	return (
		<div className={style.container_home}>
			<div className={style.container_header_home}>
				<h1 className="text_white">Where you want to compete?</h1>

				<Input
					placeholder="Search the game"
					bsSize={"lg"}
					onChange={(e) => {
						setLoading(true);
						debounce(() => filterGames(e.target.value));
					}}
					className={style.input_search}
				/>
			</div>
			<div className="separator" />

			{loading ? (
				<Loading />
			) : (
				<div className={style.container_cards_games} data-aos="fade-up">
					{viewedGames.map((game) => (
						<CardGame
							key={game._id.toString()}
							background={game.background}
							img={game.image}
							id={game._id.toString()}
							title={game.name}
						/>
					))}
				</div>
			)}
		</div>
	);
}
