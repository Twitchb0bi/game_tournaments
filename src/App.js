import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Logged from "./views/Logged/Logged";
import AccountCreation from "./views/AccountCreation/AccountCreation";
import { Flip, ToastContainer } from "react-toastify";
import Login from "./views/Login/Login";
function App() {
	return (
		<BrowserRouter>
			<ToastContainer transition={Flip} newestOnTop rtl={false} pauseOnFocusLoss />
			<Routes>
				<Route path="/*" element={<Logged />} />
				<Route path="/create" element={<AccountCreation />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
