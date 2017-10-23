var gridMap = [];
var selectMap = [];

var activeCell;
var fireSpeed = 1.12;
var cellSpeed = 1;
var litcoin = 0;

var keepTime = false;
var timer = 0;
var finalTime = 0;
var cellCount = 0;

function g2d(r,c){
  return (r*5) + c;
}

function r3d(n){
  return (n - (n % 5))/5;
}

function c3d(n){
  return n%5;
}

function opac(c,o){
  return 'rgba(' + parseInt(c.slice(-6,-4),16)
    + ',' + parseInt(c.slice(-4,-2),16)
    + ',' + parseInt(c.slice(-2),16)
    +','+o+')';
}


$("#btn-play").click(function(){
  if($("#player-name").val().length>=3 && $("#player-team").val().length>=3){
    $("#game-entry-form").hide();
    $("#head-spacer").hide();
    $("#game-space").show();
    $("#game-instruction").html("Click on a square in the grid to start your fire.");
  }
  else if($("#player-name").val().length>=3){
    $("#player-name").css("border-color", "#f00");
    $("#player-team").css("border-color", "#fff");
  }
  else if($("#player-team").val().length>=3){
    $("#player-name").css("border-color", "#fff");
    $("#player-team").css("border-color", "#f00");
  }
  else{
    $("#player-name").css("border-color", "#f00");
    $("#player-team").css("border-color", "#f00");
  }

});

$("#game-grid").on("click",".grid-table-cell", function(){
  if(!keepTime){
    keepTime = true;
  }
  if((activeCell == undefined && selectMap[parseInt($(this).attr("id").substr(2),10)] == false) && gridMap[parseInt($(this).attr("id").substr(2),10)] == undefined || cellCount == 0 ){
    $("#game-instruction").html("Wait for the square to burn!");
    cellCount++;
    activeCell = parseInt($(this).attr("id").substr(2),10);
    gridMap[activeCell] = 0.02;
    $("#td"+activeCell).css("border-color", "#ccc");
    console.log(cellCount);
  }
});

$("body").on("click", ".buy", function(){
  switch(parseInt($(this).attr("id").substr(2),10)){
    case 1:
    if(litcoin>=3){
      cellSpeed *= 1.05;
      litcoin -= 3;
    }
    break;
    case 2:
    if(litcoin>=5){
      cellSpeed*=1.1;
      litcoin -= 5;
    }
    break;
    case 3:
    if(litcoin>=5){
      fireSpeed*=1.01;
      llitcoin -= 5;
    }
    break;
    case 4:
    if(litcoin>=9){
      cellSpeed *= 1.2;
      litcoin -= 9;
    }
    break;
    case 5:
    if(litcoin>=17){
      fireSpeed*=1.05;
      litcoin -= 20;
    }
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
          litcoin++;
          if(fireSpeed*cellSpeed>1.14){
            litcoin++;
          }
          if(fireSpeed*cellSpeed>1.24){
            litcoin++;
          }
          if(cellCount%5 == 0){
            litcoin++;
          }
          activeCell = undefined;
          if(cellCount==1){
            $("#game-instruction").html("Click a cell adjacent to a burning cell to grow your fire.");
          }
          else if (cellCount == 25){
            keepTime = false;
            finalTime = parseFloat(timer.toFixed(3));
            pushData();
            $("#game-instruction").html("Congratulations! You finished with a time of " +finalTime +  " seconds! Refresh the page to try again.");
          }
          else{
            $("#game-instruction").html("Click a cell next to a lit cell to keep spreading the fire!");
          }
          $("#game-litcoin").html("Litcoin: " + litcoin + "LTC");
        }, 50);
      }
      $("#td"+activeCell).css("background-color", opac("#e03e53", gridMap[activeCell]));
    }
  }
}, 100);

$(document).ready(function(){
  $("#game-space").hide();
  for(var i = 0; i<5; i++){
    $("#game-grid").append("<tr id = 'tr"+i+"'></tr>");
    for(var j = 0; j<5;j++){
      $("#tr"+i).append("<td class = 'grid-table-cell' id = 'td"+g2d(i,j)+"'></td>");
    }
  }
});

function adjacentUnlock(n){
  selectMap[g2d(r3d(n)-1,c3d(n-1))] = false;
  selectMap[g2d(r3d(n)-1,c3d(n))] = false;
  selectMap[g2d(r3d(n)-1,c3d(n+1))] = false;
  selectMap[g2d(r3d(n),c3d(n-1))] = false;
  selectMap[g2d(r3d(n),c3d(n+1))] = false;
  selectMap[g2d(r3d(n)+1,c3d(n-1))] = false;
  selectMap[g2d(r3d(n)+1,c3d(n))] = false;
  selectMap[g2d(r3d(n)+1,c3d(n+1))] = false;
}

function pushData(){
  var db = firebase.database();
  ballotRef = db.ref('times');
  ballotRef.push({
    name: $("#player-name").val(),
    team: $("#player-team").val(),
    time: finalTime
  });
}
