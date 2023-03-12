import React, { useEffect, useState } from "react";
import {
	Collapse,
	Nav,
	Navbar,
	NavbarToggler,
	NavItem,
	UncontrolledPopover,
	PopoverHeader,
	PopoverBody,
} from "reactstrap";
import { NavLink as RouterLink, useNavigate } from "react-router-dom";
import style from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faBell, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
// import joined_tournaments from "../../assets/data/joined_tournaments.json";
import { handleResponse, URL_BASE } from "../../utilities/utilities";
const Header = ({ navItems }) => {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();
	const toggle = () => setIsOpen(!isOpen);
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [match, setMatch] = useState([]);

	const togglePopover = () => setPopoverOpen(!popoverOpen);

	const itemList = navItems.map((item) => {
		return (
			<NavItem key={item.url} className={style.navItem}>
				<RouterLink to={item.url} className={style.navLink}>
					{item.text}
				</RouterLink>
			</NavItem>
		);
	});

	useEffect(() => {
		ottieniMatch();
		setInterval(() => {
			if (Cookies.get("token")) ottieniMatch();
		}, 300000);
	}, []);

	//Funzione che effettua il logout
	const logout = () => {
		Cookies.remove("token");
		Cookies.remove("email");
		Cookies.remove("id");
		Cookies.remove("username");

		navigate("/login");
	};

	//Funzione che controlla se ci sono match
	const ottieniMatch = async () => {
		const url = URL_BASE + "/match/next";
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + Cookies.get("token"),
			},
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			setMatch(data);
		} else {
			setMatch([]);
		}
	};

	//Funzione che gestisce il click sul match
	const showMatch = (id) => {
		navigate("/match/" + id);
	};
	return (
		<div className={style.navBar}>
			<Navbar expand="md" dark className={style.container_navbar}>
				<div className="container container_nav">
					<NavbarToggler onClick={toggle} />

					<Collapse isOpen={isOpen} navbar>
						<Nav className="mr-auto" navbar>
							{itemList}
						</Nav>
					</Collapse>
				</div>
				<div className={style.username}>
					<div id={"Popover1"} onClick={togglePopover} className={style.container_icon_badge}>
						<FontAwesomeIcon icon={faBell} color={"white"} className={"pointer"} />

						{match.length > 0 && <div className={style.container_notification} />}
					</div>
					<UncontrolledPopover
						isOpen={popoverOpen}
						style={{ width: "300px" }}
						flip
						placement="bottom"
						trigger="legacy"
						target="Popover1"
						toggle={togglePopover}>
						<PopoverHeader>Your Match</PopoverHeader>
						<PopoverBody style={{ padding: "0", backgroundColor: "#0e1f34" }}>
							{match.map((match) => (
								<div
									className={style.container_card_joined_tournament}
									key={match.id}
									onClick={() => {
										showMatch(match._id);
									}}>
									<div className={style.container_team_name}>
										<h6 className="text-white">{match.team1.name}</h6>
										<h5 className="text-white">vs</h5>
										<h6 className="text-white">{match.team2.name}</h6>
									</div>
									<p className="text-white">{new Date(match.starting).toLocaleString()}</p>
								</div>
							))}
							{match.length == 0 && (
								<div className={style.container_no_match}>
									<h4>No Match Available</h4>
								</div>
							)}
						</PopoverBody>
					</UncontrolledPopover>
					<RouterLink to={"/profile"} className={style.navLink} state={{ _id: Cookies.get("id") }}>
						<p>{Cookies.get("username")}</p>
					</RouterLink>
					<div className={style.container_logout}>
						<FontAwesomeIcon
							className={style.exit + " pointer"}
							icon={faSignOut}
							color="red"
							onClick={logout}
							size={"lg"}
						/>
					</div>
				</div>
			</Navbar>
		</div>
	);
};

export default Header;
