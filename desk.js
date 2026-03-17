class Desk {
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
    tabletop.setAttribute("scale",{x:0.75, y:1 , z:0.75});
    tabletop.setAttribute("position", {x:x, y:+0.8, z:z});
    this.obj.append(tabletop);
    // the object will be appended once after all parts are added

    // Create four legs
    // legs around the perimeter; z offsets flipped to the opposite side
    const legPositions = [
      { x: x - 0.3, y: y, z: z + 0.3 }, // originally front-left, now back-left
      { x: x + 0.3, y: y, z: z + 0.3 }, // originally front-right, now back-right
      { x: x - 0.3, y: y, z: z - 0.3 }, // originally back-left, now front-left
      { x: x + 0.3, y: y, z: z - 0.3 }  // originally back-right, now front-right
    ];

    legPositions.forEach(pos => {
      let leg = document.createElement("a-box");
      leg.setAttribute("static-body", "");
      // legs need width and height to be visible
      leg.setAttribute("width", 0.1);
      leg.setAttribute("height", 1);
      leg.setAttribute("depth", 0.1);
      leg.setAttribute("src", "#wood");
      leg.setAttribute("position", { x: pos.x, y: y - 0.25, z: pos.z });
      this.obj.append(leg);
    });

    // Append to scene
    scene.append(this.obj);

    // Add a single small seat that tucks partially under the desk
    const seatOffset = 0; // centered
    // seat top
    let seat = document.createElement('a-box');
    seat.setAttribute('static-body','');
    // narrower square top
    seat.setAttribute('width', 0.3);
    seat.setAttribute('depth', 0.3);
    seat.setAttribute('height', 0.1);
    seat.setAttribute('src', '#wood');
    // position so the seat sits low and partially under the tabletop (opposite side)
    seat.setAttribute('position', { x: x + seatOffset, y: y - 0.1, z: z + 0.15 });
    this.obj.append(seat);

    // add four small legs under the seat
    const legOffset = 0.12;
    [
      {dx: -legOffset, dz: -legOffset},
      {dx: legOffset, dz: -legOffset},
      {dx: -legOffset, dz: legOffset},
      {dx: legOffset, dz: legOffset}
    ].forEach(lp => {
      let sleg = document.createElement('a-box');
      sleg.setAttribute('static-body','');
      sleg.setAttribute('width', 0.05);
      sleg.setAttribute('depth', 0.05);
      sleg.setAttribute('height', 0.5);
      sleg.setAttribute('src', '#wood');
      // bottom of leg should start at original y
      sleg.setAttribute('position', { x: x + seatOffset + lp.dx, y: y -0.3, z: z + 0.15 + lp.dz });
      this.obj.append(sleg);
    });

    // small back to the seat (thin vertical board)
    let back = document.createElement('a-box');
    back.setAttribute('width', 0.3);
    back.setAttribute('depth', 0.06);
    back.setAttribute('height', 0.32);
    back.setAttribute('src', '#wood');
    // place the back slightly behind the seat so it remains visible on opposite side
    back.setAttribute('position', { x: x + seatOffset, y: y + 0.16, z: z + 0.33 });
    this.obj.append(back);

    // register desk as an obstacle for AI + player collision checks
    window.WALLS = window.WALLS || [];
    window.WALLS.push(this);
  }
}