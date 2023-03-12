import React, { useEffect, useState } from "react";
import MainTemplate from "../../components/MainTemplate/MainTemplate";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "../Home/Home";
import AvailableTournaments from "../AvailableTournaments/AvailableTournaments";
import TournamentInfo from "../TournamentInfo/TournamentInfo";
import Ladder from "../Ladder/Ladder";
import CreateTeam from "../CreateTeam/CreateTeam";
import Cookies from "js-cookie";
import Profile from "../Profile/Profile";
import MatchInfo from "../MatchInfo/MatchInfo";
import UpdateTeam from "../UpdateTeam/UpdateTeam";

const nav = [
	{ url: "/games", text: "Games", exact: false },
	{ url: "/ladder", text: "Rankings", exact: true },
];
export default function Logged() {
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		//Se non c'è un username salvato, reindirizza alla pagina di creazione
		Cookies.get("token") || navigate("/login");
		Cookies.get("username") || navigate("/usernameCreation");
		//Se c'è un username salvato, mostro le pagine
		setLoading(false);
	}, []);
	return (
		<>
			{!loading && (
				<MainTemplate navItems={nav}>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/home" element={<Home />} />
						<Route path="/createTeam" element={<CreateTeam />} />
						<Route path="/games" element={<Home />} />
						<Route path="/games/:id" element={<AvailableTournaments />} />
						<Route path="/tournament/:id" element={<TournamentInfo />} />
						<Route path="/match/:id" element={<MatchInfo />} />
						<Route path="/edit/team/:id" element={<UpdateTeam />} />
						<Route path="/ladder" element={<Ladder />} />
						<Route path="/profile" element={<Profile key={Math.random()} />} />
					</Routes>
				</MainTemplate>
			)}
		</>
	);
}
