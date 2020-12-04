/**
 * @jest-environment jsdom
 */
const CrosswordGame = require("./crosswordTest.js");




//
//
// Testing Doc for CrosswordGame,
//  -  automatic tests  
//  -  manual tests
//    - manual tests are mock of how the requests get data from the url endpoint
// 


/**
 * 
 * Testing strategy
 * testing the following functions:
 * 
 * 
 * - constructor(playerID,server)
 *     partition on playerID and server ID:  
 *           1) both playerID and serverID self assigned by constructor
 *           2) both playerID and serverID manually assigned by test
 *           3) playerID self assigned by the constructor, serverID is not 
 *           4) serverID is self assigned by the constructor, playerID is not 
 *  
 * - play(serverBox,playButton)
 *      1) serverBox is not available
 *      2) playButton is not available
 * 
 * - getPuzzles(playerID)
 *      - partition on playerID
 *           1) playerID exists in game, playerID does not exist in game
 * 
 *       
 * - getPlayersRequest(gameID, dom) 
 *       - partition on gameID
 *           1) gameID exists on server, gameID does not exist on server
 *             
 *     
 *
 * - checkGameRequest(gameID, playerID)
 *       - partition on gameID
 *           1) gameID exists on server, gameID does not exist on server
 *          
 * 
 * 
 * - enterLetterRequest(url)
 *        - url is in format : "http://" + {server} + "/enter/" + {gameID} + "/" + {playerID} +"/" + {letter} + "/" + {row,column}
 *        -  therefore varying any paramter could produce a valid or invalid request
 *        - partition on url 
 *             1) valid url, invalid url 
 *           
 *  
 * 
 * - eraseLetterRequest(url)
 *        - url is in format : "http://" + {server} + "/enter/" + {gameID} + "/" + {playerID} +"/" + {letter} + "/" + {row,column}
 *        -  therefore varying any paramter could produce a valid or invalid request
 *        - partition on url 
 *             1) valid url, invalid url 
 * 
 * - joinGameRequest(gameID, playerID)
 *       - partition on gameID
 *           1) gameID exists on server, gameID does not exist on server
 *       - partition on playerID
 *           2) playerID exists on server, playerID does exist on server 
 * 
 * - getPuzzleUIRequest(gameID, playerID, puzzleID)
 * 
 *       - partition on gameID
 *           1) gameID exists on server, gameID does not exist on server
 *       - partition on playerID
 *           2) playerID exists on server, playerID does exist on server 
 * 
 * - getGamesRequest(playerID)
 * 
 *        - partition on playerID
 *           2) playerID exists on server, playerID does exist on server 
 * 
 * 
 * - createGameRequest(puzzleID, gameID, playerID)
 * 
 *      - partition on gameID
 *           1) gameID exists on server, gameID does not exist on server
 *       - partition on playerID
 *           1) playerID exists on server, playerID does exist on server 
 *       - partition on puzzleID
 *           1) puzzleID exists on server, puzzleID does not exist on server
 *     
 * 
 * - watchAndLook(gameID, playerID)
 * 
 *       - partition on gameID
 *           1) gameID exists on server, gameID does not exist on server

 * 
 * - look(gameID, playerID)
 * 
 *       - partition on gameID
 *           1) gameID exists on server, gameID does not exist on server
 * 
 * 
 * 
 * - UI functions 
 *  
 *  createGame(puzzleID,playerID)
 *        - partition on puzzleID
 *            -puzzleID is on board or not
 *            
 *      
 * 
 */


 // covers :
 // partition on playerID, serverID 
 //          1) both playerID and serverID self assigned by constructor


 test('testConstructor :  both playerID and serverID self assigned by constructor', () => {

    var crossWordGame = new CrosswordGame();
    var server = crossWordGame.getServerAssigned();
    var playerID = crossWordGame.getPlayerID();

    expect(server).toBe("localhost:4949");
    expect(typeof playerID).toBe("string") 
    
 });

 // covers :
 // partition on playerID, serverID 
 //    2) both playerID and serverID manually assigned by test

 test('testGetPuzzlesUI : both playerID and serverID manually assigned by test', () => {

   var crossWordGame = new CrosswordGame("cat_face_2020","localhost:8080");
   var server = crossWordGame.getServerAssigned();
   var playerID = crossWordGame.getPlayerID();

   expect(server).toBe("localhost:8080");
   expect(playerID).toBe("cat_face_2020") ;

 });

 // covers : 
 // partition on playerID, serverID,
 //      3) playerID self assigned by the constructor, serverID is not 
 // 

 test('testConstructor : playerID self assigned by the constructor, serverID is not ',()=>{

   var crossWordGame = new CrosswordGame(undefined,"localhost:8080");
   var server = crossWordGame.getServerAssigned();
   var playerID = crossWordGame.getPlayerID();


   expect(server).toBe("localhost:8080");
   expect(typeof playerID).toBe("string") ;



 })

 // covers : 
 // partition on playerID, serverID,
 //      4) serverID is self assigned by the constructor, playerID is not 
 // 

 test('testConstructor : serverID is self assigned by the constructor, playerID is not  ',()=>{
    
   var crossWordGame = new CrosswordGame("cat_face_2020",undefined);
   var server = crossWordGame.getServerAssigned();
   var playerID = crossWordGame.getPlayerID();
   expect(server).toBe("localhost:4949");
   expect(playerID).toBe("cat_face_2020") ;

})


 //
 // covers : play(serverBox,playButton)
 // covers : partition 
 //            1) both serverBox, playButton are available
 //       
 test('testPlay : both serverBox, playButton are available ',async()=>{  
   var crossWordGame = new CrosswordGame();
   var serverBox = document.createElement("input");
   serverBox.value = "localhost:4949";
   var playButton = document.createElement("crossword-play");
   var playData = await crossWordGame.play(serverBox,playButton);
   var puzzles = playData.puzzles;
   var games = playData.games;
   // var expectedPuzzles = [{
   //    id: '0',
   //    file: 'The smallest puzzle available',
   //    name: 'The smallest puzzle available',
   //    description: ''
   //  },
   //  {
   //    id: '1',
   //    file: 'A bigger Snow-White themed puzzle for the brave',
   //    name: 'A bigger Snow-White themed puzzle for the brave',
   //    description: ''
   //  },
   //  {
   //    id: '2',
   //    file: 'An easy puzzle to get started',
   //    name: 'An easy puzzle to get started',
   //    description: ''
   //  }];
   //  expect(puzzles).toEqual(expectedPuzzles);
    expect(games.length).toBeGreaterThanOrEqual(0);

});

// //covers : getPuzzles(playerID)
// //covers  playerID exists in game,
 //
 // covers : play(serverBox,playButton)
 // covers : partition 
 //            1) serverBox is not available
 //            2) playButton is available
 //       
 test('testPlay : serverBox is not available, playButton is available ',async()=>{  

   var crossWordGame = new CrosswordGame();

   // var serverBox = document.createElement("input");
   // serverBox.value = "localhost:4949";

   var playButton = document.createElement("crossword-play");
   var playData = await crossWordGame.play(undefined,playButton);
   var puzzles = playData.puzzles;
   var games = playData.games;
   // var expectedPuzzles = [{
   //    id: '0',
   //    file: 'The smallest puzzle available',
   //    name: 'The smallest puzzle available',
   //    description: ''
   //  },
   //  {
   //    id: '1',
   //    file: 'A bigger Snow-White themed puzzle for the brave',
   //    name: 'A bigger Snow-White themed puzzle for the brave',
   //    description: ''
   //  },
   //  {
   //    id: '2',
   //    file: 'An easy puzzle to get started',
   //    name: 'An easy puzzle to get started',
   //    description: ''
   //  }];
   //  expect(puzzles).toEqual(expectedPuzzles);
    expect(games.length).toBeGreaterThanOrEqual(0);

});


// //covers : getPuzzles(playerID)
// //covers  playerID exists in game,
 //
 // covers : play(serverBox,playButton)
 // covers : partition 
 //            1) serverBox is not available
 //            2) playButton is available
 //       
 test('testPlay : serverBox is available, playButton is not available ',async()=>{  

   var crossWordGame = new CrosswordGame();

   var serverBox = document.createElement("input");
   serverBox.value = "localhost:4949";

   var playData = await crossWordGame.play(serverBox, undefined);
   var puzzles = playData.puzzles;
   var games = playData.games;
   // var expectedPuzzles = [{
   //    id: '0',
   //    file: 'The smallest puzzle available',
   //    name: 'The smallest puzzle available',
   //    description: ''
   //  },
   //  {
   //    id: '1',
   //    file: 'A bigger Snow-White themed puzzle for the brave',
   //    name: 'A bigger Snow-White themed puzzle for the brave',
   //    description: ''
   //  },
   //  {
   //    id: '2',
   //    file: 'An easy puzzle to get started',
   //    name: 'An easy puzzle to get started',
   //    description: ''
   //  }];
   //  expect(puzzles).toEqual(expectedPuzzles);
    expect(games.length).toBeGreaterThanOrEqual(0);

});


// //covers : getPuzzles(playerID)
// //covers  playerID exists in game,
 //
 // covers : play(serverBox,playButton)
 // covers : partition 
 //            1) serverBox is not available
 //            2) playButton is available
 //       
 test('testPlay : serverBox is not available, playButton is not available ',async()=>{  

   var crossWordGame = new CrosswordGame();
   var playData = await crossWordGame.play(undefined, undefined);
   var puzzles = playData.puzzles;
   var games = playData.games;
    expect(puzzles.length).toBe(0);
    expect(games.length).toBe(0);

});


//- getPlayersRequest(gameID, dom) 
//       - partition on gameID
//           1) gameID exists on server

 test('testGetPlayersRequest :  gameID exists on server', async () => {

   var crossWordGame = new CrosswordGame();
   var dom = document.createElement("div");
   var playerID = crossWordGame.getPlayerID();
   var gameID = crossWordGame.createGame(0,playerID);
   await crossWordGame.createGameRequest(0,gameID,playerID);
   var games =  await crossWordGame.getPlayersRequest(gameID,dom);
   expect(games.gameData).toEqual([playerID]);

});

// //- getPlayersRequest(gameID, dom) 
// //       - partition on gameID
// //           1) gameID does not exist on server
// //      

test('testGetPlayersRequest : gameID does not exist on server', async() => {

   var crossWordGame = new CrosswordGame();
   var dom = document.createElement("div");
   var playerID = "alala";
   var gameID = crossWordGame.createGame(0,playerID);
   await crossWordGame.createGameRequest(0,gameID,playerID);
   var games =  await crossWordGame.getPlayersRequest(gameID,dom);
   expect(games.gameData).toEqual([playerID]);
   
});




// //
// // Integrated Test
// // 
// // covers createGame(puzzleID,playerID)   
// // covers createGameRequest(puzzleID,gameID,playerID)
// //
// // -covers puzzleID is on server
// // -gameID is on server
// // 
// //

test('testCreateGame : puzzleID is on server gameID is on server', async() => {

   var crossWordGame = new CrosswordGame();
   //puzzle 0 on the server corresponds to simple puzzle
   var gameID  =  crossWordGame.createGame(0);
   var playerID = crossWordGame.getPlayerID();
   // console.log(gameID,playerID)
   var  gameData  = await crossWordGame.createGameRequest(0,gameID,playerID);
   var expectedGameData = {
      rows: 4,
      columns: 5,
      words: [
        {
          id: 0,
          row: 0,
          col: 1,
          word: 3,
          direction: 'DOWN',
          clue: 'feline companion'
        },
        {
          id: 1,
          row: 1,
          col: 0,
          word: 3,
          direction: 'ACROSS',
          clue: 'lounging place for feline companion'
        },
        {
          id: 2,
          row: 0,
          col: 1,
          word: 3,
          direction: 'ACROSS',
          clue: 'gas powered vehicle'
        },
        {
          id: 3,
          row: 2,
          col: 1,
          word: 3,
          direction: 'ACROSS',
          clue: 'nobody likes April 15'
        }
      ]
    }
    expect(gameData).toEqual(expectedGameData);
});


//
// Integrated Test
// 
// covers createGame(puzzleID,playerID)   
// covers createGameRequest(puzzleID,gameID,playerID)
//
// - covers puzzleID is not on server
// - covers gameID is not on server
// 
test('testCreateGame : puzzleID is not on server, gameID is not on server ', async() => {
   var crossWordGame = new CrosswordGame();
   //puzzle 0 on the server corresponds to simple puzzle
   var gameID  =  "cattle_023";
   var playerID = crossWordGame.getPlayerID();
   var  gameData  = await crossWordGame.createGameRequest(100,"cattle_023",playerID);
    expect(gameData).toEqual(["Go away " + playerID + " wanting to create the game " +  gameID + " base on puzzle "+ 100]);
     
});

// //
// // Integrated Test
// // 
// // covers createGame(puzzleID,playerID)   
// // covers createGameRequest(puzzleID,gameID,playerID)
// //
// // - covers puzzleID is not on server
// // - covers gameID is on server
// // 
test('testCreateGame : puzzleID is not on server, gameID is on server', async() => {
   var crossWordGame = new CrosswordGame();
   //puzzle 0 on the server corresponds to simple puzzle
   var gameID  =  crossWordGame.createGame(0);
   var playerID = crossWordGame.getPlayerID();
   var  gameData  = await crossWordGame.createGameRequest(100,gameID,playerID);
   expect(gameData).toEqual(["Go away " + playerID + " wanting to create the game " +  gameID + " base on puzzle "+ 100]);
   //  expect(gameData.length).toBe(0);
     
});


// Integrated Test
// 
// covers createGame(puzzleID,playerID)   
// covers createGameRequest(puzzleID,gameID,playerID)
//
// - covers puzzleID is on server
// - covers gameID is not on server
// 
test('testCreateGame : puzzleID is on server, gameID is not on server', async() => {
   var crossWordGame = new CrosswordGame();
   //puzzle 0 on the server corresponds to simple puzzle
   var gameID  =  crossWordGame.createGame(0);
   var playerID = crossWordGame.getPlayerID();
   var  gameData  = await crossWordGame.createGameRequest(0,gameID,playerID);


   var myGameData =   {
      rows: 4,
      columns: 5,
      words: [
        {
          id: 0,
          row: 0,
          col: 1,
          word: 3,
          direction: 'DOWN',
          clue: 'feline companion'
        },
        {
          id: 1,
          row: 1,
          col: 0,
          word: 3,
          direction: 'ACROSS',
          clue: 'lounging place for feline companion'
        },
        {
          id: 2,
          row: 0,
          col: 1,
          word: 3,
          direction: 'ACROSS',
          clue: 'gas powered vehicle'
        },
        {
          id: 3,
          row: 2,
          col: 1,
          word: 3,
          direction: 'ACROSS',
          clue: 'nobody likes April 15'
        }
      ]
    }
    expect(gameData).toEqual(myGameData);
     
});
//
// Integrated Test
// 
// covers createGame(puzzleID,playerID)   
// covers createGameRequest(puzzleID,gameID,playerID)
//
// - covers puzzleID is not on board
// - covers gameID is not on board





// // enterLetterRequest(url)
// //    - url is in format : "http://" + {server} + "/enter/" + {gameID} + "/" + {playerID} +"/" + {letter} + "/" + {row,column}
// //        -  therefore varying any paramter except {PlayerID} could produce a valid or invalid request
// //       - partition on url 
// //          1) valid url
// //              - gameID is not on server
// //              - position{row,column} is valid
// //             
// //              
// //                 

test('enterLetterRequest : puzzleID is not on board, gameID is not on board', async() => {
   var crossWordGame = new CrosswordGame();
   //puzzle 0 on the server corresponds to simple puzzle
   // var gameID  =  crossWordGame.createGame(0);
   var playerID = crossWordGame.getPlayerID();
 
   //  expect(gameData.length).toBe(0);
     
});


// // enterLetterRequest(url)
// //    - url is in format : "http://" + {server} + "/enter/" + {gameID} + "/" + {playerID} +"/" + {letter} + "/" + {row,column}
// //        -  therefore varying any paramter except {PlayerID} could produce a valid or invalid request
// //       - partition on url 
// //          1) valid url
// //              - gameID is on server
// //              - position{row,column} is valid
// //             
// //              
// //   

// test('enterLetterRequest : puzzleID is not on board, gameID is not on board', async() => {
//    var crossWordGame = new CrosswordGame();
//    //puzzle 0 on the server corresponds to simple puzzle
//    // var gameID  =  crossWordGame.createGame(0);
//    var playerID = crossWordGame.getPlayerID();
//    //  expect(gameData.length).toBe(0);
     
// });

// // enterLetterRequest(url)
// //    - url is in format : "http://" + {server} + "/enter/" + {gameID} + "/" + {playerID} +"/" + {letter} + "/" + {row,column}
// //        -  therefore varying any paramter except {PlayerID} could produce a valid or invalid request
// //       - partition on url 
// //          1) valid url
// //              - gameID is on server
// //              - position{row,column} is not valid
// //             
// //              


// test('enterLetterRequest : puzzleID is not on board, gameID is not on board', async() => {
//    var crossWordGame = new CrosswordGame();
//    //puzzle 0 on the server corresponds to simple puzzle
//    // var gameID  =  crossWordGame.createGame(0);
//    var playerID = crossWordGame.getPlayerID();

//    //  expect(gameData.length).toBe(0);
     
// });




// //
// // - eraseLetterRequest(url)
// //      - url is in format : "http://" + {server} + "/erase/" + {gameID} + "/" + {playerID} + "/" + {row,column}
// //       -  therefore varying any paramter except playerID could produce a valid or invalid request
// //        - partition on url 
// //            1) valid url, invalid url 



// test('testEraseLetterRequest : puzzleID is not on board, gameID is not on board', async() => {
//    var crossWordGame = new CrosswordGame();
//    //puzzle 0 on the server corresponds to simple puzzle
//    // var gameID  =  crossWordGame.createGame(0);
//    var playerID = crossWordGame.getPlayerID();
 
//    //  expect(gameData.length).toBe(0);
     
// });


// // eraseLetterRequest(url)
// //    - url is in format : "http://" + {server} + "/erase/" + {gameID} + "/" + {playerID} + "/" + {row,column}
// //        -  therefore varying any paramter except {PlayerID} could produce a valid or invalid request
// //       - partition on url 
// //          1) valid url
// //              - gameID is on server
// //              - position{row,column} is valid
// //             
// //              
// //   

// test('testEraseLetterRequest : puzzleID is not on board, gameID is not on board', async() => {
//    var crossWordGame = new CrosswordGame();
//    //puzzle 0 on the server corresponds to simple puzzle
//    // var gameID  =  crossWordGame.createGame(0);
//    var playerID = crossWordGame.getPlayerID();

//    //  expect(gameData.length).toBe(0);
     
// });

// // eraseLetterRequest(url)
// //    - url is in format : "http://" + {server} + "/erase/" + {gameID} + "/" + {playerID} + "/" + {row,column}
// //        -  therefore varying any paramter except {PlayerID} could produce a valid or invalid request
// //       - partition on url 
// //          1) valid url
// //              - gameID is on server
// //              - position{row,column} is not valid
// //             
// //              


// test('testEraseLetterRequest : puzzleID is not on board, gameID is not on board', async() => {
//    var crossWordGame = new CrosswordGame();
//    //puzzle 0 on the server corresponds to simple puzzle
//    // var gameID  =  crossWordGame.createGame(0);
//    var playerID = crossWordGame.getPlayerID();

//    //  expect(gameData.length).toBe(0);
     
// });





// // - joinGameRequest(gameID, playerID)
// //       - partition on gameID
// //           1) gameID exists on server,
// //

// test('testJoinGameRequest : gameID exists on server, ', async() => {
//    var crossWordGame = new CrosswordGame();
//    //puzzle 0 on the server corresponds to simple puzzle
//    // var gameID  =  crossWordGame.createGame(0);
//    var playerID = crossWordGame.getPlayerID();

     
// });


// // - joinGameRequest(gameID, playerID)
// //       - partition on gameID
// //           1) gameID exists is not on server,
// //  

// test('testJoinGameRequest : gameID  is not on server,', async() => {
//    var crossWordGame = new CrosswordGame();
//    //puzzle 0 on the server corresponds to simple puzzle
//    // var gameID  =  crossWordGame.createGame(0);
//    var playerID = crossWordGame.getPlayerID();


     
// });


// // checkGameRequest(gameID, playerID)
// //     - partition on gameID
// //          1)  gameID does exist on server

// test('testCheckGameRequest : gameID  is on server,', async() => {
//    var crossWordGame = new CrosswordGame();
//    //puzzle 0 on the server corresponds to simple puzzle
//    // var gameID  =  crossWordGame.createGame(0);
//    var playerID = crossWordGame.getPlayerID();


// });


// // checkGameRequest(gameID, playerID)
// //     - partition on gameID
// //          1)  gameID does not exist on server
// test('testCheckGameRequest : gameID  is not on server,', async() => {
//    var crossWordGame = new CrosswordGame();
//    //puzzle 0 on the server corresponds to simple puzzle
//    // var gameID  =  crossWordGame.createGame(0);
//    var playerID = crossWordGame.getPlayerID();

// });

// /*
// * - getPuzzleUIRequest(gameID, playerID, puzzleID)
// *       - partition on gameID
// *           
// *           1) gameID exists on server, gameID does not exist on server
// *           2) puzzleID exists on server, puzzleID does not exist on server
// *               
// *
// */

// //
// // covers getPuzzleUIRequest(gameID, playerID, puzzleID)
// // covers gameID exists on server
// // covers puzzleID exists on server
// //     


// test('testGetPuzzleUIRequest : both gameID and puzzleID is  on server,', async() => {
//    var crossWordGame = new CrosswordGame();
//    //puzzle 0 on the server corresponds to simple puzzle
//    // var gameID  =  crossWordGame.createGame(0);
//    var playerID = crossWordGame.getPlayerID();

// });


// //
// // covers getPuzzleUIRequest(gameID, playerID, puzzleID)
// // covers gameID exists on server
// // covers puzzleID doesnt exist on server
// //  

// test('testGetPuzzleUIRequest : gameID is on server and puzzleID isnt,', async() => {
//    var crossWordGame = new CrosswordGame();
//    //puzzle 0 on the server corresponds to simple puzzle
//    // var gameID  =  crossWordGame.createGame(0);
//    var playerID = crossWordGame.getPlayerID();

// });

// //
// // covers getPuzzleUIRequest(gameID, playerID, puzzleID)
// // covers gameID doesnt exist on server
// // covers puzzleID exists on server
// //  
// test('testGetPuzzleUIRequest : both gameID and puzzleID are not on server', async() => {
//    var crossWordGame = new CrosswordGame();
//    var playerID = crossWordGame.getPlayerID();

// });


// /*
// * covers
// * - watchAndLook(gameID, playerID)
// * 
// *       - partition on gameID
// *           1) gameID exists on server
// */
// test('testWatchAndLookRequest : gameID exists on server', async() => {
//    var crossWordGame = new CrosswordGame();
//    var playerID = crossWordGame.getPlayerID();

// });

// /*
// * covers
// * - watchAndLook(gameID, playerID)
// * 
// *       - partition on gameID
// *           1) gameID does not exist on server
// */
// test('testWatchAndLookRequest :  gameID is not on server', async() => {
//    var crossWordGame = new CrosswordGame();
//    var playerID = crossWordGame.getPlayerID();

// });


// /*
// * covers
// * - look(gameID, playerID)
// * 
// *       - partition on gameID
// *           1) gameID exists on server
// */

// test('testLookRequest :  gameID is on server', async() => {
//    var crossWordGame = new CrosswordGame();
//    var playerID = crossWordGame.getPlayerID();

// });
// /*
// * covers
// * - look(gameID, playerID)
// * 
// *       - partition on gameID
// *           1) gameID does not exist on server
// */
// test('testLookRequest : gameID is  not on server', async() => {
//    var crossWordGame = new CrosswordGame();
//    var playerID = crossWordGame.getPlayerID();

// });


/**
 * (mutators - manual testing - integration tests)
 * 
 * - These are tested manually by playing the game and observing the expected outcomes
 * 
 * - drawPuzzlesTable(puzzleData, playerID)
 * - fillInGameData()
 * - drawGames()
 * - colorChange()
 * - colorInvalidAnswers(gameData)
 * - renderClues(words)
 * - renderGameData
 * 
 */



 /**
  * 
  * 
  * Basic Manual  Test : Starting a Game and Basic Observations
  * To ensure that your arcade does not get lost, do not refresh the browser
  *       
  * 0) open project folder in terminal or shell
  * 
  * 1) run the server by running the following command 
  *    
  *    on macOS/Unix software or termal
  * 
  *      java -ea -cp bin:lib/parserlib.jar crossword.Server 4949 puzzles
  * 
  *    on windows software or terminal
  *      
  *      java -ea -cp bin:lib/parserlib.jar crossword.Server 4949 puzzles
  *    
  *     
  *    in the root folder 
  * 
  * 2) go to https://crossword6031.herokuapp.com/ on your webbrowser preferrably chrome
  * 
  *   you should see something similar to this :  https://www.dropbox.com/s/ntk1fg1vgo4w2tg/uiFront.png?dl=0
  * 
  * 
  * 3)  Option (1)
  *    
  *      either click on the brown button with your mouse, then press Enter
  *    
  * 
  *    or Option (2)
  *   
  *       or click on the blue button with your mouse with the tag "Open Arcade!"
  * 
  *  You should see something similar to this : https://www.dropbox.com/s/gi4izrr48u0a0a4/renderPuzzles.png?dl=0
  * 
  *  - Shows the current puzzles hosted on local server with address,
  *      - attributes to look for
  *      - puzzleID
  *      -  puzzleName
  *      - puzzle Description
  * 
  *  
  * 4) Click on any Create Game for any puzzle you like (in this case puzzle with puzzleID:3, name : "Simple", description : "An easy puzzle to get started")
  *   https://www.dropbox.com/s/e87jfd2pfbbools/createGame3.png?dl=0
  * 
  *    Once clicked : check for these things : 
  * 
  *     1) A game container ("html div") created under "My Games" header 
  *        
  *          -  game container should have an assigned GameID
  *          -  should have 2 buttons (a "Join" button, a "View Players" button)
  *          -   "Join" -> player joins the Game 
  *                - if is clicked renders the current game joined, and checks if the puzzle is solved
  *                - Updates the status to "Solved" or "UnSolved" under "Current Game" header, next to the "Check Solution" button
  *                -  erases cells that are incorrect if there are 
  *                -   all incorrect or blank squares are erased then colored reddish for 3 seconds, then the color disappears 
  *               
  *          -   "View Players" -> views current players playing the game
  * 
  *               - the button has a toggling effect when clicked which either reveals or conceals the players
  *               -  at this point you should be able to see your  assigned playerID only
  *               -  
  *        
  *     2)  render the "Check Solution" button under "Current Game" header
  *            - if is clicked checks if the puzzle game is solved
  *            -  Updates the status to "Solved" or "UnSolved" under "Current Game" header, next to the button 
  *            - erases/clears cells that are incorrect
  *            -  all incorrect or blank squares are erased then colored reddish for 3 seconds, then the color disappears  
  *            - all correct squares/cells are readonly 
  *          
  *          
  *     3) renders the game board for the game that is created under the "Current Game" header 
  *       - Game board is a {rows} * {columns} board where {rows} is the number of rows and {columns} is the number of columns
  *       - A row {row} number is counted starting from 0 which signfies the topmost and first row
  *       - A column {column} number is counted starting from 0 which signifies the leftmost and first column
  *       - in the moment it renders, ui checks if the puzzle is solved and erases any incorrect letters placed on the board
  *            -  all incorrect or blank squares are erased then colored reddish for 3 seconds, then the color disappears 
  *            - -  Updates the status to "Solved" or "UnSolved" under "Current Game" header, next to the  "Check Solution" button 
  * 
  *      - board has cells which are either ("black" in color) or ("white" in color with input cells)
  *      - white cell inputs can be either readonly or not 
  *         - readonly if the answer guess is correct
  *         - non-readonly otherwise
  * 
  *     4) renders clues that help you solve the game : see https://www.dropbox.com/s/8hy41zz9o3ngszj/clues.png?dl=0
  *        
  *         - the clues are in categories
  * 
  *             1) rendered under the "ACROSS" header      
  *             2) rendered under the "DOWN" header 
  * 
  *         - each clue is in the form "id. + clue" for example "1.I love hills"
  *         - each id corresponds to a starting position cell for the first letter of a word which the user is supposed to guess
  *         - The word is either aligned down or across
  *        
  *     5) Game display should look like this : https://www.dropbox.com/s/qo3vivffdx8rpz3/fullGameDisplay.png?dl=0
  * 
  * 5) Clicking a "Join" button on a game 
  *       
  *     1) renders the game board for the game that has been joined, under the "Current Game" header 
  *   
  *       - in the moment it renders, ui checks if the puzzle is solved and erases any incorrect letters placed on the board
  *            -  all incorrect or blank squares are erased then colored reddish for 3 seconds, then the color disappears 
  *            - -  Updates the status to "Solved" or "UnSolved" under "Current Game" header, next to the  "Check Solution" button 
  * 
  *      - board has cells which are either ("black" in color) or ("white" in color with input cells)
  *      - white cell inputs can be either readonly or not 
  *         - readonly if the answer guess is correct
  *         - non-readonly otherwise
  * 
  *     2) renders clues that help you solve the game : see https://www.dropbox.com/s/8hy41zz9o3ngszj/clues.png?dl=0
  *        
  *         - the clues are in categories
  * 
  *             1) rendered under the "ACROSS" header      
  *             2) rendered under the "DOWN" header 
  * 
  *         - each clue is in the form "id. + clue" for example "1.I love hills"
  *         - each id corresponds to a starting position cell for the first letter of a word which the user is supposed to guess
  *         - The word is either aligned down or across
  * 
  * 
  * 6) Now you can begin to modify the game by the following commands
  * 
  *     1) erasing a letter on an input cell
  *        - possible if the input cell is not readonly
  *        - erasing is achieved by a keypress "delele" or "backspace"  on the keyboard of your machine
  *        
  *     2) adding a letter on an input cell
  *        - possible if the input cell is not readonly
  *        - max length to add 1; 
  *        - therefore you should notice that a free cell input should automatically restrict entry of more than 1 letter
  *    
  *     3) checking whether game is solved by clicking the "Check Solution" button
  *            - if is clicked checks if the puzzle game is solved
  *            -  Updates the status to "Solved" or "UnSolved" under "Current Game" header, next to the button 
  *            - erases/clears cells that are incorrect
  *            -  all incorrect or blank squares are erased then colored reddish for 3 seconds, then the color disappears  
  *            - all correct cells (cells that have correct values or been guessed correctly) will have their inputs assigned become "readonly", that is, unmodifiable
  *         
  *     
  * 
  * 
  *         
  */


 //*  REMEMBER ::
 //*       - Game board is a {rows} * {columns} board where {rows} is the number of rows and {columns} is the number of columns
 //*       - A row {row} number is counted starting from 0 which signfies the topmost and first row
 //*       - A column {column} number is counted starting from 0 which signifies the leftmost and first column

//  TRY A FEW COMMANDS
//
//One Player
//
//   Testing Strategy
// 
//     Testing UI requirements
//    
//    - partition on createGame
//        - create a 1 game, create >1 game of the same puzzle
//        -  create a 1 game, create >1  on a different puzzle
//
//    - partition on enter letter 
//          1) letter is correct, letter is incorrect
//          2) letter is valid, letter is invalid
//          3) enter on blocked cell, enter on unblocked cell
//
//    -  partition on erase letter 
//         - erase on blocked cell, erase on unblocked cell
//         
//    -  partition on check game   
//         - all letters are correct (is solved), or not (not solved)
//    
//    -  partition on viewing players
//         - 1 game, more than 1 game 
// 
//    -  partition on join game
//          - game is not solved, game is solved
//           
//         
//
//

 /**
  * //covers enter requirement
  * 
  *     partition -  letter is correct 
  * //covers check requirement
  *     partition - puzzle is solved
  *   
  * 
  * Manual Testing Game 1 (1 player)
  * 
  *   puzzle name  : "Easy Puzzle" 
  *   puzzleID : "The smallest puzzle available"
  *  
  * 
  * 1) enter Letter 'c' at {row : 0 , 1}
  * 
  * 2) enter Letter 'a' at {row : 0 , 2}
  * 
  * 3) enter Letter 'r' at {row : 0 , 3}
  *   
  * 4) enter Letter 'm' at {row : 1 , 0}
  * 
  * 5) enter Letter 'a' at {row : 1 , 1}
  * 
  * 6) enter Letter 't' at {row : 1 , 2}
  * 
  * 7) enter Letter 't' at {row : 2 , 1}
  * 
  * 8) enter Letter 'a' at {row : 2 , 2}
  * 
  * 9) enter Letter 'x' at {row : 2 , 3}
  * 
  * 10) click "Check Solution" button 
  *    -results to expect
  *    - all cells are readonly 
  *    - puzzle status updated to "Solved" beside the "Check Solution" button
  * 
  * 
  * 
  */



/**
  *
  * //covers enter requirement 
  *     -partition 
  *        -wrong letter, correct letter
  *        - blocked cell, open cell
  * 
  * //covers check requirement
  * // covers create 1 game 
  * // covers view players 1 game
  * 
  * 
  * Manual Testing Game 2 (1 player)
  * 
  *   puzzle name  : "Easy Puzzle" 
  *   puzzleID : "The smallest puzzle available"
  *  
  * 
  * 1) enter correct Letter 'c' at {row : 0 , 1} on open cell
  * 
  * 2) enter correct Letter 'a' at {row : 0 , 2} on open cell
  * 
  * 3) enter correct Letter 'r' at {row : 0 , 3} on open cell
  *   
  * 4) enter correct Letter 'm' at {row : 1 , 0} on open cell
  * 
  * 5) enter wrong Letter 't' at {row : 1 , 1} on open cell
  * 
  * 6) enter wrong Letter 'f' at {row : 1 , 2} on open cell
  * 
  * 7) enter wrong Letter 'z' at {row : 2 , 1} on open cell
  * 
  * 8) enter correct Letter 'a' at {row : 2 , 2} on open cell
  * 
  * 9) enter correct Letter 'x' at {row : 2 , 3} on open cell
  * 
  * 10) click "Check Solution" button 
  * 
  *    -results to expect
  *    - expect wrong cells to be reddish for about 3 seconds and then erase wrong guessed letters
  *    - expect cells {row : 0 , 1} , {row : 0 , 2} , {row : 0 , 3} , {row : 2 , 2}, {row : 2 , 3} 
  *       to be readonly  
  *    - puzzle status updated to "Solved" beside the "Check Solution" button
  * 
  * 11) player also checks the players for this game 
  * 
  * 12) tries to erase on any cell 
  * 
  * 13) tries to enter letter on any cell
  * 
  *      - both tries should be unsuccessful,
  * 
  * 
  */





/**
  *
  * 
  * covers view players (multiple games)
  * covers create multiple games from different puzzles
  * 
  *  
  *   a) puzzle name  : "Easy Puzzle" 
  *   puzzleID : "The smallest puzzle available"
  *  
  *    b) Name : Big
  *       Description: A bigger Snow-White themed puzzle for the brave
  * 
  *   1) player1 creates 2 games from puzzle (a)
  *   2) player1 creates 2 games from puzzle (b)
  *      - expects new games to be rendered under "My Games"
  *      - expects a new game board to be rendered under "Current Game" each time a game is created
  *        
  *
  *  3) player1 views players for each game
  *    - players shown should only be player1 
  * 
  *
  * 
  * 
  * 






// Testing Strategy
//
//   Test on fundamentals and requirements
//   More than 1 player, and in our example 2 players
// 
//    1)2 players open arcade
//          - same time, different times
//
//    2) 2 players join a game 
//
//          - same time, different times
//
//    3) enter a letter
//          - valid letter, invalid letter
//          - correct letter, wrong letter
//          - player1 enters a letter , player 2 follows
//          - player2 enters a letter, player1 follows
//          - both players enter a letter at the time, (hard to do alone, so will not be included)
// 
//    4) erase a letter  
//         - player1 erases a letter player2 has entered
//         - player2 erases a letter player1 has entered
//         
//           
//    5) checkGame/checkSolution
//         - game is solved
//         - game is not solved
//         - player1 checks first, 
//         - player2 checks first,
//         
//
//
//    6) viewPlayers
//         -  both players are playing the same game, or not
// 
//    
  
// covers opens browser at the same time,
// covers both players join game at the same time
// covers game is not solved 
// covers enter letter valid, invalid , correct, wrong
// covers player1 checks game first
// covers player1 erases a letter player2 has entered
// covers  player1 enters a letter , player 2 follows
// covers  player2 enters a letter, player1 follows
// 
//
// 
 /**
  * 
  * Manual Testing Game 1 (>1 player)
  * 
  *    puzzle name  : "Easy Puzzle" 
  *    puzzleDescription : "The smallest puzzle available"
  *    puzzleID :  0 
  * 
  *  Plays start web UI's at the same time 
  */   
  //  1) 
  //
  //   Open a 2 seperate tabs on a webbrowser 
  //   call the address https://crossword6031.herokuapp.com/
  //   Make sure your local server is running as specified above (Basic Game Test)
  // 
  //      - you should see the arcades of each UI rendered
  //      
  //  2)  Let each player either 
  //  
  //      1)   click on the "brown" input, and press "Enter" or "Return"  depending on the keypad
  // 
  //      2)   click on the blue button "Open Arcade!"
  //    
  //       1) Observation 1
  //      - you should see 2 different playerIDs assigned to each UI on each Tab 
  // 
  //  3)  Let player 1 enter a correct letter 
  //   
  //        1) enter Letter 'c' at {row : 0 , 1} 
  //        - expects both player1 and player2 's board to update with letter
  //   
  //  4)  Let player 2 enter an invalid letter
  //
  //       1) enter Letter '2' at {row : 0 , 2} 
  //       - expects player2 's board to immediately erase invalid letter
  //        
  //  5)  Let player 2 enter a correct letter
  //
  //       1) enter Letter 'a' at {row : 0 , 2} 
  //        - expects both player1 and player2 's board to update with letter
  //       
  //  
  //  6) Let player 1 enter a wrong letter 
  //          
  //       1) enter Letter 'r' at {row : 0 , 3} 
  //   
  //       
  //  7) Let player 1 click Check Solution first
  //    
  //         - expects both player1 and player2 's board to update with current board state
  //         - player1 will see wrong cells or empty cells colored reddish, whilst player2 wont
  //         - all wrong cells will be erased
  //
  // 
  //  8) player1 views players "Clicks on "View Players" " in the game container that has a game ID matching the 
  //    current game
  //  9 ) player2 views players "Clicks on "View Players" " in the game container that has a game ID matching the 
  //    current game
  //      - expect both player1 and player2 see the same players.
  // 
  // 



// covers opens browsers at different times, player1 starts 
//  joins the same game, but player2 joins letter 
// covers game is solved 
// covers player2 checks game first, 
// covers player1 erases a letter player2 has entered
//
//
 /**
  * 
  * Manual Testing Game 2 (>1 player)
  *    puzzle name  : "Easy Puzzle" 
  *    puzzleDescription : "The smallest puzzle available"
  *    puzzleID :  0 
  *  Plays start web UI's at the same time 
  */   
  //  1) 
  //
  //   Open a 2 seperate tabs on a webbrowser 
  //   call the address https://crossword6031.herokuapp.com/
  //    
  //   Make sure your local server is running as specified above (Basic Game Test)
  // 
  //      - you should see the arcades of each UI rendered
  //      
  //  2)  Let player 1 
  //      
  //  
  //      1)   click on the "brown" input, and press "Enter" or "Return"  depending on the keypad
  //      2)   click on the blue button "Open Arcade!"
  //    
  //    
  //       1) Observation 1
  //      - you should see a playerID assigned to player1 UI
  //     
  // 
  // 3) let player1 
  //       
  //    
  //  3) Let player 2 follow suit (step 2), 30 sec or a minute later, and then join a game that player1 has started
  //        and is currently playing 
  //      
  //           - 
  //
  //  4) Let player 1 
  //    -  enter correct Letter 'c' at {row : 0 , 1}
  //    
  //    
  //  4) Let player 1 
  //    -  enter correct Letter 'a' at {row : 0 , 2}
  //
  //  5) Let player 1
  //    -  enter correct Letter 'r' at {row : 0 , 3}
  //
  //  6) Let player 2 join same game as player 1, thus checking it 
  //   - expects update to both player1 and player2 's board 
  //
  //  7) Let player 1 enter wrong letter
  //      enter Letter 'x' at {row : 1 , 0}
  //    - expects update to both player1 and player2 's board 
  //   
  //  8) Let player 2 erase wrong letter place by player 1 
  //
  //     -  erase letter 'x' at {row : 1 , 0}
  //     - expects update to both player1 and player2 's board 
  //      
  //
  //  9) Let player 2 to enter correct letter 
  //      - enter Letter 'm' at {row : 1 , 0}
  //     
  //
  //
  //  10) player2 enter Letter 'a' at {row : 1 , 1}
  //  
  //   
  //  11) player2 enter Letter 't' at {row : 1 , 2}
  //
  //
  //  12) player2 enter Letter 't' at {row : 2 , 1}
  //  
  //
  //  13) player2 enter Letter 'a' at {row : 2 , 2}
  //
  //
  //  14) player2  enter Letter 'x' at {row : 2 , 3}
  //
  //  15) Let player2 click "check solution" button
  //     -  expects update to both player1 and player2 's board 
  //     - status changes to "Solved" next to the button
  //
  //




