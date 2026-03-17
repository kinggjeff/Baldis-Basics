class Ceiling{
    constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.obj = document.createElement("a-box");
    this.obj.setAttribute("depth", 100);
    this.obj.setAttribute("height", 0.1);
    this.obj.setAttribute("width", 100);
    this.obj.setAttribute("src","#ceiling");
    this.obj.setAttribute("position",{x:x,y:y,z:z});
    
    scene.append(this.obj);
  }
}
