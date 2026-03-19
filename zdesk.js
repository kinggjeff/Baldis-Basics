class Zdesk {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    // Create the main entity for the desk
    this.obj = document.createElement("a-entity");
    

    // Create the tabletop
    let tabletop = document.createElement("a-box");
    tabletop.setAttribute("static-body","");
    tabletop.setAttribute("height", 0.1);
    tabletop.setAttribute("width", 1);
    tabletop.setAttribute("depth", 1);
    tabletop.setAttribute("src", "#wood");
    tabletop.setAttribute("scale",{x:3, y:1 , z:0.75});
    tabletop.setAttribute("position", {x:x, y:y + 0.3, z:z});
    this.obj.append(tabletop);
    scene.append(this.obj);

    // Create four legs
    const legPositions = [
      { x: x - 1.23, y: y, z: z - 0.3 }, // front-left
      { x: x + 1.23, y: y, z: z - 0.3 }, // front-right
      { x: x - 1.23, y: y, z: z + 0.3 }, // back-left
      { x: x + 1.23, y: y, z: z + 0.3 }  // back-right
    ];

    legPositions.forEach(pos => {
      let leg = document.createElement("a-box");
      leg.setAttribute("static-body","");
      leg.setAttribute("height", 0.7);
      leg.setAttribute("width", 0.5);
      leg.setAttribute("depth", 0.1);
      leg.setAttribute("src", "#wood");
      leg.setAttribute("position", { x: pos.x, y: y, z: pos.z });
      this.obj.append(leg);
    });

    let notebook = document.createElement("a-gltf-model")
    this.notebookCollected = false;
    notebook.setAttribute("src", "#notebook")
    notebook.setAttribute("position",{x:x,y:1.2,z:z})
    this.obj.addEventListener("click",()=>{
    if (this.notebookCollected) return;
    this.notebookCollected = true;
    notebook.remove();
    notebooks++;
    counter();
    if (typeof window.triggerYouWin === "function" && notebooks >= totalNotebooks) {
      window.triggerYouWin();
    }
    })
    this.obj.append(notebook)

    // Append to scene
    scene.append(this.obj);

    // register z-desk as an obstacle for AI + player collision checks
    window.WALLS = window.WALLS || [];
    window.WALLS.push(this);
  }
}