class Nbrown{
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
    brown.setAttribute("rotation",{x:0,y:90,z:0});

    let block = document.createElement("a-box");
    this.block = block;
    block.setAttribute("depth", 1);
    block.setAttribute("height", 0.4);
    block.setAttribute("width", 1);
    block.setAttribute("src","#wall");
    block.setAttribute("repeat","0.4 0.3")
    block.setAttribute("position",{x:x,y:2.3,z:z});
    block.setAttribute("rotation",{x:0,y:90,z:0});
    this.obj.append(block);
    scene.append(this.obj);

    this.obj.addEventListener("click", () => {
      this.hide();
      setTimeout(() => {
        console.log('regenerating Nbrown at', this.x, this.z);
        this.regenerate();
      }, 3000);
    });
  }

  hide() {
    if (this.brown) this.brown.setAttribute('visible', false);
  }

  regenerate() {
    if (this.brown) this.brown.setAttribute('visible', true);
  }
}