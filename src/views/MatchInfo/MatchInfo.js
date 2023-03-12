import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { handleResponse, URL_BASE } from "../../utilities/utilities";
import style from "./MatchInfo.module.css";
import {
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Modal,
	ModalHeader,
	ModalBody,
	Label,
	Input,
	Button,
	ModalFooter,
	FormGroup,
	FormText,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { errorNotification, successNotification } from "../../components/Notification/Notification";
import CardTeamUser from "./CardTeamUser";
export default function MatchInfo() {
	const [matchInfo, setMatchInfo] = useState({});
	const [openModalConfirm, setOpenModalConfirm] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const toggleModal = () => setOpenModalConfirm(!openModalConfirm);
	const toggle = () => setDropdownOpen((prevState) => !prevState);
	const [file, setFile] = useState(null);

	useEffect(() => {
		ottieniInfoMatch(id);
	}, []);

	//Funzione che ottiene le informazioni del match
	const ottieniInfoMatch = async (id) => {
		const url = URL_BASE + "/match/info/" + id;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + Cookies.get("token"),
			},
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			let splitted = data.tournamentMatchRef.split(" ");
			let text = "Round " + splitted[1] + " - Match " + splitted[3];
			setMatchInfo({ ...data, textRound: text });
		}
	};

	//Funzione che riporta il risultato del match
	const reportScore = async (id, result, file) => {
		const url = URL_BASE + "/match/report/" + id;
		if (result === true && !file) {
			return errorNotification("You must upload a screenshot");
		}
		let formData = new FormData();
		formData.append(
			"teamInfo",
			new Blob([JSON.stringify({ result: result })], { type: "application/json" })
		);
		if (file) formData.append("image", file);

		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + Cookies.get("token"),
			},
			body: formData,
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			successNotification(data.message);
			if (result) handleCloseModal();
			ottieniInfoMatch(matchInfo._id);
		} else {
			const data = await response.json();
			errorNotification(data.message);
		}
	};

	//Funzione che gestisce la chiusura del modal
	const handleCloseModal = () => {
		toggleModal();
		setFile(null);
	};

	//Funzione che mostra il torneo di appartenenza del match
	const showTournament = () => {
		navigate("/tournament/" + matchInfo.tournamentId._id);
	};
	return (
		<div className={style.container_match_info_page}>
			<div className={style.container}>
				<div className={style.container_info}>
					<div className={style.container_img_titolo}>
						<div className={style.container_card}>
							<img
								src={matchInfo.tournamentId?.game.image}
								alt={matchInfo.tournamentId?.name}
								className={style.img_card}
							/>
						</div>
						<div>
							<h1>{matchInfo.tournamentId?.name}</h1>
							<h4>{matchInfo.tournamentId?.game.name}</h4>
						</div>
					</div>
					<div>
						<h3>{matchInfo.textRound}</h3>
					</div>
					{/* <h2>Modalità</h2> */}
				</div>

				<div className={style.container_match_operation}>
					{matchInfo.status !== "SCORE_DONE" && (
						<Dropdown isOpen={dropdownOpen} toggle={toggle} direction={"down"} color={"primary"}>
							<DropdownToggle caret>Report Score</DropdownToggle>
							<DropdownMenu>
								<DropdownItem
									onClick={() => {
										toggleModal();
									}}>
									<FontAwesomeIcon icon={faCheck} color={"green"} className={"mr-5"} />
									You Won
								</DropdownItem>
								<DropdownItem
									onClick={() => {
										reportScore(matchInfo._id, false);
									}}>
									<FontAwesomeIcon icon={faTimes} color={"red"} className={"mr-5"} />
									You Lose
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					)}
					<Button outline color="primary" onClick={showTournament}>
						Show Tournament
					</Button>
				</div>
				<div className={style.container_team}>
					{/* <div className={style.container_team_info}>
						<div className={style.container_header_team}>
							<div className={style.container_name_result}>
								<h3 className="text-white">{matchInfo.team1?.name}</h3>
								{matchInfo.status == "SCORE_DONE" && matchInfo.winner && (
									<div
										className={
											matchInfo.winner === matchInfo.team1._id
												? style.winner + " " + style.container_result_match
												: style.loser + " " + style.container_result_match
										}>
										{matchInfo.winner === matchInfo.team1._id ? "WINNER" : "LOSER"}
									</div>
								)}
							</div>
							<div className="text-white">
								<span className="green">{matchInfo.team1?.win + " W "}</span> /{" "}
								<span className="red">{matchInfo.team1?.lose + " L"}</span>
							</div>
						</div>
						<div className="separator" />
						<div className={style.container_team_components}>
							{matchInfo.team1?.components.map((player) => (
								<div className={style.container_player}>
									<h3
										className="text-white mb-0 pointer underline_user"
										onClick={() => showPlayer(player)}>
										{player.username}
									</h3>
								</div>
							))}
						</div>
					</div> */}
					<CardTeamUser
						background={matchInfo.team1?.background}
						name={matchInfo.team1?.name}
						earnings={matchInfo.team1?.earnings}
						win={matchInfo.team1?.win}
						lose={matchInfo.team1?.lose}
						components={matchInfo.team1?.components}
						icon={matchInfo.tournamentId?.game.icon}
					/>
					<div className={style.container_vs}>
						<h1 className="text-white">VS</h1>
					</div>
					{/* <div className={style.container_team_info}>
						<div className={style.container_header_team}>
							<div className={style.container_name_result}>
								<h3 className="text-white">{matchInfo.team2?.name}</h3>
								{matchInfo.status == "SCORE_DONE" && matchInfo.winner && (
									<div
										className={
											matchInfo.winner === matchInfo.team1._id
												? style.winner + " " + style.container_result_match
												: style.loser + " " + style.container_result_match
										}>
										{matchInfo.winner === matchInfo.team1._id ? "WINNER" : "LOSER"}
									</div>
								)}
							</div>
							<div className="text-white">
								<span className="green">{matchInfo.team2?.win + " W "}</span> /{" "}
								<span className="red">{matchInfo.team2?.lose + " L"}</span>
							</div>
						</div>
						<div className="separator" />
						<div className={style.container_team_components}>
							{matchInfo.team2?.components.map((player) => (
								<div className={style.container_player}>
									<h3
										className="text-white mb-0 pointer underline_user"
										onClick={() => showPlayer(player)}>
										{player.username}
									</h3>
									<h5></h5>
								</div>
							))}
						</div>
					</div> */}
					<CardTeamUser
						background={matchInfo.team2?.background}
						name={matchInfo.team2?.name}
						earnings={matchInfo.team2?.earnings}
						win={matchInfo.team2?.win}
						lose={matchInfo.team2?.lose}
						components={matchInfo.team2?.components}
						icon={matchInfo.tournamentId?.game.icon}
					/>
				</div>
				{openModalConfirm && (
					<Modal isOpen={openModalConfirm} toggle={handleCloseModal}>
						<ModalHeader toggle={handleCloseModal} className={style.header_black}>
							Report Win
						</ModalHeader>
						<ModalBody>
							<FormGroup>
								<Label for="exampleFile" className="black">
									File
								</Label>
								<Input
									id="exampleFile"
									name="file"
									type="file"
									accept=".svg,.png,.jpeg,.jpg"
									onChange={(e) => {
										if (!e.target.files[0]) return;
										if (e.target.files[0].size > 125000) errorNotification("File too big");
										if (e.target.files[0].type.split("/")[0] !== "image") return;
										setFile(e.target.files[0]);
									}}
								/>
								<FormText>Upload your file, Max-size: 1Mb</FormText>
							</FormGroup>
						</ModalBody>
						<ModalFooter>
							<Button color="secondary" onClick={handleCloseModal}>
								Cancel
							</Button>
							<Button
								disabled={!file}
								color="success"
								onClick={() => {
									reportScore(matchInfo._id, true, file);
								}}>
								Report
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</div>
		</div>
	);
}
