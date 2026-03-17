class Door{
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.obj = document.createElement("a-entity");
    let door = document.createElement("a-box");
    this.door = door;
    this.obj.append(door);
    door.setAttribute("depth", 1);
    door.setAttribute("height", 2.2);
    door.setAttribute("width", 1);
    door.setAttribute("src","#door");
    door.setAttribute("position",{x:x,y:1,z:z});
    // door should block the player
    door.setAttribute("static-body","");

    let block = document.createElement("a-box");
    this.block = block;
    block.setAttribute("depth", 1);
    block.setAttribute("height", 0.4);
    block.setAttribute("width", 1);
    block.setAttribute("src","#wall");
    block.setAttribute("repeat","0.4 0.3")
    block.setAttribute("position",{x:x,y:2.3,z:z});
    // top block should also be collidable
    block.setAttribute("static-body","");
    this.obj.append(block);
    scene.append(this.obj);

    // register both the vertical door and the top block so AI sees them separately
    window.WALLS = window.WALLS || [];
    window.WALLS.push(this.door);
    window.WALLS.push(this.block);

    // clicking hides the door and returns it later
    this.obj.addEventListener("click", () => {
      this.hide();
      setTimeout(() => {
        console.log('regenerating door at', this.x, this.z);
        this.regenerate();
      }, 3000);
    });
  }

  hide() {
    // hide only the vertical door; keep the top block present and collidable
    this.door.setAttribute('visible', false);
    this.door.removeAttribute('static-body');

    if (window.WALLS) {
      const idx = window.WALLS.indexOf(this.door);
      if (idx !== -1) window.WALLS.splice(idx, 1);
    }
  }

  regenerate() {
    // restore visibility and physics
    this.door.setAttribute('visible', true);
    this.door.setAttribute('static-body', '');

    window.WALLS = window.WALLS || [];
    if (!window.WALLS.includes(this.door)) {
      window.WALLS.push(this.door);
    }
  }
}

