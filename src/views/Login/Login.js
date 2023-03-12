import { faCheck, faDoorOpen, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, InputGroup, InputGroupText, Spinner } from "reactstrap";
import style from "./Login.module.css";
import { URL_BASE } from "../../utilities/utilities";
import { errorNotification } from "../../components/Notification/Notification";
import Cookies from "js-cookie";
export default function Login() {
	const emailRef = useRef();
	const passwordRef = useRef();
	const [loading, setLoading] = useState(false);
	const [showPass, setShowPass] = useState(false);
	const navigate = useNavigate();

	//Funzione che effettua il login
	const login = async () => {
		setLoading(true);
		try {
			const url = URL_BASE + "/user/login";
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: emailRef.current.value.toLowerCase(),
					password: passwordRef.current.value,
				}),
			});
			if (response.status === 200) {
				const data = await response.json();

				Cookies.set("token", data.accessToken, { expires: 1 });
				Cookies.set("id", data.id, { expires: 1 });
				Cookies.set("username", data.username, { expires: 1 });
				navigate("/home");
				setLoading(false);
			} else {
				const data = await response.json();
				errorNotification(data.message);
				setLoading(false);
			}
		} catch (err) {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (Cookies.get("token")) {
			navigate("/home");
		}
	}, []);

	return (
		<div className={style.container_username_creation}>
			<h1 className="text-white big-title">Welcome Back</h1>
			<h5 className="text-white big-sub-title">Ready to start competing?</h5>
			<div className={style.container_form_username_creation}>
				<InputGroup>
					<Input placeholder="E-Mail" innerRef={emailRef} />
				</InputGroup>
				<InputGroup className="mt-20">
					<Input
						placeholder="Password"
						type={showPass ? "text" : "password"}
						innerRef={passwordRef}
					/>
					<InputGroupText
						className="bg-white"
						onClick={() => {
							setShowPass(!showPass);
						}}>
						{showPass ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
					</InputGroupText>
				</InputGroup>
				<Link to="/create" className="text-white mt-10">
					Dont't have an Account? Sign In!
				</Link>

				<Button
					color="success"
					size="lg"
					className={style.buttonJoin + " mt-20"}
					onClick={login}
					disabled={loading}>
					{loading ? (
						<Spinner size="sm" color="light" />
					) : (
						<>
							<FontAwesomeIcon className="mr-10" icon={faDoorOpen} />
							Login
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
