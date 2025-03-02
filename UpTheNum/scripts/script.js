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
    { cost: new OmegaNum(30), owned: 0, id: "pup3", permanent: false },
    { cost: new OmegaNum(35), owned: 0, id: "pup4", permanent: false },
    { cost: new OmegaNum(80), owned: 0, id: "pup5", permanent: false },
    { cost: new OmegaNum(150), owned: 0, id: "pup6", permanent: false },
    { cost: new OmegaNum(300), owned: 0, id: "pup7", permanent: false }
  ],
  energy: {
    cost: new OmegaNum(10000),
    owned: new OmegaNum(0),
    scale: new OmegaNum(10),
    base: new OmegaNum(10000)
  },
  collapseResources: [ // ID - Photons - Light
    [new OmegaNum(0),new OmegaNum(0)],
    [new OmegaNum(0),new OmegaNum(0)]
  ],
  collapseLevel: 0,
  generatorBoost: new OmegaNum(1),
  prestigeCount: 0,
  prefs: {
    precision: 4,
    prestigeConfirmation: true
  },
  timeSpentThisPrestige: 0
};
var emptySave = JSON.stringify(game);
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
  //Setters if updating some variable every tick, returners if there is no variable
  generatorBoost: function () { //general boost to all generators
    var answer = new OmegaNum(1);
    if (game.upgrades[0].owned) {
      answer = answer.mul(1.5);
    }
    if (game.prestigeUpgrades[1].owned) {
      answer = answer.mul(game.generators[0].owned.add(game.generators[1].owned).add(game.generators[2].owned).add(game.generators[3].owned).mul(1/40).add(1).sqrt());
    }
    if (game.prestigeUpgrades[5].owned) {
      answer = answer.mul(((game.timeSpentThisPrestige/300)/+1)**0.5);
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
    let answer = game.generators[id].base.mul(game.generators[id].scale.pow(game.generators[id].owned))
    if (game.collapseLevel >= 1) {
      answer = answer.div(calc.collapseEffect(1));
    }
    game.generators[id].cost = answer.round();;
  },
  energyCost: function () {
    game.energy.cost = game.energy.base
      .mul(game.energy.scale.pow(game.energy.owned))
      .div(calc.collapseEffect(0))
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
  },
  collapseProduction: function(id) {
    return game.collapseResources[id][0];
  },
  collapseEffect: function(id) {
    if (id == 0) {
      return (game.collapseResources[0][1].add(1).log10().pow(1.2).add(1));
    }
    if (id == 1) {
      return (game.collapseResources[1][1].div(100).add(1).pow(0.35));
    }
  }
};

//GAME ACTIONS

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
  for (var i in game.collapseResources) {
    game.collapseResources[i][1] = OmegaNum(0);
  }
  game.energy.owned = OmegaNum(0);
}
function prestige() {
  if (game.number.lt(2000000)) {
    return;
  }

  if (game.prefs.prestigeConfirmation) {
    if (!confirm("Are you sure? Prestiging will reset all your previous progress.\n(I recommend you to be able to gain at least 1-2 photons on your first prestige.)")) {
      return;
    }
  }
  game.photons = game.photons.add(calc.photonsOnPrestige());
  game.prestigeCount++;
  prestigeReset();

  if (game.prefs.prestigeConfirmation) {
    alert("You collapse your current number, leading to a massive explosion destroying all your generators, upgrades, and energy. In the process, you gained some photons, which will boost your new generators.")
  }

  get("prestigeTabButton").classList.remove("hidden"); //unlock

}

function collapse() {
  if (!confirm("Are you sure you want to collapse? Half of your photons will disappear and will be converted into new forms.")) {return;}
  game.collapseResources[0][0] = game.collapseResources[0][0].add(game.photons.mul(0.5));
  for (i=1; i<=game.collapseLevel; i++) {
    let photonsCarriedOver = new OmegaNum(game.photons.mul(0.5).mul(OmegaNum(0.5).pow(i)));
    game.collapseResources[i-1][0] = game.collapseResources[i-1][0].sub(photonsCarriedOver);
    game.collapseResources[i][0] = game.collapseResources[i][0].add(photonsCarriedOver)
  }
  game.photons = game.photons.mul(0.5);
}

//OPTIONS & SAVING

function save() {
  localStorage.setItem("save", JSON.stringify(game));
}

function load(saveFile = JSON.parse(localStorage.getItem("save"))) {
  transfer(JSON.parse(emptySave), game);
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

function setPrecision() {
  let input = Math.round(Number(prompt("Enter a number between 1 and 10.")));
  if (isNaN(input)) {return;}
  if (input < 1 || input > 10) {return;}
  game.prefs.precision = input;
}

function togglePrestigeConfirmation() {
  game.prefs.prestigeConfirmation = !game.prefs.prestigeConfirmation;
}

//EXTRA FUNCTIONS

var timeSinceLastSave = 0;

function transfer(from, to) {
  //let sample = new Object;
  for (i in from) {
    if (typeof from[i] == "object") {
      try {
        transfer(from[i], to[i]);
      } catch {
        alert("Warning: not found in copy to: " + JSON.stringify(from));
      }
    } else {
      to[i] = from[i];
    }
  }
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
  for (i in tabs) {
    get(tabs[i]).style.display = "none";
  }
  get(tabs[what]).style.display = "block";
}

function subTab(tabList, tabId) {
  var tabs = [
    ["ptab0", "ptab1"]
  ]

  for (i in tabs[tabList]) {
    get(tabs[tabList][i]).style.display = "none";
  }

  get(tabs[tabList][tabId]).style.display = "block";
}

function increase() {
  game.number = game.number.add(calc.Click());
  updateNumber();
}
function updateNumber() {
  get("num-display").innerHTML =
    "<b>" + game.number.toPrecision(game.prefs.precision) + "</b> number";
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
      game.generators[i].cost.toPrecision(game.prefs.precision) +
      " | Owned: " +
      game.generators[i].owned.toPrecision(game.prefs.precision) +
      " | Produces " +
      calc.generatorProduction(i).toPrecision(game.prefs.precision) +
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
      "Cost: " + current.cost.toPrecision(game.prefs.precision);
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
      "Cost: " + current.cost.toPrecision(game.prefs.precision) + " photons";
  }

  if (game.energy.cost.gt(game.number)) {
    get("energyBtn").classList.remove("canBuy");
    get("energyBtn").classList.add("noBuy");
  } else {
    get("energyBtn").classList.add("canBuy");
    get("energyBtn").classList.remove("noBuy");
  }
  get("energyCost").textContent = "Cost: " + game.energy.cost.toPrecision(game.prefs.precision);
  get("energyOwned").textContent = "Owned: " + game.energy.owned.toPrecision(game.prefs.precision);

  for (i = 0; i < game.collapseResources.length; i++) {
    game.collapseResources[i][1] = game.collapseResources[i][1].add(calc.collapseProduction(i).div(20.0));
  }

  if (game.prestigeUpgrades[6].owned == 1) {
    game.collapseLevel = 1;
  } else {
    game.collapseLevel = 0;
  }

  //update html

  if (game.number.gte(2000000)) {
    get("prestigeBottomText").innerHTML =
      "Gain " +
      calc.photonsOnPrestige().toPrecision(game.prefs.precision) +
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
    game.photons.toPrecision(game.prefs.precision) +
    " photons, giving you a " +
    game.photons.add(1).sqrt().toPrecision(game.prefs.precision) +
    "x boost to all generators.";

  get("collapseText0").textContent =
    "You have " +
    game.collapseResources[0][0].toPrecision(game.prefs.precision) +
    " radio photons, producing " +
    calc.collapseProduction(0).toPrecision(game.prefs.precision) +
    " radio light per second. You have " + 
    game.collapseResources[0][1].toPrecision(game.prefs.precision) +
    " radio light, translated to a " +
    calc.collapseEffect(0).toPrecision(game.prefs.precision) +
    "x reduction in energy cost."
  get("collapseText1").textContent =
    "You have " +
    game.collapseResources[1][0].toPrecision(game.prefs.precision) +
    " microwave photons, producing " +
    calc.collapseProduction(1).toPrecision(game.prefs.precision) +
    " microwave light per second. You have " + 
    game.collapseResources[1][1].toPrecision(game.prefs.precision) +
    " microwave light, translated to a " +
    calc.collapseEffect(1).toPrecision(game.prefs.precision) +
    "x reduction in generator cost."

  if (game.collapseLevel < 1) {
    get("collapseText1").classList.add("hidden")
  } else {
    get("collapseText1").classList.remove("hidden")
  }

  get("precisionChanger").textContent = "Change Number Precision: " + game.prefs.precision;
  get("prestigeToggle").textContent = "Toggle Prestige Confirmation (" + (game.prefs.prestigeConfirmation ? "ON)" : "OFF)");
  game.timeSpentThisPrestige += 1/20;
  //upgrade effects

  if (game.prestigeUpgrades[0].owned) {game.upgrades[0].permanent = true}
  if (game.prestigeUpgrades[4].owned) {
    get("collapsingTabBtn").classList.remove("hidden");
  } else {
    get("collapsingTabBtn").classList.add("hidden");
  }

  //extra

  timeSinceLastSave += 1 / 20;
  if (timeSinceLastSave > 15) {
    timeSinceLastSave = 0;
    save();
  }

  game.number = game.number.add(game.numberPerSecond.div(20.0));
  get("npsCount").innerHTML =
    "+<b>" + game.numberPerSecond.toPrecision(game.prefs.precision) + "</b> per second";
  game.numberPerSecond = OmegaNum(0);
}

setInterval(MainLoop, 50);
load();
