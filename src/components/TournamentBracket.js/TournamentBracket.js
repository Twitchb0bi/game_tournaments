import React, { useState, useEffect } from "react";
import {
	SingleEliminationBracket,
	DoubleEliminationBracket,
	Match,
	SVGViewer,
} from "@g-loot/react-tournament-brackets";
export default function TournamentBracket({ matches }) {
	// const [screenDimension, setScreenDimension] = React.useState({
	// 	innerWidth: window.innerWidth,
	// 	innerHeight: window.innerHeight,
	// });
	// //Funzione che ottiene le dimensioni dello schermo
	// function getWindowDimensions() {
	// 	return {
	// 		innerWidth: window.innerWidth,
	// 		innerHeight: window.innerHeight,
	// 	};
	// }
	// useEffect(() => {
	// 	setScreenDimension(getWindowDimensions);
	// 	function handleResize() {
	// 		setScreenDimension(getWindowDimensions());
	// 	}
	// 	//Aggiunge un listener per il resize dello schermo
	// 	window.addEventListener("resize", handleResize);
	// 	return () => window.removeEventListener("resize", handleResize);
	// }, []);
	return (
		<SingleEliminationBracket
			matches={matches}
			matchComponent={Match}

			// svgWrapper={({ children, ...props }) => (
			// 	<SVGViewer
			// 		width={screenDimension.innerWidth}
			// 		height={screenDimension.innerHeight}
			// 		{...props}
			// 		background="#212529"
			// 		SVGBackground="#212529">
			// 		{children}
			// 	</SVGViewer>
			// )}
		/>
	);
}
