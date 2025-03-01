const tileTypes = {
  water: {
    color: "#0858cf"
  },
  coast: {
    color: "#1779d4"
  },
  grass: {
    color: "#55bd39"
  },
  forest: {
    color: "#208f01",
    texture: "tree"
  },
  plains: {
    color: "#a5cc43"
  },
  mountain: {
    color: "#777"
  }
}

class Tile {
  constructor(type) {
    this.type = type;
  }
}

var world = []

var elevationSeed = 2;

var rainfallSeed = 12;


function sampleNoiseMap(x,y,seed = 2, octaves = 1, baseScale = 1, octaveMultiplier = 0.5) {
  let value = 0;

  noise.seed(seed);

  for (i=0;i<octaves;i++) {

    value += noise.simplex2(x/(baseScale*(octaveMultiplier**i)),y/(baseScale*(octaveMultiplier**i))) * octaveMultiplier**i;

    noise.seed(seed+i);

  }

  return value;

}


function sampleElevation(x,y) {

  return sampleNoiseMap(x,y,elevationSeed,4,32);

}


function sampleRainfall(x,y) {

  return sampleNoiseMap(x,y,rainfallSeed,8,12,0.75)+((sampleElevation(x,y)-0.05)*-0.7);

}

function generateTile(X,Y) {
  if (typeof world[X] != "object") {world[X] = []};
  if (typeof world[X][Y] == "object") {return};
  let randomNumber = Math.random()
  if (sampleElevation(X,Y)<-0.1) {
    world[X][Y] = new Tile("water");
  } else if (sampleElevation(X,Y)<0.1) {
    world[X][Y] = new Tile("coast");
  } else if (sampleElevation(X,Y)>0.9) {
    world[X][Y] = new Tile("mountain");
  } else if (sampleRainfall(X,Y) > 0) {
    world[X][Y] = new Tile("forest");
  } else if (sampleRainfall(X,Y) < -0.8) {
    world[X][Y] = new Tile("plains");
  } else {
    world[X][Y] = new Tile("grass");
  }
}