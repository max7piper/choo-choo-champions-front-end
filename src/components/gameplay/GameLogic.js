import { GenerateDominoBankForGame } from "./dominoes/DominoBank";

export function GenerateDominoesForPlayers(player_list, startingDomino) {
  GenerateDominoBankForGame();
  const dominos = JSON.parse(sessionStorage.getItem("Domino"));
  for(let i=0;i<dominos.length;i++){
    if(dominos[i][1]===startingDomino[0][1] && dominos[i][2]===startingDomino[0][2]){
      dominos.splice(i,1);
    }
  }
  // generate the "dictionaries"
  const playerDominoes = {};
  for (let k = 0; k < player_list.length; k++) {
    playerDominoes[player_list[k]] = [];
  }

  // "deal" dominoes to all players until they have fifteen
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < player_list.length; j++) {
      playerDominoes[player_list[j]].push(
        dominos.splice(Math.floor(Math.random() * dominos.length), 1)[0]
      );
    }
  }
  sessionStorage.setItem("Boneyard", JSON.stringify(dominos));
  sessionStorage.setItem("Player Dominoes", JSON.stringify(playerDominoes));
}

export function GeneratePathsForGame(startingDomino, player_list) {
  const gamePaths = {};
  gamePaths["Starting Domino"] = startingDomino;
  for (let i = 0; i < player_list.length; i++) {
    gamePaths[player_list[i]] = { Dominoes: [], Playable: false };
  }
  gamePaths["Mexican Train"] = { Dominoes: [], Playable: true };
  gamePaths['UnvalidatedDouble'] = null;
  sessionStorage.setItem("Player Paths", JSON.stringify(gamePaths));
}

export function DeterminePlayablePaths(player, player_list) {
  const game = JSON.parse(sessionStorage.getItem("game"));
  const playerDominos = game['Player Dominoes'];
  const playerPaths = game['Player Paths'];
  const boneyard = game.Boneyard;
  const playablePaths = [];
  if(playerPaths.UnvalidatedDouble === null){
    for (let i = 0; i < playerDominos[player].length; i++) {
      for (let j = 0; j < player_list.length; j++) {
        const pathDominoes = playerPaths[player_list[j]].Dominoes;
        // if train is playable we can check for playability
        if (playerPaths[player_list[j]].Playable || player_list[j] === player) {
          // if there isn't a path we check the starting domino
          if (
            pathDominoes.length === 0 &&
            (playerDominos[player][i][1] ===
              playerPaths["Starting Domino"][0][2] ||
              playerDominos[player][i][2] ===
                playerPaths["Starting Domino"][0][2])
          ) {
            if (!playablePaths.includes(player_list[j])) {
              playablePaths.push(player_list[j]);
            }
          }
          // if there is we check the last value of the last domino in the list, with this dominos top value
          else if (
            pathDominoes.length !== 0 &&
            (pathDominoes[pathDominoes.length - 1][1] ===
              playerDominos[player][i][1] ||
              pathDominoes[pathDominoes.length - 1][1] ===
                playerDominos[player][i][2])
          ) {
            if (!playablePaths.includes(player_list[j])) {
              playablePaths.push(player_list[j]);
            }
          }
        }
      }
      if (playerPaths["Mexican Train"].Playable) {
        const mexicanPath = playerPaths["Mexican Train"]["Dominoes"];
        if (
          mexicanPath.length === 0 &&
          (playerDominos[player][i][1] === playerPaths["Starting Domino"][0][2] ||
            playerDominos[player][i][2] === playerPaths["Starting Domino"][0][2])
        ) {
          if (!playablePaths.includes("Mexican Train")) {
            playablePaths.push("Mexican Train");
          }
        } else if (
          mexicanPath.length !== 0 &&
          (mexicanPath[mexicanPath.length - 1][1] ===
            playerDominos[player][i][1] ||
            mexicanPath[mexicanPath.length - 1][1] ===
              playerDominos[player][i][2])
        ) {
          if (!playablePaths.includes("Mexican Train")) {
            playablePaths.push("Mexican Train");
          }
        }
      }
    } 
  } else{
    // handles unvalidated double
    const lastDomino = playerPaths[playerPaths.UnvalidatedDouble].Dominoes[playerPaths[playerPaths.UnvalidatedDouble].Dominoes.length-1];
    for (let i = 0; i < playerDominos[player].length; i++){
      if((lastDomino[1] === playerDominos[player][i][2] || lastDomino[1]=== playerDominos[player][i][1]) && !playablePaths.includes(playerPaths.UnvalidatedDouble)){
        playablePaths.push(playerPaths.UnvalidatedDouble);
      }
    }
  }
  if (playablePaths.length === 0 && boneyard.length !== 0) {
    playablePaths.push("Draw");
  } else if (playablePaths.length === 0 && boneyard.length === 0) {
    playablePaths.push("Pass");
    if(!playerPaths[player].Playable){
      alert(player + " has gone choo choo! Their path is now playable.");
    }
    playerPaths[player].Playable = true;
    game['Playable Paths'] = playerPaths;
    sessionStorage.setItem("game", JSON.stringify(game));
  }
  return playablePaths;
}


export function DrawADomino(player, player_list) {
  const game = JSON.parse(sessionStorage.getItem("game"))
  const paths = DeterminePlayablePaths(player, player_list);
  const boneyard = game.Boneyard;
  const playerDominos = game['Player Dominoes'];
  const playerPaths = game['Player Paths'];
  if (paths.includes("Draw")) {
    playerDominos[player].push(
      boneyard.splice(Math.floor(Math.random() * boneyard.length), 1)[0]
    );
    game.Boneyard = boneyard
    game['Player Dominoes'] = playerDominos;
    game['Player Paths'] = playerPaths;
    sessionStorage.setItem("game", JSON.stringify(game));
    const newPaths = DeterminePlayablePaths(player, player_list);
    if(newPaths.includes("Draw") || newPaths.includes("Pass")){
      if(!playerPaths[player].Playable){
        alert(player + " has gone choo choo! Their path is now playable.");
      }
      playerPaths[player].Playable = true;
      game['Player Paths'] = playerPaths;
      sessionStorage.setItem("game", JSON.stringify(game));
    }
    return true;
  } else {
    alert("Cannot draw domino. There are playable dominoes!");
    return false;
  }
}

export function CheckIfDominoIsPlayable(player, player_list, domino) {
  const game = JSON.parse(sessionStorage.getItem("game"));
  const paths = DeterminePlayablePaths(player, player_list);
  const playerPaths = game['Player Paths'];
  const playablePaths = [];
  for(let i = 0; i < paths.length; i++) {
    if(playerPaths[paths[i]].Dominoes.length === 0) {
      if(playerPaths['Starting Domino'][0][2] === domino[1] || playerPaths['Starting Domino'][0][2] === domino[2]) {
        playablePaths.push(paths[i]);
      }
    } else {
      const endingDomino = playerPaths[paths[i]].Dominoes[playerPaths[paths[i]].Dominoes.length - 1];
      if(endingDomino[1] === domino[1] || endingDomino[1] === domino[2]) {
        playablePaths.push(paths[i]);
      }
    }
  }
  
  if(playablePaths.length === 0) {
    alert('This Domino is not playable. Please pick a different one!');
  } else {
    return playablePaths;
  }
}

export function PlayDomino(player, player_list, domino, path){
  // this runs under assumption that the call to this function will only occur on a playable path
  const game = JSON.parse(sessionStorage.getItem("game"));
  const playerDominos = game["Player Dominoes"];
  const playerPaths = game["Player Paths"];
  for(let i=0;i<playerDominos[player].length;i++){
    if((playerDominos[player][i][1]===domino[1]&&playerDominos[player][i][2]===domino[2])||(playerDominos[player][i][2]===domino[1]&&playerDominos[player][i][1]===domino[2])){
      playerDominos[player].splice(i,1)
      break;
    }
  }
  
  //get the direction right (reverse if top connects to bottom)
  if(playerPaths[path].Dominoes.length===0 && playerPaths['Starting Domino'][0][2]===domino[1]){
    const temp = domino[2];
    domino[2] = domino[1];
    domino[1] = temp;
  } else if(playerPaths[path].Dominoes.length !== 0 && playerPaths[path].Dominoes[playerPaths[path].Dominoes.length-1][1]===domino[1]){
    const temp = domino[2];
    domino[2] = domino[1];
    domino[1] = temp;
  }
  playerPaths[path].Dominoes.push(domino);
  if(playerPaths.UnvalidatedDouble !== null){
    playerPaths.UnvalidatedDouble = null;
    alert(player + " has validated the double!");
  }

  // check for double
  if(domino[1] === domino[2]){
    playerPaths.UnvalidatedDouble = path;
    alert(player + " has played an unvalidated double!");
  } else if(player === path && playerPaths[player].Playable){
    playerPaths[player].Playable = false;
    alert(player + " has gone ooch ooch! Their path is no longer playable.");
  }
  game['Player Paths'] = playerPaths;
  game['Player Dominoes'] = playerDominos
  sessionStorage.setItem('game', JSON.stringify(game));
}

export function CheckWinner(player_list){
  const playerDominos = JSON.parse(sessionStorage.getItem("game"))['Player Dominoes'];
  for(let i=0;i<player_list.length;i++){
    if(playerDominos[player_list[i]].length===0){
      return player_list[i];
    }
  }
  return "No One";
}

export function EnsurePlayability(player_list){
  const game = JSON.parse(sessionStorage.getItem("game"));
  const boneyard = game.Boneyard;
  if(boneyard.length!==0){
    return false;
  }
  for(let i=0;i<player_list.length;i++){
    const paths = DeterminePlayablePaths(player_list[i],player_list)
    if(!paths.includes("Pass")){
      return false;
    }
  }
  return true;
}

export function CalculateScores(player_list){
  const playerDominos = JSON.parse(sessionStorage.getItem("game"))["Player Dominoes"];
  const returnList = [];
  for(let i=0;i<player_list.length;i++){
    const dominos = playerDominos[player_list[i]];
    if(dominos.length===0){
      returnList.push(0);
    } else{
      let sum = 0;
      for(let j=0;j<dominos.length;j++){
        sum += dominos[j][1] + dominos[j][2];
      }
      returnList.push(sum);
    }
  }
  return returnList;
}

function GameLogic() {
  return null;
}
export default GameLogic;
