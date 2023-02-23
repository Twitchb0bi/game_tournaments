import React, { useState } from "react";
import {
	Collapse,
	Nav,
	Navbar,
	NavbarToggler,
	NavItem,
	PopoverBody,
	PopoverHeader,
	UncontrolledPopover,
} from "reactstrap";
import { NavLink as RouterLink, useNavigate } from "react-router-dom";
import style from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faRightToBracket, faSignOut } from "@fortawesome/free-solid-svg-icons";
import joined_tournaments from "../../assets/data/joined_tournaments.json";

const Header = ({ navItems }) => {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();
	const toggle = () => setIsOpen(!isOpen);
	const [popoverOpen, setPopoverOpen] = useState(false);
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
	//Funzione che effettua il logout
	const logout = () => {
		localStorage.clear();
		navigate("/create");
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
					<div id={"Popover1"} onClick={togglePopover}>
						<FontAwesomeIcon icon={faBell} color={"white"} className={"pointer"} />
					</div>
					<UncontrolledPopover
						isOpen={popoverOpen}
						style={{ width: "300px" }}
						flip
						placement="bottom"
						trigger="legacy"
						target="Popover1"
						toggle={togglePopover}>
						<PopoverHeader>Your Tournaments</PopoverHeader>
						<PopoverBody style={{ padding: "0", backgroundColor: "#0e1f34" }}>
							{joined_tournaments.tournaments.map((tournament) => (
								<div className={style.container_card_joined_tournament} key={tournament.id}>
									<div>
										<h6 className="text-white">{tournament.tournamentTitle}</h6>
										<p className="text-white">
											{new Date(tournament.starting).toLocaleDateString()}
										</p>
									</div>
									<FontAwesomeIcon
										icon={faRightToBracket}
										className="text-white pointer"
										size="2x"
									/>
								</div>
							))}
						</PopoverBody>
					</UncontrolledPopover>
					<p>{localStorage.getItem("username")}</p>
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
