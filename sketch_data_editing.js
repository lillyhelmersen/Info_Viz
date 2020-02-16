const dataIN = 'I-Naturia-Carnivorus-Plants.csv';

let printTable;
var idCountArray;
//Table with info
var userIdINTab;
var createdAtINTab;
var latINTab;
var longINTab;

var tableIN;

var theTime = "To day";

var numberOfIds = 12;

function preload(){
  //table = loadTable(dataCS, 'csv', 'header');
  tableIN = loadTable(dataIN, 'csv', 'header');
}

function setup() {
  setPrintTable();
  filterDataIN(tableIN);

  //filterDataCD(table);
  //myMap.onChange(drawMarks);
  makeToTable();
  printTabel();
}
function draw() {

}
//-------setup----------
function setRadioButtons(){
  console.log("Trying to make radio butons");
  radio = createRadio('radios');
  radio.style('color', '#ffffff');
  for (i = 0; i < numberOfIds; ++i){
    var j = i+1;
    var tempName = 'User: ' + j + '\n';
    var butName = tempName;
    radio.option(butName);
  }

  //radio.option('white');
  radio.style('width', '90px');
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

  buttonP.mousePressed(nextTrip);
  buttonN.mousePressed(nextTrip);
}
function setText(){
  stroke(255);
  fill(255);
  textAlign(CENTER, CENTER);
  var tSixe = width / 40;
  textSize(tSixe);
  text(theTime, width-width/10, tSixe);
}
function setMapp(){
  canvas = createCanvas(windowWidth, windowHeight);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
}
function setPrintTable(){
  printTable = new p5.Table();

  printTable.addColumn('id');
  printTable.addColumn('lat');
  printTable.addColumn('long');
  printTable.addColumn('distans');
  printTable.addColumn('time');
  printTable.addColumn('timeToNextMs');
}

function regitrerData(){

}

function printTabel(){
  saveTable(printTable, "the12Top", "csv");
}
function makeToTable(){
  console.log("Starting add to table");

  //console.log("createdAtINTab[0]: " + createdAtINTab[0]);
  var timeNextMs;
  var distans;

  ar = idCountArray;
  for(i = 0; i < numberOfIds; i++){
    for(j = 0 ; j < userIdINTab.length; j++){
      if (userIdINTab[j] == ar[i][0]){
        //console.log("Found mach in addTo Tabel: " + userIdINTab[j]);
        if(createdAtINTab[j+1] != null){
          var date01 = new Date(createdAtINTab[j]);
          var date02 = new Date(createdAtINTab[j+1]);
          timeNextMs = daysBetween(date01,date02);
          //timeNext = createdAtINTab[j] - createdAtINTab[j+1];

        } else {
          timeNextMs = -1;
        }
        /*
        calculate distansn in km
        if same day
        calulate km/h
        compare and set color
        */
        if (latINTab[j+1] != null){
          //distans
          //getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2)
          distans = getDistanceFromLatLonInKm(latINTab[j], longINTab[j], latINTab[j+1], longINTab[j+1]);
          //console.log("Distans: " + distans);
        } else {
          distans = -1;
        }



        //console.log("timeNextMs: " + timeNextMs);

        let newRow = printTable.addRow();
        newRow.setNum('id', userIdINTab[j]);
        newRow.setString('lat', latINTab[j]);
        newRow.setString('long', longINTab[j]);
        newRow.setString('distans', distans);
        newRow.setString('time', createdAtINTab[j]);
        newRow.setString('timeToNextMs', timeNextMs);

      }
    }
  }

}

function filterDataCD(table){
  latTab = table.getColumn("lat");
  longTab = table.getColumn("long");
  picture_authorTab = table.getColumn("picture_author");
}
function filterDataIN(data){

  console.log("Start filter IN data");

  userIdINTab = tableIN.getColumn("user_id");
  createdAtINTab = tableIN.getColumn("created_at");
  latINTab = tableIN.getColumn("latitude");
  longINTab = tableIN.getColumn("longitude");

  var rows = tableIN.getRowCount();
  countIDS(userIdINTab);
  /*
  console.log(table.getRowCount() + " total Rows in table :D ");
  console.log(table.getColumnCount() + " total Column in table");
  */

}


function countIDS(ar){
  if(ar == null){
    console.log("Start countIDS array is null");
  } else {
    console.log("Start countIDS array is not null");
  }


//Sorting data IDs after icother
  ar.sort(function(a, b){return a - b});

  var idCount = [[]];//[[id],[count]];[[x,y],[x,y]]
  var notFirst = false;
  /*var a = data;
  var result = { };
  var aLengt = 100;//a.length;
*/
console.log("ar.length(35259): " + ar.length);
//Iterates tha array of sorted ids !!!!remeber to modefy so not array out of bounds
  for(var i = 0; i < ar.length; ++i){
    //Cheks if this and next is tha same to maby count(levs out entrys with 1 picture)
    var idNum = ar[i];
    //console.log("ar[i]: " + ar[i]);
  //  if (ar[i] == ar[i+1]){
      //Chek if its the first entry
      if (notFirst){
        idCountLength = idCount.length-1;
        //Cheks fi we have saved the entry alreddy
        lastEntyr = idCount[idCountLength][0];
        //console.log("Last entry: " + lastEntyr + " idCountLength: " +idCountLength);
        if(ar[i] == lastEntyr){
          //console.log("try cointin");
          idCount[idCountLength][1] = idCount[idCountLength][1] + 1;
        } else {
          if(ar[i+1] != null && ar[i] == ar[i+1] ){
            //console.log(" - Added new");

            idCount.push([idNum,1]);
            /*idCount[idCountLength+1][0] = ar[i];
            idCount[idCountLength+1][1] = 1;*/
          }

        }
        //idCount.puch([ar[i],1]);
      } else {//if not empty
        //console.log(" - Tys to add first ");
        if(ar[i] == ar[i+1]){
          //console.log(" - Added first entry ar[i]: " + ar[i]);
          idCount[0][0] = ar[i];
          idCount[0][1] = 1;
          notFirst = true;
        }
      }
    //}

  }
/*
  if(idCount != null){
    for (i = 0; i < idCount.length; i++){
      console.log("idCount[0][" + i + "]: |" + idCount[1][i] + "|");
    }
  }
  */



  sortedOnNumberEntrys = sortArrayByNEntry(idCount);
  idCountArray = sortedOnNumberEntrys;
/*
sortedOnNumberEntrys = idCount;
sortedOnNumberEntrys.sort(function(a, b) {
    var x = a[1];
    var y = b[1];
    return x - y;
});
*/
  //printDobleArray(sortedOnNumberEntrys);

  //printDobleArray(idCount);

}

function sortArrayByNEntry(array){
  if(array == null){
    console.log("Start sortArrayByNEntry array is null");
  }
  var a = array;
  if (array !== undefined) {
    a.sort(sortFunction);

    function sortFunction(a, b) {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] > b[1]) ? -1 : 1;
        }
    }
  }


  return a;
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
function drawMarks(){
  clear();
  for (i = 0; i < 100; i++){
    let position1 = myMap.latLngToPixel(latTab[i], longTab[i]);
    x1 = position1.x;
    y1 = position1.y;

    //r = 8+abs(22*sin(frameCount/50));
    r = windowHeight/50;

    ellipse(x1,y1,r,r);

    stroke(255);

    if (picture_authorTab[i] == picture_authorTab[i+1]){
      r2 = 50;//Math.sqrt(9);//myMap.getZoom()*2;
      let position2 = myMap.latLngToPixel(latTab[i+1], longTab[i+1]);
      x2 = position2.x;
      y2 = position2.y;
      mits = findTheTowPonts(x1,y1,x2,y2)
      cpx1 = mits[0];
      cpy1 = mits[1];
      cpx2 = mits[2];
      cpy2 = mits[3];
      /*
      cpx1 = x1 + r2;
      cpy1 = y1 + r2;
      cpx2 = x2 + r2;
      cpy2 = y2 + r2;
      */


      //beginShape();
      noFill();
      //arc(x1, y1, x2, y2, -PI, 0, OPEN);
      //curve (cpx1, cpy1, x1, y1, x2, y2, cpx2, cpy2);
      //bezier(x1, y1, cpx1, cpy1, cpx2, cpy2, x2, y2);
      line(x1,y1,x2,y2);
      //drawLine([x1,y1],[x2,y2])
      fill(255);

      //*/
    }
    stroke(0);
    //*/
  }
}
function nextTrip(){

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
///Old stuff----------------------
