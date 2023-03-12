import {
	faCheck,
	faPen,
	faPlus,
	faTimes,
	faUser,
	faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef, useEffect } from "react";
import { createHashHistory } from "history";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Button,
	Input,
	InputGroup,
	InputGroupText,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Card,
} from "reactstrap";
import style from "./Profile.module.css";
import { getToken, handleResponse, timeSince, URL_BASE } from "../../utilities/utilities";
import { errorNotification, successNotification } from "../../components/Notification/Notification";
import Cookies from "js-cookie";
import Team from "../../components/Team/Team";
import CardGame from "../../components/CardGame/CardGame";
export default function Profile() {
	const [infoUser, setInfoUser] = useState({});
	const [team, setTeam] = useState([]);
	const [loading, setLoading] = useState(true);
	const location = useLocation();
	const [modal, setModal] = useState(false);
	const inputAggiunta = useRef();
	const toggle = () => setModal(!modal);
	const navigate = useNavigate();
	const [myProfile, setMyProfile] = useState(false);
	let history = createHashHistory();
	const [games, setGames] = useState([]);
	const gameAccount = useRef({});
	const [gameSelezionato, setGameSelezionato] = useState(null);
	const [openModalConnect, setOpenModalConnect] = useState(false);
	const inputUsername = useRef();
	const filtered = useRef(false);
	const [errorUsername, setErrorUsername] = useState(false);
	const [openModalModificaUsername, setOpenModalModificaUsername] = useState(false);
	const [usernameModifica, setUsernameModifica] = useState("");
	const gameId = useRef();

	useEffect(() => {
		if (!location.state?._id) navigate(-1);
		if (location.state._id === Cookies.get("id")) {
			setMyProfile(true);
		}
		getGames();
		setLoading(true);
		getProfile();
		ottieniTeamEsistenti();
	}, []);

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
			setGames(data);
			setLoading(false);
		} else {
			setLoading(false);
		}
	};

	//Funzione che ottiene i dati dell'utente
	const getProfile = async (idU = null) => {
		let id = idU || location.state._id;
		const url = URL_BASE + "/user/" + id;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				authorization: "Bearer " + Cookies.get("token"),
			},
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			let arr = [];
			data.recentMatch.forEach((match) => {
				if (match.team1.components.includes(Cookies.get("id"))) {
					arr.push({ ...match, isWinner: match.team1._id === match.winner ? true : false });
				}
				if (match.team2.components.includes(Cookies.get("id"))) {
					arr.push({ ...match, isWinner: match.team2._id === match.winner ? true : false });
				}
			});
			data.recentMatch = arr;
			setInfoUser(data);
			setLoading(false);
		} else {
			const data = await response.json();
			errorNotification(data.message);
		}
	};

	//Funzione che gestisce la chiusura del modal
	const handleCloseModalAggiunta = () => {
		toggle();
		inputAggiunta.current.value = "";
	};

	//Funzione che invia una richiesta di amicizia
	const sendFriendRequest = async () => {
		const url = URL_BASE + "/user/friend";
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				authorization: "Bearer " + Cookies.get("token"),
			},
			body: JSON.stringify({
				username: inputAggiunta.current.value,
			}),
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			successNotification(data.message);
			inputAggiunta.current.value = "";
			toggle();
			getProfile();
		} else {
			const data = await response.json();
			errorNotification(data.message);
		}
	};

	//Funzione che accetta una richiesta di amicizia
	const acceptFriendRequest = async (id) => {
		const url = URL_BASE + "/user/friend/accept/" + id;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + Cookies.get("token"),
			},
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			getProfile();
		} else {
			const data = await response.json();
			errorNotification(data.message);
		}
	};

	//Funzione che rifiuta una richiesta di amicizia
	const rejectFriendRequest = async (id) => {
		const url = URL_BASE + "/user/friend/reject/" + id;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + Cookies.get("token"),
			},
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			getProfile();
		} else {
			const data = await response.json();
			errorNotification(data.message);
		}
	};

	//Funzione che naviga nella pagina che mostra un match
	const showMatch = (id) => {
		navigate("/match/" + id);
	};

	//Funzione che ottiene i team già esistenti di un player
	const ottieniTeamEsistenti = async (idU = null) => {
		let id = idU || location.state._id;
		let url = URL_BASE + "/team";
		if (id !== Cookies.get("id")) {
			url += "/all/" + id;
		}

		const response = await fetch(url, {
			headers: {
				Authorization: "Bearer " + getToken(),
			},
		});
		handleResponse(response, navigate);
		if (response.status == 200) {
			const data = await response.json();
			setTeam(data);
		} else {
		}
	};

	//Funzione che va alla pagina di modifica di un team
	const handleClickCardTeam = (team) => {
		navigate("/edit/team/" + team._id, { state: { team: team } });
	};

	//Funzione che mostra il profilo di un utente
	const showProfile = (user) => {
		history.replace("/profile", {
			_id: user._id,
		});
		getProfile(user._id);
		setMyProfile(false);
		ottieniTeamEsistenti(user._id);
	};

	//Funzione che gestisce il click sulla card di un gioco
	const handleClickCardGame = (idGame) => {
		console.log(idGame);
		setGameSelezionato(idGame);
	};

	//Funzione che apre il modal di connessione di un account
	const handleOpenModalConnect = () => {
		setOpenModalConnect(true);
	};

	//Funzione che gestisce la chiusura del modal di connessione di un account
	const handleCloseModalConnect = () => {
		setOpenModalConnect(false);
		setGameSelezionato(null);
	};

	//Funzione che gestisce la connessione di un nuovo account di gioco
	const connectGame = async () => {
		if (inputUsername.current.value === "") {
			setErrorUsername(true);
			return;
		}
		setErrorUsername(false);
		const url = URL_BASE + "/user/connect";
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				authorization: "Bearer " + Cookies.get("token"),
			},
			body: JSON.stringify({
				username: inputUsername.current.value,
				game: gameSelezionato,
			}),
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			successNotification(data.message);
			inputUsername.current.value = "";
			handleCloseModalConnect();
			getProfile();
		} else {
			const data = await response.json();
			errorNotification(data.message);
		}
	};

	//Funzione che gestisce l`apertura del modal di modifica username
	const handleOpenModalModificaUsername = (id) => {
		setOpenModalModificaUsername(true);
		gameId.current = id;
		for (let i = 0; i < infoUser.gameAccount.length; i++) {
			if (infoUser.gameAccount[i].game._id === id) {
				setUsernameModifica(infoUser.gameAccount[i].username);
				return;
			}
		}
	};
	//Funzione che gestisce la chiusura del modal di modifica username
	const handleCloseModalModificaUsername = () => {
		setOpenModalModificaUsername(false);
		setErrorUsername(false);
	};

	//Funzione che non fa nulla
	const handleClickGame = (id) => {
		handleOpenModalModificaUsername(id);
	};

	useEffect(() => {
		if (Object.keys(infoUser).length === 0 || games.length === 0) return;
		if (filtered.current) return;
		filterGame();
	}, [infoUser, games]);

	//Funzione che filtra i giochi che l'utente ha già connesso
	const filterGame = () => {
		let arr = [];
		for (let i = 0; i < games.length; i++) {
			let trovato = false;
			for (let j = 0; j < infoUser.gameAccount.length; j++) {
				if (games[i]._id === infoUser.gameAccount[j].game._id) {
					trovato = true;
					break;
				}
			}
			if (!trovato) arr.push(games[i]);
		}
		filtered.current = true;
		setGames(arr);
	};

	//Funzione che permette di modificare l`username di un account di gioco
	const changeUsername = async () => {
		if (usernameModifica === "") {
			setErrorUsername(true);
			return;
		}
		const url = URL_BASE + "/user/update/username";
		const response = await fetch(url, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				authorization: "Bearer " + Cookies.get("token"),
			},
			body: JSON.stringify({
				username: usernameModifica,
				game: gameId.current,
			}),
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			successNotification(data.message);
			handleCloseModalModificaUsername();
			getProfile();
		} else {
			const data = await response.json();
			errorNotification(data.message);
		}
	};

	console.log(infoUser);
	return (
		<div className={style.container_profile}>
			{loading ? (
				<></>
			) : (
				<div className={style.container_body}>
					<div className={style.container_header_profile}>
						<div className={style.container_username}>
							{infoUser.image ? (
								<img
									src={infoUser.image}
									width={50}
									height={50}
									alt={"Avatar"}
									className={"mr-10 "}
								/>
							) : (
								<FontAwesomeIcon icon={faUserCircle} className={"mr-10 "} size={"3x"} />
							)}
							<h1>{infoUser.username}</h1>
						</div>
						<div className={style.container_stats}>
							<span className="green">{infoUser.win + " W "}</span> /{" "}
							<span className="red">{infoUser.lose + " L"}</span>
						</div>

						<div className={style.container_stats}>
							<h3>${infoUser.earnings}</h3>
						</div>
					</div>
					<div className={style.container_info_profile}></div>
					<div className={style.container_friend_recent}>
						<div className={style.container_card_recent_match}>
							<div className={style.container_title_friends_list}>
								<h3 className="w100">Recent Match</h3>
							</div>
							{infoUser.recentMatch?.length === 0 && (
								<div>
									<h3 className="w100">No recent match</h3>
								</div>
							)}
							<div className={style.container_recent_matches}>
								{infoUser.recentMatch?.map((match) => (
									<div
										key={match._id}
										className={style.container_recent_match}
										onClick={() => {
											showMatch(match._id);
										}}>
										<img src={match.tournamentId.game.background} width={300} height={200} />
										<div className={style.container_result_match}>
											<h5 className={match.isWinner ? style.green : style.red}>
												{match.isWinner ? "WIN" : "LOSE"}
											</h5>
										</div>
										<div className={style.container_info_recent_match}>
											<h4>{match.tournamentId.name}</h4>
											<div className={style.container_team}>
												<h5>{match.team1.name}</h5>
												<h5>VS</h5>
												<h5>{match.team2.name}</h5>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
						<div className={style.container_friends_list}>
							<div className={style.container_title_friends_list}>
								<h3>Friends</h3>
								{myProfile && (
									<FontAwesomeIcon
										icon={faPlus}
										color={"green"}
										size={"lg"}
										className={"button_add pointer"}
										onClick={toggle}
									/>
								)}
							</div>
							{myProfile &&
								infoUser.friendsRequest?.map((request) => (
									<div className={style.container_row_friend} key={request._id}>
										<p
											onClick={() => {
												showProfile(request);
											}}>
											{request.username}
										</p>
										<div className={style.container_action_friend_request}>
											<FontAwesomeIcon
												icon={faCheck}
												color={"green"}
												size={"lg"}
												onClick={() => acceptFriendRequest(request._id)}
												className={"pointer"}
											/>
											<FontAwesomeIcon
												icon={faTimes}
												color={"red"}
												size={"lg"}
												className={"pointer"}
												onClick={() => rejectFriendRequest(request._id)}
											/>
										</div>
									</div>
								))}

							{infoUser.friends?.map((friend) => (
								<div className={style.container_row_friend} key={friend._id}>
									<p
										className="pointer underline_user"
										onClick={() => {
											showProfile(friend);
										}}>
										{friend.username}
									</p>
									{myProfile && (
										<p className={style.last_login}>{timeSince(friend.lastLogin)} ago</p>
									)}
								</div>
							))}
							{infoUser.friends?.length === 0 && <div>No friends</div>}
						</div>
					</div>

					<Team team={team} add={team.length < 5 && myProfile} handleClick={handleClickCardTeam} />
					<div className={style.container_friend_recent + " " + style.container_games}>
						<div className={style.container_title_friends_list}>
							<h3 className="w100">Connected Games</h3>
						</div>
						<div className={style.container_recent_matches}>
							{infoUser.gameAccount?.map((game) => (
								<div
									className={style.container_game_account}
									onClick={() => handleClickGame(game.game._id)}>
									<img src={game.game.icon} width={24} height={24} />
									<h6 className="text-white mb-0">{game.username}</h6>
									<FontAwesomeIcon
										icon={faPen}
										color={"yellow"}
										size={"sm"}
										className={style.container_modifica}
									/>
								</div>
							))}
							{infoUser.gameAccount?.length === 0 && !myProfile && (
								<div>
									<h3 className="w100">No games connected</h3>
								</div>
							)}
							{myProfile && (
								<div className={style.container_no_game} onClick={handleOpenModalConnect}>
									<FontAwesomeIcon icon={faPlus} color={"white"} size={"lg"} />
								</div>
							)}
						</div>
					</div>

					{modal && (
						<Modal isOpen={modal} toggle={handleCloseModalAggiunta}>
							<ModalHeader toggle={handleCloseModalAggiunta} className={style.black}>
								Add Friend
							</ModalHeader>
							<ModalBody>
								<InputGroup>
									<InputGroupText>
										<FontAwesomeIcon icon={faUser} />
									</InputGroupText>
									<Input placeholder="username" innerRef={inputAggiunta} />
								</InputGroup>
							</ModalBody>
							<ModalFooter>
								<Button color="secondary" onClick={handleCloseModalAggiunta}>
									Cancel
								</Button>
								<Button color="success" onClick={sendFriendRequest}>
									Confirm
								</Button>
							</ModalFooter>
						</Modal>
					)}

					{openModalConnect && (
						<Modal
							isOpen={openModalConnect}
							toggle={handleCloseModalConnect}
							size={"lg"}
							className={style.container_modal}>
							<ModalHeader toggle={handleCloseModalConnect} className={style.black}>
								Add a Game
							</ModalHeader>
							<ModalBody className={"modal_body"}>
								{!gameSelezionato && (
									<div className={style.container_recent_matches + " " + style.bg_body}>
										{games.map((game) => (
											<CardGame
												key={game._id}
												img={game.image}
												title={game.name}
												id={game._id}
												handleClick={handleClickCardGame}
											/>
										))}
									</div>
								)}
								{gameSelezionato && (
									<div className={style.container_game}>
										<InputGroup>
											<InputGroupText>
												<FontAwesomeIcon icon={faUser} />
											</InputGroupText>
											<Input
												invalid={errorUsername}
												placeholder="username"
												innerRef={inputUsername}
											/>
										</InputGroup>
										<div className={style.container_info_add_account}>
											<span className="text-white">Use your full in-game username</span>
											<span className="text-white underline_user pointer"> Help?</span>
										</div>
									</div>
								)}
							</ModalBody>

							{gameSelezionato && (
								<ModalFooter className={style.bg_footer}>
									<Button color="secondary" onClick={handleCloseModalConnect}>
										Cancel
									</Button>
									<Button color="success" onClick={connectGame}>
										Confirm
									</Button>
								</ModalFooter>
							)}
						</Modal>
					)}

					{openModalModificaUsername && (
						<Modal
							isOpen={openModalModificaUsername}
							toggle={handleCloseModalModificaUsername}
							size={"lg"}
							className={style.container_modal}>
							<ModalHeader toggle={handleCloseModalModificaUsername} className={style.black}>
								Change Username
							</ModalHeader>
							<ModalBody className={"modal_body"}>
								<div className={style.container_game}>
									<InputGroup>
										<InputGroupText>
											<FontAwesomeIcon icon={faUser} />
										</InputGroupText>
										<Input
											invalid={errorUsername}
											placeholder="username"
											onChange={(e) => {
												setUsernameModifica(e.target.value);
											}}
											value={usernameModifica}
										/>
									</InputGroup>
									<div className={style.container_info_add_account}>
										<span className="text-white">Use your full in-game username</span>
										<span className="text-white underline_user pointer"> Help?</span>
									</div>
								</div>
							</ModalBody>

							<ModalFooter className={style.bg_footer}>
								<Button color="secondary" onClick={handleCloseModalModificaUsername}>
									Cancel
								</Button>
								<Button color="success" onClick={changeUsername}>
									Confirm
								</Button>
							</ModalFooter>
						</Modal>
					)}
				</div>
			)}
		</div>
	);
}
