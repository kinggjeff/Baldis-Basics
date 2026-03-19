let maze = [
  "------whhhw-----------------------------------------------------------------------------------",
  "------w---w-----------------------------------------------------------------------------------",
  "------w---w-----------------------------------------------------------------------------------",
  "------w---w-----------------------------------------------------------------------------------",
  "------w---w-----------------------------------------------------------------------------------",
  "------w---whhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhw---------------------",
  "------w---wp------------------------------------------pw----------------w---------------------",
  "------w---w--------------------------------------------w--------k-------w---------------------",
  "------w---w--------------------------------------------w----------------w---------------------",
  "------w---w--------------------------------q-----------w----whhhhhhhw---w---------------------",
  "------w---w------------------m-------------------------w----w-------w---w---------------------",
  "------w---w--------------------------------------------w----w---c-c-w---w---------------------",
  "------w---w--------------------------------------------w----w-------d---w---------------------",
  "------w---w---------m----------------------------------w----w---c-c-w---w---------------------",
  "------w---w--------------------------------------------w----w-------w---w------------------------",
  "whhhhhw------------------------------------m----------------whhhhhhhw---w-----------------------",
  "w-c-c-w---k--------------------------------------------k----w-------w-q-w-----------------------",
  "w-----w-----------------------------------------------------w-------w---w-----------------------",
  "w-c-c-w---w--------------------------------------------w----w-------w---w-----------------------",
  "w-----w---w------------m-------------------------------w----w-------w---w-----------------------",
  "w-c-c-w---w-----------------------------m--------------w----w-------w---w-----------------------",
  "w-----d---w--------------------------------------------w----whhhhhhhw---w-----------------------",
  "w-c-c-w---w--------------------------------------------w----w-------w---w-----------------------",
  "w-----w---w---------q----------------------------------w----w--c--c-w---w------------------------",
  "w--z--w---w--------------------------------------------w----w-------w---w------------------------",
  "w-----w-q-w----------------------------------pv--------w----b-------w---w------------------------",
  "whhhhhw---whhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh----w----q--w---w------------------------",
  "------w---------llllllll------------------------------------w-------w---w------------------------",
  "------w-------------------------------------pv--------------w--c--c-w---w------------------------",
  "------w---whhhhhhhhhhhhhhhw---whhhjhhhhhhhhhhhhhhhhhhhhhw---w-------w---w------------------------",
  "------w---w---------------w---w-c---c-c--w--------------w---whhhhhhhw---w------------------------",
  "------w---w---------------w---w----------w--------------w---w-------w---w-------------------------",
  "------w---w---------------w---w-c---z----w--------------w---w-------w---w------------------------",
  "------w---w---------------w---w----------w--------------w---whhhhhhhw-q-w-------------------------",
  "------w---w---------------w---hhhhhhhhhhhh--------------w-y-w-c-c-c-w---w-------------------------",
  "------w---w---------------w---------------whhhhhhhhhhhhhw---w-------w---w-------------------------",
  "------w---w---------------w-------k-------w-------------w---w-c-c-c-w---w-------------------------",
  "------w---w---------------w---------------w---c--c--c---w---w-------w---w-------------------------",
  "------w-q-whhhhhhhhhhhhhhhhhhhhhhhhhhhw---w-------------w---w-c-c-c-d---w-------------------------",
  "------w---w---------------------------w---w------q------w---w-------w---w-------------------------",
  "------w---w-----c----c----c---c-------w-q-w-------------d---w-c-c-c-w---w-------------------------",
  "------w---b--------------q------------w---w--c--c---c---w---w-------w---w-------------------------",
  "------w---w--------c---c------c-------w---w-------------w---w---z---w---w-------------------------",
  "------w---whhhhhhhhhhhhhhhhhhhhhhhhhhhw---whhhhhhhhhhhhhw---w-------w---w-------------------------",
  "------w---w----------------------------------lllll----------whhhhhhhh---w-------------------------",
  "------w---w-----------------------------------------q----------w----w---w-------------------------",
  "------w---w-------lllll-----vp---------------------------------w----w---w-------------------------",
  "------w---whhhhhhhhhhhhhhhhhhhhhhnhhhhhhhw---whhhhhhjhhhhhhw---w----w---w-------------------------",
  "------w---w-------------------w----------w---w-------------w---w----w---w-------------------------",
  "------w---w-------------------w----------w---w-c-c-c-c-c-c-w---w----b---w-------------------------",
  "------w---w-------------------w----c-----w---w-------------w---w----w---w-------------------------",
  "------w---w-------------------w----------w---w-c----z----c-w---w----w---w-------------------------",
  "------w---whhhhhhhhhhhhhhhhhhhw--c---c---w---w-------------w---w----w---w-------------------------",
  "------w-q-w-------------------w----------w---whhhhhhhhhhhhhw---w----w---w-------------------------",
  "------w---w---c----c-----c----w-------q--w---w-------------w---w----w---w-------------------------",
  "------w---w-------------------w----------w---w-------------w---whhhhw---w-------------------------",
  "------w---w-------------------b--c---c---w---w-------------w---w----w---w-------------------------",
  "------w---w-------c-----c-----w----------w---w-------------w---w----w---w-------------------------",
  "------w---w-------------------whhhhhhhhhhw-y-whhhhhhhhhhhhhw-q-w----w---w-------------------------",
  "------w---w-------------------w----------w---w-------------w---w----w---w-------------------------",
  "------w---w-------q-----------w-c-c-c-c--w---w---c-c-c-c-c-w---w----w---w-------------------------",
  "------w---w-------------------w----------w---d-------------w---w----w---w-------------------------",
  "------w---w-----c-----c-------w-c-c-c-c--w---w---c-c-c-c-c-w---whhhhw---w-------------------------",
  "------w---w-------------------w----------d---w-------------w---w-c--w---w-------------------------",
  "------w---w----c---c----c-----w-----z----w---w------z------w---d--q-w---w-------------------------",
  "------w---w-------------------w----------w---w-------------w---w-c--w---w-------------------------",
  "------w---hhhhhhhhhhnhhhhhhhhhhhhhhhhhhhhh-t-hhhhhhhhhhhhhhh---hhhhhh---w-------------------------",
  "------w-----------------------------------------------------------------w-------------------------",
  "------w-------q--------------------k------q--------k--------------------w-------------------------",
  "------wp-----llll----vp----llll-------------------------lllll---llll--pvw------------------------",
  "------whhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh---hhhhhhhhhhhhhhhhhhhhhhhhhhhw-----------------------",
  "-----------------------------------------wp-pw--------------------------------------------------",
  "-----------------------------------------hhhhh--------------------------------------------------",
  
];
let scene,player;
let notebooks = 0, notebook_text;
let coins = 0, coin_text;
let staminaBarContainerEl;
let baldis = [];
let coinObjects = [];  // Track all coins for collision detection
let vendingShopEl, vendingStatusEl;
let startScreenEl;
let loseScreenEl, loseDetailsEl, restartButtonEl;
let loseBaldiModelEl, loseBaldiCameraEl;
let gameStarted = false;
let gameOver = false;
let playerSpeedBoostTimeout = null;
let baldiSlowTimeout = null;

window.DOOR_STATES = window.DOOR_STATES || {};

const PLAYER_SPEED_BOOST_MULTIPLIER = 1.8;
const PLAYER_SPEED_BOOST_DURATION_MS = 10000;
const BALDI_SLOW_MULTIPLIER = 0.5;
const BALDI_SLOW_DURATION_MS = 10000;
const BALDI_COLLISION_DISTANCE = 1;
const BALDI_BLOCKING_DISTANCE = 1.1;
const TITLE_ROOM_SPAWN = {x: -43, y: 1, z: 300, yaw: 180};
const OPTIONS_ROOM_SPAWN = {x: -67, y: 1, z: 300, yaw: 180};
const ABOUT_ROOM_SPAWN = {x: -19, y: 1, z: 300, yaw: 180};
const GAMEPLAY_SPAWN = {x: 43, y: 1, z: -71, yaw: 180};

function createShape(tagName, attributes, parent = scene) {
  const el = document.createElement(tagName);
  for (const [name, value] of Object.entries(attributes)) {
    el.setAttribute(name, value);
  }
  parent.append(el);
  return el;
}

function teleportPlayer(spawn) {
  if (!player || !player.driver || !player.driver.object3D) return;

  player.driver.object3D.position.set(spawn.x, spawn.y, spawn.z);
  if (player.driver.body) {
    player.driver.body.velocity.set(0, 0, 0);
    player.driver.body.angularVelocity.set(0, 0, 0);
  }

  if (player.obj && player.obj.object3D) {
    const yawRad = (spawn.yaw * Math.PI) / 180;

    if (player.obj.parentEl && player.obj.parentEl.object3D) {
      player.obj.parentEl.object3D.rotation.set(0, 0, 0);
    }
    player.obj.object3D.position.set(spawn.x, spawn.y + 0.5, spawn.z);
    player.obj.object3D.rotation.set(0, yawRad, 0);
    player.obj.setAttribute("rotation", `0 ${spawn.yaw} 0`);

    const lookControls = player.obj.components && player.obj.components["look-controls"];
    if (lookControls && lookControls.yawObject && lookControls.pitchObject) {
      lookControls.yawObject.rotation.y = yawRad;
      lookControls.pitchObject.rotation.x = 0;
    }
  }
}

function createMenuRoom(center, wallColor, floorColor, accentColor) {
  const room = createShape("a-entity", {position: `${center.x} 0 ${center.z}`});
  const width = 16;
  const depth = 12;
  const height = 6;

  createShape("a-box", {
    position: "0 0.1 0",
    width,
    height: 0.2,
    depth,
    color: floorColor,
    roughness: 0.9,
    "static-body": ""
  }, room);

  createShape("a-box", {
    position: "0 6 0",
    width,
    height: 0.2,
    depth,
    color: "#f4f4f4",
    roughness: 0.8
  }, room);

  createShape("a-box", {
    position: `0 ${height / 2} ${-depth / 2}`,
    width,
    height,
    depth: 0.28,
    color: wallColor,
    "static-body": ""
  }, room);
  createShape("a-box", {
    position: `0 ${height / 2} ${depth / 2}`,
    width,
    height,
    depth: 0.28,
    color: wallColor,
    "static-body": ""
  }, room);
  createShape("a-box", {
    position: `${-width / 2} ${height / 2} 0`,
    width: 0.28,
    height,
    depth,
    color: wallColor,
    "static-body": ""
  }, room);
  createShape("a-box", {
    position: `${width / 2} ${height / 2} 0`,
    width: 0.28,
    height,
    depth,
    color: wallColor,
    "static-body": ""
  }, room);

  createShape("a-plane", {
    position: "0 3 -5.85",
    width: 9.5,
    height: 2.2,
    color: accentColor,
    side: "double"
  }, room);

  createShape("a-light", {
    type: "ambient",
    intensity: 0.22,
    color: "#ffffff"
  }, room);
  createShape("a-light", {
    type: "point",
    intensity: 0.65,
    distance: 24,
    decay: 1,
    color: "#ffffff",
    position: "0 5.2 0"
  }, room);

  return room;
}

function createBoardButton(parent, label, color, position, onClick, options = {}) {
  const width = typeof options.width === "number" ? options.width : 3.7;
  const height = typeof options.height === "number" ? options.height : 0.95;
  const rotation = options.rotation || "0 0 0";
  const textYOffset = typeof options.textYOffset === "number" ? options.textYOffset : -0.03;
  const textWidth = typeof options.textWidth === "number" ? options.textWidth : Math.max(5.8, width * 2.3);

  const btn = createShape("a-plane", {
    class: "clickable",
    position,
    width,
    height,
    rotation,
    color: "#0c0c0c",
    opacity: 0.95,
    side: "double"
  }, parent);

  createShape("a-text", {
    value: label,
    align: "center",
    width: textWidth,
    color,
    position: `0 ${textYOffset} 0.02`
  }, btn);

  btn.addEventListener("mouseenter", () => {
    btn.setAttribute("scale", "1.03 1.03 1.03");
  });
  btn.addEventListener("mouseleave", () => {
    btn.setAttribute("scale", "1 1 1");
  });
  btn.addEventListener("click", onClick);
  return btn;
}

function buildTitleWorld(startGame) {
  const titleRoom = createMenuRoom({x: -43, z: 300}, "#d5d5d5", "#dedede", "#ececec");
  const optionsRoom = createMenuRoom({x: -67, z: 300}, "#d8efe3", "#d3ecde", "#b6e9c9");
  const aboutRoom = createMenuRoom({x: -19, z: 300}, "#f0e2d0", "#e6d6c0", "#efd1a8");

  const REF_W = 480;
  const REF_H = 360;
  const U = 12 / REF_W;
  const px = (value) => value * U;
  const pxX = (x) => (x - REF_W / 2) * U;
  const pxY = (y) => (REF_H / 2 - y) * U;
  const p = (x, y, z = 0) => `${pxX(x)} ${pxY(y)} ${z}`;

  const art = createShape("a-entity", {
    position: "0 3 -5.72"
  }, titleRoom);

  createShape("a-text", {
    value: "Baldi's",
    color: "#20b621",
    position: p(28, 66, 0.02),
    rotation: "0 0 -13",
    width: px(260),
    align: "left"
  }, art);
  createShape("a-text", {
    value: "BASICS",
    color: "#0d0d0d",
    position: p(183, 58, 0.02),
    width: px(220),
    align: "left"
  }, art);

  createShape("a-ring", {
    position: p(404, 18, 0.03),
    radiusInner: px(3),
    radiusOuter: px(4),
    color: "#080808",
    side: "double"
  }, art);

  createShape("a-box", {
    position: p(430, 36, 0.03),
    width: px(52),
    height: px(13),
    depth: 0.08,
    color: "#c8bf09",
    rotation: "0 0 8"
  }, art);
  createShape("a-box", {
    position: p(430, 36, 0.03),
    width: px(13),
    height: px(52),
    depth: 0.08,
    color: "#c8bf09",
    rotation: "0 0 8"
  }, art);

  const figure = createShape("a-entity", {
    position: "0 0 0",
    rotation: "0 10 0"
  }, art);

  createShape("a-sphere", {
    position: p(133, 137, 0.18),
    radius: px(23),
    color: "#f0d1b2"
  }, figure);
  createShape("a-cylinder", {
    position: p(145, 213, 0.17),
    height: px(118),
    radius: px(30),
    color: "#27be2f",
    rotation: "0 0 -8",
    segmentsRadial: 16
  }, figure);
  createShape("a-box", {
    position: p(181, 210, 0.26),
    width: px(66),
    height: px(17),
    depth: px(10),
    color: "#27be2f",
    rotation: "0 0 -24"
  }, figure);
  createShape("a-box", {
    position: p(134, 292, 0.15),
    width: px(12),
    height: px(94),
    depth: px(10),
    color: "#2b3ed3",
    rotation: "0 0 -2"
  }, figure);
  createShape("a-box", {
    position: p(154, 293, 0.15),
    width: px(12),
    height: px(95),
    depth: px(10),
    color: "#2b3ed3",
    rotation: "0 0 3"
  }, figure);

  const board = createShape("a-entity", {
    position: p(285, 161, 0.23),
    rotation: "0 -7 -9"
  }, art);

  createShape("a-box", {
    position: "0 0 0",
    width: px(170),
    height: px(126),
    depth: 0.24,
    color: "#b87320"
  }, board);
  createShape("a-box", {
    position: "0 0 0.1",
    width: px(152),
    height: px(108),
    depth: 0.08,
    color: "#070707"
  }, board);

  createShape("a-box", {
    position: `${px(-73)} ${px(-2.5)} 0.13`,
    width: px(14),
    height: px(125),
    depth: 0.08,
    color: "#c97f25",
    rotation: "0 0 -2"
  }, board);

  createShape("a-box", {
    position: `${px(-49)} ${px(-3)} 0.14`,
    width: px(10),
    height: px(60),
    depth: 0.06,
    color: "#d20000",
    rotation: "0 0 45"
  }, board);
  createShape("a-box", {
    position: `${px(-49)} ${px(-3)} 0.14`,
    width: px(10),
    height: px(60),
    depth: 0.06,
    color: "#d20000",
    rotation: "0 0 -45"
  }, board);

  createBoardButton(
    board,
    "PLAY",
    "#16f0ee",
    `${px(28)} ${px(24)} 0.16`,
    startGame,
    {width: px(112), height: px(46), textWidth: px(230)}
  );
  createBoardButton(
    board,
    "OPTIONS",
    "#31e323",
    `${px(20)} ${px(-17)} 0.16`,
    () => teleportPlayer(OPTIONS_ROOM_SPAWN),
    {width: px(126), height: px(42), textWidth: px(250)}
  );
  createBoardButton(
    board,
    "ABOUT",
    "#d2c10f",
    `${px(-4)} ${px(-56)} 0.16`,
    () => teleportPlayer(ABOUT_ROOM_SPAWN),
    {width: px(106), height: px(38), rotation: "0 0 -14", textWidth: px(200)}
  );

  createShape("a-text", {
    value: "OPTIONS",
    color: "#0f5f2f",
    align: "center",
    width: 12,
    position: "0 4.72 -5.72"
  }, optionsRoom);
  createShape("a-text", {
    value: "WASD / Arrows = Move\nShift = Sprint",
    color: "#113322",
    align: "center",
    width: 10,
    position: "0 3.35 -5.72"
  }, optionsRoom);
  createShape("a-text", {
    value: "Collect notebooks, avoid Baldi,\nand use coins at vending machines.",
    color: "#113322",
    align: "center",
    width: 10,
    position: "0 1.95 -5.72"
  }, optionsRoom);
  createBoardButton(optionsRoom, "BACK", "#19f3f0", "0 0.92 -5.68", () => teleportPlayer(TITLE_ROOM_SPAWN));

  createShape("a-text", {
    value: "ABOUT",
    color: "#6f4d14",
    align: "center",
    width: 12,
    position: "0 4.72 -5.72"
  }, aboutRoom);
  createShape("a-text", {
    value: "Fan-made Baldi style project in A-Frame.\nThis menu is now a 3D room outside the maze.",
    color: "#3f2a0a",
    align: "center",
    width: 10,
    position: "0 3.22 -5.72"
  }, aboutRoom);
  createBoardButton(aboutRoom, "BACK", "#19f3f0", "0 1.2 -5.68", () => teleportPlayer(TITLE_ROOM_SPAWN));
}

function triggerGameOver(caughtBaldi = null) {
  if (gameOver) return;
  gameOver = true;
  gameStarted = false;

  if (player && player.pressed) {
    player.pressed = [];
  }
  if (player && player.driver && player.driver.body) {
    player.driver.body.velocity.set(0, 0, 0);
    player.driver.body.angularVelocity.set(0, 0, 0);
  }

  window.closeVendingShop();

  if (loseBaldiModelEl) {
    loseBaldiModelEl.removeAttribute("animation__loseface");
    loseBaldiModelEl.setAttribute("scale", "0.5 0.5 0.5");
    loseBaldiModelEl.setAttribute("position", "0 1.4 -0.1");
    const yaw = (caughtBaldi && caughtBaldi.obj && caughtBaldi.obj.object3D)
      ? (caughtBaldi.obj.object3D.rotation.y * 180) / Math.PI
      : 180;
    loseBaldiModelEl.setAttribute("rotation", `0 ${yaw} 0`);
    loseBaldiModelEl.setAttribute("animation__loseface", {
      property: "rotation",
      from: `0 ${yaw} 0`,
      to: `0 ${yaw + 14} 0`,
      dir: "alternate",
      easing: "easeInOutSine",
      dur: 160,
      loop: true
    });
  }

  if (loseBaldiCameraEl) {
    loseBaldiCameraEl.removeAttribute("animation__zoom");
    loseBaldiCameraEl.setAttribute("position", "0 1.62 1.9");
    loseBaldiCameraEl.setAttribute("animation__zoom", {
      property: "position",
      from: "0 1.62 1.9",
      to: "0 1.62 1.02",
      dur: 700,
      easing: "easeOutQuad"
    });
  }

  if (loseDetailsEl) {
    loseDetailsEl.textContent = `Baldi caught you after ${notebooks} notebooks.`;
  }
  if (loseScreenEl) {
    loseScreenEl.style.display = "flex";
  }
}

function setVendingStatus(message) {
  if (vendingStatusEl) vendingStatusEl.textContent = message;
}

function setHudVisibility(isVisible) {
  const value = isVisible ? "block" : "none";
  if (notebook_text) notebook_text.style.display = value;
  if (coin_text) coin_text.style.display = value;
  if (staminaBarContainerEl) staminaBarContainerEl.style.display = value;
}

function spendCoinForPurchase() {
  if (coins <= 0) {
    setVendingStatus("Not enough coins.");
    return false;
  }

  coins--;
  counter();
  return true;
}

function applyPlayerSpeedBoost() {
  if (!player) return;
  if (typeof player.baseMoveStrength === "undefined") {
    player.baseMoveStrength = player.moveStrength;
  }

  player.moveStrength = player.baseMoveStrength * PLAYER_SPEED_BOOST_MULTIPLIER;
  if (playerSpeedBoostTimeout) clearTimeout(playerSpeedBoostTimeout);

  playerSpeedBoostTimeout = setTimeout(() => {
    if (!player) return;
    player.moveStrength = player.baseMoveStrength;
    playerSpeedBoostTimeout = null;
  }, PLAYER_SPEED_BOOST_DURATION_MS);
}

function applyBaldiSlowDebuff() {
  for (const b of baldis) {
    if (typeof b.baseSpeed === "undefined") {
      b.baseSpeed = b.speed;
    }
    b.speed = b.baseSpeed * BALDI_SLOW_MULTIPLIER;
  }

  if (baldiSlowTimeout) clearTimeout(baldiSlowTimeout);

  baldiSlowTimeout = setTimeout(() => {
    for (const b of baldis) {
      if (typeof b.baseSpeed !== "undefined") {
        b.speed = b.baseSpeed;
      }
    }
    baldiSlowTimeout = null;
  }, BALDI_SLOW_DURATION_MS);
}

window.closeVendingShop = function closeVendingShop() {
  if (vendingShopEl) vendingShopEl.style.display = "none";
};

window.tryOpenVendingShop = function tryOpenVendingShop() {
  if (!gameStarted || gameOver) return false;
  if (coins <= 0) {
    setVendingStatus("You need at least 1 coin.");
    return false;
  }

  setVendingStatus("Choose one item. Cost: 1 coin.");
  if (vendingShopEl) vendingShopEl.style.display = "flex";
  return true;
};

window.addEventListener("DOMContentLoaded",function() {
  try {
    scene = document.querySelector("#game_scene");
    player = new Player("#game_camera", GAMEPLAY_SPAWN.x, GAMEPLAY_SPAWN.y, GAMEPLAY_SPAWN.z);

    for(let r = 0; r < maze.length; r++){
   let row = maze[r];
      for (let c=0; c< row.length;c++){
       let ch = row[c];

       let x=c;
       let z=-r;
       let y=0.5;

       if (ch =="w"){
        new Wall(x,y,z);
      }
      if (ch =="h"){
        new Hwall(x,y,z);
      }
       if (ch =="d"){
         new Door(x,y,z);
      }
       if (ch =="j"){
        new Jdoor(x,y,z);
       }
         if (ch =="b"){
        new Brown(x,y,z);
       }
        if (ch =="n"){
        new Nbrown(x,y,z);
       }
        if (ch =="y"){
        new Yellow(x,y,z);
       }
       if (ch =="k"){
        new Kyellow(x,y,z);
       }
       if (ch =="c"){
        new Desk(x,y,z);
       }
       if (ch =="z"){
        new Zdesk(x,y,z);
       }
       if (ch =="p"){
        new Plant(x,y,z);
       }
      if (ch =="l"){
       new Locker(x,y,z);
      }
       if (ch =="v"){
        new Bsoda(x,y,z);
       }
       if (ch =="m"){
        new LunchTable(x,y,z);
       }
       if (ch =="o"){
        new Trash(x,y,z);
       }
       if (ch == "q") {
      let c = new Coin(x, y, z);
      coinObjects.push({obj: c, collected: false});
      }
       if (ch =="t"){
        let b = new Baldi(x,y,z);
        baldis.push(b);
       }
     }
    }
  } catch (err) {
    console.error("World initialization failed:", err);
  }
  notebook_text = document.querySelector("#notebook_text");
  coin_text = document.querySelector("#coin_text"); 
  staminaBarContainerEl = document.querySelector("#stamina_bar_container");
  vendingShopEl = document.querySelector("#vending_shop");
  vendingStatusEl = document.querySelector("#vending_status");
  startScreenEl = document.querySelector("#start_screen");
  loseScreenEl = document.querySelector("#lose_screen");
  loseDetailsEl = document.querySelector("#lose_details");
  restartButtonEl = document.querySelector("#restart_button");
  loseBaldiModelEl = document.querySelector("#lose_baldi_model");
  loseBaldiCameraEl = document.querySelector("#lose_baldi_camera");

  if (startScreenEl) startScreenEl.style.display = "flex";

  const buySpeedBtn = document.querySelector("#buy_speed_boost");
  const buySlowBaldiBtn = document.querySelector("#buy_slow_baldi");
  const closeVendingBtn = document.querySelector("#close_vending_shop");

  if (buySpeedBtn) {
    buySpeedBtn.addEventListener("click", () => {
      if (!spendCoinForPurchase()) return;
      applyPlayerSpeedBoost();
      setVendingStatus("Speed boost purchased!");
      setTimeout(() => window.closeVendingShop(), 250);
    });
  }

  if (buySlowBaldiBtn) {
    buySlowBaldiBtn.addEventListener("click", () => {
      if (!spendCoinForPurchase()) return;
      applyBaldiSlowDebuff();
      setVendingStatus("Baldi slowed down!");
      setTimeout(() => window.closeVendingShop(), 250);
    });
  }

  if (closeVendingBtn) {
    closeVendingBtn.addEventListener("click", () => window.closeVendingShop());
  }

  if (restartButtonEl) {
    restartButtonEl.addEventListener("click", () => window.location.reload());
  }

  const startGame = () => {
    if (gameOver) return;
    if (!gameStarted) {
      gameStarted = true;
      if (player && player.pressed) player.pressed = [];
      if (startScreenEl) startScreenEl.style.display = "none";
      setHudVisibility(true);
      teleportPlayer(GAMEPLAY_SPAWN);
    }
  };

  const playBtn = document.querySelector("#play_button");
  const optionsBtn = document.querySelector("#options_button");
  const aboutBtn = document.querySelector("#about_button");
  const playBtnFallback = document.querySelector("#play_button_fallback");
  const optionsBtnFallback = document.querySelector("#options_button_fallback");
  const aboutBtnFallback = document.querySelector("#about_button_fallback");
  const menuDialogEl = document.querySelector("#menu_dialog");
  const menuDialogTitleEl = document.querySelector("#menu_dialog_title");
  const menuDialogBodyEl = document.querySelector("#menu_dialog_body");
  const menuDialogCloseBtn = document.querySelector("#menu_dialog_close");
  const menuInfoPanelEl = document.querySelector("#menu_info_panel");
  const menuInfoTextEl = document.querySelector("#menu_info_text");
  const menuCloseBtn = document.querySelector("#menu_close_button");
  const menuClickables = document.querySelectorAll(".menu_clickable");

  for (const el of menuClickables) {
    el.addEventListener("mouseenter", () => document.body.classList.add("menu-hover-cursor"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("menu-hover-cursor"));
  }

  const hideMenuInfo = () => {
    if (menuInfoPanelEl) menuInfoPanelEl.setAttribute("visible", "false");
  };

  const showMenuInfo = (title, body) => {
    if (!menuInfoPanelEl || !menuInfoTextEl) return;
    menuInfoTextEl.setAttribute("value", `${title}\n\n${body}`);
    menuInfoPanelEl.setAttribute("visible", "true");
  };

  const hideAboutPage = () => {
    if (menuDialogEl) menuDialogEl.style.display = "none";
  };

  const showMenuDialog = (title, bodyHtml) => {
    hideMenuInfo();
    if (menuDialogTitleEl) menuDialogTitleEl.textContent = title;
    if (menuDialogBodyEl) menuDialogBodyEl.innerHTML = bodyHtml;
    if (menuDialogEl) menuDialogEl.style.display = "flex";
  };

  const showAboutPage = () => {
    showMenuDialog(
      "About This Game",
      "Objective: collect notebooks while avoiding Baldi.<br><br>Use WASD or arrow keys to move, and hold Shift to sprint while you have stamina.<br><br>Pick up coins and spend them at vending machines for temporary boosts.<br><br>Survive, explore the maze, and gather as many notebooks as you can before Baldi catches you."
    );
  };

  const onPlay = () => {
    hideMenuInfo();
    hideAboutPage();
    document.body.classList.remove("menu-hover-cursor");
    startGame();
  };

  const onOptions = () => {
    showMenuDialog(
      "Options",
      "WASD / Arrows = Move<br>Shift = Sprint<br><br>Press Enter on the start screen to play.<br>Press Escape to close this panel."
    );
  };

  const onAbout = () => {
    showAboutPage();
  };

  // Disable unreliable A-Frame click targets; use stable HTML overlay buttons instead.
  if (playBtn) playBtn.removeAttribute("class");
  if (optionsBtn) optionsBtn.removeAttribute("class");
  if (aboutBtn) aboutBtn.removeAttribute("class");

  if (playBtnFallback) playBtnFallback.addEventListener("click", onPlay);
  if (optionsBtnFallback) optionsBtnFallback.addEventListener("click", onOptions);
  if (aboutBtnFallback) aboutBtnFallback.addEventListener("click", onAbout);

  if (menuCloseBtn) menuCloseBtn.addEventListener("click", hideMenuInfo);
  if (menuDialogCloseBtn) menuDialogCloseBtn.addEventListener("click", hideAboutPage);

  window.addEventListener("keydown", (e) => {
    if (gameStarted || gameOver) return;
    if (e.key === "Enter") startGame();
    if (e.key === "Escape") {
      hideMenuInfo();
      hideAboutPage();
    }
  });

  setHudVisibility(false);
  teleportPlayer(GAMEPLAY_SPAWN);
  setTimeout(loop, 120);

  counter();
})

  function loop(){
    if (gameOver) return;

    if (!player) {
      window.requestAnimationFrame(loop);
      return;
    }

    player.update();  

    if (!gameStarted) {
      window.requestAnimationFrame(loop);
      return;
    }

    // update Baldi AI movement
    for (let b of baldis) b.update();
    
    // Check for coin collection
    if (player && player.obj && player.obj.object3D) {
      const playerPos = (player.driver && player.driver.object3D)
        ? player.driver.object3D.position
        : player.obj.object3D.position;

      // Check collision with Baldi
      for (let b of baldis) {
        const baldiPos = b.getPosition();
        const bdx = playerPos.x - baldiPos.x;
        const bdz = playerPos.z - baldiPos.z;
        const baldiDistance = Math.sqrt(bdx * bdx + bdz * bdz);

        // Resolve overlap so the player cannot phase through Baldi.
        if (baldiDistance > 0.0001 && baldiDistance < BALDI_BLOCKING_DISTANCE && player.driver && player.driver.object3D) {
          const overlap = BALDI_BLOCKING_DISTANCE - baldiDistance;
          player.driver.object3D.position.x += (bdx / baldiDistance) * overlap;
          player.driver.object3D.position.z += (bdz / baldiDistance) * overlap;
        }

        if (baldiDistance <= BALDI_COLLISION_DISTANCE && notebooks >= 1) {
          triggerGameOver(b);
          return;
        }
      }

      for (let coinWrapper of coinObjects) {
        if (!coinWrapper.collected) {
          const coinPos = coinWrapper.obj.getPosition();
          const dx = playerPos.x - coinPos.x;
          const dz = playerPos.z - coinPos.z;
          const distance = Math.sqrt(dx * dx + dz * dz);
          
          if (distance < 1.0) {
            coinWrapper.collected = true;
            coins++;
            scene.removeChild(coinWrapper.obj.obj);
            counter();
          }
        }
      }
    }
    
    window.requestAnimationFrame(loop);
  }
  function counter(){
  notebook_text.textContent = `Notebook: ${notebooks}`;
  coin_text.textContent = `Coins: ${coins}`;
}
  