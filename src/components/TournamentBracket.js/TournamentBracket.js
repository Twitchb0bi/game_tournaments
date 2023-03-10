import React, { useEffect } from "react";
import { SingleEliminationBracket, Match } from "@g-loot/react-tournament-brackets";
import style from "./TournamentBracket.module.css";
export default function TournamentBracket({ matches }) {
	const [screenDimension, setScreenDimension] = React.useState({
		innerWidth: window.innerWidth,
		innerHeight: window.innerHeight,
	});
	//Funzione che ottiene le dimensioni dello schermo
	function getWindowDimensions() {
		const finalWidth = Math.max(window.innerWidth - 50, 0);
		const finalHeight = Math.min(window.innerHeight - 100, 3000);

		return {
			innerWidth: finalWidth,
			innerHeight: finalHeight,
		};
	}
	useEffect(() => {
		setScreenDimension(getWindowDimensions);
		function handleResize() {
			setScreenDimension(getWindowDimensions());
		}
		//Aggiunge un listener per il resize dello schermo
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className={style.container_bracket}>
			<SingleEliminationBracket
				matches={matches}
				matchComponent={Match}
				options={{
					style: {
						round: {
							spacing: 30,
						},
					},
				}}
				// svgWrapper={({ children, ...props }) => (
				// 	<SVGViewer
				// 		width={screenDimension.innerWidth}
				// 		height={screenDimension.innerHeight}
				// 		{...props}
				// 		background="#bbd6f90d"
				// 		SVGBackground="#bbd6f90d">
				// 		{children}
				// 	</SVGViewer>
				// )}
			/>
		</div>
	);
}
