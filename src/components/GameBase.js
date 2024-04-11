import NavBar from "./NavBar";
import Background from "./Background";
import {
  GenerateDominoesForPlayers,
  GeneratePathsForGame,
  DeterminePlayablePaths,
} from "./GameLogic";
import { ConvertToReact } from "./Domino";
import "./GameBase.css";

function GameChoice({ src, alt, onSelect, isSelected }) {
  const players = ["max", "arjun", "carly"];
  const startingDomino = [[90, 12, 12]];
  if (sessionStorage.getItem("Player Dominoes") == null) {
    GenerateDominoesForPlayers(players, startingDomino);
  }
  const playerDominoes = JSON.parse(sessionStorage.getItem("Player Dominoes"));
  if (sessionStorage.getItem("Player Paths") == null) {
    GeneratePathsForGame(startingDomino, players);
  }
  const playerPaths = JSON.parse(sessionStorage.getItem("Player Paths"));
  //const dominos = ConvertToReact(playerPaths["Starting Domino"]);
  const dominos = ConvertToReact(playerDominoes["carly"]);
  const sDomino = ConvertToReact(playerPaths["Starting Domino"]);
  console.log(DeterminePlayablePaths("carly", players));
  return (
    <>
      <div className="full-page">
        <NavBar />
        <div className="centered-content">
          <div className="sidegroup">
            <div className="inner-content">
              <h1 className="banktitle">Bank</h1>
              <div className="bank">{dominos}</div>
              {/* end of bank group */}
              <button className="button">Draw</button>
            </div>
            {/* end of left content */}
            <div className="inner-content">
              {/* CARLY FIX THIS!! */}
              <h3 className="players_turn">It is turn</h3>
              <img
                className="trainstation"
                src="./trainstation.png"
                alt="domino train station"
              />
              <div aria-disabled="true" className="StartingDomino">
                {sDomino}
              </div>
              {/* CARLY FIX THIS!! */}
              <button className="button">Finish Turn</button>{" "}
            </div>
          </div>
          {/* end of right content  */}
          {/* end of horizontal group */}
        </div>
        {/* end of content */}
      </div>
      <Background />
    </>
  );
}
export default GameChoice;
