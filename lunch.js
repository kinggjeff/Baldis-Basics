class LunchTable {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    // root entity
    this.obj = document.createElement("a-entity");

    // wood tabletop
    let tabletop = document.createElement("a-box");
    tabletop.setAttribute("height", 0.1);
    tabletop.setAttribute("width", 1);
    tabletop.setAttribute("depth", 1);
    tabletop.setAttribute("src", "#wood");
    tabletop.setAttribute("scale", {x:7, y:1, z:0.75});
    tabletop.setAttribute("position", {x: x, y: y + 0.3, z: z});
    tabletop.setAttribute("static-body", "");
    this.obj.append(tabletop);

    // four black poles under the tabletop (one at each corner)
    const poleOffset = 3; // half the table width in x direction
    const poleDepth = 0.3; // half width in z direction
    const poles = [
      {x: x - poleOffset, z: z - poleDepth},
      {x: x - poleOffset, z: z + poleDepth},
      {x: x + poleOffset, z: z - poleDepth},
      {x: x + poleOffset, z: z + poleDepth},
    ];

    poles.forEach(pos => {
      let pole = document.createElement("a-box");
      pole.setAttribute("height", 0.8);
      pole.setAttribute("width", 0.08);
      pole.setAttribute("depth", 0.08);
      pole.setAttribute("color", "#000");
      pole.setAttribute("position", {x: pos.x, y: y - 0.1, z: pos.z});
      pole.setAttribute("static-body", "");
      this.obj.append(pole);
    });

    // two benches - one on each side of the table
    const benchPositions = [
      {z: z - 0.65}, // front bench
      {z: z + 0.65}, // back bench
    ];

    benchPositions.forEach(pos => {
      let bench = document.createElement("a-box");
      bench.setAttribute("height", 0.4);
      bench.setAttribute("width", 7);
      bench.setAttribute("depth", 0.2);
      bench.setAttribute("rotation", {x: 90, y: 0, z: 0});
      bench.setAttribute("src", "#wood");
      bench.setAttribute("scale", {x: 1, y: 1, z: 0.4});
      bench.setAttribute("position", {x: x, y: y, z: pos.z});
      bench.setAttribute("static-body", "");
      this.obj.append(bench);

      // support beams under each bench (left and right ends)
      const benchBeams = [
        {x: x - 3.4},  // left support beam
        {x: x + 3.4},  // right support beam
      ];

      benchBeams.forEach(beam => {
        let support = document.createElement("a-box");
        support.setAttribute("height", 0.5);
        support.setAttribute("width", 0.1);
        support.setAttribute("depth", 0.1);
        support.setAttribute("color", "#000");
        support.setAttribute("position", {x: beam.x, y: y - 0.25, z: pos.z});
        support.setAttribute("static-body", "");
        this.obj.append(support);
      });
    });

    scene.append(this.obj);

    // register for collisions
    window.WALLS = window.WALLS || [];
    window.WALLS.push(this);
  }
}