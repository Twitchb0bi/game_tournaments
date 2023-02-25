import React, { useState, useEffect, useRef } from "react";
import TournamentBracket from "../../components/TournamentBracket.js/TournamentBracket";
import Countdown from "react-countdown";
import style from "./TournamentInfo.module.css";
import CustomTooltip from "../../components/Tooltip/CustomTooltip";
import Icon from "../../components/Icon/Icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faker } from "@faker-js/faker";
import {
	faEuroSign,
	faGamepad,
	faRightToBracket,
	faUsers,
	faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "reactstrap";

export default function TournamentInfo() {
	const [tournamentStarted, setTournamentStarted] = useState(false);
	const [tournamentInfo, setTournamentInfo] = useState(useLocation().state);
	const [bracket, setBracket] = useState([]);
	const [enrolled, setEnrolled] = useState(false);
	const [currentMatch, setCurrentMatch] = useState();
	const [noMatch, setNoMatch] = useState(false);
	const team = useRef();

	useEffect(() => {
		//Controllo se ho un team salvato nel local storage
		//Se ho un team salvato vuol dire che sono iscritto al torneo
		team.current = JSON.parse(localStorage.getItem(tournamentInfo.tournamentId));
		if (team.current) setEnrolled(true);

		//se premo il tasto f parte il torneo (solo per testare e per non aspettare il countdown)
		document.onkeydown = (e) => {
			if (e.key === "f") {
				startTournament();
			}
		};
	}, []);

	//Fuzione che modifica la data di inizio del torneo all'ora attuale
	const startTournament = () => {
		setTournamentInfo({ ...tournamentInfo, starting: new Date() });
	};

	//Funzione che gestisce la fine del countdown
	const handleCountdownEnd = () => {
		setTournamentStarted(true);
		createBracket();
	};

	//Funzione che crea il bracket del torneo usando dei dati falsi
	const createBracket = () => {
		let bracket = [];
		let partecipant = [];

		//Per creare il bracket devo avere un numero di partecipanti che sia una potenza di 2
		let massimoNumeroPartecipanti = Math.pow(
			2,
			Math.ceil(Math.log(tournamentInfo.enrolled) / Math.log(2))
		);

		if (massimoNumeroPartecipanti === 0) {
			setNoMatch(true);
			return;
		}

		//Calcolo il numero di round del torneo
		var rounds = Math.log(massimoNumeroPartecipanti) / Math.log(2);

		// Il numero dei match è sempre il numero dei team iscritti meno uno

		//Se il team è iscritto lo aggiungo al bracket
		if (team.current) {
			//Diminuisco il numero di partecipanti che dovrò creare
			--massimoNumeroPartecipanti;
			partecipant.push({
				id: localStorage.getItem("username"),
				name: team.current.teamName,
				img: faker.image.avatar(),
			});
		}

		//Creo i finti partecipanti
		for (let i = 0; i < massimoNumeroPartecipanti; i++) {
			if (i < tournamentInfo.enrolled) {
				let id = faker.datatype.uuid();
				let obj = {
					id: id,
					name: faker.internet.userName(),
					img: faker.image.avatar(),
				};
				partecipant.push(obj);
			} else {
				// se non ho abbastanza partecipanti creo dei partecipanti con nome TBD che non partecipanno al torneo, servono solo per gestire i bracket
				partecipant.push({
					id: faker.datatype.uuid(),
					name: "TBD",
				});
			}
		}

		for (let i = 1; i < rounds + 1; i++) {
			//Se è il primo round
			if (i === 1)
				for (let j = 0; j < partecipant.length; j += 2) {
					//Itero i partecipanti a due a due per creare i match
					let status = "SCORE_DONE";
					let randomNumber = Math.random(); // Genero un numero random
					let partecipanti = [];
					let obj1 = {
						id: partecipant[j]?.id || null,
						resultText: randomNumber > 0.5 ? "Won" : "Lost", //Se il numero è maggiore di 0.5 il primo partecipante ha vinto altrimenti ha perso
						isWinner: randomNumber > 0.5 ? true : false,
						status: "PLAYED",
						name: partecipant[j]?.name || "TBD",
						img: partecipant[j]?.img || null,
					};
					let obj2 = {
						id: partecipant[j + 1]?.id || null,
						resultText: randomNumber > 0.5 ? "Lost" : "Won",
						isWinner: randomNumber > 0.5 ? false : true,
						status: "PLAYED",
						name: partecipant[j + 1]?.name || "TBD",
						img: partecipant[j + 1]?.img || null,
					};
					//Se il nome del partecipante è TBD vuol dire che è un WALK_OVER
					if (obj1.name !== "TBD") partecipanti.push(obj1);
					if (obj2.name !== "TBD") partecipanti.push(obj2);

					if (partecipanti.length === 1) {
						status = "WALK_OVER";
						partecipanti[0].isWinner = true;
						partecipanti[0].resultText = "Won";
					}
					//Creo l'id del prossimo match che sarà il round successivo (Round 2) e il match successivo Sarà il match attuale /4 + 1
					// +1 perchè i match partono da 1 e non da 0
					let nextMatchId = "Round " + Number(i + 1) + " Match " + Number(Math.floor(j / 4 + 1));
					//se è presente un solo round allora non ho un match successivo
					if (i === rounds) nextMatchId = null;
					let obj = {
						id: "Round " + 1 + " Match " + Number(Math.ceil(j / 2) + 1),
						nextMatchId: nextMatchId,
						torunamentRoundText: i.toString(),
						// startTime: new Date().toLocaleDateString(),
						state: status,
						participants: partecipanti,
					};
					bracket.push(obj);
				}
			else {
				//Creo i match successivi al primo
				for (let j = 1; j <= Math.pow(2, rounds - i); j++) {
					let nextMatchId = null;

					// // Se è l`ultimo round allora non ha un match successivo   (e` la finale)
					if (i === rounds) nextMatchId = null;
					else nextMatchId = "Round " + Number(i + 1) + " Match " + Number(Math.ceil(j / 2));

					let partecipanti = [];

					//Offset serve a capire da dove devo partire a prendere i team che hanno vinto il match precedente
					let offset = 0;
					if (i > 2) offset = calcolaOffset(rounds, i);
					const startIndex = offset + 2 * (j - 1);

					//prendo i match precedenti
					let match1 = bracket[startIndex];
					let match2 = bracket[startIndex + 1];
					let randomNumber = Math.random();
					let partecipant1 = null;
					let partecipant2 = null;

					//Trovo chi ha vinto il primo match precedente
					//E lo aggiorno con il risultato del nuovo match
					for (let k = 0; k < match1.participants.length; k++) {
						if (match1.participants[k].isWinner) {
							partecipant1 = {
								...match1.participants[k],
								resultText: randomNumber >= 0.5 ? "Won" : "Lost",
								isWinner: randomNumber >= 0.5 ? true : false,
								status: "PLAYED",
							};
						}
					}

					//Trovo chi ha vinto il secondo match precedente
					//E lo aggiorno con il risultato del nuovo match
					for (let k = 0; k < match2.participants.length; k++) {
						if (match2.participants[k].isWinner) {
							partecipant2 = {
								...match2.participants[k],
								resultText: randomNumber < 0.5 ? "Won" : "Lost",
								isWinner: randomNumber < 0.5 ? true : false,
								status: "PLAYED",
							};
						}
					}
					if (partecipant1) partecipanti.push(partecipant1);
					if (partecipant2) partecipanti.push(partecipant2);

					let status = "SCORE_DONE";
					//Se è presente un solo partecipante vuol dire che è un WALK_OVER
					if (partecipanti.length === 1) {
						status = "WALK_OVER";
						partecipanti[0].isWinner = true;
						partecipanti[0].resultText = "Won";
					}

					bracket.push({
						id: "Round " + i + " Match " + j,
						nextMatchId: nextMatchId,
						tournamentRoundText: i.toString(),
						// startTime: new Date().toLocaleDateString(),
						state: status,
						participants: partecipanti,
					});
				}
			}
		}
		//Imposto l`ultimo match come match da visualizzare
		setCurrentMatch(bracket[bracket.length - 1]);
		//Imposto il bracket
		setBracket(bracket);
	};

	//Funzione che calcola l`offset da cui partire per prendere i partecipanti
	const calcolaOffset = (rounds, i) => {
		let offset = Math.pow(2, rounds - i + 2);
		--i;
		while (i > 2) {
			offset += Math.pow(2, rounds - i + 2);
			i--;
		}
		return offset;
	};
	return (
		<div className={style.container_tournament_bracket}>
			<div className={style.container_info}>
				<div className={style.container_card}>
					<div className={style.container_img}>
						<img
							src={tournamentInfo.img}
							alt={tournamentInfo.title}
							id={"gameImg"}
							className={style.img_card}
						/>
						<CustomTooltip title={tournamentInfo.title} id={"gameImg"} />
					</div>
					<div className={style.container_tournament_header}>
						<div className={style.container_img_titolo}>
							<div>
								<h1 className={style.title_tournament}>{tournamentInfo.tournamentTitle}</h1>
								<div className={style.container_img_platform}>
									<Icon
										src={require("../../assets/images/monitor.png")}
										id={"monitor"}
										title={"Monitor"}
									/>
									<Icon
										src={require("../../assets/images/xbox.png")}
										width={40}
										id={"xbox"}
										title={"Xbox"}
									/>
									<Icon
										src={require("../../assets/images/ps4.png")}
										id={"ps4"}
										width={40}
										title={"PS4"}
									/>
									<Icon
										src={require("../../assets/images/european.png")}
										id={"europe"}
										width={25}
										title={"Europe"}
									/>
								</div>
							</div>
						</div>
						{!tournamentStarted && (
							<div className={style.container_countdown}>
								<div className={style.container_value_countdown}>
									<h4>Starts In:</h4>
									<Countdown date={tournamentInfo.starting} onComplete={handleCountdownEnd} />
								</div>
							</div>
						)}
					</div>
				</div>

				<div className={style.container_info_tournament}>
					{/* <div className={style.container_details_prize}> */}
					<div className={style.container_details_tournament}>
						<div className={style.container_cards_info}>
							<div className={style.container_card_info}>
								<FontAwesomeIcon icon={faGamepad} color={"white"} size={"lg"} />
								<p>
									<strong>Mode:</strong> {tournamentInfo.teamSize + "V" + tournamentInfo.teamSize}
								</p>
							</div>
							<div className={style.container_card_info}>
								<FontAwesomeIcon icon={faWallet} color={"white"} size={"lg"} />
								<p>
									<strong>Entry fee:</strong> €{tournamentInfo.entryFee}
								</p>
							</div>
							<div className={style.container_card_info}>
								<FontAwesomeIcon icon={faUsers} color={"white"} size={"lg"} />
								<p>
									<strong>Enrolled:</strong>{" "}
									{enrolled
										? Number(tournamentInfo.enrolled + 1)
										: tournamentInfo.enrolled + "/" + tournamentInfo.maxTeams}
								</p>
							</div>
							<div className={style.container_card_info}>
								<FontAwesomeIcon icon={faEuroSign} color={"white"} size={"lg"} />
								<p>
									<strong>Prize:</strong> € {tournamentInfo.totalEarnings}
								</p>
							</div>
						</div>
						<div className={style.container_prize}>
							<div className={style.container_prize_item}>
								<img
									src={require("../../assets/images/second.png")}
									width={80}
									alt={"Second place"}
								/>
								<span>€ {tournamentInfo.secondEarnings}</span>
							</div>
							<div className={style.container_prize_item}>
								<img
									src={require("../../assets/images/first.png")}
									width={100}
									alt={"First place"}
								/>
								<span>€ {tournamentInfo.firstEarnings}</span>
							</div>
							<div className={style.container_prize_item}>
								<img
									src={require("../../assets/images/third.png")}
									width={75}
									alt={"Third place"}
								/>
								<span>€{tournamentInfo.thirdEarnings}</span>
							</div>
						</div>
					</div>

					{/* </div> */}
				</div>
				{!tournamentStarted && (
					<div className={style.container_join_button}>
						{enrolled ? (
							<Button className={"button"} disabled={true}>
								<FontAwesomeIcon icon={faRightToBracket} color={"white"} className={"mr-10"} />
								You Already joined this tournament, wait for the start!
							</Button>
						) : (
							<NavLink to={{ pathname: "/createTeam" }} state={{ info: tournamentInfo }}>
								<Button className={style.button + " button"}>
									<FontAwesomeIcon icon={faRightToBracket} color={"white"} className={"mr-10"} />
									Join
								</Button>
							</NavLink>
						)}
					</div>
				)}

				{tournamentStarted && currentMatch && (
					<>
						<h2 className="mt-20 text-white">Current Match</h2>
						<div className={style.container_next_match}>
							<div className={style.container_partecipante}>
								<img
									src={currentMatch.participants[0].img}
									width={60}
									height={60}
									className={"mb-10"}
									alt={"Team " + currentMatch.participants[0].name}
								/>
								<h4 className="mb-0">{currentMatch.participants[0].name}</h4>
							</div>
							<div className={style.container_risultato_match}>
								<h3 className={"text-white " + style.status_match}>
									{currentMatch.state.replace(/_/g, " ")}
								</h3>
								<h1 className={"text-white text-center " + style.match_result}>
									{currentMatch.participants[0].isWinner ? "1 " : "0 "} :{" "}
									{currentMatch.participants[1].isWinner ? " 1" : " 0"}
								</h1>
							</div>
							<div className={style.container_partecipante}>
								<img
									src={currentMatch.participants[1].img}
									width={60}
									height={60}
									className={"mb-10"}
									alt={"Team " + currentMatch.participants[1].name}
								/>
								<h4 className="mb-0">{currentMatch.participants[1].name}</h4>
							</div>
						</div>
					</>
				)}

				{tournamentStarted && bracket.length > 0 && (
					<>
						<h2 className="mt-20 text-white">Bracket</h2>
						<div className={style.container_bracket}>
							<TournamentBracket matches={bracket} />
						</div>
					</>
				)}
				{noMatch && (
					<div className={style.container_no_match}>
						<h2 className="text-white">Tournament started without Teams</h2>
					</div>
				)}
			</div>
		</div>
	);
}
