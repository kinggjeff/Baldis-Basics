class Yellow{
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.obj = document.createElement("a-entity");
    let yellow = document.createElement("a-box");
    this.yellow = yellow;
    this.obj.append(yellow);
    yellow.setAttribute("depth", 1);
    yellow.setAttribute("height", 2.2);
    yellow.setAttribute("width", 3);
    yellow.setAttribute("src","#yellow");
    yellow.setAttribute("position",{x:x,y:1,z:z});

    let block = document.createElement("a-box");
    this.block = block;
    block.setAttribute("depth", 1);
    block.setAttribute("height", 0.4);
    block.setAttribute("width", 3);
    block.setAttribute("repeat","0.8 0.3")
    block.setAttribute("src","#wall");
    block.setAttribute("position",{x:x,y:2.3,z:z});
    this.obj.append(block);

    // start out visible in the scene
    scene.append(this.obj);

    // hide when clicked and schedule regeneration
    this.obj.addEventListener("click", () => {
      this.hide();
      setTimeout(() => {
        console.log('regenerating Yellow at', this.x, this.z);
        this.regenerate();
      }, 3000);
    });
  }

  hide() {
    if (this.yellow) this.yellow.setAttribute('visible', false);
  }

  regenerate() {
    if (this.yellow) this.yellow.setAttribute('visible', true);
  }
}