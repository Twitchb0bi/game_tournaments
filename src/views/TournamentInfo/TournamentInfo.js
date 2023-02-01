import React from "react";
import TournamentBracket from "../../components/TournamentBracket.js/TournamentBracket";
import style from "./TournamentInfo.module.css";
let arr = [
	{
		id: 19753,
		nextMatchId: 8,
		tournamentRoundText: "3",
		startTime: "2021-05-30",
		state: "SCHEDULED",
		participants: [],
	},
	{
		id: 19754,
		nextMatchId: 19753,
		tournamentRoundText: "2",
		startTime: "2021-05-30",
		state: "SCHEDULED",
		participants: [
			{
				id: "14754a1a-932c-4992-8dec-f7f94a339960",
				resultText: null,
				isWinner: false,
				status: null,
				name: "CoKe BoYz s",
				picture: "teamlogos/client_team_default_logo",
			},
		],
	},
	{
		id: 19755,
		nextMatchId: 19754,
		tournamentRoundText: "1",
		startTime: "2021-05-30",
		state: "SCORE_DONE",
		participants: [
			{
				id: "14754a1a-932c-4992-8dec-f7f94a339960",
				resultText: "Won",
				isWinner: true,
				status: "PLAYED",
				name: "CoKe BoYz",
				picture: "teamlogos/client_team_default_logo",
			},
			{
				id: "d16315d4-7f2d-427b-ae75-63a1ae82c0a8",
				resultText: "Lost",
				isWinner: false,
				status: "PLAYED",
				name: "Aids Team",
				picture: "teamlogos/client_team_default_logo",
			},
		],
	},
	{
		id: 19756,
		nextMatchId: 19754,
		tournamentRoundText: "1",
		startTime: "2021-05-30",
		state: "RUNNING",
		participants: [
			{
				id: "d8b9f00a-0ffa-4527-8316-da701894768e",
				resultText: null,
				isWinner: false,
				status: null,
				name: "Art of kill",
				picture: "teamlogos/client_team_default_logo",
			},
		],
	},
	{
		id: 19757,
		nextMatchId: 19753,
		tournamentRoundText: "2",
		startTime: "2021-05-30",
		state: "SCHEDULED",
		participants: [],
	},
	{
		id: 19758,
		nextMatchId: 19757,
		tournamentRoundText: "1",
		startTime: "2021-05-30",
		state: "SCHEDULED",
		participants: [
			{
				id: "9397971f-4b2f-44eb-a094-722eb286c59b",
				resultText: null,
				isWinner: false,
				status: null,
				name: "Crazy Pepes",
				picture: "teamlogos/client_team_default_logo",
			},
		],
	},
	{
		id: 19759,
		nextMatchId: 19757,
		tournamentRoundText: "1",
		startTime: "2021-05-30",
		state: "SCHEDULED",
		participants: [
			{
				id: "42fecd89-dc83-4821-80d3-718acb50a30c",
				resultText: null,
				isWinner: false,
				status: null,
				name: "BLUEJAYS",
				picture: "teamlogos/client_team_default_logo",
			},
			{
				id: "df01fe2c-18db-4190-9f9e-aa63364128fe",
				resultText: null,
				isWinner: false,
				status: null,
				name: "Bosphorus",
				picture: "teamlogos/r7zn4gr8eajivapvjyzd",
			},
		],
	},

	{
		id: 1,
		nextMatchId: 8,
		tournamentRoundText: "3",
		startTime: "2021-05-30",
		state: "SCHEDULED",
		participants: [],
	},
	{
		id: 2,
		nextMatchId: 1,
		tournamentRoundText: "3",
		startTime: "2021-05-30",
		state: "SCHEDULED",
		participants: [],
	},
	{
		id: 3,
		nextMatchId: 1,
		tournamentRoundText: "3",
		startTime: "2021-05-30",
		state: "SCHEDULED",
		participants: [],
	},
	{
		id: 4,
		nextMatchId: 3,
		tournamentRoundText: "3",
		startTime: "2021-05-30",
		state: "SCHEDULED",
		participants: [],
	},
	{
		id: 5,
		nextMatchId: 3,
		tournamentRoundText: "3",
		startTime: "2021-05-30",
		state: "SCHEDULED",
		participants: [],
	},
	{
		id: 6,
		nextMatchId: 2,
		tournamentRoundText: "3",
		startTime: "2021-05-30",
		state: "SCHEDULED",
		participants: [],
	},
	{
		id: 7,
		nextMatchId: 2,
		tournamentRoundText: "3",
		startTime: "2021-05-30",
		state: "SCHEDULED",
		participants: [],
	},

	{
		id: 8,
		nextMatchId: null,
		tournamentRoundText: "3",
		startTime: "2021-05-30",
		state: "SCHEDULED",
		participants: [],
	},
];

export default function TournamentInfo() {
	return (
		<div className={style.container_tournament_bracket}>
			<div className={style.container_info}>
				<div className={style.container_img_titolo}>
					<div className={style.container_card}>
						<img
							src={require("../../assets/images/copertinaRocketLeague.jpg")}
							alt={"Rocket League"}
							className={style.img_card}
						/>
					</div>

					<h1>2v2 EXTREME Tournament</h1>
				</div>
			</div>
			<div className={style.container_bracket}>
				<TournamentBracket matches={arr} />
			</div>
		</div>
	);
}
