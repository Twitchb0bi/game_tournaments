import React from "react";
import style from "./Footer.module.css";
import disco from "../../assets/images/disco.png";
import unimib from "../../assets/images/unimib.jpg";
import { NavLink } from "react-router-dom";

function Footer({ courseName, courseLink, navItems }) {
	const itemList = navItems.map((item) => {
		return (
			<li key={item.url} className="nav-item">
				<NavLink exact={item.exact} to={item.url}>
					{item.text}
				</NavLink>
			</li>
		);
	});
	return (
		<footer className={style.footer}>
			<div className="container-fluid">
				<div className="row">
					<div className="col">
						<nav className={style.footerNav}>
							<ul className={style.footerGrid}>{itemList}</ul>
						</nav>
					</div>

					<div className="col-md-auto">
						<div className={`d-flex ${style.copyright}`}>
							<div id={style.disco} className={style.logo}>
								<a href="https://www.disco.unimib.it/it" target="_blank">
									<img src={disco} alt="disco" width={70} height={70} />
								</a>
							</div>

							<div id={style.unimib} className={style.logo}>
								<a href="https://www.unimib.it/" target="_blank">
									<img src={unimib} alt="unimib" width={70} height={70} />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
