
  function myFunction() {
  var x = document.getElementById("carouselExampleIndicators");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  var form = document.getElementById('form');

    var displaySetting = form.style.display;
    if (displaySetting == "block") {
      form.style.display = "none";
    }
    else {
      form.style.display = "block";
      
    }
  }
function myfunction() {
  var hideform = document.getElementById("form");
  var displaySetting = form.style.display;

  if (displaySetting === "none"){
    hideform.style.display ="block";
  }
  else {
    hideform.style.display = "none";
  }

  var showCarousel = document.getElementById("carouselExampleIndicators")
  var displaySetting = form.style.display;

  if (displaySetting == "block") {
      showCarousel.style.display = "none";
    }
    else {
      showCarousel.style.display = "block";
    }
}
var header = document.getElementById("myDIV");
var btns = header.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
  var current = document.getElementsByClassName("active");
  current[0].className = current[0].className.replace(" active", "");
  this.className += " active";
  });
}
function myfunction1() {
  var hideform = document.getElementById("Web");
  var displaySetting = form.style.display;

  if (displaySetting === "none"){
    hideform.style.display ="block";
  }
  else {
    hideform.style.display = "none";
  }
}
function myfunction2() {
  var hideform = document.getElementById("App");
  var displaySetting = form.style.display;

  if (displaySetting === "none"){
    hideform.style.display ="block";
  }
  else {
    hideform.style.display = "none";
  }
}
function myfunction3() {
  var hideform = document.getElementById("Others");
  var displaySetting = form.style.display;

  if (displaySetting === "none"){
    hideform.style.display ="block";
  }
  else {
    hideform.style.display = "none";
  }
}
function myfunction4() {
  var hideform = document.getElementById("All");
  var displaySetting = form.style.display;

  if (displaySetting === "none"){
    hideform.style.display ="block";
  }
  else {
    hideform.style.display = "none";
  }
}
  
