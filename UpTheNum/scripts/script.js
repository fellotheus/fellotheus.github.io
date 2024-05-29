/*
          DEFINING
*/

var game = {
  number: new OmegaNum(0),
  numberPerSecond: new OmegaNum(0),
  photons: new OmegaNum(0),
  generators: [
    {
      cost: new OmegaNum(20),
      owned: new OmegaNum(0),
      scale: new OmegaNum(1.15),
      id: "gen1",
      power: new OmegaNum(0.2),
      base: new OmegaNum(20),
      mult: new OmegaNum(1)
    },
    {
      cost: new OmegaNum(200),
      owned: new OmegaNum(0),
      scale: new OmegaNum(1.15),
      id: "gen2",
      power: new OmegaNum(2),
      base: new OmegaNum(200),
      mult: new OmegaNum(1)
    },
    {
      cost: new OmegaNum(2500),
      owned: new OmegaNum(0),
      scale: new OmegaNum(1.15),
      id: "gen3",
      power: new OmegaNum(8),
      base: new OmegaNum(2500),
      mult: new OmegaNum(1)
    },
    {
      cost: new OmegaNum(12500),
      owned: new OmegaNum(0),
      scale: new OmegaNum(1.15),
      id: "gen4",
      power: new OmegaNum(40),
      base: new OmegaNum(12500),
      mult: new OmegaNum(1)
    }
  ],
  upgrades: [
    { cost: new OmegaNum(200), owned: 0, id: "up1", permanent: false },
    { cost: new OmegaNum(800), owned: 0, id: "up2", permanent: false },
    { cost: new OmegaNum(3000), owned: 0, id: "up3", permanent: false },
    { cost: new OmegaNum(22000), owned: 0, id: "up4", permanent: false },
    { cost: new OmegaNum(150000), owned: 0, id: "up5", permanent: false }
  ],
  prestigeUpgrades: [
    { cost: new OmegaNum(1), owned: 0, id: "pup1", permanent: false },
    { cost: new OmegaNum(6), owned: 0, id: "pup2", permanent: false },
    { cost: new OmegaNum(10), owned: 0, id: "pup3", permanent: false },
    { cost: new OmegaNum(12), owned: 0, id: "pup4", permanent: false }
  ],
  energy: {
    cost: new OmegaNum(10000),
    owned: new OmegaNum(0),
    scale: new OmegaNum(10),
    base: new OmegaNum(10000)
  },
  generatorBoost: new OmegaNum(1),
  prestigeCount: 0
};
var buy = {
  gen: function (what) {
    if (game.generators[what].cost.gt(game.number)) {
      return;
    }
    game.number = game.number.sub(game.generators[what].cost);
    game.generators[what].owned = game.generators[what].owned.add(1);
    calc.generatorCost(what);
  },
  upgrade: function (what) {
    if (game.upgrades[what].cost.gt(game.number)) {
      return;
    }
    if (game.upgrades[what].owned == 1) {
      return;
    }
    game.number = game.number.sub(game.upgrades[what].cost);
    game.upgrades[what].owned = 1;
  },
  energy: function () {
    if (game.energy.cost.gt(game.number)) {
      return;
    }
    game.number = game.number.sub(game.energy.cost);
    game.energy.owned = game.energy.owned.add(1);
    calc.energyCost();
  },
  prestigeUpgrade: function (what) {
    if (game.prestigeUpgrades[what].cost.gt(game.photons)) {
      return;
    }
    if (game.prestigeUpgrades[what].owned == 1) {
      return;
    }
    game.photons = game.photons.sub(game.prestigeUpgrades[what].cost);
    game.prestigeUpgrades[what].owned = 1;
  },
};
var calc = { 
  //Returners if used on specific event (e.g. click) or a part of calculation.
  //Setters if value should update every tick
  generatorBoost: function () {
    var answer = new OmegaNum(1);
    if (game.upgrades[0].owned) {
      answer = answer.mul(1.5);
    }
    if (game.prestigeUpgrades[1].owned) {
      answer = answer.mul(game.generators[0].owned.add(game.generators[1].owned).add(game.generators[2].owned).add(game.generators[3].owned).mul(1/40).add(1).sqrt());
    }
    answer = answer.mul(OmegaNum.pow(2, game.energy.owned));
    answer = answer.mul(game.photons.add(1).sqrt());
    game.generatorBoost = answer;
  },
  Click: function () {
    var answer = 1;
    return answer;
  },
  generatorCost: function (id) {
    game.generators[id].cost = game.generators[id].base
      .mul(game.generators[id].scale.pow(game.generators[id].owned))
      .round();
  },
  energyCost: function () {
    game.energy.cost = game.energy.base
      .mul(game.energy.scale.pow(game.energy.owned))
      .round();
  },
  generatorProduction: function (id) {
    let answer = game.generators[id].power.mul(
      game.generatorBoost.mul(game.generators[id].mult)
    );
    if (id == 0) {
      if (game.upgrades[1].owned) {
        answer = answer.mul(2);
      }
      if (game.prestigeUpgrades[2].owned) {
        answer = answer.mul(5);
      }
    }
    if (id == 1) {
      if (game.upgrades[2].owned) {
        answer = answer.mul(2);
      }
      if (game.prestigeUpgrades[3].owned) {
        answer = answer.mul(3);
      }
    }
    if (id == 2 && game.upgrades[3].owned) {
      answer = answer.mul(2);
    }
    if (id == 3 && game.upgrades[4].owned) {
      answer = answer.mul(2);
    }
    return answer;
  },
  photonsOnPrestige: function () {
    let answer = game.number.div(2000000).sqrt().sub(1);
    return answer;
  }
};
function prestigeReset() {
  game.number = OmegaNum(0);
  for (var i in game.generators) {
    game.generators[i].owned = OmegaNum(0);
  }
  for (var i in game.upgrades) {
    if (!game.upgrades[i].permanent) {
      game.upgrades[i].owned = 0;
    }
  }
  game.energy.owned = OmegaNum(0);
}
function prestige() {
  if (game.number.lt(2000000)) {
    return;
  }

  if (!confirm("Are you sure? Prestiging will reset all your previous progress.\n(I recommend you to be able to gain at least 1-2 photons on your first prestige.)")) {
    return;
  }

  game.photons = game.photons.add(calc.photonsOnPrestige());
  game.prestigeCount++;
  prestigeReset();

  alert("You collapse your current number, leading to a massive explosion destroying all your generators, upgrades, and energy. In the process, you gained some photons, which will boost your new generators.")

  get("prestigeTabButton").classList.remove("hidden"); //unlock

}

//EXTRA FUNCTIONS

var timeSinceLastSave = 0;

function transfer(from, to) {
  //let sample = new Object;
  for (i in from) {
    if (typeof from[i] == "object") {
      transfer(from[i], to[i]);
    } else {
      to[i] = from[i];
    }
  }
}

function save() {
  localStorage.setItem("save", JSON.stringify(game));
}

function load(saveFile = JSON.parse(localStorage.getItem("save"))) {
  transfer(saveFile, game);
  if (game.prestigeCount == 0) {
    get("prestigeTabButton").classList.add("hidden");
  } else {
    get("prestigeTabButton").classList.remove("hidden");
  }
}

function exportSave() {
  navigator.clipboard.writeText(JSON.stringify(game));
}

function importSave() {
  importedSave = JSON.parse(window.prompt("Paste the save below."));
  load(importedSave);
}


function clearSave() {
  localStorage.clear("save");
}
function get(what) {
  return document.getElementById(what);
}
function oom(n) {
  return Math.floor(Math.log(n) / Math.LN10 + 0.000000000001); // because float math sucks like that
}
function multiplyString(what, times) {
  var answer = "";
  for (i = 0; i < times; i++) {
    answer += what;
  }
  return answer;
}
function round(what, precision = 4) {
  var answer;
  var num = what;
  if (what < 10 ** (precision + 1)) {
    //No E
    answer = parseFloat(what.toString().slice(0, precision + 1)); //compensates for the decimal point for numbers whose length <= precision, intentionally adds an extra digit for numbers whose length=one more than precision
    answer = answer.toString();
    if (oom(num) + 1 < precision) {
      if (answer.length < precision + 1 && answer == Math.round(answer)) {
        answer += ".";
      }
      if (answer.length < precision + 1) {
        answer += multiplyString("0", precision + 1 - answer.length);
      }
    }
  } else if (oom(what) < 21) {
    //With E
    answer =
      what.toString().slice(0, 1) + "." + what.toString().slice(1, precision);
    answer += "e" + oom(what);
  } else {
    //With E in normal view
    if (what.toString().length <= precision + 5) {
      what = what * 1.000000000000001;
    }
    answer = what.toString().slice(0, precision + 1);
    answer += "e" + oom(what);
  }
  return answer;
}

function tab(what) {
  var tabs = ["tab0", "tab1", "tab2", "tab3", "prestigeTab"];
  for (i = 0; i < tabs.length; i++) {
    get(tabs[i]).style.display = "none";
  }
  get(tabs[what]).style.display = "block";
}
function increase() {
  game.number = game.number.add(calc.Click());
  updateNumber();
}
function updateNumber() {
  get("num-display").innerHTML =
    "<b>" + game.number.toPrecision(4) + "</b> number";
}

/*THE MAIN LOOP*/

function MainLoop() {
  updateNumber();
  calc.energyCost();
  calc.generatorBoost();
  for (var i in game.generators) {
    //iterate on generators
    calc.generatorCost(i);
    current = game.generators[i];
    get(current.id).textContent =
      "Buy Generator " +
      (parseInt(i) + 1) +
      " for " +
      game.generators[i].cost.toPrecision(4) +
      " | Owned: " +
      game.generators[i].owned.toPrecision(4) +
      " | Produces " +
      calc.generatorProduction(i).toPrecision(4) +
      " per second"; //update generator
    if (current.cost.gt(game.number)) {
      //CANNOT BUY
      get(current.id).classList.remove("bought");
      get(current.id).classList.remove("canBuy");
      get(current.id).classList.add("noBuy");
    } else {
      //CAN BUY
      get(current.id).classList.remove("bought");
      get(current.id).classList.add("canBuy");
      get(current.id).classList.remove("noBuy");
    }
    game.numberPerSecond = game.numberPerSecond.add(
      current.owned.mul(calc.generatorProduction(i))
    );
  }
  for (i = 0; i < game.upgrades.length; i++) {
    //iterate upgrades
    current = game.upgrades[i];
    if (current.owned == 1) {
      //OWNED
      get(current.id).classList.add("bought");
      get(current.id).classList.remove("canBuy");
      get(current.id).classList.remove("noBuy");
    } else if (current.cost.gt(game.number)) {
      //CANNOT BUY
      get(current.id).classList.remove("bought");
      get(current.id).classList.remove("canBuy");
      get(current.id).classList.add("noBuy");
    } else {
      //CAN BUY
      get(current.id).classList.remove("bought");
      get(current.id).classList.add("canBuy");
      get(current.id).classList.remove("noBuy");
    }
    get(current.id + "cost").textContent =
      "Cost: " + current.cost.toPrecision(4);
  }
  for (i = 0; i < game.prestigeUpgrades.length; i++) {
    //iterate upgrades
    current = game.prestigeUpgrades[i];
    if (current.owned == 1) {
      //OWNED
      get(current.id).classList.add("bought");
      get(current.id).classList.remove("canBuy");
      get(current.id).classList.remove("noBuy");
    } else if (current.cost.gt(game.photons)) {
      //CANNOT BUY
      get(current.id).classList.remove("bought");
      get(current.id).classList.remove("canBuy");
      get(current.id).classList.add("noBuy");
    } else {
      //CAN BUY
      get(current.id).classList.remove("bought");
      get(current.id).classList.add("canBuy");
      get(current.id).classList.remove("noBuy");
    }
    get(current.id + "cost").textContent =
      "Cost: " + current.cost.toPrecision(4) + " photons";
  }
  if (game.energy.cost.gt(game.number)) {
    get("energyBtn").classList.remove("canBuy");
    get("energyBtn").classList.add("noBuy");
  } else {
    get("energyBtn").classList.add("canBuy");
    get("energyBtn").classList.remove("noBuy");
  }
  get("energyCost").innerHTML = "Cost: " + game.energy.cost.toPrecision(4);
  get("energyOwned").innerHTML = "Owned: " + game.energy.owned.toPrecision(4);

  //update small things

  if (game.number.gte(2000000)) {
    get("prestigeBottomText").innerHTML =
      "Gain " +
      calc.photonsOnPrestige().toPrecision(3) +
      " photons";
  } else {
    get("prestigeBottomText").innerHTML = "Requires 2e6 number";
  }
  if (game.number.gte(100000) || game.prestigeCount != 0) {
    get("prestigeButton").classList.remove("hidden");
  } else {
    get("prestigeButton").classList.add("hidden");
  }
  get("prestigeTabText").textContent =
    "You have " +
    game.photons.toPrecision(4) +
    " photons, giving you a " +
    game.photons.add(1).sqrt().toPrecision(4) +
    "x boost to all generators.";

  //upgrade effects

  if (game.prestigeUpgrades[0].owned) {game.upgrades[0].permanent = true}

  //extra

  timeSinceLastSave += 1 / 20;
  if (timeSinceLastSave > 15) {
    timeSinceLastSave = 0;
    save();
  }

  game.number = game.number.add(game.numberPerSecond.div(20.0));
  get("npsCount").innerHTML =
    "+<b>" + game.numberPerSecond.toPrecision(4) + "</b> per second";
  game.numberPerSecond = OmegaNum(0);
}

setInterval(MainLoop, 50);
load();
