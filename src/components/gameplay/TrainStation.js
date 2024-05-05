import React from "react";
// import orangeTrain from "../trains/OrangeTrain";
// import greenTrain from "../trains/GreenTrain";
// import { redTrain } from "../trains/RedTrain";
// import blueTrain from "../trains/BlueTrain";
// import purpleTrain from "../trains/PurpleTrain";
import whiteTrain from "../trains/WhiteTrain";
import confirmedTrain from "../trains/TrainSelector";

const TrainStation = ({
  sDomino,
  handleDominoSelection,
  lastDominos,
  isAvailable,
}) => {
  return (
    <div className="newTrainStation">
      <div
        className={`mexicanDomino ${isAvailable[0] ? "highlight" : ""}`}
        onClick={() => handleDominoSelection(0)}
      >
        {lastDominos[0]}
      </div>
      <div className="mexicanTrain">{whiteTrain()}</div>
      <div className="rotateDominoTop">
        <div className="train-domino-pairing-top">
          <div
            className={`playerOneDomino ${isAvailable[1] ? "highlight" : ""}`}
            onClick={() => handleDominoSelection(1)}
          >
            {lastDominos[1]}
          </div>
          <div className="playerOneTrain">{confirmedTrain[0]}</div>
        </div>
        <div className="train-domino-pairing-top">
          <div className="playerFourTrain">{confirmedTrain[1]}</div>
          <div
            className={`playerFourDomino ${isAvailable[4] ? "highlight" : ""}`}
            onClick={() => handleDominoSelection(4)}
          >
            {lastDominos[4]}
          </div>
        </div>
      </div>
      <div className="StartingDomino">{sDomino}</div>
      <div className="rotateDominoBottom">
        <div className="train-domino-pairing-bottom">
          <div
            className={`playerTwoDomino ${isAvailable[2] ? "highlight" : ""}`}
            onClick={() => handleDominoSelection(2)}
          >
            {lastDominos[2]}
          </div>
          <div className="playerTwoTrain">{confirmedTrain[2]}</div>
        </div>
        <div className="train-domino-pairing-bottom">
          <div className="playerThreeTrain">{confirmedTrain[3]}</div>
          <div
            className={`playerThreeDomino ${isAvailable[3] ? "highlight" : ""}`}
            onClick={() => handleDominoSelection(3)}
          >
            {lastDominos[3]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainStation;
