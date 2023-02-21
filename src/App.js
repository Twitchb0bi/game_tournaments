import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UsernameCreation from "./views/UsernameCreation/UsernameCreation";
import Logged from "./views/Logged/Logged";
function App() {
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
