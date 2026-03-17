class Hwall{
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.obj = document.createElement("a-box");
    this.obj.setAttribute("depth", 1);
    this.obj.setAttribute("height", 4);
    this.obj.setAttribute("width", 1);
    this.obj.setAttribute("rotation",{x:0,y:90,z:0});
    this.obj.setAttribute("src","#wall");
    this.obj.setAttribute("repeat","0.8 2");
    this.obj.setAttribute("position",{x:x,y:y,z:z});
    // make horizontal wall collidable
    this.obj.setAttribute("static-body","");
    scene.append(this.obj);

    // register so Baldi's AI can see this wall
    window.WALLS = window.WALLS || [];
    window.WALLS.push(this);
  }
}