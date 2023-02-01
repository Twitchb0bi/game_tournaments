import React, { useEffect } from "react";
import MainTemplate from "./components/MainTemplate/MainTemplate";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./views/Home/Home";
import { getInformazioniGioco } from "./utilities/utilities";
import AvailableTournaments from "./views/AvailableTournaments/AvailableTournaments";
import TournamentInfo from "./views/TournamentInfo/TournamentInfo";
function App() {
	const nav = [
		{ url: "/games", text: "Games", exact: false },
		{ url: "/ladder", text: "Ladder", exact: true },
	];
	useEffect(() => {
		getInformazioniGioco();
	}, []);
	return (
		<BrowserRouter>
			<MainTemplate
				footerCourseName="Applicazioni Web: Progettazione e Sviluppo"
				footerCourseLink="https://elearning.unimib.it/course/view.php?id=44672"
				navItems={nav}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/games" element={<Home />} />
					<Route path="/games/:id" element={<AvailableTournaments />} />
					<Route path="/tournament/:id" element={<TournamentInfo />} />
					{/*<Route path="/pokedex" element={<Pokedex />} />
					<Route path="/info" element={<Info />} />
					<Route path="/pokedex/:number" element={<PokemonDetail />} /> */}
				</Routes>
			</MainTemplate>
		</BrowserRouter>
	);
}

export default App;
