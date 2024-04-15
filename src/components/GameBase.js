import NavBar from "./NavBar";
import Background from "./Background";
import greenTrain from "./GreenTrain";
import { redTrain } from "./RedTrain";
import blueTrain from "./BlueTrain";
import purpleTrain from "./PurpleTrain";
import orangeTrain from "./OrangeTrain";

import {
  GenerateDominoesForPlayers,
  GeneratePathsForGame,
  DrawADomino,
  CheckIfDominoIsPlayable,
  DeterminePlayablePaths,
} from "./GameLogic";
import { ConvertToReact } from "./Domino";
import "./GameBase.css";
import { useEffect, useState } from "react";

function GameChoice({ src, alt, onSelect, isSelected }) {
  // hard coded setup
  const players = ["max", "arjun", "carly"];
  const startingDomino = [[90, 12, 12]];
  const currentPlayer = "max";

  if (sessionStorage.getItem("Player Dominoes") == null) {
    GenerateDominoesForPlayers(players, startingDomino);
  }

  // a bunch of booleans that we will use within
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [drawDisabled, setDrawDisabled] = useState(true);
  const [playDisabled, setPlayDisabled] = useState(true);
  const [finishDisabled, setFinishDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [inTurn, setInTurn] = useState(false);

  // now the functions
  useEffect(() => {
    const storedIndex = sessionStorage.getItem("currentPlayerIndex");
    if (storedIndex !== null) {
      setCurrentPlayerIndex(parseInt(storedIndex));
    }
  }, []);

  const finishTurn = () => {
    switchToNextPlayer();
    setInTurn(false);
  };

  const switchToNextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);
    sessionStorage.setItem("currentPlayerIndex", nextIndex.toString());
  };

  const DrawDomino = () => {
    DrawADomino(currentPlayer, players);
    window.location.reload();
  };

  const SelectADominoToPlay = () => {
    const domino = JSON.parse(sessionStorage.getItem("SelectedDomino"));
    if (domino == null) {
      alert("No domino selected");
      return false;
    }
    const result = CheckIfDominoIsPlayable(currentPlayer, players, domino);
    if (result !== undefined) {
      alert("Playable Paths: " + result.toString());
      return true;
    }
    return false;
  };

  async function Turn() {
    // timer goes here
    const options = DeterminePlayablePaths(currentPlayer, players);
    if (options.includes("Draw")) {
      setDrawDisabled(false);
      const optionsTwo = DeterminePlayablePaths(currentPlayer, players);
      if (!optionsTwo.includes("Draw")) {
        setDrawDisabled(true);
        setPlayDisabled(false);
      }
    } else if (
      options.includes(currentPlayer) ||
      options.includes("Mexican Train")
    ) {
      setPlayDisabled(false);
    }
    setFinishDisabled(false);
  }
  // set up round
  const playerDominoes = JSON.parse(sessionStorage.getItem("Player Dominoes"));
  if (sessionStorage.getItem("Player Paths") == null) {
    GeneratePathsForGame(startingDomino, players);
  }
  const playerPaths = JSON.parse(sessionStorage.getItem("Player Paths"));
  const dominos = ConvertToReact(playerDominoes[currentPlayer]);
  const sDomino = ConvertToReact(playerPaths["Starting Domino"]);

  if (!loading && !inTurn) {
    Turn(currentPlayer);
    setInTurn(true);
  } else if (loading && !inTurn) {
    setLoading(false);
  }
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
              <div className="button-container">
                <button
                  className="button"
                  onClick={DrawDomino}
                  disabled={drawDisabled}
                >
                  Draw
                </button>
                <button
                  className="button"
                  onClick={SelectADominoToPlay}
                  disabled={playDisabled}
                >
                  AddToPath
                </button>
              </div>
            </div>
            {/* end of left content */}
            <div className="inner-content">
              <h3 className="players_turn">
                It is <strong>{players[currentPlayerIndex]}</strong>'s turn
              </h3>{" "}
              <div className="newTrainStation">
                <div className="mexicanDomino">
                  {ConvertToReact([[0, 2, 12]])}
                </div>
                <div className="mexicanTrain">{orangeTrain()}</div>
                <div className="rotateDominoTop">
                  <div className="train-domino-pairing-top">
                    <div className="playerOneDomino">
                      {ConvertToReact([[0, 3, 12]])}
                    </div>
                    <div className="playerOneTrain">{greenTrain()}</div>
                  </div>
                  <div className="train-domino-pairing-top">
                    <div className="playerFourTrain">{redTrain()}</div>
                    <div className="playerFourDomino">
                      {ConvertToReact([[0, 6, 12]])}
                    </div>
                  </div>
                </div>
                <div className="StartingDomino">{sDomino}</div>
                <div className="rotateDominoBottom">
                  <div className="train-domino-pairing-bottom">
                    <div className="playerTwoDomino">
                      {ConvertToReact([[0, 9, 12]])}
                    </div>
                    <div className="playerTwoTrain">{blueTrain()}</div>
                  </div>
                  <div className="train-domino-pairing-bottom">
                    <div className="playerThreeTrain">{purpleTrain()}</div>
                    <div className="playerThreeDomino">
                      {ConvertToReact([[0, 11, 12]])}
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="finish-turn-button"
                onClick={finishTurn}
                disabled={finishDisabled}
              >
                Finish Turn
              </button>{" "}
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
