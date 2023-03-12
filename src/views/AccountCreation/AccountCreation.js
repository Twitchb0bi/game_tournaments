import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, InputGroup, InputGroupText, Spinner } from "reactstrap";
import style from "./AccountCreation.module.css";
import { URL_BASE } from "../../utilities/utilities";
import { errorNotification } from "../../components/Notification/Notification";
import Cookies from "js-cookie";
export default function AccountCreation() {
	const emailRef = useRef();
	const passwordRef = useRef();
	const usernameRef = useRef();
	const [validEmail, setValidEmail] = useState(false);
	const [validPassword, setValidPassword] = useState(false);
	const [validUsername, setValidUsername] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (Cookies.get("token")) {
			navigate("/home");
		}
	}, []);

	//Funzione che controlla se la mail è valida
	const checkEmail = (value) => {
		// emailRef.current.value = value;
		let checkMail = new RegExp(
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
		);
		if (checkMail.test(value)) setValidEmail(true);
		else setValidEmail(false);
	};

	//Funzione che controlla se la password è valida
	const checkPass = (value) => {
		// passwordRef.current.value = value;
		let checkPassword = new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/);
		if (checkPassword.test(value)) setValidPassword(true);
		else setValidPassword(false);
	};

	//Funzione che crea un account
	const createAccount = async () => {
		const url = URL_BASE + "/user/register";
		setLoading(true);
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: emailRef.current.value,
				password: passwordRef.current.value,
				username: usernameRef.current.value,
			}),
		});
		if (response.status == 200) {
			const data = await response.json();
			navigate("/login");
			setLoading(false);
		} else {
			const data = await response.json();
			errorNotification(data.message);
			setLoading(false);
		}
	};

	//Funzione che controlla se un username è già stato utilizzato
	const checkUsername = async (value) => {
		const url = URL_BASE + "/user/exist/" + value;
		const response = await fetch(url);
		if (response.status == 200) {
			const data = await response.json();
			if (data.exist) setValidUsername(false);
			else setValidUsername(true);
		} else {
			setValidUsername(false);
		}
	};

	//Debounce
	let debounceTimer;
	const debounce = useCallback(async (callback) => {
		window.clearTimeout(debounceTimer);
		debounceTimer = window.setTimeout(callback, 250);
	}, []);
	return (
		<div className={style.container_username_creation}>
			<h1 className="text-white big-title">Welcome</h1>
			<h5 className="text-white big-sub-title">Ready to start competing?</h5>
			<div className={style.container_form_username_creation}>
				<InputGroup>
					<Input
						placeholder="E-Mail"
						innerRef={emailRef}
						onChange={(e) => {
							checkEmail(e.target.value);
						}}
					/>
					<InputGroupText>
						{validEmail ? (
							<FontAwesomeIcon icon={faCheck} color={"green"} />
						) : (
							<FontAwesomeIcon icon={faTimes} color={"red"} />
						)}
					</InputGroupText>
				</InputGroup>
				<InputGroup className="mt-20">
					<Input
						placeholder="Password"
						innerRef={passwordRef}
						onChange={(e) => {
							checkPass(e.target.value);
						}}
					/>
					<InputGroupText>
						{validPassword ? (
							<FontAwesomeIcon icon={faCheck} color={"green"} />
						) : (
							<FontAwesomeIcon icon={faTimes} color={"red"} />
						)}
					</InputGroupText>
				</InputGroup>
				<InputGroup className="mt-20">
					<Input
						placeholder="Username"
						innerRef={usernameRef}
						onChange={(e) => {
							debounce(() => {
								checkUsername(e.target.value);
							});
						}}
					/>
					<InputGroupText>
						{validUsername ? (
							<FontAwesomeIcon icon={faCheck} color={"green"} />
						) : (
							<FontAwesomeIcon icon={faTimes} color={"red"} />
						)}
					</InputGroupText>
				</InputGroup>

				<Link to="/login" className="text-white mt-10">
					Have an Account? Log In!
				</Link>

				<Button
					color="success"
					size="lg"
					className={style.buttonJoin + " mt-20"}
					disabled={!validEmail || !validPassword || !validUsername || loading}
					onClick={createAccount}>
					{loading ? (
						<Spinner size="sm" color="light" />
					) : (
						<>
							<FontAwesomeIcon className="mr-10" icon={faCheck} />
							Sign-In
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
