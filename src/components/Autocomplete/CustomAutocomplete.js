import React, { useState, useEffect, useRef, useCallback } from "react";
import { getToken, handleResponse, URL_BASE } from "../../utilities/utilities";
import style from "./CustomAutocomplete.module.css";
import { Input, InputGroup, InputGroupText } from "reactstrap";
import { useClickOutside } from "./useClickOutside";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
export default function CustomAutocomplete({
	id,
	placeholder,
	label,
	realId,
	handleClick,
	showExistingTeam = false,
	value,
	rimuoviCampo,
	clearCampo,
	components = [],
}) {
	const ref = useClickOutside(() => onFocusLoss());
	const inputRef = useRef();
	const [opzioni, setOpzioni] = useState([]);
	const navigate = useNavigate();
	useEffect(() => {
		getFriends();
	}, []);
	//Funzione che permette di ottenere gli amici di un player
	const getFriends = async (text = undefined) => {
		const url = URL_BASE + "/user/find/friends";
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + getToken(),
			},
			body: JSON.stringify({
				text: text,
				components: components.length > 0 ? components : undefined,
			}),
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			setOpzioni(data);
		} else {
		}
	};

	let debounceTimer;
	const debounce = useCallback(async (callback) => {
		window.clearTimeout(debounceTimer);
		debounceTimer = window.setTimeout(callback, 250);
	}, []);
	const onKeyUp = (e) => {
		const searchWrapper = document.querySelector(".search_input " + id);
		let userData = e.target.value;
		debounce(() => getFriends(userData.toLocaleLowerCase()));
	};
	//Funzione che gestisce la apertura delle informazioni
	const handleClickOpen = (e) => {
		const searchWrapper = document.querySelector(".search_input." + id);
		searchWrapper.classList.add("activeAutocomplete"); //hide autocomplete box
	};

	const onFocusLoss = () => {
		const searchWrapper = document.querySelector(".search_input." + id);
		searchWrapper.classList.remove("activeAutocomplete");
	};

	//funzione che gestisce il click
	const gestisciClick = (opzione) => {
		handleClick(opzione, realId);
		inputRef.current.value = opzione.username;
		onFocusLoss();
	};

	return (
		<div className={"wrapperSearch"}>
			<div className={"search_input " + id}>
				<a href="" target="_blank" hidden></a>
				<div>
					<InputGroup>
						{realId && <InputGroupText>{realId + 1}</InputGroupText>}
						<Input
							placeholder={placeholder}
							onClick={(e) => {
								handleClickOpen();
							}}
							defaultValue={value}
							innerRef={inputRef}
							className={style.input_component}
							id={label}
							onKeyUp={onKeyUp}
							type="text"
							onChange={(e) => {
								clearCampo(realId);
							}}
						/>
						{!showExistingTeam && (
							<InputGroupText>
								<FontAwesomeIcon
									icon={faTrash}
									color={"red"}
									className={"pointer"}
									onClick={() => {
										rimuoviCampo(realId);
									}}
								/>
							</InputGroupText>
						)}
					</InputGroup>
					{/* <input
						onClick={(e) => {
							handleClickOpen();
						}}
						ref={inputRef}
						id={label}
						onKeyUp={onKeyUp}
						type="text"
						placeholder={placeholder}
					/> */}
				</div>
				<div className={"autocom_box"} ref={ref}>
					{opzioni.map((opzione, count) => (
						<li
							key={opzione._id}
							onClick={() => {
								gestisciClick(opzione);
							}}>
							{opzione.username}
						</li>
					))}
					{opzioni.length == 0 && <h6 className={"mb0 black"}>No Friends</h6>}
				</div>
				<div className="iconSearch"></div>
			</div>
		</div>
	);
}
