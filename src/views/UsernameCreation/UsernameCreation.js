import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "reactstrap";
import style from "./UsernameCreation.module.css";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
AOS.init();
export default function UsernameCreation() {
	const [username, setUsername] = useState("");
	const navigate = useNavigate();

	//Funzione che salva l'username nel local storage e reindirizza alla home
	const confermaUsername = () => {
		localStorage.setItem("username", username);
		navigate("/");
	};
	//Controllo se l'username è già stato inserito, in tal caso reindirizzo alla home
	useEffect(() => {
		localStorage.getItem("username") && navigate("/");
	}, []);
	return (
		<div className={style.container_username_creation}>
			<h1 className="text-white big-title">Welcome</h1>
			<h5 className="text-white big-sub-title">Ready to start competing?</h5>
			<div className={style.container_form_username_creation}>
				<Input
					placeholder="Enter your username"
					onChange={(e) => {
						setUsername(e.target.value);
					}}
				/>
				<Button
					color="success"
					size="lg"
					className="mt-20"
					disabled={!username.replace(/ /g, "")}
					onClick={confermaUsername}>
					<FontAwesomeIcon className="mr-10" icon={faCheck} />
					Confirm
				</Button>
			</div>
		</div>
	);
}
