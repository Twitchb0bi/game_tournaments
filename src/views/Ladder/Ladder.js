import {
	faArrowDown,
	faArrowUp,
	faBars,
	faTableCellsLarge,
	faUser,
	faUserCircle,
	faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { faker } from "@faker-js/faker";
import style from "./Ladder.module.css";
import CardUser from "../../components/CardUser/CardUser";
import { getToken, handleResponse, URL_BASE } from "../../utilities/utilities";
import { useNavigate } from "react-router-dom";

export default function Ladder() {
	const [headerTabella, setHeaderTabella] = useState([
		{ name: "Rank" },
		{ name: "Name", title: "username", dir: "" },
		{ name: "Earnings", title: "earnings", dir: "" },
		{ name: "Stats", title: "win", dir: "" },
	]);
	const [users, setUsers] = useState([]);
	const [viewType, setViewType] = useState("table");
	const [selectedType, setSelectedType] = useState("user");
	const navigate = useNavigate();

	//Funzione che gestisce il click sull`header della tabella, gestendo la direzione di ordinamento
	const handleClickHeader = (header) => {
		if (header.dir === undefined) return;
		let nextHeader = {};
		let arr = headerTabella.map((h) => {
			let obj = { ...h };
			if (h.name === header.name) {
				if (h.dir === "asc") obj.dir = "desc";
				if (h.dir === "desc") obj.dir = "";
				if (h.dir === "") obj.dir = "asc";
				nextHeader = obj;
			} else {
				if (obj.dir !== undefined) obj.dir = "";
			}
			return obj;
		});
		sortTable(nextHeader);
		setHeaderTabella(arr);
	};

	//Ottengo gli utenti in classifica
	useEffect(() => {
		ottieniClassifica();
	}, []);

	//Funzione che ottiene la classifica dal server
	const ottieniClassifica = async () => {
		const url = URL_BASE + "/user/top";
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + getToken(),
			},
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			let arr = data.map((user, count) => {
				return { ...user, position: count + 1 };
			});
			setUsers(arr);
		} else {
		}
	};

	//Funzione che gestisce il click sulle icone per cambiare la vista
	const handleClickView = (type) => {
		if (type === "card") {
			sortTable({ title: "position", dir: "" });
		}
		setViewType(type);
	};

	//Funzione che gestisce l`ordinamento della tabella
	const sortTable = (header) => {
		let arr = [...users];
		if (header.dir === "asc") {
			arr.sort((a, b) => {
				if (a[header.title] > b[header.title]) return 1;
				if (a[header.title] < b[header.title]) return -1;
				return 0;
			});
		}
		if (header.dir === "desc") {
			arr.sort((a, b) => {
				if (a[header.title] > b[header.title]) return -1;
				if (a[header.title] < b[header.title]) return 1;
				return 0;
			});
		}
		if (header.dir === "") {
			arr = users.sort((a, b) => {
				if (a.position > b.position) return 1;
				if (a.position < b.position) return -1;
				return 0;
			});
		}
		setUsers(arr);
	};

	const showProfile = (user) => {
		navigate("/profile", { state: { _id: user._id } });
	};

	//Funzione che ottiene i team migliori
	const ottieniTopTeam = async () => {
		const url = URL_BASE + "/team/top";
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + getToken(),
			},
		});
		handleResponse(response, navigate);
		if (response.status === 200) {
			const data = await response.json();
			let arr = data.map((user, count) => {
				return { ...user, position: count + 1 };
			});
			setUsers(arr);
		} else {
		}
	};

	//Funzione che gestisce il cambio di dati tra user e team
	const handleClickType = (type) => {
		setSelectedType(type);
		if (type === "team") {
			ottieniTopTeam();
		} else {
			ottieniClassifica();
		}
	};
	return (
		<div className={style.container_ladder}>
			<div className={style.container_utenti}>
				<div className={style.container_title_option}>
					<h1 className="text-white">Rankings</h1>

					<div className={style.container_view_option}>
						<div
							className={viewType === "table" ? style.selected : ""}
							onClick={() => {
								handleClickView("table");
							}}>
							<FontAwesomeIcon icon={faBars} size={"lg"} color={"white"} className={"pointer"} />
						</div>
						<div
							className={viewType === "card" ? style.selected : ""}
							onClick={() => {
								handleClickView("card");
							}}>
							<FontAwesomeIcon
								icon={faTableCellsLarge}
								size={"lg"}
								color={"white"}
								className={"pointer"}
							/>
						</div>
					</div>
				</div>
				<div className={style.container_type_ladder}>
					<h4
						className={selectedType === "user" ? style.selected : ""}
						onClick={() => handleClickType("user")}>
						<FontAwesomeIcon icon={faUser} color={"white"} /> User
					</h4>
					<h4
						className={selectedType === "team" ? style.selected : ""}
						onClick={() => handleClickType("team")}>
						<FontAwesomeIcon icon={faUserGroup} color={"white"} /> Team
					</h4>
				</div>
				{viewType === "table" && (
					<div className={style.container_tabella}>
						<Table responsive hover className={style.table}>
							<thead>
								<tr>
									{headerTabella.map((header) => (
										<th
											key={header.name}
											onClick={() => {
												handleClickHeader(header);
											}}
											className={header.dir !== undefined ? "pointer" : ""}>
											{header.name}
											{header.dir === "asc" && (
												<FontAwesomeIcon icon={faArrowUp} className={"ml-5"} />
											)}
											{header.dir === "desc" && (
												<FontAwesomeIcon icon={faArrowDown} className={"ml-5"} />
											)}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{users.map((user, count) => (
									<tr key={user.userId}>
										<td scope="row">
											{user.position === 1 ? (
												<img
													width={20}
													height={20}
													alt={"Crown"}
													src={require("../../assets/images/crown.png")}
													className={style.crown}
												/>
											) : (
												<>{user.position}</>
											)}
										</td>
										<td
											className={user.username ? "underline_user pointer" : ""}
											onClick={() => {
												if (user.username) showProfile(user);
											}}>
											{user.avatar || user.background ? (
												<img
													src={user.avatar || user.background}
													width={20}
													height={20}
													alt={"Avatar"}
													className={"mr-10 border-radius-10"}
												/>
											) : (
												<FontAwesomeIcon icon={faUserCircle} className={"mr-10 "} size={"lg"} />
											)}

											{user.username || user.name}
										</td>
										<td>€ {user.earnings}</td>
										<td>
											<span className="green">{user.win + " W "}</span> /{" "}
											<span className="red">{user.lose + " L"}</span>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</div>
				)}
				{viewType === "card" && (
					<div className={style.container_card}>
						{users.map((user, count) => (
							<CardUser
								key={user.userId}
								avatar={user.avatar || user.background}
								userId={user.userId}
								position={user.position}
								username={user.username || user.name}
								win={user.win}
								lose={user.lose}
								earnings={user.earnings}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
