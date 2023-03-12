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
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "reactstrap";
import { getToken, handleResponse, URL_BASE } from "../../utilities/utilities";
import Cookies from "js-cookie";

export default function TournamentInfo() {
	const [tournamentStarted, setTournamentStarted] = useState(false);
	const [tournamentInfo, setTournamentInfo] = useState({});
	const [bracket, setBracket] = useState([]);
	const [enrolled, setEnrolled] = useState(false);
	const [currentMatch, setCurrentMatch] = useState();
	const [noMatch, setNoMatch] = useState(false);
	const [joinDisabled, setJoinDisabled] = useState(false);
	const team = useRef();
	const location = useLocation();
	let { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		getTournamentInfo(id);
	}, []);

	//Ottieni informazioni torneo
	const getTournamentInfo = async (id) => {
		const url = URL_BASE + "/tournament/" + id;
		let response = await fetch(url, {
			headers: {
				Authorization: "Bearer " + getToken(),
			},
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			let data = await response.json();
			if (data.enrolled === data.maxTeams) setJoinDisabled(true);
			setTournamentInfo({ ...location.state, ...data });
			setEnrolled(data.joined);
		} else {
			navigate(-1);
		}
	};

	//Funzione che gestisce la fine del countdown
	const handleCountdownEnd = async () => {
		setTournamentStarted(true);
		await getTournamentInfo(id);
		createBracket();
	};

	const ottieniStatusBracket = (statusMatch) => {
		if (statusMatch == "PLAYING" || statusMatch == "WAITING") {
			return "DONE";
		}
		if (statusMatch == "WO") return "WALK_OVER";
		return "NOT_STARTED";
	};

	const ottieniStatusTeam = (statusMatch) => {
		if (statusMatch == "PLAYING" || statusMatch == "WAITING") return null;
		if (statusMatch == "WALK_OVER") return null;
	};

	//Funzione che gestisce la scritta del nome del team
	const ottieniUsernameDaVisualizzare = (username, status) => {
		if (username) return username;
		if (status == "WO") return "";
		if (status == "WAITING") return "";
	};

	//Funzione che gestisce la scritta sul risultato del match
	const ottieniResultText = (status, winnerTeam, teamId) => {
		if (status == "PLAYING") return null;
		if (!winnerTeam) return null;
		if (status == "WO" && winnerTeam != teamId) return "";
		if (winnerTeam == teamId) return "WIN";
		else return "LOSE";
	};

	const ottieniWinnerTeam = (status, winnerTeam, idTeam) => {
		if (status == "WAITING") return null;
		if (status == "WO" && winnerTeam == idTeam) return "WIN";

		return false;
	};

	//Funzione che crea il bracket del torneo usando dei dati falsi
	const createBracket = () => {
		let bracket = [];

		//Per creare il bracket devo avere un numero di partecipanti che sia una potenza di 2
		let massimoNumeroPartecipanti = Math.pow(
			2,
			Math.ceil(Math.log(tournamentInfo.enrolled) / Math.log(2))
		);
		if (massimoNumeroPartecipanti === 0) {
			setNoMatch(true);
			return;
		}
		// Il numero dei match è sempre il numero dei team iscritti meno uno
		let lastMatch;
		let id = 0;
		for (let i = 0; i < tournamentInfo.bracket.length; i++) {
			//Cerco l`ultimo match in cui è presente il team dell`utente
			if (tournamentInfo.bracket[i]?.team1?.components?.includes(Cookies.get("id"))) {
				lastMatch = tournamentInfo.bracket[i];
			}

			if (tournamentInfo.bracket[i]?.team2?.components?.includes(Cookies.get("id"))) {
				lastMatch = tournamentInfo.bracket[i];
			}
			let status = ottieniStatusBracket(tournamentInfo.bracket[i].status);
			let statusTeam = ottieniStatusTeam(status);
			let obj = {
				id: tournamentInfo.bracket[i].tournamentMatchRef,
				nextMatchId: tournamentInfo.bracket[i].tournamentNextMatchRef,
				torunamentRoundText: tournamentInfo.bracket[i].roundText,
				state: status,
				participants: [
					{
						id: tournamentInfo.bracket[i].team1?._id || id,
						resultText: ottieniResultText(
							tournamentInfo.bracket[i].status,
							tournamentInfo.bracket[i].winner,
							tournamentInfo.bracket[i].team1?._id
						),
						isWinner: ottieniWinnerTeam(
							tournamentInfo.bracket[i].status,
							tournamentInfo.bracket[i].winner,
							tournamentInfo.bracket[i].team1?._id
						),
						status: statusTeam,
						name: ottieniUsernameDaVisualizzare(
							tournamentInfo.bracket[i].team1?.name,
							tournamentInfo.bracket[i].status
						),
					},
					{
						id: tournamentInfo.bracket[i].team2?._id || id + 1,
						resultText: ottieniResultText(
							tournamentInfo.bracket[i].status,
							tournamentInfo.bracket[i].winner,
							tournamentInfo.bracket[i].team2?._id
						),
						isWinner: ottieniWinnerTeam(
							tournamentInfo.bracket[i].status,
							tournamentInfo.bracket[i].winner,
							tournamentInfo.bracket[i].team2?._id
						),
						status: statusTeam,
						name: ottieniUsernameDaVisualizzare(
							tournamentInfo.bracket[i].team2?.name,
							tournamentInfo.bracket[i].status
						),
					},
				],
			};
			id += 2;
			bracket.push(obj);
		}
		setCurrentMatch(lastMatch);
		setBracket(bracket);

		//Imposto l`ultimo match come match da visualizzare
	};
	//Funzione che gestisce il click su un match
	const showMatch = () => {
		navigate("/match/" + currentMatch._id);
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
								<h1 className={style.title_tournament}>{tournamentInfo.name}</h1>
								<div className={style.container_img_platform}>
									{tournamentInfo?.platform?.map((piattaforma) => (
										<Icon
											key={piattaforma.name}
											src={piattaforma.image}
											id={piattaforma.name}
											title={piattaforma.name}
											width={piattaforma.name == "PS4" || piattaforma.name == "XBOX" ? 40 : 20}
										/>
									))}

									{tournamentInfo.region?.map((regione) => (
										<Icon
											src={regione.image}
											id={regione.name}
											title={regione.name}
											width={25}
											key={regione.name}
										/>
									))}
								</div>
							</div>
						</div>
						{!tournamentStarted && (
							<div className={style.container_countdown}>
								<div className={style.container_value_countdown}>
									<h4>Starts In:</h4>
									<Countdown
										date={new Date(tournamentInfo.startingDate)}
										onComplete={handleCountdownEnd}
									/>
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
									<strong>Entry fee:</strong>
									{tournamentInfo.entryFee == 0 ? " Free" : "€ " + tournamentInfo.entryFee}
								</p>
							</div>
							<div className={style.container_card_info}>
								<FontAwesomeIcon icon={faUsers} color={"white"} size={"lg"} />
								<p>
									<strong>Enrolled:</strong>{" "}
									{tournamentInfo.enrolled + "/" + tournamentInfo.maxTeams}
								</p>
							</div>
							<div className={style.container_card_info}>
								<FontAwesomeIcon icon={faEuroSign} color={"white"} size={"lg"} />
								<p>
									<strong>Prize:</strong> € {tournamentInfo.prize}
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
								<span>€ {tournamentInfo.prizeSecondPlace}</span>
							</div>
							<div className={style.container_prize_item}>
								<img
									src={require("../../assets/images/first.png")}
									width={100}
									alt={"First place"}
								/>
								<span>€ {tournamentInfo.prizeFirstPlace}</span>
							</div>
							<div className={style.container_prize_item}>
								<img
									src={require("../../assets/images/third.png")}
									width={75}
									alt={"Third place"}
								/>
								<span>€{tournamentInfo.prizeThirdPlace}</span>
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
								You already joined this tournament, wait for the start!
							</Button>
						) : (
							<>
								{joinDisabled ? (
									<Button className={style.button + " button"} disabled={joinDisabled}>
										<FontAwesomeIcon icon={faRightToBracket} color={"white"} className={"mr-10"} />
										Join
									</Button>
								) : (
									<NavLink to={{ pathname: "/createTeam" }} state={{ info: tournamentInfo }}>
										<Button className={style.button + " button"}>
											<FontAwesomeIcon
												icon={faRightToBracket}
												color={"white"}
												className={"mr-10"}
											/>
											Join
										</Button>
									</NavLink>
								)}
							</>
						)}
					</div>
				)}
				{/* 
				{tournamentStarted && currentMatch && (
					<>
						<h2 className="mt-20 text-white">Your Match</h2>
						<div className={style.container_next_match} onClick={showMatch}>
							<div className={style.container_partecipante}>
								{/* <img
									src={currentMatch.participants[0].img}
									width={60}
									height={60}
									className={"mb-10"}
									alt={"Team " + currentMatch.participants[0].name}
								/> 
								<h4 className="mb-0">{currentMatch.team1?.name}</h4>
							</div>
							<div className={style.container_risultato_match}>
								<h3 className={"text-white " + style.status_match}>
									{currentMatch.status.replace(/_/g, " ")}
								</h3>
								<h1 className={"text-white text-center " + style.match_result}>
									{currentMatch.winner == currentMatch.team1?._id ? "1 " : "0 "} :{" "}
									{currentMatch.winner == currentMatch.team2?._id ? " 1" : " 0"}
								</h1>
							</div>
							<div className={style.container_partecipante}>
								{/* <img
									src={currentMatch.participants[1].img}
									width={60}
									height={60}
									className={"mb-10"}
									alt={"Team " + currentMatch.participants[1].name}
								/> 
								<h4 className="mb-0">{currentMatch.team2?.name}</h4>
							</div>
						</div>
					</>
				)} */}

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
