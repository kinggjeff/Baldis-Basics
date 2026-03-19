class Kyellow{
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;

    this.obj = document.createElement("a-entity");
    this.yellow = document.createElement("a-box");
    this.obj.append(this.yellow);
    this.yellow.setAttribute("depth", 1);
    this.yellow.setAttribute("height", 2.2);
    this.yellow.setAttribute("width", 3);
    this.yellow.setAttribute("src","#yellow");
    this.yellow.setAttribute("position",{x:x,y:1,z:z});
    this.yellow.setAttribute("rotation",{x:0,y:90,z:0});
    this.yellow.setAttribute("static-body","");

    let block = document.createElement("a-box");
    block.setAttribute("depth", 1);
    block.setAttribute("height", 0.4);
    block.setAttribute("width", 3);
    block.setAttribute("src","#wall");
    block.setAttribute("repeat","0.8 0.3");
    block.setAttribute("position",{x:x,y:2.3,z:z});
    block.setAttribute("rotation",{x:0,y:90,z:0});
    block.setAttribute("static-body","");
    this.obj.append(block);
    scene.append(this.obj);

    window.DOOR_STATES = window.DOOR_STATES || {};
    window.DOOR_STATES[`${this.x},${this.z}`] = true;

    this.obj.addEventListener("click", () => {
      this.hide();
      setTimeout(() => {
        console.log('regenerating Kyellow at', this.x, this.z);
        this.regenerate();
      }, 10000);
    });
  }

  hide() {
    if (this.yellow) {
      this.yellow.setAttribute('visible', false);
      this.yellow.removeAttribute('static-body');
    }
    window.DOOR_STATES = window.DOOR_STATES || {};
    window.DOOR_STATES[`${this.x},${this.z}`] = false;
  }

  regenerate() {
    if (this.yellow) {
      this.yellow.setAttribute('visible', true);
      this.yellow.setAttribute('static-body', '');
    }
    window.DOOR_STATES = window.DOOR_STATES || {};
    window.DOOR_STATES[`${this.x},${this.z}`] = true;
  }
}