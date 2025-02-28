Number.prototype.mod = function (n) {
  "use strict";
  return ((this % n) + n) % n;
};

const map = document.getElementById("map");
const mapCtx = map.getContext("2d");

var tileSize = 15;
var mapWidth = document.getElementById("map").width;
var mapHeight = document.getElementById("map").height;
var mapCoords = [-mapWidth/2,-mapHeight/2];

function placeTile(x,y,color) {
  mapCtx.fillStyle = color;
  mapCtx.fillRect(x,y,tileSize,tileSize);
}

function drawMap() {
  mapCtx.clearRect(0,0,mapWidth,mapHeight);

  let numberOfCols = Math.ceil((mapWidth + (mapCoords[0].mod(tileSize)))/tileSize);
  let numberOfRows = Math.ceil((mapHeight + (mapCoords[1].mod(tileSize)))/tileSize);

  let topLeftTileCoords = [-(mapCoords[0].mod(tileSize)),-(mapCoords[1].mod(tileSize))]
  let topLeftTileId = [Math.floor(mapCoords[0]/tileSize),Math.floor(mapCoords[1]/tileSize)]

  for (x=0;x<numberOfCols;x++) {
    for (y=0;y<numberOfRows;y++) {
      let tileId = [topLeftTileId[0]+x,topLeftTileId[1]+y];
      let tileCanvasPos = [topLeftTileCoords[0]+(x*tileSize),topLeftTileCoords[1]+(y*tileSize)]

      generateTile(tileId[0],tileId[1]);
      placeTile(tileCanvasPos[0],tileCanvasPos[1],tileTypes[world[tileId[0]][tileId[1]].type].color)
      if (tileTypes[world[tileId[0]][tileId[1]].type].texture != undefined) {
        mapCtx.drawImage(document.getElementById(tileTypes[world[tileId[0]][tileId[1]].type].texture),tileCanvasPos[0],tileCanvasPos[1],tileSize,tileSize);
      }
    }
  }

  if (mouseDown == true) {
    mapCoords = [initialMapCoords[0]-mouseCoords[0]+initialMouseCoords[0],initialMapCoords[1]-mouseCoords[1]+initialMouseCoords[1]]
  }
}

var mouseDown = false;
var mouseCoords = [0,0]
var initialMouseCoords = [0,0]
var initialMapCoords = [0,0]

function mouseEvent(event) {
  mouseCoords = [event.clientX, event.clientY]
}

function mapClick() {
  initialMouseCoords = mouseCoords;
  initialMapCoords = mapCoords;
  mouseDown = true;

}

function mapRelease() {
  mouseDown = false;
}

setInterval(drawMap,1/30);