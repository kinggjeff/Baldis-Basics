class Coin {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.obj = document.createElement("a-entity");

    let coin = document.createElement("a-gltf-model")
    coin.setAttribute("src", "#gold-coin")
    coin.setAttribute("scale", {x: 0.5, y: 0.5, z: 0.5})
    coin.setAttribute("position",{x:x,y:1,z:z})
    coin.setAttribute("animation", {
      property: "rotation",
      to: "0 360 0",
      dur: 6000,
      easing: "linear",
      loop: true
    })

    let light = document.createElement("a-light")
    light.setAttribute("type", "point")
    light.setAttribute("color", "#FFD54A")
    light.setAttribute("intensity", 1.2)
    light.setAttribute("distance", 6)
    light.setAttribute("decay", 2)
    light.setAttribute("position", {x: x, y: 1, z: z})

    this.obj.addEventListener("click",()=>{
    coin.remove();
    light.remove();
    coins++;          
    counter();
    })
    this.obj.append(coin)
    this.obj.append(light)
    scene.append(this.obj);

    // register coin so it blocks movement and for AI visibility
    window.WALLS = window.WALLS || [];
    window.WALLS.push(this);
  }

  getPosition() {
    const p = this.obj.object3D.position;
    return { x: p.x, y: p.y, z: p.z };
  }
}
