import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Table } from "reactstrap";

import style from "./AvailableTournaments.module.css";

let arr = [
	{
		id: 1,
		entryFee: 100,
		teamSize: 2,
		competition: "Rocket League",
		enrolled: "25/30",
		starting: "2020-10-10 10:00:00",
	},
	{
		id: 2,
		entryFee: 100,
		teamSize: 2,
		competition: "Rocket League",
		enrolled: "25/30",
		starting: "2020-10-10 10:00:00",
	},
];
export default function AvailableTournaments() {
	let { id } = useParams();
	const navigate = useNavigate();
	const [headerTabella, setHeaderTabella] = useState([
		{ name: "Entry Fee", dir: "" },
		{ name: "Team Size", dir: "" },
		{ name: "Competition" },
		{ name: "Starting", dir: "" },
		{ name: "Enrolled", dir: "" },
	]);
	//Funzione che gestisce il click sull`header della tabella, gestendo la direzione di ordinamento
	const handleClickHeader = (header) => {
		// console.log(headerTabella);
		let arr = headerTabella.map((h) => {
			let obj = { ...h };
			if (h.name === header.name) {
				if (h.dir === "asc") obj.dir = "desc";
				if (h.dir === "desc") obj.dir = "";
				if (h.dir === "") obj.dir = "asc";
			}

			return obj;
		});
		setHeaderTabella(arr);
	};

	const handleClickJoin = (tournamentId) => {
		navigate(`/tournament/${tournamentId}`);
	};
	return (
		<div className={style.container_game_info}>
			<img src={require("../../assets/images/largeRL.jpg")} className={style.img_copertina} />
			<div className={style.container_info}>
				<div className={style.container_img_titolo}>
					<div className={style.container_card}>
						<img
							src={require("../../assets/images/copertinaRocketLeague.jpg")}
							alt={"Rocket League"}
							className={style.img_card}
						/>
					</div>
					<h1>Rocket League</h1>
				</div>
				{/* <h2>Modalità</h2> */}
			</div>
			<div className={style.container_partite_disponibili}>
				<div className={style.container_tabella}>
					<Table responsive dark hover>
						<thead>
							<tr>
								{headerTabella.map((header) => (
									<th
										onClick={() => {
											handleClickHeader(header);
										}}
										className={header.dir != undefined ? "pointer" : ""}>
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
							{arr.map((tournament) => (
								<tr>
									<th scope="row">{tournament.entryFee} $</th>
									<td>{tournament.teamSize}</td>
									<td>{tournament.competition}</td>
									<td>{tournament.starting}</td>
									<td>{tournament.enrolled}</td>
									<td>
										<Button
											color="success"
											onClick={() => {
												handleClickJoin(tournament.id);
											}}>
											Join
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
