import React, { useState } from "react";
import { Collapse, Nav, Navbar, NavbarToggler, NavItem } from "reactstrap";
import { NavLink as RouterLink, useNavigate } from "react-router-dom";
import style from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";

const Header = ({ navItems }) => {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();
	const toggle = () => setIsOpen(!isOpen);

	const itemList = navItems.map((item) => {
		return (
			<NavItem key={item.url} className={style.navItem}>
				<RouterLink to={item.url} className={style.navLink}>
					{item.text}
				</RouterLink>
			</NavItem>
		);
	});

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
					<p>{localStorage.getItem("username")}</p>
					<div className={style.container_logout}>
						<FontAwesomeIcon
							className="pointer"
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
