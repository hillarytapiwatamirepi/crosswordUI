// const e = require("express");


/* Copyright (c) 2017-2020 MIT 6.031 course staff, all rights reserved. */

function memoryGame() {
  
    var words = [
      [ 'red', 'orange', 'yellow', 'green', 'blue', 'purple', ],
      [ 'apple', 'bean', 'carrot', 'donut', 'eclair', 'flan', ],
      [ Math.floor(Math.random() * Math.pow(16, 3)).toString(16) ],
    ];
  
  
  
  
    var playerID = words.map(function(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }).join('_');
    console.log('generated player ID', playerID);
    
  
    var serverBox = document.getElementById('crossword-server');
    var playButton = document.getElementById('crossword-play');
  
  
  
  
  
  
  
  
    if (serverBox) {
      serverBox.addEventListener('keypress', function(e) {
        if (e.keyCode == 13) { serverBox.blur(); play(serverBox.value); }
      });
      if (playButton) {
        playButton.addEventListener('click', function() { play(serverBox.value); });
      }
    }
  
  
  
  
  
    var boardTable = document.getElementById('memory-board');
    boardTable.addEventListener('click', flip);
    
    var flippingCell = null;
  
    console.log(server);
    var play = memoryGame.play = function play(server) {
      console.log('playing on server', server);
      if (serverBox) { serverBox.disabled = true; }
      if (playButton) { playButton.disabled = true; }
      memoryGame.server = server;
      // watchAndLook();
      getPuzzles();
    };
    
    // get the puzzles 
    function getPuzzles(){
  
      var req = new XMLHttpRequest();
      req.addEventListener('load', function onWatchLoad() {
        console.log('watch response', this.responseText.replace(/\r?\n/g, '\u21B5'));
        console.log(this.responseText);
        setTimeout(watchAndLook, 1);
      });
      req.addEventListener('loadstart', function onWatchStart() {
        console.log('watch start');
        setTimeout(look, 1);
      });
      req.addEventListener('error', function onWatchError() {
        console.error('watch error', memoryGame.server);
      });
      req.open('GET', 'http://' + memoryGame.server + "/currentPuzzles");
      console.log('sending watch request');
      req.send();
      
    }
  
  
    function watchAndLook() {
      var req = new XMLHttpRequest();
      req.addEventListener('load', function onWatchLoad() {
        console.log('watch response', this.responseText.replace(/\r?\n/g, '\u21B5'));
        refreshBoard(this.responseText);
        setTimeout(watchAndLook, 1);
      });
      req.addEventListener('loadstart', function onWatchStart() {
        console.log('watch start');
        setTimeout(look, 1);
      });
      req.addEventListener('error', function onWatchError() {
        console.error('watch error', memoryGame.server);
      });
      req.open('GET', 'http://' + memoryGame.server + '/watch/' + playerID);
      console.log('sending watch request');
      req.send();
    }
    
  
  
  
    function look() {
      var req = new XMLHttpRequest();
      req.addEventListener('load', function onLookLoad() {
        console.log('look response', this.responseText.replace(/\r?\n/g, '\u21B5'));
        refreshBoard(this.responseText);
      });
      req.addEventListener('error', function onLookError() {
        console.error('look error', memoryGame.server);
      });
      req.open('GET', 'http://' + memoryGame.server + '/look/' + playerID);
      console.log('sending look request');
      req.send();
    }
    
    function flip(event) {
      if (event.target.tagName !== 'TD') { return; }
      if (flippingCell) {
        console.log('already waiting to flip a card');
        return;
      }
      
      flippingCell = event.target;
      flippingCell.classList.add('card-blocked');
      var col = indexOfElement(flippingCell);
      var row = indexOfElement(flippingCell.parentElement);
      var url = memoryGame.server + '/flip/' + playerID + '/' + row + ',' + col;
      var req = new XMLHttpRequest();
      req.addEventListener('load', function onFlipLoad() {
        console.log('flip response', this.responseText.replace(/\r?\n/g, '\u21B5'));
        refreshBoard(this.responseText);
      });
      req.addEventListener('loadend', function onFlipDone() {
        flippingCell.classList.remove('card-blocked');
        flippingCell = null;
      });
      req.addEventListener('error', function onFlipError() {
        console.error('flip error', url);
      });
      req.open('GET', 'http://' + url);
      console.log('sending flip request');
      req.send();
    }
    
    function indexOfElement(elt) {
      return Array.prototype.indexOf.call(elt.parentElement.children, elt);
    }
    
    function refreshBoard(text) {
      var board = text.split(/\r?\n/);
      var dims = board.shift().split('x');
      var rows = parseInt(dims.shift());
      var cols = parseInt(dims.shift());
      var cards = board.map(function(line) { return line.split(' '); });
      
      for (var row = 0; row < rows; row++) {
        var tableRow = boardTable.children[row] ||
                       boardTable.appendChild(document.createElement('tr'));
        for (var col = 0; col < cols; col++) {
          var tableCell = tableRow.children[col] ||
                          tableRow.appendChild(document.createElement('td'));
          var card = cards.shift();
          refreshCell(tableCell, card[0], card[1]);
        }
      }
    }
    
    function refreshCell(tableCell, status, text) {
      tableCell.classList.remove('card-visible');
      tableCell.classList.remove('card-control');
      tableCell.innerText = '';
      if (status === 'none') {
        tableCell.classList.add('card-visible');
      } else if (status === 'down') {
        tableCell.innerText = '?';
      } else if (status === 'up') {
        tableCell.classList.add('card-visible');
        tableCell.innerText = text;
      } else if (status === 'my') {
        tableCell.classList.add('card-visible');
        tableCell.classList.add('card-control');
        tableCell.innerText = text;
      } else {
        console.error('invalid board cell', status, text);
      }
    }
  }
  




















// const grid = document.getElementById("grid");
// const gridTable = document.createElement("table");

// const puzzleData = {
//     rows : 3,
//     columns : 4,
//     words : [
//         {   
//             id : 1 ,
//             row :0 ,
//             col :1 , 
//             word:"cat" , 
//             direction:"DOWN" , 
//             clue : "feline companion" , 
        
//         },
//         {   
//             id : 2 , 
//             row : 1,
//             col : 0 ,
//             word: "mat", 
//             direction:  "ACROSS", 
//             clue : "lounging place for feline companion" , 
        
//         },
//         {   
//             id : 3 ,
//             row : 0,
//             col : 1 , 
//             word: "car", 
//             direction: "ACROSS", 
//             clue : "gas powered vehicle" , 
        
//         },
//         {   
//             id : 4, 
//             row :2,
//             col :1 ,
//             word: "tax", 
//             direction: "ACROSS" , 
//             clue :  "feline companion", 

//         }

//     ]




// }




// for (let i  = 0; i < puzzleData.rows ;i+=1){
//     const gridRow = document.createElement("tr");
//     gridRow.className= "grid-row";
//     for (let j = 0 ; j < puzzleData.columns ; j ++){
//         const gridCell = document.createElement("td");
//         gridCell.className ="grid-cell-black";
//         gridRow.appendChild(gridCell);
//     }

//     gridTable.appendChild(gridRow);
// }



// var rows = gridTable.childNodes;


// function configureData(){
//     var seen = new Set();

//     puzzleData.words.forEach((word)=>{
    
//         if (word.direction === "ACROSS"){
//             var name = word.word;
//             var rowIndex = word.row;
//             var colIndex = word.col;

//             // get row and children for the start of the word
//             var row =  rows[rowIndex];
//             var rowChildren = row.childNodes;

//             for (let dy = 0 ; dy < name.length; dy++ ) {
//                     var coord =[rowIndex,colIndex+dy];
//                     if (!seen.has(JSON.stringify(coord))){
//                         var cellChild =  rowChildren[colIndex + dy];
//                         var cellDivTop = document.createElement("div");
//                         cellDivTop.className="grid-cell-top";
//                         var cellDivRightSide = document.createElement("div");
//                         cellDivRightSide.className="grid-cell-right";
//                         var cellDivLeftSide =  document.createElement("div");
//                         cellDivLeftSide.className="grid-cell-left";
//                         var cellDivBottomSide =  document.createElement("div");
//                         cellDivBottomSide.className="grid-cell-bottom";
            
//                         // cell input and label shenanigans
//                         var cellInput = document.createElement("input");
//                         cellInput.className = "grid-cell-input";
            
            
//                         // do the middle
//                         var middleDivSide = document.createElement("div");
//                         middleDivSide.appendChild(cellDivTop);
//                         middleDivSide.appendChild(cellInput);
//                         middleDivSide.appendChild(cellDivBottomSide);
            
//                         // add all the parts.
//                         cellChild.appendChild(cellDivLeftSide);
//                         cellChild.appendChild(middleDivSide);
//                         cellChild.appendChild(cellDivRightSide);
//                         cellChild.className="grid-cell-white";
//                         seen.add(JSON.stringify(coord))
//                     }
//             }
//         }else{
//             var name = word.word;
//             var rowIndex=  word.row;
//             var colIndex = word.col;

//             for (let dx= 0 ; dx < name.length; dx++ ) {
//                 //get row and children
//                 var row =  rows[rowIndex + dx];
//                 var rowChildren = row.childNodes;
//                 var coord = [rowIndex+dx,colIndex];       
//                 if (!seen.has(JSON.stringify(coord))){
//                     var cellChild = rowChildren[colIndex];
//                     var cellDivTop = document.createElement("div");
//                     cellDivTop.className="grid-cell-top";
//                     var cellDivRightSide = document.createElement("div");
//                     cellDivRightSide.className="grid-cell-right";
//                     var cellDivLeftSide =  document.createElement("div");
//                     cellDivLeftSide.className="grid-cell-left";
//                     var cellDivBottomSide =  document.createElement("div");
//                     cellDivBottomSide.className="grid-cell-bottom";
        
//                     // cell input and label shenanigans
//                     var cellInput = document.createElement("input");
//                     cellInput.className = "grid-cell-input";
        
//                     // do the middle
//                     var middleDivSide = document.createElement("div");
//                     middleDivSide.appendChild(cellDivTop);
//                     middleDivSide.appendChild(cellInput);
//                     middleDivSide.appendChild(cellDivBottomSide);
        
//                     // add all the parts.
//                     cellChild.appendChild(cellDivLeftSide);
//                     cellChild.appendChild(middleDivSide);
//                     cellChild.appendChild(cellDivRightSide);
//                     cellChild.className="grid-cell-white";
//                     seen.add(JSON.stringify(coord))
//                 }
      
//             }
//         }

//     });

// }





// function configureLabels(){

//     puzzleData.words.forEach((word)=>{

//         if (word.direction === "ACROSS"){

//             var name = word.word;
//             var rowIndex = word.row;
//             var colIndex = word.col;

//             // get row and children for the start of the word
//             var row =  rows[rowIndex];
//             var rowChildren = row.childNodes;
//             var cellChild =  rowChildren[colIndex];
//             cellChild.childNodes[0].innerText = word.id.toString();


//         }else{

//             var name = word.word;
//             var rowIndex=  word.row;
//             var colIndex = word.col;
//             var row =  rows[rowIndex];
//             var rowChildren = row.childNodes;
//             var cellChild = rowChildren[colIndex];
//             cellChild.childNodes[1].childNodes[0].innerText = word.id.toString();

//         }


//     })



// }


// configureData();
// configureLabels();







// for (let i  = 0; i < puzzleData.rows ;i+=1){
//     const gridRow = document.createElement("tr");
//     gridRow.className= "grid-row";
//     for (let j = 0 ; j < puzzleData.columns ; j ++){
//         const gridCell = document.createElement("td");
//         gridCell.className ="grid-cell";
//         gridRow.appendChild(gridCell);
//     }

//     gridTable.appendChild(gridRow);
// }



// grid.appendChild(gridTable);