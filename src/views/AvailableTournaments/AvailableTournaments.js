import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { faker } from "@faker-js/faker";
import style from "./AvailableTournaments.module.css";
import {
	getToken,
	handleResponse,
	ottieniFormatoDataCorretto,
	URL_BASE,
} from "../../utilities/utilities";

export default function AvailableTournaments() {
	const location = useLocation();
	const navigate = useNavigate();
	const [headerTabella, setHeaderTabella] = useState([
		{ name: "Entry Fee", title: "entryFee", dir: "" },
		{ name: "Team Size", title: "teamSize", dir: "" },
		{ name: "Competition" },
		{ name: "Starting", title: "starting", dir: "" },
		{ name: "Enrolled", title: "enrolled", dir: "" },
	]);
	const [tournament, setTournament] = useState([]);
	const [infoGioco, setInfoGioco] = useState(location.state);

	//Funzione che gestisce il click sull`header della tabella, gestendo la direzione di ordinamento
	const handleClickHeader = (header) => {
		if (header.dir === undefined) return;
		let nuovoHeader = {};
		let arr = headerTabella.map((h) => {
			let obj = { ...h };
			if (h.name === header.name) {
				if (h.dir === "asc") obj.dir = "desc";
				if (h.dir === "desc") obj.dir = "";
				if (h.dir === "") obj.dir = "asc";
				nuovoHeader = obj;
			} else if (obj.dir !== undefined) obj.dir = "";

			return obj;
		});
		sortTable(nuovoHeader);
		setHeaderTabella(arr);
	};

	//Funzione che gestisce il click sul bottone "View" di un torneo
	const handleClickView = (tournamentInfo) => {
		navigate(`/tournament/${tournamentInfo._id}`, {
			state: { ...tournamentInfo, ...infoGioco },
		});
	};

	useEffect(() => {
		getTournaments();
	}, []);

	//Funzione che ottiene tutti i tornei disponibili per un gioco
	const getTournaments = async () => {
		const url = URL_BASE + "/tournament";
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + getToken(),
			},
			body: JSON.stringify({
				game: infoGioco.id,
			}),
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			setTournament(data);
		} else {
			const data = await response.json();
		}
	};

	//Funzione che ordina la tabella in base all`header cliccato
	const sortTable = (header) => {
		let arr = [...tournament];
		if (header.dir === "asc") {
			arr.sort((a, b) => {
				if (a[header.title] < b[header.title]) return -1;
				if (a[header.title] > b[header.title]) return 1;
				return 0;
			});
		} else if (header.dir === "desc") {
			arr.sort((a, b) => {
				if (a[header.title] > b[header.title]) return -1;
				if (a[header.title] < b[header.title]) return 1;
				return 0;
			});
		}
		setTournament(arr);
	};

	return (
		<div className={style.container_game_info}>
			<img src={infoGioco.background} className={style.img_copertina} alt={infoGioco.title} />
			<div className={style.container_info}>
				<div className={style.container_img_titolo}>
					<div className={style.container_card}>
						<img src={infoGioco.img} alt={infoGioco.title} className={style.img_card} />
					</div>
					<h1>{infoGioco.title}</h1>
				</div>
				{/* <h2>Modalità</h2> */}
			</div>
			<div className={style.container_partite_disponibili}>
				<div className={style.container_tabella}>
					<Table responsive hover size={"md"} className={style.table}>
						<thead>
							<tr>
								{headerTabella.map((header) => (
									<th
										key={header.name}
										onClick={() => {
											handleClickHeader(header);
										}}
										className={header.dir !== undefined ? "pointer" : ""}>
										{header.name}
										{header.dir === "asc" && (
											<FontAwesomeIcon icon={faArrowUp} className={"ml-5"} />
										)}
										{header.dir === "desc" && (
											<FontAwesomeIcon icon={faArrowDown} className={"ml-5"} />
										)}
									</th>
								))}

								<th></th>
							</tr>
						</thead>
						<tbody>
							{tournament.map((tournament) => (
								<tr key={tournament.id}>
									<td scope="row">
										{tournament.entryFee == 0 ? "Free" : "€" + tournament.entryFee}
									</td>
									<td>{tournament.teamSize}</td>
									<td>{tournament.name}</td>
									<td>{ottieniFormatoDataCorretto(tournament.startingDate)}</td>
									<td>{tournament.enrolled + "/" + tournament.maxTeams}</td>
									<td>
										<Button
											color="success"
											onClick={() => {
												handleClickView(tournament);
											}}>
											View
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					{tournament.length == 0 && <div className="no_item_table">No Tournamets available</div>}
				</div>
			</div>
		</div>
	);
}
