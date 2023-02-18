import {
	faArrowDown,
	faArrowUp,
	faBars,
	faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { faker } from "@faker-js/faker";
import style from "./Ladder.module.css";
import CardUser from "../../components/CardUser/CardUser";
let count = 1;
export default function Ladder() {
	const [headerTabella, setHeaderTabella] = useState([
		{ name: "Rank" },
		{ name: "Name" },
		{ name: "Earnings", title: "earnings", dir: "" },
		{ name: "Stats", title: "win", dir: "" },
	]);
	const [users, setUsers] = useState([]);
	const [viewType, setViewType] = useState("table");

	//Funzione che gestisce il click sull`header della tabella, gestendo la direzione di ordinamento
	const handleClickHeader = (header) => {
		if (header.dir == undefined) return;
		let nextHeader = {};
		let arr = headerTabella.map((h) => {
			let obj = { ...h };
			if (h.name === header.name) {
				if (h.dir === "asc") obj.dir = "desc";
				if (h.dir === "desc") obj.dir = "";
				if (h.dir === "") obj.dir = "asc";
				nextHeader = obj;
			} else {
				if (obj.dir != undefined) obj.dir = "";
			}
			return obj;
		});
		sortTable(nextHeader);
		setHeaderTabella(arr);
	};

	//Funzione che crea un utente random
	function createRandomUser() {
		const obj = {
			userId: faker.datatype.uuid(),
			position: count,
			username: faker.internet.userName(),
			avatar: faker.image.avatar(),
			win: faker.datatype.number({ min: 0, max: 100 }),
			lose: faker.datatype.number({ min: 0, max: 100 }),
			earnings: faker.datatype.number({ min: 0, max: 10000 }),
		};
		count++;
		return obj;
	}

	useEffect(() => {
		let arr = [];
		for (let i = 0; i < 30; i++) {
			arr.push(createRandomUser());
		}
		count = 1;
		setUsers(arr);
	}, []);

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

	return (
		<div className={style.container_ladder}>
			<div className={style.container_utenti}>
				<h1 className="text-white mt-40">Rankings</h1>
				<div className={style.container_view_option}>
					<div
						className={viewType == "table" ? style.selected : ""}
						onClick={() => {
							handleClickView("table");
						}}>
						<FontAwesomeIcon icon={faBars} size={"lg"} color={"white"} className={"pointer"} />
					</div>
					<div
						className={viewType == "card" ? style.selected : ""}
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
				{viewType === "table" && (
					<div className={style.container_tabella}>
						<Table responsive hover>
							<thead>
								<tr>
									{headerTabella.map((header) => (
										<th
											key={header.name}
											onClick={() => {
												handleClickHeader(header);
											}}
											className={header.dir != undefined ? "pointer" : ""}>
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
											{user.position == 1 ? (
												<img
													width={20}
													height={20}
													src={require("../../assets/images/crown.png")}
													className={style.crown}
												/>
											) : (
												<>{user.position}</>
											)}{" "}
										</td>
										<td>
											<img
												src={user.avatar}
												width={20}
												height={20}
												className={"mr-10 border-radius-10"}
											/>
											{user.username}
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
								avatar={user.avatar}
								userId={user.userId}
								position={user.position}
								username={user.username}
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
