import React, { useEffect } from "react";
import MainTemplate from "./components/MainTemplate/MainTemplate";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./views/Home/Home";
import { getInformazioniGioco } from "./utilities/utilities";
import AvailableTournaments from "./views/AvailableTournaments/AvailableTournaments";
import TournamentInfo from "./views/TournamentInfo/TournamentInfo";
import Ladder from "./views/Ladder/Ladder";
import UsernameCreation from "./views/UsernameCreation/UsernameCreation";
import Logged from "./views/Logged/Logged";
function App() {
	useEffect(() => {
		getInformazioniGioco();
	}, []);
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/*" element={<Logged />} />
				<Route path="/create" element={<UsernameCreation />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
