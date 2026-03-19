class Player{
  constructor(selector,x,y,z){
    this.obj = document.querySelector(selector);
    this.text = document.createElement("a-text");
    this.text.setAttribute("value","books");
    this.obj.append(this.text)
    this.moveStrength = 2.2;
    this.sprintMultiplier = 1.35;      // reduced sprint speed multiplier
    this.stamina = 150;                // larger stamina pool
    this.maxStamina = 150;
    this.staminaDrainRate = 1;       // stamina depleted per frame while sprinting
    this.staminaRegenRate = 0.3;       // stamina regenerated per frame while not sprinting
    this.canSprintAgain = true;        // sprint disabled until stamina reaches 50%
    this.jumping = false;
    this.jumpStrength = 0.15;          // jump velocity
    this.dy = this.jumpStrength;
    this.pressed = [];

    this.driver = document.createElement("a-sphere");
    this.driver.setAttribute("opacity",0);
    this.driver.setAttribute("dynamic-body",{mass:20,angularDamping:0.5,linearDamping:0.01});
    this.driver.setAttribute("radius",0.5);

    this.driver.object3D.position.x = this.obj.object3D.position.x + x;
    this.driver.object3D.position.y = this.obj.object3D.position.y + y;
    this.driver.object3D.position.z = this.obj.object3D.position.z + z;
    
    this.driver.object3D.rotation.x = this.obj.object3D.rotation.x + x;
    this.driver.object3D.rotation.y = this.obj.object3D.rotation.y + y;
    this.driver.object3D.rotation.z = this.obj.object3D.rotation.z + z;
    scene.append(this.driver);

    // Reference to stamina bar UI
    this.staminaBarFill = document.getElementById("stamina_bar_fill");

    window.addEventListener("keyup",(e)=>{
      delete this.pressed[e.key];
    });
    window.addEventListener("keydown",(e)=>{
      this.pressed[e.key] = true;
    })
  }

  update(){
    this.processImpulses();  
    this.obj.object3D.position.x = this.driver.object3D.position.x;
    this.obj.object3D.position.y = this.driver.object3D.position.y + 0.5;
    this.obj.object3D.position.z = this.driver.object3D.position.z;
    this.updateStaminaBar();
  }

  // Returns true if the tile at maze grid coords (col, row) is a solid obstacle.
  isSolidTile(tile, col, row) {
    if (tile === "w" || tile === "h" || tile === "l") return true;
    if (tile === "d" || tile === "j" || tile === "y" || tile === "k") {
      const key = `${col},${-row}`;
      if (!window.DOOR_STATES) return true;
      if (typeof window.DOOR_STATES[key] === "undefined") return true;
      return window.DOOR_STATES[key] === true;
    }
    return false;
  }

  // Returns true if world position (wx, wz) overlaps a solid tile.
  isBlockedAt(wx, wz) {
    if (typeof maze === "undefined" || !Array.isArray(maze)) return false;
    const r = 0.28;
    const probes = [[0,0],[r,0],[-r,0],[0,r],[0,-r]];
    for (const [sx, sz] of probes) {
      const col = Math.round(wx + sx);
      const row = Math.round(-(wz + sz));
      if (row < 0 || row >= maze.length) return true;
      const rowStr = maze[row] || "";
      if (col < 0 || col >= rowStr.length) return true;
      if (this.isSolidTile(rowStr[col], col, row)) return true;
    }
    return false;
  }

  processImpulses(){
    try{
      const body = this.driver.body; // Get the physics body
      if (!body) return;

      const hasDirectionalInput =
        this.pressed["ArrowUp"] || this.pressed["w"] ||
        this.pressed["ArrowDown"] || this.pressed["s"] ||
        this.pressed["ArrowLeft"] || this.pressed["a"] ||
        this.pressed["ArrowRight"] || this.pressed["d"];

      const isStandingStill =
        !hasDirectionalInput &&
        (!body.velocity || (Math.abs(body.velocity.x) < 0.01 && Math.abs(body.velocity.z) < 0.01));
      
      // Handle stamina: deplete only while sprinting and moving, regenerate only while standing still
      const isSprinting = this.pressed["Shift"] && this.canSprintAgain && hasDirectionalInput;
      if (isSprinting) {
        this.stamina = Math.max(0, this.stamina - this.staminaDrainRate);
      } else if (isStandingStill) {
        this.stamina = Math.min(this.maxStamina, this.stamina + this.staminaRegenRate);
      }
      
      // Manage sprint availability: disable at 0, re-enable at 50%
      if (this.stamina <= 0) {
        this.canSprintAgain = false;
      } else if (this.stamina >= this.maxStamina * 0.5) {
        this.canSprintAgain = true;
      }
      
      // Calculate current move speed: only sprint when Shift is held and stamina available
      const currentMoveStrength = isSprinting ? this.moveStrength * this.sprintMultiplier : this.moveStrength;
      
      // Initialize velocity
      let vx = 0;
      let vz = 0;
      
      if(this.pressed["ArrowUp"] || this.pressed["w"] ){
        let theta = this.obj.object3D.rotation.y + Math.PI;
        vx += Math.sin(theta) * currentMoveStrength;
        vz += Math.cos(theta) * currentMoveStrength;
      }
      if(this.pressed["ArrowDown"] || this.pressed["s"] ){
        let theta = this.obj.object3D.rotation.y;
        vx += Math.sin(theta) * currentMoveStrength;
        vz += Math.cos(theta) * currentMoveStrength;
      }
      if(this.pressed["ArrowLeft"] || this.pressed["a"] ){
        let theta = this.obj.object3D.rotation.y - Math.PI / 2;
        vx += Math.sin(theta) * currentMoveStrength;
        vz += Math.cos(theta) * currentMoveStrength;
      }
      if(this.pressed["ArrowRight"] || this.pressed["d"] ){
        let theta = this.obj.object3D.rotation.y + Math.PI / 2;
        vx += Math.sin(theta) * currentMoveStrength;
        vz += Math.cos(theta) * currentMoveStrength;
      }
      
      // Block movement per-axis so walls are solid and the player can still slide along them.
      if (this.driver.object3D) {
        const px = this.driver.object3D.position.x;
        const pz = this.driver.object3D.position.z;
        const look = 0.18;
        if (vx !== 0 && this.isBlockedAt(px + Math.sign(vx) * look, pz)) vx = 0;
        if (vz !== 0 && this.isBlockedAt(px, pz + Math.sign(vz) * look)) vz = 0;
      }

      // Apply horizontal velocity (preserve vertical velocity for jumping and gravity)
      if (body.velocity) {
        body.velocity.x = vx;
        body.velocity.z = vz;
      }
      
      if(this.pressed[" "] && !this.jumping){
        this.jumping = true;
      }
      if(this.jumping){
        if(this.dy > 0){
          this.dy -= 0.002;
          if (body.velocity) body.velocity.y += this.dy;
        }else{
          this.jumping = false;
          this.dy = this.jumpStrength;         
        }
      }
      
    }catch{}
  }
  updateStaminaBar() {
    // Update stamina bar width based on current stamina
    const staminaPercent = (this.stamina / this.maxStamina) * 100;
    if (this.staminaBarFill) {
      this.staminaBarFill.style.width = staminaPercent + "%";
      
      // Change color based on stamina level: green -> yellow -> red
      if (staminaPercent > 50) {
        this.staminaBarFill.style.backgroundColor = "#00FF00"; // green
      } else if (staminaPercent > 25) {
        this.staminaBarFill.style.backgroundColor = "#FFFF00"; // yellow
      } else {
        this.staminaBarFill.style.backgroundColor = "#FF0000"; // red
      }
    }
  }
}