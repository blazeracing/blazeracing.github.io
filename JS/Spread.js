var gridMap = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
};

var activeCell;
var fireSpeed = 0.1;
var cellSpeed = 0.1;

var keepTime = false;
var timer = 0;

function g2d(r,c){
  return (r*7) + c;
}

$("#btn-play").click(function(){
  $("#game-entry-form").hide();
  $("#head-spacer").hide();
  $("#game-instruction").html("Click on a cell in the grid to start your fire.");
});

$("#game-grid").on("click",".grid-table-cell", function(){
  if(!keepTime){
    keepTime = true;
  }
  if(activeCell == undefined){
    activeCell = parseInt($(this).attr("id").substr(2),10);
    console.log(activeCell);
    setTimeout(function(){ activeCell = undefined; }, 6000);
  }
});

setInterval(function(){
  if(keepTime){
    timer+= 0.1;
    $("#game-timer").html("Time: " + Math.floor(timer));
  }
}, 100);

$(document).ready(function(){
  for(var i = 0; i<7; i++){
    $("#game-grid").append("<tr id = 'tr"+i+"'></tr>");
    for(var j = 0; j<7;j++){
      $("#tr"+i).append("<td class = 'grid-table-cell' id = 'td"+g2d(i,j)+"'>t</td>");
    }
  }
});
