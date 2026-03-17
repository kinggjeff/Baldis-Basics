class Brown{
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.obj = document.createElement("a-entity");
    let brown = document.createElement("a-box");
    this.brown = brown;
    this.obj.append(brown);
    brown.setAttribute("depth", 1);
    brown.setAttribute("height", 2.2);
    brown.setAttribute("width", 1);
    brown.setAttribute("src","#brown");
    brown.setAttribute("position",{x:x,y:1,z:z});

    let block = document.createElement("a-box");
    this.block = block;
    block.setAttribute("depth", 1);
    block.setAttribute("height", 0.4);
    block.setAttribute("width", 1);
    block.setAttribute("repeat","0.4 0.3")
    block.setAttribute("src","wall.jpg");
    block.setAttribute("position",{x:x,y:2.3,z:z});
    this.obj.append(block);
    scene.append(this.obj);

    this.obj.addEventListener("click", () => {
      this.hide();
      setTimeout(() => {
        console.log('regenerating Brown at', this.x, this.z);
        this.regenerate();
      }, 3000);
    });
  }

  hide() {
    // hide only the vertical brown panel; keep the top block visible
    if (this.brown) this.brown.setAttribute('visible', false);
  }

  regenerate() {
    if (this.brown) this.brown.setAttribute('visible', true);
  }
}