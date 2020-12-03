
/**
 *
 * A crossword Game class that implements a Web Game UI interface
 *
 */

class CrosswordGame{


    // Fields
      #server 
      #playerID 
    /**
     *
     * Renders a crossword game arcade interface on a web browser
     * 
     * Abstraction Function
     *    AF(server,playerID) =  user interface (UI) rendered on a web browser that can display the following:
     * 
     *               * - currents games running on the server on the Game UI
     *               * - current puzzles that are stored on the server
     *               * - the current board that a player has joined or created
     *               * - the set of players that have started playing this game
     *              
     *               where UI is a client of a server at address "http://" + {server}. The client is assigned 
     *                a random string {playerID}
     *            
     *
     * RI:
     * - server === "localhost:4949"
     * - playerID != null
     *
     * Safety from rep exposure
     * 
     * - every request function sends data as a string, which is immutable
     * - server is a string, so immutable
     * - server and playerID are private 
     * - 
     *
     * Thread safety argument
     * - it only depends on the local server implementation, which is threadsafe
     * - nothing is mutated here (all mutations happen on the server, which returns a response)
     * - added async/await when calling and declaring functions  
     */

    
    /**
     * 
     * Creates a crossword Game instance
     *  
     *  
     */
    constructor(){
     // get the open arcade buttons
     var serverBox = document.getElementById("crossword-server");
     var playButton = document.getElementById("crossword-play");
     this.#playerID = this.generatePlayerID() ;
     var root  = this;
     // get the server root {"localhost:4949"}
     if (serverBox) {
       serverBox.addEventListener("keypress", function (e) {
         if (e.keyCode == 13) {
           serverBox.blur();
        //    root.#server = serverBox.value;
           root.play(serverBox,playButton);
         }
       });
       if (playButton) {
         playButton.addEventListener("click", function () {
        //    this.#server = serverBox.value;
            // root.#server = serverBox.value;
            root.play(serverBox,playButton);
         });
       }
     }

     this.#checkRep();
          
    }
    /**
    *
    * Checks whether rep invariant has been violated
    *
    */

    #checkRep(){
       
      console.assert(this.#server === "localhost:4949","make sure server localaddress is on port 4949");
      console.assert(this.#playerID != null,"make sure playerID Is assigned");
      

    }

   /**
    *
    * Given a game server root, for example "localhost:8080",
    *
    * - Starts running the game for the client Webbrowser, by connecting to a server, whose address
    *   is given by  "http://{server}" , e.g. "http://localhost:8080"
    * - Displays the currents games running on the server on the Game UI
    * - Displays the current puzzles that are stored on the server
    * - Renders
    *
    * @param serverBox
    *  @param playButton
    *
    */
 
      async play(serverBox,playButton) {
       this.#server = serverBox.value;
       console.log("playing on server", this.#server);
       if (serverBox) {
         serverBox.disabled = true;
       }
       if (playButton) {
         playButton.disabled = true;
       }
       var welcomeContainer = document.getElementById("welcome-tag");
       welcomeContainer.innerText = "Welcome player : " + this.#playerID;
       await this.getPuzzles(this.#playerID);
       await this.getGamesRequest(this.#playerID);
     }
 
 
   /**
    *
    *
    * @returns a string representation of playerID, which represents a user who has opened their crossword arcade 
    *  on the browser and they are using the WEBUI to play crossword puzzle
    *  
    *
    */
     generatePlayerID(){
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
       return playerID
     }
    
  
 //////////////////////////    REQUESTS  TO SERVER      ///////////////////////
 
     /**
      *
      * Given a playerID,
      *
      * gets all the puzzles that are currently running on the server at address "http://{server}"  by making
      * a GET request to the the server
      *
      *  request url format : "http://" + this.#server + "/currentPuzzles")
      *
      * - The function also listens for a response from the server, and the response
      *   is expected to be in this example format :
      *
      *    "{ "id" : "0" ,"file" : "The smallest puzzle available", "name" : "The smallest puzzle available", "description" : "" };
      *    { "id" : "1" ,"file" : "A bigger Snow-White themed puzzle for the brave", "name" : "A bigger Snow-White themed puzzle for the brave", "description" : "" };
      *    { "id" : "2" ,"file" : "An easy puzzle to get started", "name" : "An easy puzzle to get started", "description" : "" }"
      *
      *
      * - also watches for errors that may arise/raised when making the request, or when an
      * invalid/unsuccessful response is given
      *
      *
      *
      * @param playerID
      *
      */
      async getPuzzles(playerID) {
       var req = new XMLHttpRequest();
       var root = this;
       req.addEventListener("load", function onPuzzleLoad() {
         console.log(
           "puzzles response",
            this.responseText.replace(/\r?\n/g, "\u21B5")
         );
         // splits the strings by regex
         var listOfStrings = this.responseText.split(";");
         var puzzleData = [];
         // parses each string
         listOfStrings.forEach((exp) => {
           if (exp !== "") {
             console.log(JSON.parse(exp));
             puzzleData.push(JSON.parse(exp));
           }
         });
         // uses it draw puzzles Table
         root.drawPuzzlesTable(puzzleData, playerID);
       });
 
       req.addEventListener("error", function onPuzzleError() {
         console.error("watch error", this.#server);
       });
       req.open("GET", "http://" + this.#server + "/currentPuzzles");
       req.send();
       this.#checkRep();
     }
 
 
     /**
      *
      * Given a gameID, and a dom (an html element to be rendered on the UI),
      *
      *
      * gets all the players that are currently playing the game with {gameID} running on the server at address "http://{server}"  by making
      * a GET request to the the server
      *
      *  request url format : "http://" + {server} + "/players/" + gameID
      *
      * - The function also listens for a response from the server, and the response
      *   is expected to be in this example format (as a string with playerID's seperated with a comma):
      *
      *    "shadrach,meshach,abednego,"
      *
      * - After the function gets the response, it now renders add those playerID's to a dom, as child html element
      *
      *
      * - also watches for errors that may arise/raised when making the request, or when an
      * invalid/unsuccessful response is given
      *
      *
      *
      * @param gameID - current game with {gameID} that the user wants to view players in
      * @param dom -  an html element to be rendered on the UI
      *
      *
      */
      async getPlayersRequest(gameID, dom) {
       var req = new XMLHttpRequest();
      
       req.addEventListener("load", function onPuzzleLoad() {
         console.log(
           "game data response",
           this.responseText.replace(/\r?\n/g, "\u21B5")
         );
         // split by regex
         var listOfStrings = this.responseText.split(",");
 
         var gameData = [];
         //parse
         listOfStrings.forEach((exp) => {
           if (exp !== "") {
             gameData.push(exp);
           }
         });
         // add to dom
         gameData.forEach((player) => {
           const tag = document.createElement("h4");
           tag.innerText = player;
           dom.appendChild(tag);
         });
       });
       req.addEventListener("error", function onPuzzleError() {
         console.error("watch error", this.#server);
       });
       req.open("GET", "http://" + this.#server + "/players/" + gameID);
       console.log("join request");
       req.send();
       this.#checkRep();
     }
 
     /**
      *
      * Given a gameID, and a playerID
      *
      *  Checks whether a currently rendered game is solved or not
      *
      *
      *  request url format : "http://" + {server} + "/check/" + {gameID} + "/" + {playerID}
      *
      * - The function also listens for a response from the server, and the response
      *   is expected to be in this example format
      *
      *    case 1: (if puzzle is solved)
      *        "solved"
      *
      *    case 2 : (if puzzle is not solved)
      *       "{ "row": "0", "column" : "0" };{ "row": "1", "column" : "2" };{ "row": "2", "column" : "4" };"
      *      - returns representation of board positions corresponding to {row} number {column} number of cells that
      *         have been erased on the game running on the server, since they were incorrect
      *
      * - After the function gets the response, it now refreshes the board by visibly erasing the characters at
      * those positions on the WEBUI in the browser
      *
      * - also watches for errors that may arise/raised when making the request, or when an
      * invalid/unsuccessful response is given
      *
      *
      *
      * @param gameID - current game with {gameID} that the user wants to view players in
      * @param playerID-  an html element to be rendered on the UI
      *
      *
      */
 
     async checkGameRequest(gameID, playerID) {
       var req = new XMLHttpRequest();
       var root = this;
       req.addEventListener("load", async function onPuzzleLoad() {
         console.log(
           "game data response",
           this.responseText.replace(/\r?\n/g, "\u21B5")
         );
         
         if (this.responseText.includes("solved")) {
           const gameStatusContainer = document.getElementById("game-status");
           gameStatusContainer.innerText = "Solved";
           gameStatusContainer.style.color = "#556b2f";
         } else {
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
 
           await root.colorInvalidAnswers(gameData);
         }
       });
 
       req.addEventListener("error", function onPuzzleError() {
         console.error("watch error", root.#server);
       });
       req.open(
         "GET",
         "http://" + this.#server + "/check/" + gameID + "/" + playerID
       );
       console.log("join request");
       req.send();
       this.#checkRep();
     }
 
     /**
      *
      * Given an a url,  which is a {server} endpoint
      *
      * Makes a GET request to the {server} using that endpoint, to modify a cell at position {row,column} on the
      * game board. The modification is an addition of cell value {letter} at a cell with position {row,column} on the gameBoard
      *
      *  request url format : "http://" + {server} + "/enter/" + {gameID} + "/" + {playerID} +"/" + {letter} + "/" + {row,column}
      *
      *   where
      *     -  {server}  -  current server on which the game with {gameID} is running
      *     - {playerID} - (assigned by Web Client) making the request
      *     -  {letter} -  answer guessed in the form of a single alphabetical letter [a-z]
      *     -  {row,column} - represents the row number and column number of the cell to be modified
      *
      *
      * - server will respond with a string based on the success of the request
      *     case 1 (successful) :
      *       "Successful"
      *
      *     case 2 (unsuccessful):
      *       "Go away " + {playerID} + " wanting to play " + {gameID}
      *
      *
      * - also watches for errors that may arise/raised when making the request, or when an
      * invalid/unsuccessful response is given
      *
      *
      * @param url - server endpoint at which we make a GET request
      *
      *
      *
      */
 
     async enterLetterRequest(url) {
       var req = new XMLHttpRequest();
 
       req.addEventListener("load", function onPuzzleLoad() {
         console.log("game response", this.responseText.replace(/\r?\n/g, "\u21B5"));
       });
 
       req.addEventListener("error", function onPuzzleError() {
         console.error("watch error", this.#server);
       });
 
       req.open("GET", url);
       console.log("enter letter request request");
       req.send();
       this.#checkRep();
     }
 
     /**
      *
      * Given an a url,  which is a {server} endpoint
      *
      * Makes a GET request to the {server} using that endpoint, to modify a cell at position {row,column} on the
      * game board. The modification is an erasure of cell value at a cell with position {row,column} on the gameBoard
      *
      *  request url format : "http://" + {server} + "/enter/" + {gameID} + "/" + {playerID} +"/" + {letter} + "/" + {row,column}
      *
      *   where
      *     -  {server}  -  current server on which the game with {gameID} is running
      *     - {playerID} - (assigned by Web Client) making the request
      *     -  {letter} -  answer guessed in the form of a single alphabetical letter [a-z]
      *     -  {row,column} - represents the row number and column number of the cell to be modified
      *
      *
      * - server will respond with a string based on the success of the request
      *     case 1 (successful) :
      *       "Successful"
      *
      *     case 2 (unsuccessful):
      *       "Go away " + {playerID} + " wanting to play " + {gameID}
      *
      *
      * - also watches for errors that may arise/raised when making the request, or when an
      * invalid/unsuccessful response is given
      *
      *
      * @param url - server endpoint at which we make a GET request
      *
      *
      */
 
     async eraseLetterRequest(url) {
       var req = new XMLHttpRequest();
       req.addEventListener("load", function onPuzzleLoad() {
         console.log("game response", this.responseText.replace(/\r?\n/g, "\u21B5"));
       });
 
       req.addEventListener("error", function onPuzzleError() {
         console.error("watch error", this.#server);
       });
 
       req.open("GET", url);
       console.log("erase letter request request");
       req.send();
       this.#checkRep();
     }
 
     /**
      *
      * Given a gameID, and a playerID
      *
      *   makes a GET request to {server}
      *
      *   request url format : "http://" + {server} + "/join/" + {gameID} + "/" + {playerID}
      *
      *  The request is made by a player with {playerID} (assigned by WEBUI client)
      *
      *
      * - server will respond with a string based on the success of the request
      *
      *     case 1 (successful request) :
      *         returns game user interface data in this form, (example)
      *           [broken up here so that it's easily readable, but it's usually one compact string]
      *
      *        { "row" : "0", "col" : "1","value" : ""};{ "row" : "0", "col" : "2","value" : ""};
      *        { "row" : "0", "col" : "3","value" : ""};{ "row" : "1", "col" : "0","value" : ""};
      *        { "row" : "1", "col" : "1","value" : ""};{ "row" : "1", "col" : "2","value" : ""};
      *       { "row" : "2", "col" : "1","value" : ""};{ "row" : "2", "col" : "2","value" : ""};
      *        { "row" : "2", "col" : "3","value" : ""};
      *
      *     case 2 (unsuccessful request):
      *       "Go away " + {playerID} + " wanting to play " + {gameID}
      *
      *
      * - After the function gets the response, it now refreshes the board by rendering the current state of
      * the board of the game with {gameID} running on the {server}
      *
      * - also watches for errors that may arise or are raised when making the request, or when an
      * invalid/unsuccessful response is given
      *
      *
      *
      * @param gameID - current game with {gameID} that the user wants to view players in
      * @param playerID-  an html element to be rendered on the UI
      *
      *
      */
      async joinGameRequest(gameID, playerID) {
       var req = new XMLHttpRequest();
       var root = this;
       req.addEventListener("load",async function onPuzzleLoad() {
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
         root.fillInGameData(gameData);
       });
       req.addEventListener("error", function onPuzzleError() {
         console.error("watch error", root.#server);
       });
       req.open(
         "GET",
         "http://" + this.#server + "/join/" + gameID + "/" + playerID
       );
       console.log("join request");
       req.send();
       this.#checkRep();
     }
 
     /**
      *
      * Given a gameID, and a playerID
      *
      *  Gets the data of what a game puzzle consists of.
      *  Data has the following components
      *
      *     - number of rows,
      *
      *     - number of columns,
      *
      *     - a game entry ()
      *
      *         -  which consists of (id, clue, row, column, answerLength,direction)
      *
      *         -  id = id of the entry for that specific {puzzleID}
      *
      *         -  answer = the answer to the be guessed (but is no where in this function or on the UI immplementation
      *                       because client is not supposed to have access to it,therefore we have the answerLength instead, which is the length of the {answer} string)
      *
      *         -  clue  =   a string of a clue
      *
      *         -  row,column = starting position of {answer} with {answerLength}
      *
      *         -  direction = the direction in which {answer} should be aligned and this {direction} string is supposed to havetwo values : "DOWN" or "ACROSS"
      *
      *
      * - request url format :  "http://" + {server} + "/puzzle/" + {puzzleID};
      *
      * - The function also listens for a response from the server, and the response
      *   is expected to be in this example format
      *
      *      * Format Example (usually in a single line, but for the purposes of readability) :
      *        "{ "rows" : "4"};
      *        { "columns" : "5"};
      *        {  "id" : "0", "row" : "0","col" : "1", "word" : "3", "direction" : "DOWN", "clue" : "feline companion"};
      *        {  "id" : "2", "row" : "0","col" : "1", "word" : "3", "direction" : "ACROSS", "clue" : "gas powered vehicle"};"
      *
      * - After the function gets the response, it parses it and uses data in this json format
      *     to render a game board
      *
      *        format :
      *            {
      *               rows : 4,
      *               columns : 5,
      *               words : [
      *
      *                    {
      *                      id : 0,
      *                      row : 0,
      *                      col  : 1,
      *                      word :  3
      *                      direction  "DOWN"
      *                      clue : "feline companion",
      *
      *                    },               {
      *                      id : 2,
      *                      row : 0,
      *                      col  : 1,
      *                      word : 3,
      *                      direction  "ACROSS"
      *                      clue : "gas powered vehicle",
      *
      *                    },
      *                 ]
      *               }
      *
      *
      * - also watches for errors that may arise/raised when making the request, or when an
      * invalid/unsuccessful response is given
      *
      *
      *
      * @param gameID - current game with {gameID} that the user wants to view players in
      * @param playerID-  an html element to be rendered on the UI
      * @param puzzleID - the id of the puzzle on {server} that the game with {gameID} is based on
      *
      *
      */
 
     async getPuzzleUIRequest(gameID, playerID, puzzleID) {
       var req = new XMLHttpRequest();
       var root = this;
       req.addEventListener("load", async function onPuzzleLoad() {
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
 
        root.renderGameData(gameID, playerID, actualGameData);
       });
 
       req.addEventListener("error", function onPuzzleError() {
         console.error("watch error", this.#server);
       });
       req.open("GET", "http://" + this.#server + "/puzzle/" + puzzleID);
       console.log("puzzle UI request");
       req.send();
       this.#checkRep();
     }
 
     /**
      *
      * Given a  playerID (assigned by WEBCLIENT)
      *
      *  get the games that a player with {playerID} is currently playing
      *
      *  request url format : "http://" + {server} + "/currentGames"
      *
      *
      * - The function also listens for a response from the server, and the response
      *   is expected to be in this example format
      *
      *      Format : "{ "gameID" : "parrot_ca_e90", "puzzleID" :  "2" };{ "gameID" : "parr_caew_90", "puzzleID" :  "1" }""
      *
      * - After the function gets the response, it parses it into this json format
      *       Format : [{
      *                 gameID : "parrot_ca_e90",
      *                 puzzleID :  "2"
      *                },{
      *                 gameID :  "parr_caew_90",
      *                 puzzleID :  1
      *                },
      *                   ]
      *  -  the json formatted data is then used to the relevant game data : see :
      *
      *
      *
      * - also watches for errors that may arise/raised when making the request, or when an
      * invalid/unsuccessful response is given
      *
      *
      *
      * @param gameID - current game with {gameID} that the user wants to view players in
      * @param playerID-  an html element to be rendered on the UI
      *
      *
      */
 
     async getGamesRequest(playerID) {
       var req = new XMLHttpRequest();
       var root = this;
       req.addEventListener("load", async function onPuzzleLoad() {
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
           root.drawGames(playerID, gamesData);
         }
       });
 
       req.addEventListener("error", function onPuzzleError() {
         console.error("watch error", this.#server);
       });
       req.open("GET", "http://" + this.#server + "/currentGames");
       console.log("games request");
       req.send();
       this.#checkRep();
     }
 
     /**
      *
      * Given a  playerID (assigned by WEBCLIENT), puzzleID (assigned by local server), gameID (assigned by WEBCLIENT)
      *
      *  Creates a game with {gameID} based on a puzzle with {puzzleID} on the local server running at address "http://" + {server}, with initial player with {playerID}
      *  by making a GET request, with
      *  request url format : "http://" + {server} +  "/new/" + {puzzleID} + "/" + {gameID} + "/" + {playerID}
      *
      *
      * - The function also listens for a response from the server, and the response
      *   is expected to be in this example format
      *
      *      case 1 (successful request) :
      *
      *           returns game state user interface data in this form, (example)
      *           [broken up here so that it's easily readable, but it's usually one compact string]
      *
      *        { "row" : "0", "col" : "1","value" : ""};{ "row" : "0", "col" : "2","value" : ""};
      *        { "row" : "0", "col" : "3","value" : ""};{ "row" : "1", "col" : "0","value" : ""};
      *        { "row" : "1", "col" : "1","value" : ""};{ "row" : "1", "col" : "2","value" : ""};
      *       { "row" : "2", "col" : "1","value" : ""};{ "row" : "2", "col" : "2","value" : ""};
      *        { "row" : "2", "col" : "3","value" : ""};
      *
      *      case 2 (unsuccessful request) :
      *
      *            response = "Go away " + playerID + " wanting to play " + puzzleID;
      *
      *
      *
      * - also watches for errors that may arise/raised when making the request, or when an
      * invalid/unsuccessful response is given
      *
      *
      *
      * @param gameID - current game with {gameID} that the user wants to view players in
      * @param playerID-  an html element to be rendered on the UI
      *
      *
      */
 
     async createGameRequest(puzzleID, gameID, playerID) {
       var req = new XMLHttpRequest();
       var root = this;
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
         console.error("watch error", root.#server);
       });
       req.open(
         "GET",
         "http://" +
           this.#server +
           "/new/" +
           puzzleID +
           "/" +
           gameID +
           "/" +
           playerID
       );
       console.log("puzzles request");
       req.send();
       this.#checkRep();
     }
 
     /**
      *
      *  Given a  playerID (assigned by WEBCLIENT), gameID (assigned by WEBCLIENT)
      *  "watches" the board, by listening for board changes by making a continuous
      *   GET requests, seperated by a millisecond , with format
      *
      *
      *      format url :  "http://" + {server} + "/watch/" + {gameID} + "/" + {playerID}
      *
      * - also makes a simultaneous "look" request
      *
      *  - Board changes include:
      *       - a player has erased a letter
      *       - a player has entered a letter in the input box
      *       - a player has clicked the "Check Solved" button to check whether the puzzle is solved.
      *
      *
      * - The function also listens for a response from the server, and the response
      *   is expected to be in this example format
      *
      *
      *      case 1 (successful request) :
      *             returns game state user interface data in this form, (example)
      *           [broken up here so that it's easily readable, but it's usually one compact string]
      *
      *        { "row" : "0", "col" : "1","value" : ""};{ "row" : "0", "col" : "2","value" : ""};
      *        { "row" : "0", "col" : "3","value" : ""};{ "row" : "1", "col" : "0","value" : ""};
      *        { "row" : "1", "col" : "1","value" : ""};{ "row" : "1", "col" : "2","value" : ""};
      *       { "row" : "2", "col" : "1","value" : ""};{ "row" : "2", "col" : "2","value" : ""};
      *        { "row" : "2", "col" : "3","value" : ""};
      *
      *      case 2 (unsuccessful request) :
      *
      *            response = "Go away " + {gameID}
      *
      * - The server response is the current board's state returned from the local server with address "http://"+ {server}
      *
      *
      * - also watches for errors that may arise/raised when making the request, or when an
      * invalid/unsuccessful response is given
      *
      *
      *
      * @param gameID - current game with {gameID} that the player is playing
      * @param playerID-  current player making the request
      *
      *
      */
 
     async watchAndLook(gameID, playerID) {
       var req = new XMLHttpRequest();
       var root = this;
       req.addEventListener("load", async function onWatchLoad() {
         console.log(
           "watch response",
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
         await root.fillInGameData(gameData);
         setTimeout(async() => {
           console.log("sending for more data");
           await root.watchAndLook(gameID, playerID);
         }, 1);
       });
       req.addEventListener("loadstart", function onWatchStart() {
         console.log("watch start");
         setTimeout(() => {
           root.look(gameID, playerID);
         }, 1);
       });
       req.addEventListener("error", function onWatchError() {
         console.error("watch error", this.#server);
       });
       req.open(
         "GET",
         "http://" + this.#server + "/watch/" + gameID + "/" + playerID
       );
       console.log("sending watch request");
       req.send();
       this.#checkRep();
     }
 
     /**
      *
      *  Given a  playerID (assigned by WEBCLIENT), gameID (assigned by WEBCLIENT)
      *
      *   Gets the current state of the board being rendered on the player (with {playerID}) 's Web User Interface
      *
      *   by making a  GET request  with format
      *
      *      format url :  "http://" + {server} + "/look/" + {gameID}
      *
      *
      * - The function also listens for a response from the server, and the response
      *   is expected to be in this example format
      *
      *
      *      case 1 (successful request) :
      *             returns game state user interface data in this form, (example)
      *           [broken up here so that it's easily readable, but it's usually one compact string]
      *
      *        { "row" : "0", "col" : "1","value" : ""};{ "row" : "0", "col" : "2","value" : ""};
      *        { "row" : "0", "col" : "3","value" : ""};{ "row" : "1", "col" : "0","value" : ""};
      *        { "row" : "1", "col" : "1","value" : ""};{ "row" : "1", "col" : "2","value" : ""};
      *       { "row" : "2", "col" : "1","value" : ""};{ "row" : "2", "col" : "2","value" : ""};
      *        { "row" : "2", "col" : "3","value" : ""};
      *
      *      case 2 (unsuccessful request) :
      *
      *            response = "Go away " + {gameID}
      *
      * - The server response is the current board's state returned from the local server with address "http://"+ {server}
      *
      * - also watches for errors that may arise/raised when making the request, or when an
      * invalid/unsuccessful response is given
      *
      *
      *
      * @param gameID - current game with {gameID} that the player is playing
      * @param playerID-  current player making the request
      *
      *
      */
 
     async look(gameID, playerID) {
       var req = new XMLHttpRequest();
       var root = this;
       req.addEventListener("load",async function onLookLoad() {
         console.log("look response", this.responseText.replace(/\r?\n/g, "\u21B5"));
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
         await root.fillInGameData(gameData);
       });
       req.addEventListener("error", function onLookError() {
         console.error("look error", this.#server);
       });
       req.open(
         "GET",
         "http://" + this.#server + "/look/" + gameID + "/" + playerID
       );
       console.log("sending look request");
       req.send();
       this.#checkRep();
     }
 
 //////////////////////////    HTML/JS UI ELEMENTS : MUTATORS     ///////////////////////
 
     /**
      *
      * Given puzzleData , playerID
      *
      *  renders the puzzleData on WEBUI in this way see : https://www.dropbox.com/s/4jw0apyhqw52a6w/puzzles.png?dl=0
      *
      * @param puzzleData - puzzleData a list of json puzzle representations, which each rep is in the form
      *   ,for example,
      *    {
      *     id :  1,
      *      name :  "snowWhite puzzle",
      *      description :  "a puzzle based on the snow white disney movie"}
      *
      * @param playerID - the playerID assigned previously by the webbrowser client
      *
      *
      *
      */
 
     async drawPuzzlesTable(puzzleData, playerID) {
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
           puzzleButton.addEventListener("click", async() => {
             var gameID = await this.createGame(piece.id, playerID);
             let promise = await this.createGameRequest(piece.id, gameID, playerID);
             
           });
 
           puzzleButton.className = "puzzle-button";
 
           puzzleContainer.appendChild(puzzleH2);
           puzzleContainer.appendChild(puzzleButton);
 
           puzzlesTable.appendChild(puzzleContainer);
         });
       }
       this.#checkRep();
     }
 
     /**
      *
      * Given gameData , playerID
      *
      *  renders the gameData on WEBUI in this way see : https://www.dropbox.com/s/nuscfvtoat7fbt0/games.png?dl=0
      *
      *
      * @param gameData - a list of json puzzle representations, which each rep is in the form
      *
      *    Format : [{
      *                 gameID : "parrot_ca_e90",
      *                 puzzleID :  "2"
      *                },{
      *                 gameID :  "parr_caew_90",
      *                 puzzleID :  1
      *                },
      *                   ]
      *
      * @param playerID - the playerID assigned previously by the webbrowser client
      *
      *
      *
      */
 
     async drawGames(playerID, gameData) {
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
 
         gameButton.addEventListener("click", async() => {
           this.getPuzzleUIRequest(game.gameID, playerID, game.puzzleID);
           this.joinGameRequest(game.gameID, playerID);
           // checkGameRequest(game.gameID, playerID);
           await this.watchAndLook(game.gameID, playerID);
 
           const checkButtonContainer = document.getElementById(
             "checkgame-button-container"
           );
           this.removeAllChildNodes(checkButtonContainer);
           const checkButton = document.createElement("button");
           checkButton.addEventListener("click", () => {
             this.checkGameRequest(game.gameID, playerID);
           });
           checkButton.className = "checkgame-button";
           checkButton.id = "checkgame";
           checkButton.innerText = "Check Solution";
           checkButtonContainer.appendChild(checkButton);
         });
 
         const gamePlayers = document.createElement("div");
         gamePlayers.className = "game-players-container-hide";
         const showPlayers = document.createElement("button");
         showPlayers.className = "puzzle-button";
         showPlayers.innerText = "Views Players";
 
         showPlayers.addEventListener("click", async() => {
           gamePlayers.classList.toggle("game-players-container-reveal");
           await this.removeAllChildNodes(gamePlayers);
           await this.getPlayersRequest(game.gameID, gamePlayers);
         });
 
         gameContainerHeader.appendChild(gameH2);
         gameContainerHeader.appendChild(gameButton);
         gameContainerHeader.appendChild(showPlayers);
 
         gameContainer.appendChild(gameContainerHeader);
         gameContainer.appendChild(gamePlayers);
 
         gamesTable.appendChild(gameContainer);
       });
       this.#checkRep();
     }
 
     /**
      *
      * Given root,
      *
      *  changes the backgroud-color to a color with hex value "#ff7f7f";
      *
      * @param root -  an html element
      *
      *
      */
 
      colorChange(root) {
       var colors = ["#ff7f7f"];
       colors.forEach((color) => {
         root.style.backgroundColor = color;
       });
     }
 
     /**
      *
      * Given gameData,
      *
      *
      * @param gameData - a list of json board row positions, in the form
      *       [ { row : 0 , column : 0  },{ row: 1, column : 2 }]
      *
      *      - representation of board positions corresponding to {row} number {column} number of cells that
      *         have been erased on the game running on the server, since they were incorrect
      *      -  colors the cells at those input for about 3 seconds, before erasing the text
      *      -  see : https://www.dropbox.com/s/4jw0apyhqw52a6w/puzzles.png?dl=0
      *
      *
      *
      */
 
     async colorInvalidAnswers(gameData) {
       gameData.forEach((game) => {
         var row = game.row;
         var col = game.column;
         var cellID = row + "," + col;
         var cellInput = document.getElementById(cellID);
         cellInput.className = "grid-cell-input-color";
         /**
          *
          * resets the color of a cell to white, and erases its text
          *
          */
         function resetColor() {
           cellInput.className = "grid-cell-input";
           cellInput.value = "";
         }
         setTimeout(resetColor, 3000);
       });
       this.#checkRep();
     }
 
     /**
      *
      * Given gameData
      *
      *  @param gameData - a list of json board row positions, in the form
      *       [ { row : 0 , column : 0 , value : "a"  },{ row: 1, column : 2 , value : "d"}]
      *
      *  fills the squares at positions {row,column} with the letter referenced by {value}
      *
      *
      */
 
     async fillInGameData(gameData) {
       gameData.forEach((game) => {
         var row = game.row;
         var col = game.col;
         var cellID = row + "," + col;
         var cellInput = document.getElementById(cellID);
         if (cellInput) {
           cellInput.value = game.value;
         }
       });
       this.#checkRep();
     }
 
     /**
      *
      * Given puzzleID , playerID
      *
      *  creates a game instance  on the WEBUI running a couple of tasks :
      *
      *    1)  generate a random gameID for the game to be created
      *    2)  send a GET request to server for the game to be created on the server i.e. call createGameRequest(puzzleID,playerID,gameID)
      *    3)  add the game to the list of active games on the UI : see  https://www.dropbox.com/s/nuscfvtoat7fbt0/games.png?dl=0
      *
      *
      *
      * @param puzzleID - an integer puzzleID assigned by the server, that the game is modelled after
      * @param playerID - the playerID assigned previously by the webbrowser client, that is creating the game
      * @returns gameID -  the gameID it generated
      *
      *
      */
 
     async createGame(puzzleID, playerID) {
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
       gameButton.addEventListener("click", async() => {
         await this.getPuzzleUIRequest(gameID, playerID, puzzleID);
         await this.joinGameRequest(gameID, playerID);
         await this.watchAndLook(gameID, playerID);
 
         const checkButtonContainer = document.getElementById(
           "checkgame-button-container"
         );
         await this.removeAllChildNodes(checkButtonContainer);
         const checkButton = document.createElement("button");
         checkButton.className = "checkgame-button";
         checkButton.id = "checkgame";
         checkButton.innerText = "Check Solution";
         checkButton.addEventListener("click", () => {
           this.checkGameRequest(gameID, playerID);
         });
         checkButtonContainer.appendChild(checkButton);
       });
 
       const gamePlayers = document.createElement("div");
       gamePlayers.className = "game-players-container-hide";
       const showPlayers = document.createElement("button");
       showPlayers.className = "puzzle-button";
       showPlayers.innerText = "Views Players";
 
       showPlayers.addEventListener("click", async() => {
         gamePlayers.classList.toggle("game-players-container-reveal");
         await this.removeAllChildNodes(gamePlayers);
         await this.getPlayersRequest(gameID, gamePlayers);
       });
 
       gameContainerHeader.appendChild(gameH2);
       gameContainerHeader.appendChild(gameButton);
       gameContainerHeader.appendChild(showPlayers);
 
       gameContainer.appendChild(gameContainerHeader);
       gameContainer.appendChild(gamePlayers);
 
       gamesTable.appendChild(gameContainer);
       this.#checkRep();
       return gameID;
     }
 
     /**
      *
      * Given val,
      *  returns the lowercase representation of val
      *
      *
      * @param val - a string value
      * @returns val in lowercase
      *
      */
 
     forceLowerCase(val) {
       return val.toLowerCase();
     }
 
     /**
      *
      * Given words
      *
      * @param words -  a list of game entries with json format
      *
      *               words : [
      *
      *                    {
      *                      id : 0,
      *                      row : 0,
      *                      col  : 1,
      *                      word :  3
      *                      direction  "DOWN"
      *                      clue : "feline companion",
      *
      *                    },               {
      *                      id : 2,
      *                      row : 0,
      *                      col  : 1,
      *                      word : 3,
      *                      direction  "ACROSS"
      *                      clue : "gas powered vehicle",
      *
      *                    },
      *                 ]
      *
      * renders the clues beside the current puzzle that has those clues, on the WEB UI see : https://www.dropbox.com/s/4jw0apyhqw52a6w/puzzles.png?dl=0
      *
      *
      *
      */
 
     async renderClues(words) {
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
       this.#checkRep();
     }
     /**
      *
      * Given parent, an HTML element, removed all child nodes (child html elements) that belong to {parent}
      *
      *  @param parent - an html element
      *
      */
 
     async removeAllChildNodes(parent) {
       while (parent.firstChild) {
         parent.removeChild(parent.firstChild);
       }
       this.#checkRep();
     }
 
     /**
      *
      * Given puzzleData , playerID , gameID
      *
      *  renders a blank game on (playerID)'s WEBUI based on puzzleData of a specific puzzle,
      *  see : https://www.dropbox.com/s/rqe0r7rfi7s7ijv/blankCrossword.png?dl=0
      *
      * @param puzzleData - a json puzzle representation ,
      *          {
      *               rows : 4,
      *               columns : 5,
      *               words : [
      *                    {
      *                      id : 0,
      *                      row : 0,
      *                      col  : 1,
      *                      word :  3
      *                      direction  "DOWN"
      *                      clue : "feline companion",
      *
      *                    },               {
      *                      id : 2,
      *                      row : 0,
      *                      col  : 1,
      *                      word : 3,
      *                      direction  "ACROSS"
      *                      clue : "gas powered vehicle",
      *
      *                    },
      *                 ]
      *               }
      *
      *         where ;
      *             rows :  number of rows in puzzle
      *             columns : number of columns in puzzle
      *             words :  a list of game entries(without answers) in json format
      *
      *  @param gameID - the gameID assigned previously by the webbrowser client
      *  @param playerID - the playerID assigned previously by the webbrowser client
      *
      *
      *
      */
 
      async renderGameData(gameID, playerID, puzzleData) {
       const grid = document.getElementById("grid");
       console.log("this is the puzzle data am", puzzleData);
 
       const gridTableContainer = document.getElementById("table");
       const cluesContainer = document.getElementById("clues");
       await this.removeAllChildNodes(gridTableContainer);
       await this.removeAllChildNodes(cluesContainer);
 
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
       var root = this;
 
       var rows = gridTable.childNodes;
 
       /**
        *
        * Helper function to renderGameData which does the cell tiling
        *
        * @param puzzleData - a json puzzle representation ,
        *          {
        *               rows : 4,
        *               columns : 5,
        *               words : [
        *                    {
        *                      id : 0,
        *                      row : 0,
        *                      col  : 1,
        *                      word :  3
        *                      direction  "DOWN"
        *                      clue : "feline companion",
        *
        *                    },               {
        *                      id : 2,
        *                      row : 0,
        *                      col  : 1,
        *                      word : 3,
        *                      direction  "ACROSS"
        *                      clue : "gas powered vehicle",
        *
        *                    },
        *                 ]
        *               }
        *
        *         where ;
        *             rows :  number of rows in puzzle
        *             columns : number of columns in puzzle
        *             words :  a list of game entries(without answers) in json format
        *
        */
       async function configureData(puzzleData) {
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
 
                 cellInput.onkeyup = async(ev) => {
                   ev.target.value = ev.target.value.toLowerCase();
                   if (ev.target.value != "") {
                     var url =
                       `http://${root.#server}/enter/${gameID}/${playerID}/${ev.target.value}/${rowIndex},${colIndex + dy}`;
 
                     await root.enterLetterRequest(url);
                   } else {
                     var url =
                       `http://${root.#server}/erase/${gameID}/${playerID}/${rowIndex},${colIndex + dy}`;
 
                     await root.eraseLetterRequest(url);
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
                 cellInput.onkeyup = async (ev) => {
                   ev.target.value = ev.target.value.toLowerCase();
                   if (ev.target.value != "") {
                     var url =
                       `http://${root.#server}/enter/${gameID}/${playerID}/${ev.target.value}/${rowIndex + dx},${colIndex}`;
 
                     await root.enterLetterRequest(url);
                   } else {
                     var url =
                       `http://${root.#server}/erase/${gameID}/${playerID}/${rowIndex + dx},${colIndex}`;
 
                     await root.eraseLetterRequest(url);
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
       /**
        *
        * Given puzzleData, assigns entry id labels to grid cells at starting
        *  positions {row,col}
        *
        *  see : https://www.dropbox.com/s/vuhbxmgzq0j65i9/gridCell.png?dl=0
        *
        * @param puzzleData - a json puzzle representation ,
        *          {
        *               rows : 4,
        *               columns : 5,
        *               words : [
        *                    {
        *                      id : 0,
        *                      row : 0,
        *                      col  : 1,
        *                      word :  3
        *                      direction  "DOWN"
        *                      clue : "feline companion",
        *
        *                    },               {
        *                      id : 2,
        *                      row : 0,
        *                      col  : 1,
        *                      word : 3,
        *                      direction  "ACROSS"
        *                      clue : "gas powered vehicle",
        *
        *                    },
        *                 ]
        *               }
        *
        *         where ;
        *             rows :  number of rows in puzzle
        *             columns : number of columns in puzzle
        *             words :  a list of game entries(without answers) in json format
        *
        */
       async function configureLabels(puzzleData) {
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
 
       await configureData(puzzleData);
       await configureLabels(puzzleData);
 
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
       await this.renderClues(puzzleData.words);
       this.#checkRep();
     }
     
 
 
 
 }


 