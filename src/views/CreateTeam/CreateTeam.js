import React, { useState, useEffect, useRef } from "react";
import style from "./CreateTeam.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input, InputGroup, InputGroupText } from "reactstrap";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
export default function CreateTeam() {
	const location = useLocation();
	const [tournamentInfo, setTournamentInfo] = useState(location.state.info);
	const usernameList = useRef({});
	const [disabled, setDisabled] = useState(true);
	const [inputFields, setInputFields] = useState([]);
	const navigate = useNavigate();
	const teamName = useRef("");
	//Creo dinamicamente gli input in base alla grandezza del team richiesto per il torneo
	useEffect(() => {
		//Controllo che siano presenti le informazioni del torneo altrimenti torno indietro
		if (!tournamentInfo.tournamentId) navigate("/");
		//Se ho già creato il team, torno indietro
		if (localStorage.getItem(tournamentInfo.tournamentId))
			navigate("/tournament/" + tournamentInfo.tournamentId, { state: tournamentInfo });
		let a = [];
		let obj = {};

		//Creo gli input in base alla grandezza del team richiesto per il torneo
		for (let i = 0; i < tournamentInfo.teamSize; i++) {
			obj[i] = "";
			if (i === 0) obj[i] = localStorage.getItem("username");
			a.push(
				<InputGroup>
					<InputGroupText>{i + 1}</InputGroupText>
					<Input
						placeholder="Es. Superman #12313"
						defaultValue={usernameList.current[i]}
						onChange={(e) => handleChangeValueUsername(e.target.value, i)}
					/>
				</InputGroup>
			);
		}
		usernameList.current = obj;
		setInputFields(a);
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
			if (usernameList.current[keys[i]].replace(" ", "") === "") {
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
	const createTeam = () => {
		let obj = {
			teamList: usernameList.current,
			teamName: teamName.current,
		};
		localStorage.setItem(tournamentInfo.tournamentId, JSON.stringify(obj));
		navigate("/tournament/" + tournamentInfo.tournamentId, { state: tournamentInfo });
	};
	return (
		<div className={style.container_create_team}>
			<h1 className="text-white">Create your team </h1>
			<h5 className="text-white">{tournamentInfo.tournamentTitle} </h5>

			<div className={style.container_card}>
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
				<Button color="primary" className="button mt-20" onClick={createTeam} disabled={disabled}>
					Create
				</Button>
			</div>
		</div>
	);
}
