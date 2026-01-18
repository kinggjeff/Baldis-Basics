class Wall{
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.obj = document.createElement("a-box");
    this.obj.setAttribute("depth", 2);
    this.obj.setAttribute("height", 5);
    this.obj.setAttribute("width", 0.01);
    this.obj.setAttribute("src","wall.jpg");
    this.obj.setAttribute("position",{x:x,y:y,z:z});
    scene.append(this.obj);
  }
}
