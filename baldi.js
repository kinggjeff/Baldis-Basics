class Baldi {
  constructor(x, y, z) {
    // world position (we'll keep object3D in sync)
    this.speed = 0.03;           // movement units per frame
    this.turnDistance = 1.0;     // lookahead distance to walls
    this.avoidDistance = 0.8;    // if a wall is closer than this, turn
    this.turnCooldown = 0;       // frames until next allowed turn
    this.state = "idle";         // start idle, move after first notebook
    this.roomPlan = [];
    this.roomPlanIndex = 0;
    this.roomStepCounter = 0;
    this.roomDetourCount = 0;
    this.doorDecisionCooldown = 0;
    this.classroomEnterChance = 0.35;
    this.intersectionCooldown = 0;
    this.hallVisitCounts = {};
    this.roamPath = [];
    this.roamPathIndex = 0;
    this.lastVisitedCellKey = null;
    this.navigationCells = this.buildNavigationCells();
    this.navigationCellSet = new Set(this.navigationCells.map(cell => this.cellKey(cell.x, cell.z)));
    this.lastNotebooksWhen = 0;  // track when we last saw notebook count change

    // initial heading (will pick a cardinal direction that's open)
    this.heading = 0;

    this.obj = document.createElement("a-entity");

    // load the teacher gltf model
    let baldiModel = document.createElement("a-gltf-model");
    baldiModel.setAttribute("src", "#teacher");
    baldiModel.setAttribute("scale", {x: 0.1, y: 0.1, z: 0.1});
    baldiModel.setAttribute("rotation", {x: 0, y: 0, z: 0});
    baldiModel.setAttribute("animation-mixer", "");
    this.obj.append(baldiModel);

    const baldiLight = document.createElement("a-light");
    baldiLight.setAttribute("type", "point");
    baldiLight.setAttribute("color", "#ff0000");
    baldiLight.setAttribute("intensity", 1);
    baldiLight.setAttribute("distance", 5);
    baldiLight.setAttribute("decay", 2);
    baldiLight.setAttribute("position", {x: 0, y: 1, z: 0});
    this.obj.append(baldiLight);

    scene.append(this.obj);

    // initialize position (y=1 to match other NPCs)
    this.obj.object3D.position.set(x, 1, z);
    this.obj.object3D.rotation.y = this.heading;

    // Face the player at start if player exists
    if (player && player.obj && player.obj.object3D) {
      const playerPos = player.obj.object3D.position;
      const dx = playerPos.x - x;
      const dz = playerPos.z - z;
      this.heading = Math.atan2(dx, dz);
      this.obj.object3D.rotation.y = this.heading;
    } else {
      // Fallback: choose a random available direction
      const cardinals = [0, Math.PI/2, Math.PI, 3*Math.PI/2];
      const available = cardinals.filter(h => this.canMoveAtHeading(h));
      if (available.length) this.heading = available[Math.floor(Math.random()*available.length)];
      this.obj.object3D.rotation.y = this.heading;
    }

    console.log('Baldi created at', x, z);
  }

  getPosition() {
    const p = this.obj.object3D.position;
    return { x: p.x, y: p.y, z: p.z };
  }

  buildNavigationCells() {
    if (typeof maze === "undefined" || !Array.isArray(maze)) return [];

    const cells = [];
    for (let rowIndex = 0; rowIndex < maze.length; rowIndex++) {
      const row = maze[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        if (this.isWalkableMazeChar(row[colIndex])) {
          cells.push({ x: colIndex, z: -rowIndex });
        }
      }
    }

    return cells;
  }

  isWalkableMazeChar(ch) {
    const blocked = new Set(["w", "h", "y", "k", "c", "z", "p", "v", "m", "o", window.LOCKER_TILE || "r"]);
    return !blocked.has(ch);
  }

  cellKey(x, z) {
    return `${x},${z}`;
  }

  getCurrentCell() {
    const pos = this.obj.object3D.position;
    return { x: Math.round(pos.x), z: Math.round(pos.z) };
  }

  recordCurrentCellVisit() {
    const cell = this.getCurrentCell();
    const key = this.cellKey(cell.x, cell.z);
    if (this.lastVisitedCellKey === key) return;

    this.lastVisitedCellKey = key;
    this.hallVisitCounts[key] = (this.hallVisitCounts[key] || 0) + 1;
  }

  planRoamPath() {
    const start = this.getCurrentCell();
    const reachable = this.getReachableCells(start);
    const target = this.chooseRoamTarget(start, reachable);
    if (!target) {
      this.roamPath = [];
      this.roamPathIndex = 0;
      return;
    }

    const path = this.findPath(start, target);
    if (!path || path.length < 2) {
      this.roamPath = [];
      this.roamPathIndex = 0;
      return;
    }

    this.roamPath = path.slice(1);
    this.roamPathIndex = 0;
  }

  chooseRoamTarget(start, reachableCells) {
    if (!reachableCells || !reachableCells.length) return null;

    const candidates = reachableCells
      .filter(cell => cell.x !== start.x || cell.z !== start.z)
      .map(cell => {
        const distance = Math.abs(cell.x - start.x) + Math.abs(cell.z - start.z);
        const visits = this.hallVisitCounts[this.cellKey(cell.x, cell.z)] || 0;
        return { cell, distance, visits };
      })
      .filter(entry => entry.distance >= 6)
      .sort((a, b) => a.visits - b.visits || b.distance - a.distance);

    if (!candidates.length) return null;

    // Pick randomly from the top candidates to add variety
    const topN = Math.min(5, candidates.length);
    return candidates[Math.floor(Math.random() * topN)].cell;
  }

  getReachableCells(start) {
    const startKey = this.cellKey(start.x, start.z);
    if (!this.navigationCellSet.has(startKey)) return [];

    const queue = [start];
    const visited = new Set([startKey]);
    const reachable = [start];

    while (queue.length) {
      const current = queue.shift();
      const neighbors = [
        { x: current.x + 1, z: current.z },
        { x: current.x - 1, z: current.z },
        { x: current.x, z: current.z + 1 },
        { x: current.x, z: current.z - 1 }
      ];

      for (const neighbor of neighbors) {
        const key = this.cellKey(neighbor.x, neighbor.z);
        if (!this.navigationCellSet.has(key) || visited.has(key)) continue;
        visited.add(key);
        queue.push(neighbor);
        reachable.push(neighbor);
      }
    }

    return reachable;
  }

  findPath(start, target) {
    const startKey = this.cellKey(start.x, start.z);
    const targetKey = this.cellKey(target.x, target.z);
    if (!this.navigationCellSet.has(startKey) || !this.navigationCellSet.has(targetKey)) return null;

    const queue = [start];
    const cameFrom = new Map();
    cameFrom.set(startKey, null);

    while (queue.length) {
      const current = queue.shift();
      const currentKey = this.cellKey(current.x, current.z);
      if (currentKey === targetKey) break;

      const neighbors = [
        { x: current.x + 1, z: current.z },
        { x: current.x - 1, z: current.z },
        { x: current.x, z: current.z + 1 },
        { x: current.x, z: current.z - 1 }
      ];

      for (const neighbor of neighbors) {
        const neighborKey = this.cellKey(neighbor.x, neighbor.z);
        if (!this.navigationCellSet.has(neighborKey) || cameFrom.has(neighborKey)) continue;
        cameFrom.set(neighborKey, current);
        queue.push(neighbor);
      }
    }

    if (!cameFrom.has(targetKey)) return null;

    const path = [];
    let current = target;
    while (current) {
      path.push(current);
      current = cameFrom.get(this.cellKey(current.x, current.z));
    }

    return path.reverse();
  }

  getNextRoamCell() {
    while (this.roamPathIndex < this.roamPath.length) {
      const cell = this.roamPath[this.roamPathIndex];
      const pos = this.obj.object3D.position;
      if (Math.abs(pos.x - cell.x) < 0.06 && Math.abs(pos.z - cell.z) < 0.06) {
        this.obj.object3D.position.x = cell.x;
        this.obj.object3D.position.z = cell.z;
        this.roamPathIndex++;
        continue;
      }
      return cell;
    }

    return null;
  }

  moveTowardCell(cell) {
    const pos = this.obj.object3D.position;
    const dx = cell.x - pos.x;
    const dz = cell.z - pos.z;

    if (Math.abs(dx) >= Math.abs(dz)) {
      this.heading = dx >= 0 ? Math.PI / 2 : (3 * Math.PI) / 2;
      if (Math.abs(dz) < 0.08) pos.z = cell.z;
      else pos.z += dz * 0.45;
      pos.x += Math.sign(dx) * Math.min(this.speed, Math.abs(dx));
    } else {
      this.heading = dz >= 0 ? 0 : Math.PI;
      if (Math.abs(dx) < 0.08) pos.x = cell.x;
      else pos.x += dx * 0.45;
      pos.z += Math.sign(dz) * Math.min(this.speed, Math.abs(dz));
    }

    this.obj.object3D.rotation.y = this.heading;
  }

  update() {
    // Baldi waits until the first notebook has been collected.
    if (notebooks < 1) {
      // Face the player continuously while idle
      if (player && player.obj && player.obj.object3D) {
        const pos = this.obj.object3D.position;
        const playerPos = player.obj.object3D.position;
        const dx = playerPos.x - pos.x;
        const dz = playerPos.z - pos.z;
        this.heading = Math.atan2(dx, dz);
        this.obj.object3D.rotation.y = this.heading;
      }
      return;
    }

    // Transition from idle to straight movement when first notebook is collected
    if (this.state === "idle") {
      this.state = "straight";

      // Snap initial movement to a hallway-aligned cardinal direction.
      const cardinals = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
      let bestHeading = cardinals[0];
      let bestDiff = Infinity;
      for (const h of cardinals) {
        const diff = Math.abs(Math.atan2(Math.sin(this.heading - h), Math.cos(this.heading - h)));
        if (diff < bestDiff) {
          bestDiff = diff;
          bestHeading = h;
        }
      }
      this.heading = bestHeading;
    }

    const pos = this.obj.object3D.position;
    this.centerInHallway();

    // Move straight through hallways; when blocked, pick a random left/right turn.
    if (!this.canMoveStep(this.heading)) {
      const left = this.normalizeHeading(this.heading + Math.PI / 2);
      const right = this.normalizeHeading(this.heading + (3 * Math.PI) / 2);

      const options = [left, right].filter(h => this.canMoveStep(h));
      if (!options.length) return;

      this.heading = options[Math.floor(Math.random() * options.length)];
    }

    if (!this.canMoveStep(this.heading)) return;

    pos.x += Math.sin(this.heading) * this.speed;
    pos.z += Math.cos(this.heading) * this.speed;

    this.obj.object3D.rotation.y = this.heading;
  }

  updateRoaming() {
    this.state = "roam";
    this.centerInHallway();
    this.recordCurrentCellVisit();

    let nextCell = this.getNextRoamCell();
    if (!nextCell) {
      this.planRoamPath();
      nextCell = this.getNextRoamCell();
    }

    if (!nextCell) return;

    this.moveTowardCell(nextCell);

    // Keep Baldi in hallways only: room-loop behavior is disabled.
  }

  tryStartRoomLoop() {
    const enterHeading = this.getPassByClassroomTurn();
    if (enterHeading === null) return false;
    if (Math.random() > this.classroomEnterChance) {
      this.doorDecisionCooldown = 18;
      return false;
    }
    return this.startRoomLoopFromHeading(enterHeading);
  }

  chooseSideTurn(left, right, leftOpen, rightOpen) {
    const choices = [];
    if (leftOpen) choices.push(left);
    if (rightOpen) choices.push(right);
    if (!choices.length) return null;

    // Prefer least-visited corridor to spread Baldi across more hallways.
    let best = [];
    let bestScore = Infinity;
    for (const h of choices) {
      const score = this.getVisitScoreForHeading(h);
      if (score < bestScore) {
        bestScore = score;
        best = [h];
      } else if (score === bestScore) {
        best.push(h);
      }
    }

    return best[Math.floor(Math.random() * best.length)];
  }

  recordHallVisit() {
    const pos = this.obj.object3D.position;
    const gx = Math.round(pos.x);
    const gz = Math.round(pos.z);
    const key = `${gx},${gz}`;
    this.hallVisitCounts[key] = (this.hallVisitCounts[key] || 0) + 1;
  }

  getVisitScoreForHeading(heading) {
    const pos = this.obj.object3D.position;
    const tx = Math.round(pos.x + Math.sin(heading) * 1.0);
    const tz = Math.round(pos.z + Math.cos(heading) * 1.0);
    const key = `${tx},${tz}`;
    return this.hallVisitCounts[key] || 0;
  }

  startRoomLoopFromHeading(enterHeading) {
    if (!this.canMoveStep(enterHeading)) return false;

    const sideHeading = Math.random() < 0.5
      ? this.normalizeHeading(enterHeading + (Math.PI / 2))
      : this.normalizeHeading(enterHeading + ((3 * Math.PI) / 2));
    const oppositeSideHeading = this.normalizeHeading(sideHeading + Math.PI);
    const exitHeading = this.normalizeHeading(enterHeading + Math.PI);

    // Add small randomness to room visit durations
    const randVar = (base) => base + Math.floor((Math.random() - 0.5) * 4);

    this.roomPlan = [
      { heading: enterHeading, steps: randVar(28) },
      { heading: sideHeading, steps: randVar(12) },
      { heading: enterHeading, steps: randVar(14) },
      { heading: oppositeSideHeading, steps: randVar(24) },
      { heading: enterHeading, steps: randVar(10) },
      { heading: sideHeading, steps: randVar(12) },
      { heading: exitHeading, steps: randVar(30) }
    ];
    this.roomPlanIndex = 0;
    this.roomStepCounter = 0;
    this.roomDetourCount = 0;
    this.state = "room-loop";
    this.doorDecisionCooldown = 90;
    return true;
  }

  getPassByClassroomTurn() {
    const pos = this.obj.object3D.position;
    const forwardX = Math.sin(this.heading);
    const forwardZ = Math.cos(this.heading);

    // Left vector for the current heading.
    const leftHeading = this.normalizeHeading(this.heading + Math.PI / 2);
    const leftX = Math.sin(leftHeading);
    const leftZ = Math.cos(leftHeading);

    const entries = this.getNearbyClassroomEntries(2.0);
    if (!entries.length) return null;

    let bestTurn = null;
    let bestScore = Infinity;

    for (let el of entries) {
      const dx = el.object3D.position.x - pos.x;
      const dz = el.object3D.position.z - pos.z;

      const forward = dx * forwardX + dz * forwardZ;
      const side = dx * leftX + dz * leftZ;

      // Entry should be near Baldi's side while he is passing by.
      if (forward < -0.6 || forward > 1.6) continue;
      if (Math.abs(side) < 0.4 || Math.abs(side) > 1.9) continue;

      const turnHeading = side > 0
        ? leftHeading
        : this.normalizeHeading(this.heading + (3 * Math.PI) / 2);

      if (!this.canMoveStep(turnHeading)) continue;

      const score = Math.abs(forward) + Math.abs(Math.abs(side) - 1.0);
      if (score < bestScore) {
        bestScore = score;
        bestTurn = turnHeading;
      }
    }

    return bestTurn;
  }

  getNearbyClassroomEntries(maxDist) {
    const pos = this.obj.object3D.position;
    const maxSq = maxDist * maxDist;
    const found = [];

    const walls = window.WALLS || [];
    for (let w of walls) {
      const el = w.obj || w;
      if (!el || !el.object3D) continue;
      if (!this.isClassroomEntryElement(el)) continue;
      if (el.getAttribute && el.getAttribute("visible") === false) continue;

      const dx = el.object3D.position.x - pos.x;
      const dz = el.object3D.position.z - pos.z;
      const d2 = (dx * dx) + (dz * dz);
      if (d2 <= maxSq) found.push(el);
    }

    if (scene && scene.querySelectorAll) {
      const entries = scene.querySelectorAll('a-box[src="#brown"], a-box[src="#door"]');
      for (let el of entries) {
        if (!el || !el.object3D) continue;
        if (el.getAttribute && el.getAttribute("visible") === false) continue;

        const dx = el.object3D.position.x - pos.x;
        const dz = el.object3D.position.z - pos.z;
        const d2 = (dx * dx) + (dz * dz);
        if (d2 <= maxSq) found.push(el);
      }
    }

    return found;
  }

  updateRoomLoop() {
    if (!this.roomPlan.length || this.roomPlanIndex >= this.roomPlan.length) {
      this.state = "roam";
      this.roomPlan = [];
      this.roomPlanIndex = 0;
      this.roomStepCounter = 0;
      this.roomDetourCount = 0;
      this.roamPath = [];
      this.roamPathIndex = 0;
      return;
    }

    const segment = this.roomPlan[this.roomPlanIndex];
    this.heading = segment.heading;

    if (!this.canMoveStep(this.heading)) {
      const blockingEl = this.getBlockingElementForStep(this.heading, 0.18, true);
      if (this.tryInsertDeskDetour(this.heading, blockingEl)) {
        return;
      }

      // Try turning to continue the path instead of aborting the room completely
      const alternatives = [
        this.normalizeHeading(this.heading + Math.PI / 2),
        this.normalizeHeading(this.heading - Math.PI / 2),
        this.normalizeHeading(this.heading + Math.PI)
      ];

      let foundAlternative = false;
      for (let alt of alternatives) {
        if (this.canMoveStep(alt)) {
          this.heading = alt;
          foundAlternative = true;
          break;
        }
      }

      if (!foundAlternative) {
        // Still blocked, skip this segment instead of aborting
        this.roomStepCounter = segment.steps;
      }
      return;
    }

    const pos = this.obj.object3D.position;
    pos.x += Math.sin(this.heading) * this.speed;
    pos.z += Math.cos(this.heading) * this.speed;
    this.obj.object3D.rotation.y = this.heading;

    this.roomStepCounter++;
    if (this.roomStepCounter >= segment.steps) {
      this.roomStepCounter = 0;
      this.roomPlanIndex++;
      if (this.roomPlanIndex >= this.roomPlan.length) {
        this.state = "roam";
        this.roomPlan = [];
        this.roomPlanIndex = 0;
        this.roomDetourCount = 0;
        this.roamPath = [];
        this.roamPathIndex = 0;
      }
    }
  }

  tryInsertDeskDetour(heading, blockingEl) {
    if (!this.isDeskObstacle(blockingEl)) return false;
    if (this.roomDetourCount >= 8) return false;

    const left = this.normalizeHeading(heading + Math.PI / 2);
    const right = this.normalizeHeading(heading + (3 * Math.PI) / 2);
    const candidates = [left, right].filter(option => {
      return this.canFollowStepSequence([
        { heading: option, steps: 16 },
        { heading, steps: 20 },
        { heading: this.normalizeHeading(option + Math.PI), steps: 16 }
      ], 0.18, true);
    });

    if (!candidates.length) return false;

    const sideHeading = candidates[Math.floor(Math.random() * candidates.length)];
    const returnHeading = this.normalizeHeading(sideHeading + Math.PI);

    this.roomPlan.splice(this.roomPlanIndex, 0,
      { heading: sideHeading, steps: 16 },
      { heading, steps: 20 },
      { heading: returnHeading, steps: 16 }
    );
    this.roomDetourCount++;
    return true;
  }

  centerInHallway() {
    const pos = this.obj.object3D.position;
    if (Math.abs(Math.sin(this.heading)) < 0.001) {
      const targetX = Math.round(pos.x);
      const dx = targetX - pos.x;
      if (Math.abs(dx) < 0.9) {
        if (Math.abs(dx) < 0.04) pos.x = targetX;
        else pos.x += dx * 0.55;
      }
    } else {
      const targetZ = Math.round(pos.z);
      const dz = targetZ - pos.z;
      if (Math.abs(dz) < 0.9) {
        if (Math.abs(dz) < 0.04) pos.z = targetZ;
        else pos.z += dz * 0.55;
      }
    }
  }

  isAlignedForTurn() {
    const pos = this.obj.object3D.position;
    if (Math.abs(Math.sin(this.heading)) < 0.001) {
      return Math.abs(pos.x - Math.round(pos.x)) < 0.12;
    }

    return Math.abs(pos.z - Math.round(pos.z)) < 0.12;
  }

  getNearbyClassroomEntry(maxDist) {
    const pos = this.obj.object3D.position;
    let nearest = null;
    let nearestSq = maxDist * maxDist;

    // door/jdoor pieces are registered in WALLS
    const walls = window.WALLS || [];

    for (let w of walls) {
      const el = w.obj || w;
      if (!el || !el.object3D) continue;
      if (!this.isClassroomEntryElement(el)) continue;
      if (el.getAttribute && el.getAttribute("visible") === false) continue;

      const dx = el.object3D.position.x - pos.x;
      const dz = el.object3D.position.z - pos.z;
      const d2 = (dx * dx) + (dz * dz);
      if (d2 <= nearestSq) {
        nearestSq = d2;
        nearest = el;
      }
    }

    // brown/nbrown are not registered in WALLS, so scan scene for their panels
    if (scene && scene.querySelectorAll) {
      const entries = scene.querySelectorAll('a-box[src="#brown"], a-box[src="#door"]');
      for (let el of entries) {
        if (!el || !el.object3D) continue;
        if (el.getAttribute && el.getAttribute("visible") === false) continue;

        const dx = el.object3D.position.x - pos.x;
        const dz = el.object3D.position.z - pos.z;
        const d2 = (dx * dx) + (dz * dz);
        if (d2 <= nearestSq) {
          nearestSq = d2;
          nearest = el;
        }
      }
    }

    return nearest;
  }

  normalizeHeading(h) {
    const twoPi = 2 * Math.PI;
    h %= twoPi;
    if (h < 0) h += twoPi;
    return h;
  }

  isDoorElement(el) {
    if (!el || !el.getAttribute) return false;
    return el.getAttribute("src") === "#door";
  }

  isClassroomEntryElement(el) {
    if (!el || !el.getAttribute) return false;
    const src = el.getAttribute("src");
    return src === "#door" || src === "#brown";
  }

  isOverheadDoorFrameBlock(el) {
    if (!el || !el.getAttribute || !el.object3D) return false;
    const src = el.getAttribute("src");
    // Door lintel blocks are the small wall pieces above doors.
    return src === "#wall" && el.object3D.position.y > 2.0;
  }

  isDeskObstacle(el) {
    if (!el) return false;

    const target = el.obj || el;
    if (!target) return false;

    if (target.querySelector) {
      const woodBox = target.querySelector('a-box[src="#wood"]');
      if (woodBox) return true;
    }

    return false;
  }

  canSeePlayer(playerPos) {
    const pos = this.obj.object3D.position;
    const dx = playerPos.x - pos.x;
    const dz = playerPos.z - pos.z;
    const distance = Math.hypot(dx, dz);

    if (distance < 0.001) return true;

    // Sample points along the sight line. If any sample is inside an obstacle,
    // the view is blocked.
    const steps = Math.max(2, Math.ceil(distance / 0.25));
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const sx = pos.x + dx * t;
      const sz = pos.z + dz * t;
      if (this.isPointBlocked(sx, sz, 0.05)) return false;
    }

    return true;
  }

  isPointBlocked(x, z, padding = 0, ignoreDoors = false) {
    return this.getBlockingElementAtPoint(x, z, padding, ignoreDoors) !== null;
  }

  getBlockingElementAtPoint(x, z, padding = 0, ignoreDoors = false) {
    const walls = window.WALLS || [];

    for (let w of walls) {
      const el = w.obj || w;
      if (!el || !el.object3D) continue;
      if (el.getAttribute && el.getAttribute("visible") === false) continue;
      if (ignoreDoors && this.isDoorElement(el)) continue;
      if (this.isOverheadDoorFrameBlock(el)) continue;

      const wp = el.object3D.position;
      let width = parseFloat(el.getAttribute && el.getAttribute("width")) || 1.0;
      let depth = parseFloat(el.getAttribute && el.getAttribute("depth")) || 1.0;

      const scale = el.getAttribute && el.getAttribute("scale");
      if (scale && typeof scale === "object") {
        width *= (scale.x || 1);
        depth *= (scale.z || 1);
      }

      const halfX = (width / 2) + padding;
      const halfZ = (depth / 2) + padding;

      if (Math.abs(wp.x - x) < halfX && Math.abs(wp.z - z) < halfZ) {
        return w;
      }
    }

    return null;
  }

  canMoveStep(heading) {
    const pos = this.obj.object3D.position;
    const nx = pos.x + Math.sin(heading) * this.speed;
    const nz = pos.z + Math.cos(heading) * this.speed;
    return !this.isPointBlocked(nx, nz, 0.18, true);
  }

  getBlockingElementForStep(heading, padding = 0.18, ignoreDoors = true) {
    const pos = this.obj.object3D.position;
    const nx = pos.x + Math.sin(heading) * this.speed;
    const nz = pos.z + Math.cos(heading) * this.speed;
    return this.getBlockingElementAtPoint(nx, nz, padding, ignoreDoors);
  }

  canMoveMultipleSteps(sideHeading, steps, padding = 0.18, ignoreDoors = true, offsetSteps = 0, offsetHeading = sideHeading) {
    const pos = this.obj.object3D.position;
    let x = pos.x + Math.sin(offsetHeading) * this.speed * offsetSteps;
    let z = pos.z + Math.cos(offsetHeading) * this.speed * offsetSteps;

    for (let index = 0; index < steps; index++) {
      x += Math.sin(sideHeading) * this.speed;
      z += Math.cos(sideHeading) * this.speed;
      if (this.getBlockingElementAtPoint(x, z, padding, ignoreDoors)) return false;
    }

    return true;
  }

  canFollowStepSequence(segments, padding = 0.18, ignoreDoors = true) {
    const pos = this.obj.object3D.position;
    let x = pos.x;
    let z = pos.z;

    for (const segment of segments) {
      for (let index = 0; index < segment.steps; index++) {
        x += Math.sin(segment.heading) * this.speed;
        z += Math.cos(segment.heading) * this.speed;
        if (this.getBlockingElementAtPoint(x, z, padding, ignoreDoors)) return false;
      }
    }

    return true;
  }

  // helper: test whether moving a short distance along 'heading' would collide with any wall
  canMoveAtHeading(heading) {
    const pos = this.obj.object3D.position;
    const fx = pos.x + Math.sin(heading) * this.turnDistance;
    const fz = pos.z + Math.cos(heading) * this.turnDistance;

    const walls = window.WALLS || [];
    const radius = 0.4;

    for (let w of walls) {
      const el = w.obj || w;
      if (!el || !el.object3D) continue;
      if (this.isDoorElement(el)) continue;
      if (this.isOverheadDoorFrameBlock(el)) continue;
      const wp = el.object3D.position;

      let width = parseFloat(el.getAttribute && el.getAttribute('width')) || 1.0;
      let depth = parseFloat(el.getAttribute && el.getAttribute('depth')) || 1.0;
      const scale = el.getAttribute && el.getAttribute('scale');
      if (scale && typeof scale === 'object') {
        width *= (scale.x || 1);
        depth *= (scale.z || 1);
      }

      const halfX = (width / 2) + radius;
      const halfZ = (depth / 2) + radius;

      if (Math.abs(wp.x - fx) < halfX && Math.abs(wp.z - fz) < halfZ) {
        return false;
      }
    }
    return true;
  }
}
