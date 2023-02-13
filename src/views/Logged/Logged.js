import React, { useEffect, useState } from "react";
import MainTemplate from "../../components/MainTemplate/MainTemplate";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "../Home/Home";
import AvailableTournaments from "../AvailableTournaments/AvailableTournaments";
import TournamentInfo from "../TournamentInfo/TournamentInfo";
import Ladder from "../Ladder/Ladder";
import UsernameCreation from "../UsernameCreation/UsernameCreation";
export default function Logged() {
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const nav = [
		{ url: "/games", text: "Games", exact: false },
		{ url: "/ladder", text: "Rankings", exact: true },
	];
	useEffect(() => {
		//Se non c'è un username salvato, reindirizza alla pagina di creazione
		localStorage.getItem("username") === null && navigate("/create");
		//Se c'è un username salvato, mostro le pagine
		setLoading(false);
	}, []);
	return (
		<>
			{!loading && (
				<MainTemplate navItems={nav}>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/create" element={<UsernameCreation />} />
						<Route path="/games" element={<Home />} />
						<Route path="/games/:id" element={<AvailableTournaments />} />
						<Route path="/tournament/:id" element={<TournamentInfo />} />
						<Route path="/ladder" element={<Ladder />} />
					</Routes>
				</MainTemplate>
			)}
		</>
	);
}
