import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Table } from "reactstrap";

import style from "./Ladder.module.css";

let arr = [
	{
		_id: "63dc4d2247ddff77898d4471",
		rank: 99,
		name: "Rosanna Duffy",
		earnings: "$1,446.03",
		win: 16,
		lose: 12,
	},
	{
		_id: "63dc4d226ed86549bc371dbb",
		rank: 77,
		name: "Whitfield Barker",
		earnings: "$2,833.31",
		win: 67,
		lose: 99,
	},
	{
		_id: "63dc4d22f7d7af01018c27c7",
		rank: 50,
		name: "Suzette Spears",
		earnings: "$1,857.12",
		win: 51,
		lose: 17,
	},
	{
		_id: "63dc4d2279d2a7af10238559",
		rank: 53,
		name: "Puckett Carey",
		earnings: "$3,897.96",
		win: 99,
		lose: 69,
	},
	{
		_id: "63dc4d22f163bdc3b7d46ed6",
		rank: 90,
		name: "Tanner Mendoza",
		earnings: "$1,148.11",
		win: 63,
		lose: 28,
	},
	{
		_id: "63dc4d22de0694bd0fcc2f3e",
		rank: 88,
		name: "Gladys Wilkins",
		earnings: "$1,223.38",
		win: 86,
		lose: 24,
	},
	{
		_id: "63dc4d22b5d1e5e5e9fb80f0",
		rank: 88,
		name: "Riley Green",
		earnings: "$2,458.68",
		win: 91,
		lose: 15,
	},
	{
		_id: "63dc4d2232d6a05781dc0162",
		rank: 77,
		name: "Walsh Kaufman",
		earnings: "$3,666.17",
		win: 50,
		lose: 21,
	},
	{
		_id: "63dc4d222cca05cefb89e3ef",
		rank: 89,
		name: "Rosemary Whitehead",
		earnings: "$3,176.87",
		win: 76,
		lose: 76,
	},
	{
		_id: "63dc4d22df4968b37dae5ddf",
		rank: 85,
		name: "Marissa Chang",
		earnings: "$2,695.71",
		win: 50,
		lose: 58,
	},
	{
		_id: "63dc4d22029b47efe2cd876d",
		rank: 11,
		name: "Melisa Parsons",
		earnings: "$1,048.60",
		win: 69,
		lose: 73,
	},
	{
		_id: "63dc4d2294f1b4a99859589b",
		rank: 59,
		name: "Vazquez Hines",
		earnings: "$3,539.71",
		win: 36,
		lose: 73,
	},
	{
		_id: "63dc4d22bf62be59a30f72cb",
		rank: 4,
		name: "Maribel Morin",
		earnings: "$3,230.67",
		win: 90,
		lose: 21,
	},
	{
		_id: "63dc4d222d3b84d01cd7ad65",
		rank: 33,
		name: "Cindy Scott",
		earnings: "$1,659.42",
		win: 95,
		lose: 33,
	},
	{
		_id: "63dc4d22dc0be169588c9114",
		rank: 44,
		name: "Clay Ward",
		earnings: "$1,487.73",
		win: 28,
		lose: 14,
	},
	{
		_id: "63dc4d2271b74165f1bcee4f",
		rank: 50,
		name: "Whitney Gates",
		earnings: "$2,891.85",
		win: 60,
		lose: 15,
	},
	{
		_id: "63dc4d223fae94cae02b4a5e",
		rank: 38,
		name: "Michael Fleming",
		earnings: "$1,442.99",
		win: 91,
		lose: 28,
	},
	{
		_id: "63dc4d2262969edf5934a56a",
		rank: 24,
		name: "Reba Vinson",
		earnings: "$1,225.86",
		win: 86,
		lose: 15,
	},
	{
		_id: "63dc4d22967441b495fd8d93",
		rank: 8,
		name: "Vanessa Bolton",
		earnings: "$2,549.70",
		win: 6,
		lose: 87,
	},
	{
		_id: "63dc4d22d334840f23099cf0",
		rank: 57,
		name: "Ashley Barrett",
		earnings: "$3,709.19",
		win: 70,
		lose: 59,
	},
	{
		_id: "63dc4d22ab51a400331e1828",
		rank: 88,
		name: "Burris Miller",
		earnings: "$3,503.42",
		win: 5,
		lose: 96,
	},
	{
		_id: "63dc4d22029340eec15dcc95",
		rank: 44,
		name: "Gregory Underwood",
		earnings: "$2,244.21",
		win: 80,
		lose: 89,
	},
	{
		_id: "63dc4d22d214d5d090ac4dea",
		rank: 27,
		name: "Benson Rosa",
		earnings: "$1,767.11",
		win: 92,
		lose: 72,
	},
	{
		_id: "63dc4d2276e156b439f6d596",
		rank: 26,
		name: "Lorena Wong",
		earnings: "$3,671.04",
		win: 60,
		lose: 21,
	},
	{
		_id: "63dc4d227cc34c9a8254515d",
		rank: 70,
		name: "Charity Hamilton",
		earnings: "$1,217.82",
		win: 53,
		lose: 36,
	},
	{
		_id: "63dc4d222c10100b0d3f6fc1",
		rank: 14,
		name: "Kemp Gonzalez",
		earnings: "$2,408.42",
		win: 18,
		lose: 90,
	},
	{
		_id: "63dc4d227e03512c6927eafa",
		rank: 97,
		name: "Merritt Strong",
		earnings: "$3,434.08",
		win: 26,
		lose: 31,
	},
	{
		_id: "63dc4d2200296e25fb714aa5",
		rank: 52,
		name: "Flowers Blankenship",
		earnings: "$2,114.39",
		win: 70,
		lose: 14,
	},
	{
		_id: "63dc4d2218e9abacc45776de",
		rank: 80,
		name: "Tracy Raymond",
		earnings: "$3,783.44",
		win: 97,
		lose: 99,
	},
	{
		_id: "63dc4d225a7b9ab6c4f35697",
		rank: 89,
		name: "Francesca Jenkins",
		earnings: "$1,338.35",
		win: 69,
		lose: 18,
	},
];
export default function Ladder() {
	const navigate = useNavigate();
	const [headerTabella, setHeaderTabella] = useState([
		{ name: "Rank" },
		{ name: "Name" },
		{ name: "Earnings", dir: "" },
		{ name: "Stats", dir: "" },
	]);
	//Funzione che gestisce il click sull`header della tabella, gestendo la direzione di ordinamento
	const handleClickHeader = (header) => {
		// console.log(headerTabella);
		let arr = headerTabella.map((h) => {
			let obj = { ...h };
			if (h.name === header.name) {
				if (h.dir === "asc") obj.dir = "desc";
				if (h.dir === "desc") obj.dir = "";
				if (h.dir === "") obj.dir = "asc";
			}

			return obj;
		});
		setHeaderTabella(arr);
	};

	return (
		<div className={style.container_ladder}>
			<div className={style.container_utenti}>
				<h1 className="text-white mt-40">Rankings</h1>
				<div className={style.container_tabella}>
					<Table responsive hover>
						<thead>
							<tr>
								{headerTabella.map((header) => (
									<th
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
							{arr.map((tournament, count) => (
								<tr>
									<td scope="row">{count + 1} </td>
									<td>{tournament.name}</td>
									<td>{tournament.earnings}</td>
									<td>
										<span className="green">{tournament.win + " W / "}</span>
										<span className="red">{tournament.lose + " L"}</span>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
			</div>
		</div>
	);
}
