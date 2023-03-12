import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { handleResponse, URL_BASE } from "../../utilities/utilities";
import style from "./UpdateTeam.module.css";
import { errorNotification, successNotification } from "../../components/Notification/Notification";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import CustomAutocomplete from "../../components/Autocomplete/CustomAutocomplete";
import Loading from "../../components/Loading/Loading";
export default function UpdateTeam() {
	const [team, setTeam] = useState({});
	const location = useLocation();
	const navigate = useNavigate();
	const [modal, setModal] = useState(false);
	const [userToAdd, setUserToAdd] = useState();
	const imgRef = useRef(null);
	const [loading, setLoading] = useState(true);
	const componentsList = useRef([]);
	const toggle = () => setModal(!modal);
	const [possoUpgradare, setPossoUpgradare] = useState(false);
	const inputRef = useRef();

	useEffect(() => {
		if (!location.state.team) navigate("/profile");
		if (!location.state.team._id) navigate("/profile");
		ottieniInformazioniTeam(location.state.team._id);
	}, []);

	//Funzione che permette di abbandonare il team
	const leaveTeam = async (userId = undefined) => {
		const url = URL_BASE + "/team/leave";
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + Cookies.get("token"),
			},
			body: JSON.stringify({
				teamId: team._id,
				userId: userId,
			}),
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			successNotification(data.message);
			if (userId === Cookies.get("id"))
				setTimeout(() => {
					navigate("/profile", { state: { _id: userId } });
				}, 200);
			else ottieniInformazioniTeam(location.state.team._id);
		} else {
			const data = await response.json();
			errorNotification(data.message);
		}
	};
	//Funzione che aggiunge un componente al team
	const addComponent = async () => {
		const url = URL_BASE + "/team/add";
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + Cookies.get("token"),
			},
			body: JSON.stringify({
				teamId: team._id,
				userId: userToAdd._id,
			}),
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			setUserToAdd(null);
			successNotification(data.message);
			ottieniInformazioniTeam(location.state.team._id);
			toggle();
		} else {
			const data = await response.json();
			errorNotification(data.message);
		}
	};

	//Funzione che gestisce il click dell'autocomplete
	const handleClickAutocomplete = (user) => {
		setUserToAdd(user);
	};

	//Funzione che ottiene le informazioni di un team
	const ottieniInformazioniTeam = async (id) => {
		const url = URL_BASE + "/team/info/" + id;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + Cookies.get("token"),
			},
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			setTeam(data);

			if (data.creator == Cookies.get("id")) setPossoUpgradare(true);
			console.log(data);
			componentsList.current = data.components.map((component) => component._id);

			setLoading(false);
		} else {
			const data = await response.json();
			errorNotification(data.message);
		}
	};

	//Funzione che gestisce il cambio dell'immagine di copertina
	const handleChangeImage = (image) => {
		const img = URL.createObjectURL(image);
		setTeam({ ...team, background: img });
		imgRef.current = image;
		updateTeam();
	};

	//Funzione che gestisce la modifica delle informazioni del team
	const updateTeam = async () => {
		const url = URL_BASE + "/team/update/" + team._id;
		let formData = new FormData();
		formData.append("image", imgRef.current);
		formData.append(
			"teamInfo",
			new Blob([JSON.stringify({ name: inputRef.current.value })], { type: "application/json" })
		);
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
		} else {
			const data = await response.json();
			errorNotification(data.message);
		}
	};

	const handleClickOpenFile = () => {
		if (possoUpgradare) document.getElementById("input_image").click();
	};
	return (
		<div className={style.container_pagina}>
			{loading ? (
				<Loading allPage={true} />
			) : (
				<div className={style.container_pagina_update_team}>
					<div className={style.container_copertina} onClick={handleClickOpenFile}>
						<img src={team?.background} className={style.img_copertina} alt={team?.name} />
						{possoUpgradare && (
							<div className={style.container_edit_copertina}>
								<FontAwesomeIcon icon={faPen} color={"yellow"} size={"2x"} />
							</div>
						)}
						<input
							type="file"
							id="input_image"
							name="image"
							accept=".svg,.png,.jpeg,.jpg"
							style={{ display: "none" }}
							onChange={(e) => {
								if (!e.target.files[0]) return;
								if (e.target.files[0].size > 125000) return errorNotification("File too big");
								if (e.target.files[0].type.split("/")[0] !== "image") return;
								handleChangeImage(e.target.files[0]);
							}}
						/>
					</div>
					<div className={style.container_team_name}>
						{possoUpgradare ? (
							<Input
								placeholder="Team Name"
								defaultValue={team?.name}
								innerRef={inputRef}
								className={style.container_input_modifica}
							/>
						) : (
							<h1 className="text-white">{team?.name}</h1>
						)}
						<h6 className="text-white">
							Created: {new Date(team.creationDate).toLocaleDateString()}
						</h6>
					</div>
					<div className={style.container_components}>
						<div className={style.container_components_title}>
							<h3>Components {"[" + team.components.length + "/5]"}</h3>
							<FontAwesomeIcon
								icon={faPlus}
								size={"lg"}
								color={"green"}
								className={"button_add pointer"}
								onClick={toggle}
							/>
						</div>
						<div className={style.container_team_components}>
							{team.components?.map((component) => (
								<div className={style.container_row_component} key={component._id}>
									<h4>{component.username}</h4>
									{(Cookies.get("id") == team.creator || Cookies.get("id") == component._id) && (
										<Button
											color={"danger"}
											outline
											className={style.button_kick}
											size={"sm"}
											onClick={() => {
												leaveTeam(component._id);
											}}>
											{Cookies.get("id") === component._id ? "Leave" : "Kick"}
										</Button>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			)}
			{modal && (
				<Modal isOpen={modal} toggle={toggle}>
					<ModalHeader toggle={toggle} className={style.modal}>
						Add a Component
					</ModalHeader>
					<ModalBody>
						<CustomAutocomplete
							placeholder={"Search"}
							showExistingTeam={true}
							handleClick={handleClickAutocomplete}
							label={""}
							id={"insertTeammate"}
							components={componentsList.current}
						/>
					</ModalBody>
					<ModalFooter>
						<Button color="secondary" onClick={toggle}>
							Cancel
						</Button>
						<Button color="success" onClick={addComponent} disabled={!userToAdd}>
							Confirm
						</Button>
					</ModalFooter>
				</Modal>
			)}
		</div>
	);
}
