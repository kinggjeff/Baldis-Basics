class Locker {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.obj = document.createElement("a-entity");
    this.obj.setAttribute("position", { x, y: 0, z });

    const shellColor = "#b71c1c";
    const shellDark = "#7f1111";
    const shellLight = "#d94343";
    const metalColor = "#c7cbd1";
    const shadowColor = "#541010";

    const createPart = (tagName, attributes) => {
      const part = document.createElement(tagName);
      for (const [name, value] of Object.entries(attributes)) {
        part.setAttribute(name, value);
      }
      this.obj.append(part);
      return part;
    };

    // Main cabinet body fills most of a single maze tile.
    createPart("a-box", {
      width: 0.82,
      height: 2.25,
      depth: 0.72,
      color: shellColor,
      position: "0 1.125 0",
      roughness: 0.72,
      metalness: 0.12,
      "static-body": ""
    });

    const addDoorFace = (zSign) => {
      const outerZ = 0.325 * zSign;
      const innerZ = -0.335 * zSign;
      const detailZ = 0.368 * zSign;
      const hardwareZ = 0.375 * zSign;
      const lockZ = 0.405 * zSign;
      const plateZ = 0.37 * zSign;
      const lipZ = 0.31 * zSign;
      const footZ = 0.2 * zSign;

      // Slightly recessed inner shadow behind the door opening.
      createPart("a-box", {
        width: 0.68,
        height: 2.03,
        depth: 0.05,
        color: shadowColor,
        position: { x: 0, y: 1.11, z: innerZ },
        roughness: 1
      });

      // Door panel.
      createPart("a-box", {
        width: 0.68,
        height: 2.02,
        depth: 0.08,
        color: shellLight,
        position: { x: 0, y: 1.11, z: outerZ },
        roughness: 0.6,
        metalness: 0.18
      });

      // Vent rows to make it read as a locker instead of a plain cabinet.
      const ventRows = [1.73, 1.58, 1.43, 0.98, 0.83, 0.68];
      for (const ventY of ventRows) {
        createPart("a-box", {
          width: 0.46,
          height: 0.03,
          depth: 0.02,
          color: shellDark,
          position: { x: -0.03, y: ventY, z: detailZ },
          roughness: 0.7
        });
      }

      // Small center ridge detail.
      createPart("a-box", {
        width: 0.06,
        height: 1.7,
        depth: 0.018,
        color: shellDark,
        position: { x: 0.18, y: 1.15, z: detailZ },
        roughness: 0.75
      });

      // Locker handle and lock plate.
      createPart("a-box", {
        width: 0.07,
        height: 0.36,
        depth: 0.04,
        color: metalColor,
        position: { x: 0.23, y: 1.11, z: hardwareZ },
        roughness: 0.35,
        metalness: 0.75
      });
      createPart("a-cylinder", {
        radius: 0.022,
        height: 0.028,
        color: "#f1d25c",
        position: { x: 0.23, y: 1, z: lockZ },
        rotation: "90 0 0",
        roughness: 0.25,
        metalness: 0.9
      });

      // Nameplate and top lip to break up the silhouette.
      createPart("a-box", {
        width: 0.28,
        height: 0.09,
        depth: 0.02,
        color: metalColor,
        position: { x: -0.04, y: 1.9, z: plateZ },
        roughness: 0.28,
        metalness: 0.65
      });
      createPart("a-box", {
        width: 0.7,
        height: 0.04,
        depth: 0.12,
        color: shellLight,
        position: { x: 0, y: 2.02, z: lipZ },
        roughness: 0.55,
        metalness: 0.15
      });

      // Short feet keep the base from looking flat on the floor.
      createPart("a-box", {
        width: 0.1,
        height: 0.08,
        depth: 0.1,
        color: metalColor,
        position: { x: -0.24, y: 0.04, z: footZ },
        roughness: 0.45,
        metalness: 0.6
      });
      createPart("a-box", {
        width: 0.1,
        height: 0.08,
        depth: 0.1,
        color: metalColor,
        position: { x: 0.24, y: 0.04, z: footZ },
        roughness: 0.45,
        metalness: 0.6
      });
    };

    addDoorFace(1);
    addDoorFace(-1);

    // Door frame rails.
    createPart("a-box", {
      width: 0.08,
      height: 2.12,
      depth: 0.76,
      color: shellDark,
      position: "-0.37 1.1 0",
      roughness: 0.9
    });
    createPart("a-box", {
      width: 0.08,
      height: 2.12,
      depth: 0.76,
      color: shellDark,
      position: "0.37 1.1 0",
      roughness: 0.9
    });
    createPart("a-box", {
      width: 0.82,
      height: 0.08,
      depth: 0.76,
      color: shellDark,
      position: "0 2.21 0",
      roughness: 0.9
    });
    createPart("a-box", {
      width: 0.82,
      height: 0.08,
      depth: 0.76,
      color: shellDark,
      position: "0 0.04 0",
      roughness: 0.9
    });

    scene.append(this.obj);

    window.WALLS = window.WALLS || [];
    window.WALLS.push(this);
  }
}