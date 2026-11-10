import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const CENTER = new THREE.Vector3(0, 0.35, 0);

// nav sólida depois de sair do topo
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-solid", scrollY > 24);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

function fallback(stage, why) {
  console.warn("3D indisponível:", why);
  stage.querySelector("canvas")?.setAttribute("hidden", "");
  stage.querySelector(".viewer__fallback")?.removeAttribute("hidden");
  stage.querySelector("[data-hint]")?.setAttribute("hidden", "");
}

class Viewer {
  constructor(stage, model, env) {
    this.stage = stage;
    this.canvas = stage.querySelector("canvas");
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    this.scene.environment = new THREE.PMREMGenerator(this.renderer).fromScene(env, 0.04).texture;
    this.scene.environmentIntensity = 0.9;
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(1.5, 2.5, 3);
    this.scene.add(key);
    this.pivot = new THREE.Group();
    this.pivot.add(model);
    this.scene.add(this.pivot);
    model.traverse((o) => {
      if (o.isMesh && o.material.map) o.material.map.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    });
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.05, 20);
    this.visible = false;
    new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (this.visible) this.loop();
    }).observe(stage);
    new ResizeObserver(() => this.resize()).observe(stage);
    this.resize();
    this.canvas.classList.add("is-ready");
  }
  resize() {
    const w = this.stage.clientWidth, h = this.stage.clientHeight;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.aspect = w / h;
    this.frame?.();
    this.dirty = true;
  }
  loop() {
    if (this.running) return;
    this.running = true;
    const tick = () => {
      if (!this.visible) return (this.running = false);
      this.update();
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

/* Herói: arrastar gira a camiseta, com inércia */
function hero(stage, model, env) {
  const v = new Viewer(stage, model, env);
  const hint = stage.querySelector("[data-hint]");
  let yaw = 0.5, target = 0, touched = false, down = null;
  v.frame = () => {
    const fit = v.aspect < 0.9 ? 2.5 / v.aspect * 0.62 : 2.0;
    v.camera.position.set(0, 0.42, clamp(fit, 2.0, 4.6));
    v.camera.lookAt(CENTER);
  };
  v.frame();
  const interact = () => { touched = true; hint.classList.add("is-gone"); };
  const nudge = (d) => { interact(); target += d; };
  v.canvas.addEventListener("pointerdown", (e) => { down = e.clientX; v.canvas.setPointerCapture(e.pointerId); interact(); });
  v.canvas.addEventListener("pointermove", (e) => { if (down == null) return; target += (e.clientX - down) * 0.008; down = e.clientX; });
  const up = () => (down = null);
  v.canvas.addEventListener("pointerup", up);
  v.canvas.addEventListener("pointercancel", up);
  v.canvas.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-0.6); }
    if (e.key === "ArrowRight") { e.preventDefault(); nudge(0.6); }
  });
  stage.querySelectorAll("[data-rot]").forEach((b) => b.addEventListener("click", () => nudge(b.dataset.rot * 0.9)));
  let t0 = performance.now();
  v.update = () => {
    const now = performance.now(), dt = Math.min(0.05, (now - t0) / 1000);
    t0 = now;
    if (!touched && !reduce) target = 0.35 + Math.sin(now / 1700) * 0.7; // balanço leve até a pessoa mexer
    yaw += (target - yaw) * (reduce ? 1 : 1 - Math.exp(-dt * 7));
    v.pivot.rotation.y = yaw;
  };
  v.loop();
}

/* Capítulos: a câmera segue a rolagem da seção */
function chapters(section, model, env) {
  const stage = section.querySelector("[data-viewer]");
  const v = new Viewer(stage, model, env);
  const tabs = [...section.querySelectorAll(".tab")];
  const texts = [...section.querySelectorAll(".chap")];
  // az = giro da câmera em torno da camiseta; x/y = alvo; d = distância
  const stops = [
    { az: 0.35, x: 0, y: 0.35, d: 2.3 },
    { az: 0, x: 0.03, y: 0.42, d: 1.95 },
    { az: Math.PI, x: 0, y: 0.35, d: 2.3 },
  ];
  const cur = { ...stops[0] };
  let active = -1;
  const progress = () => {
    const r = section.getBoundingClientRect();
    return clamp(-r.top / (r.height - innerHeight), 0, 1);
  };
  const stopsAt = (p) => {
    const f = p * (stops.length - 1), i = Math.min(stops.length - 2, Math.floor(f));
    let t = f - i;
    t = t * t * (3 - 2 * t);
    const a = stops[i], b = stops[i + 1], o = {};
    for (const k in a) o[k] = a[k] + (b[k] - a[k]) * t;
    return o;
  };
  const setActive = (i) => {
    if (i === active) return;
    active = i;
    texts.forEach((el, n) => el.classList.toggle("is-active", n === i));
    tabs.forEach((el, n) => {
      el.classList.toggle("is-active", n === i);
      el.setAttribute("aria-pressed", n === i);
    });
  };
  tabs.forEach((b) => b.addEventListener("click", () => {
    const i = +b.dataset.go, r = section.getBoundingClientRect();
    scrollTo({ top: scrollY + r.top + (i / (stops.length - 1)) * (r.height - innerHeight) + 2, behavior: reduce ? "auto" : "smooth" });
  }));
  let t0 = performance.now();
  v.update = () => {
    const now = performance.now(), dt = Math.min(0.05, (now - t0) / 1000);
    t0 = now;
    const p = progress(), goal = stopsAt(p), k = reduce ? 1 : 1 - Math.exp(-dt * 9);
    for (const key in cur) cur[key] += (goal[key] - cur[key]) * k;
    const narrow = v.aspect < 0.9 ? 1.5 : 1;
    v.camera.position.set(
      cur.x + Math.sin(cur.az) * cur.d * narrow,
      cur.y + 0.06,
      Math.cos(cur.az) * cur.d * narrow
    );
    v.camera.lookAt(cur.x, cur.y, 0);
    setActive(Math.round(p * (stops.length - 1)));
  };
  v.loop();
}

(async () => {
  const heroStage = document.querySelector('[data-viewer="hero"]');
  const capSection = document.querySelector("[data-chapters]");
  try {
    const gltf = await new GLTFLoader().loadAsync("assets/models/camiseta.glb");
    const env = new RoomEnvironment();
    hero(heroStage, gltf.scene, env);
    chapters(capSection, gltf.scene.clone(true), env);
  } catch (err) {
    fallback(heroStage, err);
    fallback(capSection.querySelector("[data-viewer]"), err);
  }
})();
