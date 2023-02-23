import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { faker } from "@faker-js/faker";
import style from "./AvailableTournaments.module.css";

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
		navigate(`/tournament/${tournamentInfo.tournamentId}`, {
			state: { ...tournamentInfo, ...infoGioco },
		});
	};

	useEffect(() => {
		let arr = [];
		//Creo un array di tornei random (da 1 a 10)
		for (let i = 0; i < Math.floor(Math.random() * 10) + 1; i++) {
			arr.push(createRandomTournament());
		}
		//ordino per data di inizio
		arr.sort((a, b) => {
			return a.starting - b.starting;
		});
		setTournament(arr);
	}, []);

	//Funzione che crea un torneo random
	const createRandomTournament = () => {
		let enrolled = faker.datatype.number({ min: 0, max: 50 });
		let maxTeams = faker.datatype.number({
			min: enrolled,
			max: enrolled + faker.datatype.number({ min: 1, max: 50 }),
		});
		const teamSize = faker.datatype.number({ min: 1, max: 2 });
		const totalEarnings = faker.datatype.number({ min: 1, max: 100 });
		return {
			tournamentId: faker.datatype.uuid(),
			entryFee: faker.datatype.number({ min: 0, max: 100 }),
			teamSize: teamSize,
			totalEarnings: totalEarnings,
			firstEarnings: (totalEarnings * 0.5).toFixed(2),
			secondEarnings: (totalEarnings * 0.3).toFixed(2),
			thirdEarnings: (totalEarnings * 0.2).toFixed(2),

			tournamentTitle: infoGioco.title + " - " + teamSize + "V" + teamSize,
			starting: faker.date.soon(3),
			enrolled: enrolled,
			maxTeams: maxTeams,
		};
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
									<td scope="row">€ {tournament.entryFee}</td>
									<td>{tournament.teamSize}</td>
									<td>{tournament.tournamentTitle}</td>
									<td>{tournament.starting.toLocaleString()}</td>
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
				</div>
			</div>
		</div>
	);
}
