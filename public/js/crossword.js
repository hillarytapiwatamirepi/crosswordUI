// const e = require("express");



/* Copyright (c) 2017-2020 MIT 6.031 course staff, all rights reserved. */

function memoryGame() {
  var words = [
    ["red", "orange", "yellow", "green", "blue", "purple"],
    ["apple", "bean", "carrot", "donut", "eclair", "flan"],
    [Math.floor(Math.random() * Math.pow(16, 3)).toString(16)],
  ];

  var playerID = words
    .map(function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    })
    .join("_");
  console.log("generated player ID", playerID);

  var serverBox = document.getElementById("crossword-server");
  var playButton = document.getElementById("crossword-play");

  if (serverBox) {
    serverBox.addEventListener("keypress", function (e) {
      if (e.keyCode == 13) {
        serverBox.blur();
        play(serverBox.value);
      }
    });
    if (playButton) {
      playButton.addEventListener("click", function () {
        play(serverBox.value);
      });
    }
  }

  // var boardTable = document.getElementById('memory-board');
  // boardTable.addEventListener('click', flip);

  // var flippingCell = null;

  // console.log(server);

  var play = (memoryGame.play = function play(server) {
    console.log("playing on server", server);
    if (serverBox) {
      serverBox.disabled = true;
    }
    if (playButton) {
      playButton.disabled = true;
    }
    memoryGame.server = server;
    // watchAndLook();
    var welcomeContainer = document.getElementById("welcome-tag");
    welcomeContainer.innerText = "Welcome player : " + playerID;
    getPuzzles(playerID);
    getGamesRequest(playerID);
  });

  // get the puzzles
  function getPuzzles(playerID) {
    var req = new XMLHttpRequest();
    req.addEventListener("load", function onPuzzleLoad() {
      console.log(
        "puzzles response",
        this.responseText.replace(/\r?\n/g, "\u21B5")
      );
      var listOfStrings = this.responseText.split(";");
      // console.log(listOfStrings);
      var puzzleData = [];
      listOfStrings.forEach((exp) => {
        if (exp !== "") {
          console.log(JSON.parse(exp));
          puzzleData.push(JSON.parse(exp));
        }
      });
      drawPuzzlesTable(puzzleData, playerID);

      // console.log(JSON.parse(this.responseText));
      // setTimeout(watchAndLook, 1);
    });
    //   req.addEventListener('loadstart', function onWatchStart() {
    //     console.log('watch start');
    //     setTimeout(look, 1);
    //   });
    req.addEventListener("error", function onPuzzleError() {
      console.error("watch error", memoryGame.server);
    });
    req.open("GET", "http://" + memoryGame.server + "/currentPuzzles");
    console.log("puzzles request");
    req.send();
  }

}

function getPlayersRequest(gameID,dom){

  var req = new XMLHttpRequest();
  req.addEventListener("load", function onPuzzleLoad() {
    console.log(
      "game data response",
      this.responseText.replace(/\r?\n/g, "\u21B5")
    );
    var listOfStrings = this.responseText.split(",");
    console.log(listOfStrings)
    var gameData = [];
    listOfStrings.forEach((exp) => {
      if (exp !== "") {
        gameData.push(exp);
      }
    });
 
    gameData.forEach((player)=>{

        const tag = document.createElement("h4");
        tag.innerText = player;
        dom.appendChild(tag);

    })
    // return gameData;

  });
  req.addEventListener("error", function onPuzzleError() {
    console.error("watch error", memoryGame.server);
  });
  req.open(
    "GET",
    "http://" + memoryGame.server + "/players/" + gameID 
  );
  console.log("join request");
  req.send();




}


function drawPuzzlesTable(puzzleData, playerID) {
  const puzzlesTable = document.getElementById("puzzlesID");
  if (puzzlesTable) {
    puzzleData.forEach((piece) => {
      const puzzleContainer = document.createElement("div");
      puzzleContainer.className = "puzzle-container";

      const puzzleH2 = document.createElement("h5");

      puzzleH2.innerText = `
          ID: ${piece.id}
          Name : ${piece.name}
          Description: ${piece.description}
        `;
      const puzzleButton = document.createElement("button");
      puzzleButton.innerText = "Create Game";
      puzzleButton.addEventListener("click", () => {
        var gameID = createGame(piece.id, playerID);
        createGameRequest(piece.id, gameID, playerID);
      });

      puzzleButton.className = "puzzle-button";

      puzzleContainer.appendChild(puzzleH2);
      puzzleContainer.appendChild(puzzleButton);

      puzzlesTable.appendChild(puzzleContainer);
    });
  }
}

function checkGameRequest(gameID, playerID) {
  var req = new XMLHttpRequest();
  req.addEventListener("load", function onPuzzleLoad() {
    console.log(
      "game data response",
      this.responseText.replace(/\r?\n/g, "\u21B5")
    );
    console.log("this")
    if (this.responseText.includes("solved")){

        const gameStatusContainer = document.getElementById("game-status");
        gameStatusContainer.innerText = "Solved";
        gameStatusContainer.style.color = "#556b2f";
         

    }else{

    const gameStatusContainer = document.getElementById("game-status");
    gameStatusContainer.innerText = "UnSolved";
    gameStatusContainer.style.color = "#ff7f7f";

    var listOfStrings = this.responseText.split(";");
    var gameData = [];
    listOfStrings.forEach((exp) => {
      if (exp !== "") {
        gameData.push(JSON.parse(exp));
      }
    });

    colorInvalidAnswers(gameData);
    }
  });

  req.addEventListener("error", function onPuzzleError() {
    console.error("watch error", memoryGame.server);
  });
  req.open(
    "GET",
    "http://" + memoryGame.server + "/check/" + gameID + "/" + playerID
  );
  console.log("join request");
  req.send();
}

function enterLetterRequest(url) {
  var req = new XMLHttpRequest();

  req.addEventListener("load", function onPuzzleLoad() {
    console.log("game response", this.responseText.replace(/\r?\n/g, "\u21B5"));
  });

  req.addEventListener("error", function onPuzzleError() {
    console.error("watch error", memoryGame.server);
  });

  req.open("GET", url);
  console.log("enter letter request request");
  req.send();
}

function eraseLetterRequest(url) {
  var req = new XMLHttpRequest();
  req.addEventListener("load", function onPuzzleLoad() {
    console.log("game response", this.responseText.replace(/\r?\n/g, "\u21B5"));
  });

  req.addEventListener("error", function onPuzzleError() {
    console.error("watch error", memoryGame.server);
  });

  req.open("GET", url);
  console.log("erase letter request request");
  req.send();
}

function joinGameRequest(gameID, puzzleID, playerID) {
  var req = new XMLHttpRequest();
  req.addEventListener("load", function onPuzzleLoad() {
    console.log(
      "game data response",
      this.responseText.replace(/\r?\n/g, "\u21B5")
    );
    var listOfStrings = this.responseText.split(";");
    var gameData = [];
    listOfStrings.forEach((exp) => {
      if (exp !== "") {
        gameData.push(JSON.parse(exp));
      }
    });

    //   console.log(gameData);
    var gameLabel = document.getElementById("current-game");
    gameLabel.innerText = gameID;
    fillInGameData(gameData);
  });
  req.addEventListener("error", function onPuzzleError() {
    console.error("watch error", memoryGame.server);
  });
  req.open(
    "GET",
    "http://" + memoryGame.server + "/join/" + gameID + "/" + playerID
  );
  console.log("join request");
  req.send();
}

function getPuzzleUIRequest(gameID, playerID, puzzleID) {
  var req = new XMLHttpRequest();
  req.addEventListener("load", function onPuzzleLoad() {
    console.log(
      "puzzles response",
      this.responseText.replace(/\r?\n/g, "\u21B5")
    );

    var listOfStrings = this.responseText.split(";");
    var gameData = [];
    listOfStrings.forEach((exp) => {
      if (exp !== "") {
        gameData.push(JSON.parse(exp));
      }
    });
    var actualGameData = {
      rows: parseInt(gameData[0].rows),
      columns: parseInt(gameData[1].columns),
      words: [],
    };
    for (let i = 2; i < gameData.length; i++) {
      var wordData = gameData[i];
      var word = {
        id: parseInt(wordData.id),
        row: parseInt(wordData.row),
        col: parseInt(wordData.col),
        word: parseInt(wordData.word),
        direction: wordData.direction,
        clue: wordData.clue,
      };
      actualGameData.words.push(word);
    }

    renderGameData(gameID, playerID, actualGameData);
  });

  req.addEventListener("error", function onPuzzleError() {
    console.error("watch error", memoryGame.server);
  });
  req.open("GET", "http://" + memoryGame.server + "/puzzle/" + puzzleID);
  console.log("puzzle UI request");
  req.send();
}

function getGamesRequest(playerID) {
  var req = new XMLHttpRequest();
  req.addEventListener("load", function onPuzzleLoad() {
    console.log(
      "puzzles response",
      this.responseText.replace(/\r?\n/g, "\u21B5")
    );
    var listOfStrings = this.responseText.split(";");
    //   console.log(listOfStrings);
    var gamesData = [];
    listOfStrings.forEach((exp) => {
      if (exp !== "") {
        gamesData.push(JSON.parse(exp));
      }
    });
    if (gamesData.length > 0) {
      drawGames(playerID, gamesData);
    }
  });

  req.addEventListener("error", function onPuzzleError() {
    console.error("watch error", memoryGame.server);
  });
  req.open("GET", "http://" + memoryGame.server + "/currentGames");
  console.log("games request");
  req.send();
}

function drawGames(playerID, gameData) {
  const gamesTable = document.getElementById("gamesID");
  gameData.forEach((game) => {
    const gameContainer = document.createElement("div");
    gameContainer.className = "puzzle-container";

    const gameContainerHeader = document.createElement("div");
    gameContainerHeader.className = "puzzle-container-header";


    const gameH2 = document.createElement("h5");
    gameH2.innerText = `
            GameID : ${game.gameID}
            PuzzleID : ${game.puzzleID}
          `;
    const gameButton = document.createElement("button");
    gameButton.innerText = "Join";
    gameButton.className = "puzzle-button";





    gameButton.addEventListener("click", () => {
      getPuzzleUIRequest(game.gameID, playerID, game.puzzleID);
      joinGameRequest(game.gameID, game.puzzleID, playerID);
      // checkGameRequest(game.gameID, playerID);
      watchAndLook(game.gameID,playerID) ;

      const checkButtonContainer = document.getElementById(
        "checkgame-button-container"
      );
      removeAllChildNodes(checkButtonContainer);
      const checkButton = document.createElement("button");
      checkButton.addEventListener("click", () => {
        checkGameRequest(game.gameID, playerID);
      });
      checkButton.className = "checkgame-button";
      checkButton.id = "checkgame";
      checkButton.innerText = "Check Solution";
      checkButtonContainer.appendChild(checkButton);
    });

    const gamePlayers= document.createElement("div");
    gamePlayers.className = "game-players-container-hide" ; 
    const showPlayers = document.createElement("button");
    showPlayers.className = "puzzle-button";
    showPlayers.innerText = "Views Players"





    showPlayers.addEventListener("click",()=>{
  
      gamePlayers.classList.toggle("game-players-container-reveal");
      removeAllChildNodes(gamePlayers);
      getPlayersRequest(game.gameID,gamePlayers);
  
    });
  
  
  
    gameContainerHeader.appendChild(gameH2);
    gameContainerHeader.appendChild(gameButton);
    gameContainerHeader.appendChild(showPlayers);
  
  
    gameContainer.appendChild(gameContainerHeader);
    gameContainer.appendChild(gamePlayers);
  
    gamesTable.appendChild(gameContainer);
  });
}

function colorChange(root) {
  var colors = ["#ff7f7f"];
  colors.forEach((color) => {
    root.style.backgroundColor = color;
  });
}

function colorInvalidAnswers(gameData) {
  gameData.forEach((game) => {
    var row = game.row;
    var col = game.column;
    var cellID = row + "," + col;
    var cellInput = document.getElementById(cellID);
    cellInput.className = "grid-cell-input-color";
    function resetColor() {
      cellInput.className = "grid-cell-input";
      cellInput.value = "";
    }

    setTimeout(resetColor, 3000);
  });
}

function fillInGameData(gameData) {
  gameData.forEach((game) => {
    var row = game.row;
    var col = game.col;
    var cellID = row + "," + col;
    var cellInput = document.getElementById(cellID);
    if (cellInput) {
      cellInput.value = game.value;
    }
  });
}

function createGameRequest(puzzleID, gameID, playerID) {
  var req = new XMLHttpRequest();
  req.addEventListener("load", function onPuzzleLoad() {
    console.log("game response", this.responseText.replace(/\r?\n/g, "\u21B5"));

  

    // var listOfStrings = this.responseText.split(";");
    // var gameData = [];
    // listOfStrings.forEach((exp) => {
    //   if (exp !== "") {
    //     // console.log(exp);
    //     gameData.push(JSON.parse(exp));
    //   }
    // });
    // var actualGameData = {
    //   rows: parseInt(gameData[0].rows),
    //   columns: parseInt(gameData[1].columns),
    //   words: [],
    // };
    // for (let i = 2; i < gameData.length; i++) {
    //   var wordData = gameData[i];
    //   console.log("row", parseInt(wordData.row), "col", parseInt(wordData.col));
    //   var word = {
    //     id: parseInt(wordData.id),
    //     row: parseInt(wordData.row),
    //     col: parseInt(wordData.col),
    //     word: parseInt(wordData.word),
    //     direction: wordData.direction,
    //     clue: wordData.clue,
    //   };
    //   actualGameData.words.push(word);
    // }
    // renderGameData(gameID, playerID, actualGameData);
  });
  req.addEventListener("error", function onPuzzleError() {
    console.error("watch error", memoryGame.server);
  });
  req.open(
    "GET",
    "http://" +
      memoryGame.server +
      "/new/" +
      puzzleID +
      "/" +
      gameID +
      "/" +
      playerID
  );
  console.log("puzzles request");
  req.send();
}

function watchAndLook(gameID,playerID) {
  var req = new XMLHttpRequest();
  req.addEventListener('load', function onWatchLoad() {
    console.log('watch response', this.responseText.replace(/\r?\n/g, '\u21B5'));
    var listOfStrings = this.responseText.split(";");
    var gameData = [];
    listOfStrings.forEach((exp) => {
      if (exp !== "") {
        gameData.push(JSON.parse(exp));
      }
    });

    //   console.log(gameData);
    var gameLabel = document.getElementById("current-game");
    gameLabel.innerText = gameID;
    fillInGameData(gameData);
    setTimeout(()=>{
      console.log("sending for more data");
      watchAndLook(gameID,playerID)
    }, 1);
  });
  req.addEventListener('loadstart', function onWatchStart() {
    console.log('watch start');
    setTimeout(()=>{look(gameID,playerID)}, 1);
  });
  req.addEventListener('error', function onWatchError() {
    console.error('watch error', memoryGame.server);
  });
  req.open('GET', 'http://' + memoryGame.server + '/watch/' + gameID + '/' + playerID);
  console.log('sending watch request');
  req.send();
}

function look(gameID,playerID) {
  var req = new XMLHttpRequest();
  req.addEventListener('load', function onLookLoad() {
    console.log('look response', this.responseText.replace(/\r?\n/g, '\u21B5'));
    var listOfStrings = this.responseText.split(";");
    var gameData = [];
    listOfStrings.forEach((exp) => {
      if (exp !== "") {
        gameData.push(JSON.parse(exp));
      }
    });

    //   console.log(gameData);
    var gameLabel = document.getElementById("current-game");
    gameLabel.innerText = gameID;
    fillInGameData(gameData);
  });
  req.addEventListener('error', function onLookError() {
    console.error('look error', memoryGame.server);
  });
  req.open('GET', 'http://' + memoryGame.server + '/look/' + gameID +'/'+playerID);
  console.log('sending look request');
  req.send();
}






function createGame(puzzleID, playerID) {
  const gamesTable = document.getElementById("gamesID");

  var words = [
    ["horse", "monkey", "donkey", "parrot", "cat", "dog"],
    ["pikachu", "charmander", "ca", "do", "ec", "fl"],
    [Math.floor(Math.random() * Math.pow(16, 3)).toString(16)],
  ];

  var gameID = words
    .map(function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    })
    .join("_");
  console.log("generated gameID", gameID);

  const gameContainer = document.createElement("div");
  gameContainer.className = "puzzle-container";

  const gameContainerHeader = document.createElement("div");
  gameContainerHeader.className = "puzzle-container-header";


  const gameH2 = document.createElement("h5");

  gameH2.innerText = `
      GameID : ${gameID}
      PuzzleID : ${puzzleID}
    `;
  const gameButton = document.createElement("button");
  gameButton.innerText = "Join";
  gameButton.className = "puzzle-button";
  gameButton.addEventListener("click", () => {
    getPuzzleUIRequest(gameID, playerID, puzzleID);
    joinGameRequest(gameID, puzzleID, playerID); 
    watchAndLook(gameID,playerID) ;

   
    const checkButtonContainer = document.getElementById(
      "checkgame-button-container"
    );
    removeAllChildNodes(checkButtonContainer);
    const checkButton = document.createElement("button");
    checkButton.className = "checkgame-button";
    checkButton.id = "checkgame";
    checkButton.innerText = "Check Solution";
    checkButton.addEventListener("click", () => {
      checkGameRequest(gameID, playerID);

    });
    checkButtonContainer.appendChild(checkButton);
  });


  const gamePlayers= document.createElement("div");
  gamePlayers.className = "game-players-container-hide" ; 
  const showPlayers = document.createElement("button");
  showPlayers.className = "puzzle-button";
  showPlayers.innerText = "Views Players"
  

  showPlayers.addEventListener("click",()=>{
  
    gamePlayers.classList.toggle("game-players-container-reveal");
    removeAllChildNodes(gamePlayers);
    getPlayersRequest(gameID,gamePlayers);

  });



  gameContainerHeader.appendChild(gameH2);
  gameContainerHeader.appendChild(gameButton);
  gameContainerHeader.appendChild(showPlayers);


  gameContainer.appendChild(gameContainerHeader);
  gameContainer.appendChild(gamePlayers);

  gamesTable.appendChild(gameContainer);

  return gameID;
}

function forceLowerCase(val) {
  return val.toLowerCase();
}
function renderClues(words) {
  const clueBlock = document.getElementById("clues");

  const acrossH2 = document.createElement("h2");
  acrossH2.innerText = "ACROSS";

  const downH2 = document.createElement("h2");
  downH2.innerText = "DOWN";

  const acrossElements = document.createElement("div");
  const downElements = document.createElement("div");

  acrossElements.appendChild(acrossH2);
  downElements.appendChild(downH2);

  words.forEach((word) => {
    const clueH5 = document.createElement("h5");
    clueH5.style = "text-decoration:none";
    clueH5.innerText = word.id.toString() + ". " + word.clue;
    if (word.direction === "ACROSS") {
      acrossElements.appendChild(clueH5);
    } else {
      downElements.appendChild(clueH5);
    }
  });

  clueBlock.appendChild(acrossElements);
  clueBlock.appendChild(downElements);
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderGameData(gameID, playerID, puzzleData) {
  const grid = document.getElementById("grid");
    console.log("this is the puzzle data am",puzzleData);

  const gridTableContainer = document.getElementById("table");
  const cluesContainer = document.getElementById("clues");
  removeAllChildNodes(gridTableContainer);
  removeAllChildNodes(cluesContainer);

  const gridTable = document.createElement("table");

  for (let i = 0; i < puzzleData.rows; i += 1) {
    const gridRow = document.createElement("tr");
    gridRow.className = "grid-row";
    for (let j = 0; j < puzzleData.columns; j++) {
      const gridCell = document.createElement("td");
      gridCell.className = "grid-cell-black";
      gridRow.appendChild(gridCell);
    }

    gridTable.appendChild(gridRow);
  }

  var rows = gridTable.childNodes;

  function configureData(puzzleData) {
    var seen = new Set();

    puzzleData.words.forEach((word) => {
      if (word.direction === "ACROSS") {
        var name = word.word;
        var rowIndex = word.row;
        var colIndex = word.col;

        // get row and children for the start of the word
        var row = rows[rowIndex];
        var rowChildren = row.childNodes;
        // console.log(rowIndex,",",colIndex);
        for (let dy = 0; dy < name; dy++) {
          var coord = [rowIndex, colIndex + dy];
          if (!seen.has(JSON.stringify(coord))) {
            var cellChild = rowChildren[colIndex + dy];
            var cellDivTop = document.createElement("div");
            cellDivTop.className = "grid-cell-top";
            var cellDivRightSide = document.createElement("div");
            cellDivRightSide.className = "grid-cell-right";
            var cellDivLeftSide = document.createElement("div");
            cellDivLeftSide.className = "grid-cell-left";
            var cellDivBottomSide = document.createElement("div");
            cellDivBottomSide.className = "grid-cell-bottom";

            // cell input and label shenanigans
            var cellInput = document.createElement("input");
            cellInput.id =
              rowIndex.toString() + "," + (colIndex + dy).toString();
            cellInput.maxLength = "1";
            cellInput.className = "grid-cell-input";

            cellInput.onkeyup = (ev) => {
              ev.target.value = ev.target.value.toLowerCase();
              if (ev.target.value != "") {
                var url =
                  "http://" +
                  memoryGame.server +
                  "/enter/" +
                  gameID +
                  "/" +
                  playerID +
                  "/" +
                  ev.target.value +
                  "/" +
                  rowIndex +
                  "," +
                  (colIndex + dy);

                enterLetterRequest(url);
              } else {
                var url =
                  "http://" +
                  memoryGame.server +
                  "/erase/" +
                  gameID +
                  "/" +
                  playerID +
                  "/" +
                  rowIndex +
                  "," +
                  (colIndex + dy);

                eraseLetterRequest(url);
              }
            };

            // do the middle
            var middleDivSide = document.createElement("div");
            middleDivSide.appendChild(cellDivTop);
            middleDivSide.appendChild(cellInput);
            middleDivSide.appendChild(cellDivBottomSide);

            // add all the parts.
            cellChild.appendChild(cellDivLeftSide);
            cellChild.appendChild(middleDivSide);
            cellChild.appendChild(cellDivRightSide);
            cellChild.className = "grid-cell-white";
            seen.add(JSON.stringify(coord));
          }
        }
      } else {
        var name = word.word;
        var rowIndex = word.row;
        var colIndex = word.col;

        // console.log(rowIndex,",",colIndex);
        for (let dx = 0; dx < name; dx++) {
          //get row and children
          var row = rows[rowIndex + dx];
          var rowChildren = row.childNodes;
          var coord = [rowIndex + dx, colIndex];
          if (!seen.has(JSON.stringify(coord))) {
            var cellChild = rowChildren[colIndex];
            var cellDivTop = document.createElement("div");
            cellDivTop.className = "grid-cell-top";
            var cellDivRightSide = document.createElement("div");
            cellDivRightSide.className = "grid-cell-right";
            var cellDivLeftSide = document.createElement("div");
            cellDivLeftSide.className = "grid-cell-left";
            var cellDivBottomSide = document.createElement("div");
            cellDivBottomSide.className = "grid-cell-bottom";

            // cell input and label shenanigans
            var cellInput = document.createElement("input");
            cellInput.id =
              (rowIndex + dx).toString() + "," + colIndex.toString();
            cellInput.className = "grid-cell-input";
            cellInput.maxLength = "1";
            cellInput.onkeyup = (ev) => {
              ev.target.value = ev.target.value.toLowerCase();
              if (ev.target.value != "") {
                var url =
                  "http://" +
                  memoryGame.server +
                  "/enter/" +
                  gameID +
                  "/" +
                  playerID +
                  "/" +
                  ev.target.value +
                  "/" +
                  (rowIndex + dx) +
                  "," +
                  colIndex;

                enterLetterRequest(url);
              } else {
                var url =
                  "http://" +
                  memoryGame.server +
                  "/erase/" +
                  gameID +
                  "/" +
                  playerID +
                  "/" +
                  (rowIndex + dx) +
                  "," +
                  colIndex;

                eraseLetterRequest(url);
              }
            };
            // do the middle
            var middleDivSide = document.createElement("div");
            middleDivSide.appendChild(cellDivTop);
            middleDivSide.appendChild(cellInput);
            middleDivSide.appendChild(cellDivBottomSide);

            // add all the parts.
            cellChild.appendChild(cellDivLeftSide);
            cellChild.appendChild(middleDivSide);
            cellChild.appendChild(cellDivRightSide);
            cellChild.className = "grid-cell-white";
            seen.add(JSON.stringify(coord));
          }
        }
      }
    });
  }

  function configureLabels(puzzleData) {
    puzzleData.words.forEach((word) => {
      if (word.direction === "ACROSS") {
        var rowIndex = word.row;
        var colIndex = word.col;

        // get row and children for the start of the word
        var row = rows[rowIndex];
        var rowChildren = row.childNodes;
        var cellChild = rowChildren[colIndex];
        cellChild.childNodes[0].innerText =
          cellChild.childNodes[0].innerText + " " + word.id.toString();
      } else {
        var rowIndex = word.row;
        var colIndex = word.col;
        var row = rows[rowIndex];
        var rowChildren = row.childNodes;
        var cellChild = rowChildren[colIndex];
        cellChild.childNodes[1].childNodes[0].innerText =
          cellChild.childNodes[0].innerText + " " + word.id.toString();
      }
    });
  }

  configureData(puzzleData);
  configureLabels(puzzleData);

  for (let i = 0; i < puzzleData.rows; i += 1) {
    const gridRow = document.createElement("tr");
    gridRow.className = "grid-row";
    for (let j = 0; j < puzzleData.columns; j++) {
      const gridCell = document.createElement("td");
      gridCell.className = "grid-cell";
      gridRow.appendChild(gridCell);
    }

    gridTable.appendChild(gridRow);
  }

  gridTableContainer.appendChild(gridTable);
  grid.appendChild(gridTableContainer);
  renderClues(puzzleData.words);
}
