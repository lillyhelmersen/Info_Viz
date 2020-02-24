const key = 'pk.eyJ1IjoianoxMTExIiwiYSI6ImNqc2syOHlhcjExcmk0M256emx3cncydDQifQ.dRFhBWbfIm97qGZNBzCR0A';

const options = {
  lat: 30,/*orilat,*/
  lng: 0,/*orilon,*/
  zoom: 0.5,
  studio: true,
  style: 'mapbox://styles/mapbox/traffic-night-v2',
};

const mappa = new Mappa('MapboxGL', key);
let myMap;
let canvas;
let alert = false;

const data = 'data/the12Top.csv';

let printTable;
var idCountArray;
//Table with info
var userIdINTab;
var latINTab;
var longINTab;
var distansINTab;
var timeINTab;
var timeToNextMsINTab;
var idIndex = [];
var ids = [];

var inSheet = 0;
var forRedraw = 0;
var latSelected = 1;
var one_day=1000*60*60*24;

var tableIN;
var maxRow;

var theTime = "To day";

var numberOfIds = 12;
var img;

function preload(){
  //table = loadTable(dataCS, 'csv', 'header');
  tableIN = loadTable(data, 'csv', 'header');
  img = loadImage('speeds.PNG');
}

function setup() {
  //console.log(tableIN.getRowCount() + " total Rows in table :D ");
  //console.log(tableIN.getColumnCount() + " total Column in table");
  maxRow = tableIN.getRowCount();
  //setPrintTable();
  setMapp();
  filterData(tableIN);
  setRadioButtons();
  setArowBottons();
  setText(theTime);
  //image(img, 0, 0, width/20, height-height/20);



  //filterDataCD(table);

  //printToTable();
}
function draw() {

}
//-------setup----------
function setRadioButtons(){
  console.log("Trying to make radio butons");
  radio = createSelect('radios');
  radio.style('color', '#000000');
  for (i = 0; i < numberOfIds; ++i){
    var j = i+1;
    var id = ids[i];
    var tempName = '' + j + '. User: ' + id + '';
    var butName = tempName;
    radio.option(butName, j);
    radio.changed(nextTrip);
  }

  //radio.option('white');
  radio.style('width','135px');
  radio.parent('radios');
}
function setArowBottons(){
  //button.position(input.x + input.width, 65);
  buttonP = createButton('Previus Day');
  buttonN = createButton('Next Day');
  buttonP.position(0,0);
  buttonN.position(100,0);

  setButStyls(buttonP);
  setButStyls(buttonN);

  buttonP.mousePressed(lastTrip);
  buttonN.mousePressed(nextTrip);
}
function setText(newTex){
  stroke(255);
  fill(255);
  textAlign(CENTER, CENTER);
  var tSixe = width / 40;
  textSize(tSixe);
  text(newTex, width-width/5, tSixe);
  noStroke();
  noFill();
}
function setMapp(){
  canvas = createCanvas(windowWidth-0.5, windowHeight-0.5 );
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  myMap.onChange(function() { drawMarks(forRedraw);});
}
function filterData(data){

  console.log("Start filter IN data");
//id,lat,long,distans,time,timeToNextMs
  userIdINTab = data.getColumn("id");
  latINTab = data.getColumn("lat");
  longINTab = data.getColumn("long");
  distansINTab = data.getColumn("distans");
  timeINTab = data.getColumn("time");
  timeToNextMsINTab = data.getColumn("timeToNextMs");

  setIdIndex(userIdINTab);
  //var rows = data.getRowCount();
  //countIDS(userIdINTab);
  /*
  console.log(table.getRowCount() + " total Rows in table :D ");
  console.log(table.getColumnCount() + " total Column in table");
  */

}

function setIdIndex(userIdTab){
  //idIndex = [];
  var tempCount = 1;
  idIndex[0] = 0;
  ids[0] = userIdTab[0];

  for(i = 1; i < userIdTab.length-1; ++i){
    if(userIdTab[i] != userIdTab[i+1]){
      idIndex[tempCount] = i+1;
      ids[tempCount] = userIdTab[i+1];
      //console.log("userIdTab["+(i+1)+"]: " + userIdTab[i+1]);
      //console.log(" - idIndex["+tempCount+"]: " + i+1);
      tempCount++;
    }
  }
}

function printDobleArray(a){
  if(a == null){
    console.log("Start printDobleArray array is null");
  }
  //console.log("array print : " + a[0][0]);
  if (a !== undefined) {
    for (i = 0; i < a.length; i++){
      console.log("User id: |" + a[i][0] + "| pictures taken: |" + a[i][1] + "|");
    }
  }
}

function toData(s){
  var dateInMs;
  //2017-07-24 01:46:49 UTC
  /*
  var ar1 = s.split(" ");
  var ar2 = ar1[0].split("-");
  var ar3 = ar1[1].split(":");
  for (i = 0; i < 3; i++){
    ar2[i] = parseInt(ar2[i]);
    ar3[i] = parseInt(ar3[i]);
    console.log("ar2: " + ar2[i] + " ar3: " + ar3[i]);
  }
/*
  console.log("ar1: " + ar1.toString());
  console.log("ar2: " + ar2.toString());
  console.log("ar3: " + ar3.toString());
*/
  //var d = new Date(year, month,   day,  hours,  minutes, seconds, milliseconds);
  //var d = new Date(ar2[0], ar2[1]-1, ar2[2], ar3[0], ar3[1], ar3[3], 0);
  var d = new Date(s);
  //console.log("date: " + d.toString());
  return dateInMs;
}
//--------------Calclotions-------------------------
//Date calclotions
function daysBetween(date1,date2) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;

  // Convert back to days and return
  return difference_ms;//.round(difference_ms/one_day);
}
//Km calcolation : https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}
function deg2rad(deg) {
  return deg * (Math.PI/180);
}

//----------Drawing---------------------
function drawMarks(startIndex){
  forRedraw = startIndex;
  //console.log("startIndex: "  + startIndex);
  clear();
  setText(dateToDay(timeINTab[inSheet]));
  var i = startIndex;
  var bool = true;

  if(ifNextTrip(timeToNextMsINTab[i])){
    bool = false;
    i++;
  }

  while (bool){
    //console.log(" - I am drawing");
    let position1 = myMap.latLngToPixel(latINTab[i], longINTab[i]);
    x1 = position1.x;
    y1 = position1.y;
    let position2 = myMap.latLngToPixel(latINTab[i+1], longINTab[i+1]);
    x2 = position2.x;
    y2 = position2.y;
    //console.log("position1: x: " + x1 + " y: " + y1);

    drawPoint(x1,y1);
    drawLine(x1,y1,x2,y2,i);
    //difference_ms;//.round(difference_ms/one_day);
    if(ifNextTrip(timeToNextMsINTab[i])){
      bool = false;
    }
    i++;
    if(i == maxRow){
      bool = false;
    }
  }

  position1 = myMap.latLngToPixel(latINTab[i], longINTab[i]);
  x1 = position1.x;
  y1 = position1.y;
  drawPoint(x1,y1);
  //For next trip
  inSheet = i;
  //console.log("inSheet: " + inSheet);
}
function nextTrip(){
  //console.log("PresedNext");
  var radioSelected = radio.value();
  //console.log(" - Radiao: " + radioSelected);
  //console.log(" - latSelected: " + latSelected);
  //That there is a selected person
  if(latSelected != 0){

    if(latSelected != radioSelected){
      setNewInSheet();
    }
    drawMarks(inSheet);
  } else {
    noSelection();
  }
  latSelected = radioSelected;
  //setText(dateToDay(timeINTab[inSheet]));//new Date(timeINTab[inSheet]).getDate()
}
function lastTrip(){
  var radioSelected = radio.value();
  //That there is a selected person
  if(latSelected != 0){

    if(latSelected != radioSelected){
      setNewInSheet();
    }
    setPreviusInSheet();
    drawMarks(inSheet);
  } else {
    noSelection();
  }
  latSelected = radioSelected;

}
function ifNextTrip(timeBetween){
  timeBetween = Math.round(timeBetween/one_day);
  //console.log("day? : " + timeBetween);
  if(timeBetween >= 1){
    return true;
  }
}
function setNewInSheet(){
  var radioSelected = radio.value()-1;
  console.log("radioSelected: " + radioSelected);
  console.log("new In sheet: " + idIndex[radioSelected]);
  inSheet = idIndex[radioSelected];
}
function setPreviusInSheet(){
  var bool = true;
  var tempinSheet = forRedraw;
  var backCount = 0;
  while(bool){
    //inSheet
    if(ifNextTrip(timeToNextMsINTab[tempinSheet])){
      backCount++;
    }
    if(backCount == 2){
      bool = false;
    }
    if(tempinSheet < 1){
      bool = false;
    }
    tempinSheet--;
  }
  inSheet = tempinSheet;
}

function noSelection(){

}

function  drawPoint(x,y){
  var zoom = myMap.zoom();
  r = windowHeight/50;//!!!!!!!!!!!!!!SOMTHING WITH ZOOL
  //r = (zoom+1)*20-(zoom+1)*50;
  pointStyle();
  ellipse(x,y,r,r);
  noFill();
  noStroke();
}
function  drawLine(x1,y1,x2,y2,i){
  //console.log("Draw line");
  lineStyle(i);
  line(x1,y1,x2,y2);
  noFill();
  noStroke();
  strokeWeight(0);
}

//---------------------MAth shit for curws---------------------
function findTheT(x1,y1,x2,y2){
  var sq = Math.sqrt(3);
  var v3 = [(x1 + x2 + sq*(y1 - y2))/2, (y1 + y2 + sq*(x2 - x1))/2];
  return v3;
}
function findTheHalf(x1,y1,x2,y2){
  x = (x1+x2)/2;
  y = (y1+y2)/2;
  return [x,y];
}
function findTheTowPonts(x1,y1,x2,y2){
  v3 = findTheT(x1,y1,x2,y2);
  var x3 = v3[0];
  var y3 = v3[1];

  m1 = findTheHalf(x1,y1,x3,y3);
  var m1x = m1[0];
  var m1y = m1[1];
  m2 = findTheHalf(x1,y1,x3,y3);
  var m2x = m2[0];
  var m2y = m2[1];

  return[m1x,m1y,m2x,m2y];
}


//Consmeticks
function setButStyls(b){
  b.parent('arowButton');

  var c = color('#f0f0f0');
  b.style('background-color', c);
  c = color(25);
  b.style('color', c);
  b.style('border', 'none');
}
function pointStyle(){
  fill(255);
}
function lineStyle(i){
  //caclate km/t
  //distansINTab;
  var h = timeToNextMsINTab[i]/(60*60*1000);
  var km_h = distansINTab[i]/h;
  //console.log("km/t: " + km_h);

  strokeWeight(2.5);

  if(h == 0){
    stroke('#FF0900');
  } else if(km_h > 200){
    stroke('#FF6900');
  }  else if(km_h > 80){
    stroke('#FEE300');
  } else if(km_h > 25){
    stroke('#cfff77');
    stroke('#00FFF3');
  } else if(km_h > 5){
    stroke('#0BFF01');
  }  else if(km_h > 0){
  } else {
    stroke('#0000ff');
  }


}

function dateToDay(time){
  var d = new Date(timeINTab[inSheet]);
  var s = "" + d.getDate()+"." + d.getMonth() +"."+ d.getFullYear();
  return s;
}
///Old stuff----------------------
