// const e = require("express");

const grid = document.getElementById("grid");
const gridTable = document.createElement("table");

const puzzleData = {
    rows : 3,
    columns : 4,
    words : [
        {   
            id : 1 ,
            row :0 ,
            col :1 , 
            word:"cat" , 
            direction:"DOWN" , 
            clue : "feline companion" , 
        
        },
        {   
            id : 2 , 
            row : 1,
            col : 0 ,
            word: "mat", 
            direction:  "ACROSS", 
            clue : "lounging place for feline companion" , 
        
        },
        {   
            id : 3 ,
            row : 0,
            col : 1 , 
            word: "car", 
            direction: "ACROSS", 
            clue : "gas powered vehicle" , 
        
        },
        {   
            id : 4, 
            row :2,
            col :1 ,
            word: "tax", 
            direction: "ACROSS" , 
            clue :  "feline companion", 

        }

    ]




}




for (let i  = 0; i < puzzleData.rows ;i+=1){
    const gridRow = document.createElement("tr");
    gridRow.className= "grid-row";
    for (let j = 0 ; j < puzzleData.columns ; j ++){
        const gridCell = document.createElement("td");
        gridCell.className ="grid-cell-black";
        gridRow.appendChild(gridCell);
    }

    gridTable.appendChild(gridRow);
}



var rows = gridTable.childNodes;


function configureData(){
    var seen = new Set();

    puzzleData.words.forEach((word)=>{
    
        if (word.direction === "ACROSS"){
            var name = word.word;
            var rowIndex = word.row;
            var colIndex = word.col;

            // get row and children for the start of the word
            var row =  rows[rowIndex];
            var rowChildren = row.childNodes;

            for (let dy = 0 ; dy < name.length; dy++ ) {
                    var coord =[rowIndex,colIndex+dy];
                    if (!seen.has(JSON.stringify(coord))){
                        var cellChild =  rowChildren[colIndex + dy];
                        var cellDivTop = document.createElement("div");
                        cellDivTop.className="grid-cell-top";
                        var cellDivRightSide = document.createElement("div");
                        cellDivRightSide.className="grid-cell-right";
                        var cellDivLeftSide =  document.createElement("div");
                        cellDivLeftSide.className="grid-cell-left";
                        var cellDivBottomSide =  document.createElement("div");
                        cellDivBottomSide.className="grid-cell-bottom";
            
                        // cell input and label shenanigans
                        var cellInput = document.createElement("input");
                        cellInput.className = "grid-cell-input";
            
            
                        // do the middle
                        var middleDivSide = document.createElement("div");
                        middleDivSide.appendChild(cellDivTop);
                        middleDivSide.appendChild(cellInput);
                        middleDivSide.appendChild(cellDivBottomSide);
            
                        // add all the parts.
                        cellChild.appendChild(cellDivLeftSide);
                        cellChild.appendChild(middleDivSide);
                        cellChild.appendChild(cellDivRightSide);
                        cellChild.className="grid-cell-white";
                        seen.add(JSON.stringify(coord))
                    }
            }
        }else{
            var name = word.word;
            var rowIndex=  word.row;
            var colIndex = word.col;

            for (let dx= 0 ; dx < name.length; dx++ ) {
                //get row and children
                var row =  rows[rowIndex + dx];
                var rowChildren = row.childNodes;
                var coord = [rowIndex+dx,colIndex];       
                if (!seen.has(JSON.stringify(coord))){
                    var cellChild = rowChildren[colIndex];
                    var cellDivTop = document.createElement("div");
                    cellDivTop.className="grid-cell-top";
                    var cellDivRightSide = document.createElement("div");
                    cellDivRightSide.className="grid-cell-right";
                    var cellDivLeftSide =  document.createElement("div");
                    cellDivLeftSide.className="grid-cell-left";
                    var cellDivBottomSide =  document.createElement("div");
                    cellDivBottomSide.className="grid-cell-bottom";
        
                    // cell input and label shenanigans
                    var cellInput = document.createElement("input");
                    cellInput.className = "grid-cell-input";
        
                    // do the middle
                    var middleDivSide = document.createElement("div");
                    middleDivSide.appendChild(cellDivTop);
                    middleDivSide.appendChild(cellInput);
                    middleDivSide.appendChild(cellDivBottomSide);
        
                    // add all the parts.
                    cellChild.appendChild(cellDivLeftSide);
                    cellChild.appendChild(middleDivSide);
                    cellChild.appendChild(cellDivRightSide);
                    cellChild.className="grid-cell-white";
                    seen.add(JSON.stringify(coord))
                }
      
            }
        }

    });

}





function configureLabels(){

    puzzleData.words.forEach((word)=>{

        if (word.direction === "ACROSS"){

            var name = word.word;
            var rowIndex = word.row;
            var colIndex = word.col;

            // get row and children for the start of the word
            var row =  rows[rowIndex];
            var rowChildren = row.childNodes;
            var cellChild =  rowChildren[colIndex];
            cellChild.childNodes[0].innerText = word.id.toString();


        }else{

            var name = word.word;
            var rowIndex=  word.row;
            var colIndex = word.col;
            var row =  rows[rowIndex];
            var rowChildren = row.childNodes;
            var cellChild = rowChildren[colIndex];
            cellChild.childNodes[1].childNodes[0].innerText = word.id.toString();

        }


    })



}


configureData();
configureLabels();







for (let i  = 0; i < puzzleData.rows ;i+=1){
    const gridRow = document.createElement("tr");
    gridRow.className= "grid-row";
    for (let j = 0 ; j < puzzleData.columns ; j ++){
        const gridCell = document.createElement("td");
        gridCell.className ="grid-cell";
        gridRow.appendChild(gridCell);
    }

    gridTable.appendChild(gridRow);
}



grid.appendChild(gridTable);