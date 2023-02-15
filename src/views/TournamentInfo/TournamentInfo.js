import React, { useState, useEffect } from "react";
import TournamentBracket from "../../components/TournamentBracket.js/TournamentBracket";
import Countdown from "react-countdown";
import style from "./TournamentInfo.module.css";
import CustomTooltip from "../../components/Tooltip/CustomTooltip";
import Icon from "../../components/Icon/Icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEuroSign, faGamepad, faUsers, faWallet } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
let arr = [
	{
		id: 19753,
		nextMatchId: 8,
		tournamentRoundText: "2",
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
		tournamentRoundText: "2",
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
		tournamentRoundText: "2",
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
		tournamentRoundText: "2",
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
		tournamentRoundText: "2",
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
		tournamentRoundText: "2",
		startTime: "2021-05-30",
		state: "SCHEDULED",
		participants: [],
	},
	{
		id: 2,
		nextMatchId: 1,
		tournamentRoundText: "2",
		startTime: "2021-05-30",
		state: "SCHEDULED",
		participants: [],
	},
	{
		id: 3,
		nextMatchId: 1,
		tournamentRoundText: "2",
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
	const [tournamentStarted, setTournamentStarted] = useState(false);
	const [tournamentInfo, setTournamentInfo] = useState(useLocation().state);
	const handleCountdownEnd = () => {
		setTournamentStarted(true);
	};
	console.log(tournamentInfo);
	return (
		<div className={style.container_tournament_bracket}>
			<div className={style.container_info}>
				<div className={style.container_tournament_header}>
					<div className={style.container_img_titolo}>
						<div className={style.container_card}>
							<img
								src={tournamentInfo.img}
								alt={tournamentInfo.title}
								id={"img"}
								className={style.img_card}
							/>
							<CustomTooltip title={tournamentInfo.title} id={"img"} />
						</div>
						<div>
							<h1 className={style.title_tournament}>{tournamentInfo.tournamentTitle}</h1>
							<div className={style.container_img_platform}>
								<Icon
									src={require("../../assets/images/monitor.png")}
									id={"monitor"}
									title={"Monitor"}
								/>
								<Icon
									src={require("../../assets/images/xbox.png")}
									width={40}
									id={"xbox"}
									title={"Xbox"}
								/>
								<Icon
									src={require("../../assets/images/ps4.png")}
									id={"ps4"}
									width={40}
									title={"PS4"}
								/>
								<Icon
									src={require("../../assets/images/european.png")}
									id={"europe"}
									width={25}
									title={"Europe"}
								/>
							</div>
						</div>
					</div>
					{!tournamentStarted && (
						<div className={style.container_countdown}>
							<div className={style.container_value_countdown}>
								<h4>Starts In:</h4>
								<Countdown date={tournamentInfo.starting} onComplete={handleCountdownEnd} />
							</div>
						</div>
					)}
				</div>

				<div className={style.container_info_tournament}>
					{/* <div className={style.container_details_prize}> */}
					<div className={style.container_details_tournament}>
						<div className={style.container_cards_info}>
							<div className={style.container_card_info}>
								<FontAwesomeIcon icon={faGamepad} color={"white"} size={"lg"} />
								<p>
									<strong>Mode:</strong> {tournamentInfo.teamSize + "V" + tournamentInfo.teamSize}
								</p>
							</div>
							<div className={style.container_card_info}>
								<FontAwesomeIcon icon={faWallet} color={"white"} size={"lg"} />
								<p>
									<strong>Entry fee:</strong> €{tournamentInfo.entryFee}
								</p>
							</div>
							<div className={style.container_card_info}>
								<FontAwesomeIcon icon={faUsers} color={"white"} size={"lg"} />
								<p>
									<strong>Enrolled:</strong>{" "}
									{tournamentInfo.enrolled + "/" + tournamentInfo.maxTeams}
								</p>
							</div>
							<div className={style.container_card_info}>
								<FontAwesomeIcon icon={faEuroSign} color={"white"} size={"lg"} />
								<p>
									<strong>Prize:</strong> € {tournamentInfo.totalEarnings}
								</p>
							</div>
						</div>
						<div className={style.container_prize}>
							<div className={style.container_prize_item}>
								<img src={require("../../assets/images/second.png")} width={80} />
								<span>€ {tournamentInfo.secondEarnings}</span>
							</div>
							<div className={style.container_prize_item}>
								<img src={require("../../assets/images/first.png")} width={100} />
								<span>€ {tournamentInfo.firstEarnings}</span>
							</div>
							<div className={style.container_prize_item}>
								<img src={require("../../assets/images/third.png")} width={75} />
								<span>€{tournamentInfo.thirdEarnings}</span>
							</div>
						</div>
					</div>

					{/* </div> */}
				</div>

				{tournamentStarted && (
					<div className={style.container_bracket}>
						<TournamentBracket matches={arr} />
					</div>
				)}
			</div>
		</div>
	);
}
