var gridMap = [];

var activeCell;
var fireSpeed = 1.07;
var cellSpeed = 1;
var litcoin = 0;

var keepTime = false;
var timer = 0;
var finalTime = 0;
var cellCount = 0;

function g2d(r,c){
  return (r*6) + c;
}

function r3d(n){
  return (n - (n % 6))/6;
}

function c3d(n){
  return n%6;
}

function opac(c,o){
  return 'rgba(' + parseInt(c.slice(-6,-4),16)
    + ',' + parseInt(c.slice(-4,-2),16)
    + ',' + parseInt(c.slice(-2),16)
    +','+o+')';
}


$("#btn-play").click(function(){
  $("#game-entry-form").hide();
  $("#head-spacer").hide();
  $("#game-space").show();
  $("#game-instruction").html("Click on a square in the grid to start your fire.");
});

$("#game-grid").on("click",".grid-table-cell", function(){
  if(!keepTime){
    keepTime = true;
  }
  if((activeCell == undefined && gridMap[parseInt($(this).attr("id").substr(2),10)] == false) || cellCount == 0 ){
    $("#game-instruction").html("Wait for the square to burn!");
    cellCount++;
    activeCell = parseInt($(this).attr("id").substr(2),10);
    gridMap[activeCell] = 0.02;
    $("#td"+activeCell).css("border-color", "#ccc");
    console.log(cellCount);


  }
});

setInterval(function(){ //Game loop
  if(keepTime){
    timer+= 0.1;
    $("#game-timer").html("Time: " + Math.floor(timer));

    if(activeCell !== undefined){
      gridMap[activeCell] = gridMap[activeCell] * fireSpeed * cellSpeed;
      if(gridMap[activeCell]>=1){
        gridMap[activeCell] = 1;
        cellSpeed = 1;
        adjacentUnlock(activeCell);
        setTimeout(function(){
          activeCell = undefined;
          if(cellCount==1){
            $("#game-instruction").html("Click a cell adjacent to a burning cell to grow your fire.");
          }
          else if (cellCount == 36){
            keepTime = false;
            finalTime = parseFloat(timer.toFixed(3));
            $("#game-instruction").html("Congratulations! You finished with a time of " +finalTime +  " seconds! Refresh the page to try again.");
          }
          else{
            $("#game-instruction").html("Click a cell next to a lit cell to keep spreading the fire!");
          }
        }, 50);
      }
      $("#td"+activeCell).css("background-color", opac("#e03e53", gridMap[activeCell]));
    }
  }
}, 100);

$(document).ready(function(){
  $("#game-space").hide();
  for(var i = 0; i<6; i++){
    $("#game-grid").append("<tr id = 'tr"+i+"'></tr>");
    for(var j = 0; j<6;j++){
      $("#tr"+i).append("<td class = 'grid-table-cell' id = 'td"+g2d(i,j)+"'></td>");
    }
  }
});

function adjacentUnlock(n){
  gridMap[g2d(r3d(n)-1,c3d(n-1))] = false;
  gridMap[g2d(r3d(n)-1,c3d(n))] = false;
  gridMap[g2d(r3d(n)-1,c3d(n+1))] = false;
  gridMap[g2d(r3d(n),c3d(n-1))] = false;
  gridMap[g2d(r3d(n),c3d(n+1))] = false;
  gridMap[g2d(r3d(n)+1,c3d(n-1))] = false;
  gridMap[g2d(r3d(n)+1,c3d(n))] = false;
  gridMap[g2d(r3d(n)+1,c3d(n+1))] = false;
}
