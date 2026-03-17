class Trash {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.obj = document.createElement("a-entity");

    let trash = document.createElement("a-gltf-model")
    trash.setAttribute("src", "#trash")
    trash.setAttribute("position",{x:x,y:0,z:z})
    this.obj.append(trash)

    // sensible default scale and add to scene
    this.obj.setAttribute("scale",{x:1,y:1,z:1});
    this.obj.object3D.position.set(x, 0, z);
    scene.append(this.obj);

    // register bsoda so it blocks movement and for AI visibility
    window.WALLS = window.WALLS || [];
    window.WALLS.push(this);
  }

  getPosition() {
    const p = this.obj.object3D.position;
    return { x: p.x, y: p.y, z: p.z };
  }
}