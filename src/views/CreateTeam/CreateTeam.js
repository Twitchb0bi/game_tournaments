import React, { useState, useEffect, useRef } from "react";
import style from "./CreateTeam.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input, InputGroup, InputGroupText } from "reactstrap";
import {
	faCrown,
	faDoorOpen,
	faEye,
	faEyeSlash,
	faMinus,
	faPeopleGroup,
	faPlus,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { getToken, handleResponse, URL_BASE } from "../../utilities/utilities";
import CustomTooltip from "../../components/Tooltip/CustomTooltip";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
import CustomAutocomplete from "../../components/Autocomplete/CustomAutocomplete";
import Cookies from "js-cookie";
import { errorNotification } from "../../components/Notification/Notification";
import Team from "../../components/Team/Team";
AOS.init();
export default function CreateTeam() {
	const location = useLocation();
	const [tournamentInfo, setTournamentInfo] = useState(location.state.info || {});
	const usernameList = useRef({});
	const [disabled, setDisabled] = useState(true);
	const [inputFields, setInputFields] = useState([]);
	const navigate = useNavigate();
	const teamName = useRef("");
	const [teamEsistenti, setTeamEsistenti] = useState([]);
	const [teamSelezionato, setTeamSelezionato] = useState();
	const [showExistingTeam, setShowExistingTeam] = useState(false);
	const [teamSize, setTeamSize] = useState(2);
	const [showCreate, setShowCreate] = useState(false);

	//Creo dinamicamente gli input in base alla grandezza del team richiesto per il torneo
	useEffect(() => {
		//Controllo che siano presenti le informazioni del torneo altrimenti torno indietro
		// if (!tournamentInfo._id) navigate("/");
		let size = tournamentInfo?.teamSize || 2;
		setTeamSize(size);
		for (let i = 0; i < size; i++) {
			if (i === 0)
				usernameList.current[i] = { username: Cookies.get("username"), _id: Cookies.get("id") };
			else usernameList.current[i] = { username: "", _id: "" };
		}

		if (location.state?.type == "create") {
			setShowExistingTeam(false);
			setShowCreate(true);
		} else {
			ottieniTeamEsistenti();
		}
	}, []);

	//Funzione che gestisce la modifica dell`username
	const handleChangeValueUsername = (value, index) => {
		usernameList.current[index] = value;
		validateInput();
	};

	//Funzione che controlla se abbiamo inserito tutti i valori degli username
	//Se non abbiamo inserito tutti gli username, il bottone per creare il team rimane disabilitato
	const validateInput = () => {
		let keys = Object.keys(usernameList.current);
		for (let i = 0; i < keys.length; i++) {
			if (usernameList.current[keys[i]].username == "") {
				setDisabled(true);
				return;
			}
		}
		let name = teamName.current;
		if (name.replace(" ", "") === "") {
			setDisabled(true);
			return;
		}
		setDisabled(false);
	};

	//Funzione che conferma la creazione del team
	const createTeam = async () => {
		const url = URL_BASE + "/team";
		let arr = [];
		Object.keys(usernameList.current).forEach((key) => {
			if (usernameList.current[key]._id) arr.push(usernameList.current[key]._id);
		});
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + getToken(),
			},
			body: JSON.stringify({
				name: teamName.current,
				components: arr,
			}),
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			if (location.state?.type != "create") {
				ottieniTeamEsistenti();
				setShowCreate(false);
			} else navigate(-1);
		} else {
			const data = await response.json();
			errorNotification(data.message);
		}
	};

	//Funzione che ottiene i team già esistenti di un player
	const ottieniTeamEsistenti = async () => {
		const url = URL_BASE + "/team/" + tournamentInfo.teamSize;
		const response = await fetch(url, {
			headers: {
				Authorization: "Bearer " + getToken(),
			},
		});
		handleResponse(response, navigate);
		if (response.status == 200) {
			const data = await response.json();
			let arr = [];
			data.forEach((element) => {
				let string = "";
				element.components.forEach((element2) => {
					string += element2.username + ", ";
				});
				string = string.substring(0, string.length - 2);
				arr.push({ ...element, componentsName: string });
			});
			setShowExistingTeam(true);
			setTeamEsistenti(arr);
		} else {
		}
	};

	//Funzione che permette di unirsi ad un torneo
	const joinTournament = async () => {
		const url = URL_BASE + "/tournament/join/" + tournamentInfo._id;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + getToken(),
			},
			body: JSON.stringify({
				teamId: teamSelezionato._id,
			}),
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			navigate("/tournament/" + tournamentInfo._id, { state: tournamentInfo });
		} else {
			const data = await response.json();
			errorNotification(data.message);
		}
	};

	//Funzione che gestisce il click sulla card di un team
	const handleClickCard = (team) => {
		setTeamSelezionato(team);
	};

	//Funzione che permette di aggiungere un nuovo membro
	const aggiungiCampo = () => {
		usernameList.current[teamSize] = { username: "", _id: "" };
		setTeamSize((teamSize) => teamSize + 1);
		setDisabled(true);
	};

	//Funzione che rimuove un campo
	const rimuoviCampo = (i) => {
		let obj = {};
		let arr = Object.keys(usernameList.current);
		for (let j = 0; j < arr.length; j++) {
			if (j < i) obj[j] = usernameList.current[j];

			if (j > i) {
				obj[j - 1] = usernameList.current[j];
			}
		}
		usernameList.current = obj;
		let size = teamSize - 1;
		setTimeout(() => {
			setTeamSize((teamSize) => size);
		}, 10);
		setTeamSize(1);
		validateInput();
	};

	useEffect(() => {
		if (!teamSize) return;
		//Creo gli input in base alla grandezza del team richiesto per il torneo
		let a = [];
		//Creo gli input in base alla grandezza del team richiesto per il torneo
		for (let i = 0; i < teamSize; i++) {
			if (i === 0) {
				//TODO OTTENERE USERANAME E ID DA TOKEN
				// arr.push({ username: Cookies.get("username"), _id: Cookies.get("id") });
				a.push(
					<InputGroup key={i}>
						<InputGroupText>
							<FontAwesomeIcon icon={faCrown} />
						</InputGroupText>
						<Input
							placeholder="Es. Superman #12313"
							disabled={true}
							defaultValue={usernameList.current[i].username}
						/>
					</InputGroup>
				);
			} else {
				// arr.push({})
				a.push(
					<CustomAutocomplete
						id={"a" + i}
						key={i}
						realId={i}
						rimuoviCampo={rimuoviCampo}
						placeholder={"Es. Superman #12313"}
						label={i}
						value={usernameList.current[i].username || ""}
						handleClick={handleChangeValueUsername}
						showExistingTeam={showExistingTeam}
						clearCampo={clearCampo}
					/>
				);
			}
		}
		setInputFields(a);
	}, [teamSize]);

	//Funzione che gestisce il cambio di valore dell'input
	const clearCampo = (i) => {
		usernameList.current[i] = { username: "", _id: "" };
		validateInput();
	};

	const showCreateNewTeam = () => {
		setShowCreate(!showCreate);
	};
	return (
		<div className={style.container_create_team}>
			{/* <h1 className="text-white">Your Teams </h1> */}
			{showExistingTeam && (
				<>
					<div className={style.container_team}>
						<div className={style.container_button_join}>
							<Button
								color="primary"
								className={style.button_conferma + " button mt-20 mb-20"}
								onClick={joinTournament}
								disabled={!teamSelezionato}>
								<FontAwesomeIcon icon={faDoorOpen} color={"white"} className={"mr-5"} size={"xs"} />
								Join
							</Button>
							<Button
								color="primary"
								className={style.button_conferma + " button mt-20 mb-20"}
								onClick={showCreateNewTeam}>
								{showCreate ? (
									<>
										<FontAwesomeIcon
											icon={faEyeSlash}
											color={"white"}
											className={"mr-5"}
											size={"xs"}
										/>
										New Team
									</>
								) : (
									<>
										<FontAwesomeIcon icon={faEye} color={"white"} className={"mr-5"} size={"xs"} />
										New Team
									</>
								)}
							</Button>
						</div>
						<div className={style.container_team_esistenti}>
							<Team
								team={teamEsistenti}
								handleClick={handleClickCard}
								cardSelected={teamSelezionato}
							/>
						</div>
					</div>
					{showCreate && (
						<h4 className={style.container_or}>
							<span>OR</span>
						</h4>
					)}
				</>
			)}
			{teamEsistenti.length < 5 && showCreate && (
				<>
					<h1 className="text-white" data-aos="fade-up">
						Create Team
					</h1>

					<div className={style.container_card} data-aos="fade-up">
						<h4 className="text-white mb-0 ">Team Name</h4>
						<div className={style.container_username}>
							<InputGroup>
								<InputGroupText>
									<FontAwesomeIcon icon={faPeopleGroup} color={"black"} />
								</InputGroupText>
								<Input
									placeholder="Team Name"
									onChange={(e) => {
										teamName.current = e.target.value;
										validateInput();
									}}
								/>
							</InputGroup>
						</div>
						<div className="separator mt-10" />
						<h4 className="text-white mb-0 mt-10">Members</h4>
						<h6 className="text-white mb-0">Use your in-game username</h6>
						<div className={style.container_input}>{inputFields}</div>
						{!showExistingTeam && teamSize <= 5 && (
							<Button
								color="primary"
								className={" button"}
								size={"sm"}
								onClick={aggiungiCampo}
								disabled={teamSize >= 5}>
								<FontAwesomeIcon icon={faPlus} /> Add
							</Button>
						)}
						<div className="separator mt-20" />
						<Button
							color="primary"
							className={style.button_conferma + " button mt-20"}
							onClick={createTeam}
							disabled={disabled}>
							Create
						</Button>
					</div>
				</>
			)}
		</div>
	);
}
