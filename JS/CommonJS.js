var $cont = $('html, body');
var isRed = false;

$('a').click(function() {
    $cont.animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 750);
});

function isRunning(){ //run in console to check whether this script is running.
  console.log("Is running");
}


$(window).scroll(function() {
  if($(window).scrollTop() > ($(".first-parallax").offset().top + $(".first-parallax").outerHeight()) ){
    if(!isRed){
      $("#blaze").css("color","#e03e53");
      isRed = true;
    }
  }
  else{
    if(isRed){
      $("#blaze").css("color", "#fff");
      isRed = false;
    }
  }
});
