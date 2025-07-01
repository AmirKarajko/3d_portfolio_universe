const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(6, 4, 16);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas"), antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

function createPlanet(color, positionZ, labelText, radius = 2.5) {
  const geometry = new THREE.SphereGeometry(radius, 16, 16);
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.2 });
  const planet = new THREE.Mesh(geometry, material);
  planet.position.set(0, 0, positionZ);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 128;
  ctx.fillStyle = "white";
  ctx.font = "48px Arial";
  ctx.textBaseline = "middle";
  ctx.fillText(labelText, 20, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(8, 2, 1);
  sprite.position.set(0, 3.5, positionZ);

  scene.add(sprite);
  scene.add(planet);

  return { planet, label: sprite };
}

function createPanel(position, width, height, drawFunc) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawFunc(ctx, canvas);

  const texture = new THREE.CanvasTexture(canvas);
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
  });
  const panel = new THREE.Mesh(geometry, material);
  panel.position.copy(position);
  scene.add(panel);

  return { mesh: panel, ctx, canvas, texture, drawFunc };
}

const spacing = -16;

const planetAbout = createPlanet(0x0000FF, 0, "About me", 2.5);
const planetSkills = createPlanet(0xFFFF00, spacing, "Skills", 2);
const planetProjects = createPlanet(0xFF0000, spacing * 2, "Projects", 2);
const planetContact = createPlanet(0x00FF00, spacing * 3, "Contact me", 2);

let targetZ = camera.position.z;

const aboutPanel = createPanel(new THREE.Vector3(8, 0, 0), 10, 5,
(ctx, canvas) => {
    ctx.fillStyle = "white";
    ctx.font = "60px Arial";
    ctx.fillText("I am a developer.", 40, 100);
    ctx.font = "36px Arial";
    ctx.fillText("I designed and developed this 3D portfolio.", 40, 160);
    ctx.fillText("Expert in programming.", 40, 210);
    ctx.fillText("I love creating 3D web projects.", 40, 270);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "assets/bulb.svg";

    img.onload = () => {
      ctx.drawImage(img, 40, 300, 200, 200);
      aboutPanel.texture.needsUpdate = true;
    };
  }
);

const skillsPanel = createPanel(new THREE.Vector3(8, 0, spacing), 10, 4,
  (ctx) => {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Skills:", 40, 100);
    ctx.fillText("I have experience with JavaScript, Three.js, HTML,", 60, 160);
    ctx.fillText("and CSS for creating 3D web projects.", 60, 210);
  }
);

const projectsPanel = createPanel(new THREE.Vector3(8, 0, spacing * 2), 10, 4,
  (ctx) => {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Projects:", 40, 100);
    ctx.fillText("You can view my projects on the website:", 40, 160);
    ctx.fillText("karajkoamir.wordpress.com", 40, 210);
  }
);

const contactPanel = createPanel(new THREE.Vector3(8, 0, spacing * 3), 10, 4,
  (ctx) => {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Contact:", 40, 100);
    ctx.fillText("Email: amir.karajko@gmail.com", 40, 160);
  }
);

window.addEventListener("wheel", (event) => {
  targetZ += event.deltaY * 0.02;
  targetZ = THREE.MathUtils.clamp(targetZ, spacing * 3 - 5, 15);
});

function animate() {
  requestAnimationFrame(animate);

  camera.position.z += (targetZ - camera.position.z) * 0.1;

  camera.lookAt(0, 1, camera.position.z - 10);

  planetAbout.planet.rotation.y += 0.008;
  planetSkills.planet.rotation.y += 0.008;
  planetProjects.planet.rotation.y += 0.008;
  planetContact.planet.rotation.y += 0.008;

  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
