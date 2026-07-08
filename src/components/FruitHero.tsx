/**
 * FruitHero — interactive 3D floating fruits for the hero section.
 *
 * - Photoscanned CC0 glTF models (Poly Haven) float with soft zero-g physics.
 * - The cursor is a kinematic collider that physically pushes fruits aside.
 * - Clicking a fruit slices it in half (world-space clipping planes + flesh
 *   caps), bursts juice particles, and respawns a fresh fruit moments later.
 *
 * NOTE: the <Suspense> boundary must live INSIDE <Canvas>. Physics (rapier
 * WASM) and useGLTF both suspend; if that bubbles to a boundary outside the
 * Canvas, R3F unmounts mid-init and force-loses the WebGL context.
 */
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  Physics,
  RigidBody,
  BallCollider,
  type RapierRigidBody,
} from "@react-three/rapier";

/* ------------------------------------------------------------------ */
/* Models & palette                                                     */
/* ------------------------------------------------------------------ */

const MODELS = {
  apple: "/models/food_apple_01/food_apple_01.gltf",
  lemon: "/models/lemon/lemon.gltf",
  lime: "/models/food_lime_01/food_lime_01.gltf",
  ginger: "/models/food_ginger_01/food_ginger_01.gltf",
  kiwi: "/models/food_kiwi_01/food_kiwi_01.gltf",
  pomegranate: "/models/food_pomegranate_01/food_pomegranate_01.gltf",
} as const;

type FruitKind = keyof typeof MODELS;

/** Inner flesh color revealed on the cut face. */
const FLESH: Record<FruitKind, string> = {
  apple: "#F3EDC8",
  lemon: "#F6E27A",
  lime: "#C9E284",
  ginger: "#EFE3A8",
  kiwi: "#8CC63F",
  pomegranate: "#B91E3E",
};

/** Juice splash particle color. */
const JUICE: Record<FruitKind, string> = {
  apple: "#D8E6A3",
  lemon: "#F2D53C",
  lime: "#A4D65E",
  ginger: "#E8D77F",
  kiwi: "#6FB33A",
  pomegranate: "#D42B4C",
};

Object.values(MODELS).forEach((p) => useGLTF.preload(p));

/* ------------------------------------------------------------------ */
/* Layout slots — x is a fraction of the half viewport width           */
/* ------------------------------------------------------------------ */

interface Slot {
  kind: FruitKind;
  fx: number; // fraction of half viewport width
  y: number;
  z: number;
  size: number; // world diameter
}

const DESKTOP_SLOTS: Slot[] = [
  { kind: "apple", fx: -0.8, y: 1.7, z: 0.2, size: 1.05 },
  { kind: "lemon", fx: -0.55, y: -0.35, z: 0.4, size: 0.85 },
  { kind: "kiwi", fx: -0.92, y: -1.5, z: -0.3, size: 0.8 },
  { kind: "lemon", fx: -0.4, y: 2.5, z: -0.4, size: 0.6 },
  { kind: "pomegranate", fx: 0.8, y: 1.5, z: -0.1, size: 1.15 },
  { kind: "lime", fx: 0.55, y: -0.45, z: 0.35, size: 0.8 },
  { kind: "ginger", fx: 0.94, y: -1.45, z: 0.1, size: 1.0 },
  { kind: "apple", fx: 0.42, y: 2.5, z: -0.5, size: 0.65 },
];

const MOBILE_SLOTS: Slot[] = [
  { kind: "apple", fx: -0.62, y: 2.7, z: 0, size: 0.75 },
  { kind: "lemon", fx: 0.62, y: 2.5, z: 0.2, size: 0.6 },
  { kind: "lime", fx: -0.6, y: -2.7, z: 0.1, size: 0.6 },
  { kind: "pomegranate", fx: 0.66, y: -2.5, z: 0, size: 0.8 },
];

/* ------------------------------------------------------------------ */
/* Model loading helpers                                                */
/* ------------------------------------------------------------------ */

/** Clone + normalize a glTF scene so its bounding sphere has `size` diameter, centered at origin. */
function useNormalizedFruit(kind: FruitKind, size: number, cloneMaterials = false) {
  const { scene } = useGLTF(MODELS[kind]);
  return useMemo(() => {
    const root = scene.clone(true);
    if (cloneMaterials) {
      root.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.material = (mesh.material as THREE.Material).clone();
        }
      });
    }
    const sphere = new THREE.Box3()
      .setFromObject(root)
      .getBoundingSphere(new THREE.Sphere());
    const holder = new THREE.Group();
    holder.add(root);
    root.position.copy(sphere.center).multiplyScalar(-1);
    holder.scale.setScalar(size / (sphere.radius * 2));
    return holder;
  }, [scene, size, cloneMaterials]);
}

/* ------------------------------------------------------------------ */
/* Whole floating fruit                                                 */
/* ------------------------------------------------------------------ */

interface FruitProps {
  slot: Slot;
  phase: number; // bobbing phase offset
  onSlice: (pos: THREE.Vector3, quat: THREE.Quaternion) => void;
}

function FloatingFruit({ slot, phase, onSlice }: FruitProps) {
  const body = useRef<RapierRigidBody>(null);
  const visual = useRef<THREE.Group>(null);
  const model = useNormalizedFruit(slot.kind, slot.size);
  const viewport = useThree((s) => s.viewport);
  const bornAt = useRef(-1);
  const force = useMemo(() => new THREE.Vector3(), []);

  // Gentle initial tumble
  useEffect(() => {
    body.current?.setAngvel(
      {
        x: (Math.random() - 0.5) * 0.8,
        y: (Math.random() - 0.5) * 0.8,
        z: (Math.random() - 0.5) * 0.8,
      },
      true
    );
  }, []);

  useFrame((state) => {
    const rb = body.current;
    if (!rb) return;
    const t = state.clock.elapsedTime;

    // Spawn "pop" — scale in over 0.45s
    if (bornAt.current < 0) bornAt.current = t;
    const k = Math.min(1, (t - bornAt.current) / 0.45);
    const s = 0.3 + 0.7 * (1 - (1 - k) * (1 - k)); // ease-out
    visual.current?.scale.setScalar(s);

    // Soft spring toward the anchor (with a slow sinusoidal bob)
    const halfW = viewport.width / 2;
    const ax = slot.fx * halfW;
    const ay = slot.y + Math.sin(t * 0.55 + phase) * 0.28;
    const p = rb.translation();
    force.set((ax - p.x) * 2.4, (ay - p.y) * 2.4, (slot.z - p.z) * 2.4);
    rb.resetForces(true);
    rb.addForce(force, true);
  });

  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={[slot.fx * 5.5, slot.y + 3.5, slot.z]}
      linearDamping={1.6}
      angularDamping={0.8}
      gravityScale={0}
    >
      <BallCollider args={[slot.size / 2]} />
      <group
        ref={visual}
        onPointerDown={(e) => {
          e.stopPropagation();
          const rb = body.current;
          if (!rb) return;
          const tr = rb.translation();
          const rot = rb.rotation();
          onSlice(
            new THREE.Vector3(tr.x, tr.y, tr.z),
            new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w)
          );
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
      >
        <primitive object={model} />
      </group>
    </RigidBody>
  );
}

/* ------------------------------------------------------------------ */
/* Sliced fruit halves                                                  */
/* ------------------------------------------------------------------ */

interface HalfProps {
  kind: FruitKind;
  size: number;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  /** World-space cut normal; this half keeps the +normal side when sign=1. */
  normal: THREE.Vector3;
  sign: 1 | -1;
}

function FruitHalf({ kind, size, position, quaternion, normal, sign }: HalfProps) {
  const body = useRef<RapierRigidBody>(null);
  const visual = useRef<THREE.Group>(null);
  const model = useNormalizedFruit(kind, size, true);
  const bornAt = useRef(-1);

  // Local-space cut plane (bake world normal into the fruit's local frame)
  const localNormal = useMemo(
    () => normal.clone().multiplyScalar(sign).applyQuaternion(quaternion.clone().invert()).normalize(),
    [normal, quaternion, sign]
  );
  const worldPlane = useMemo(() => new THREE.Plane(), []);
  const localPlane = useMemo(
    () => new THREE.Plane(localNormal.clone(), 0),
    [localNormal]
  );

  // Apply the clipping plane to every mesh material of this (cloned) model
  useEffect(() => {
    model.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.clippingPlanes = [worldPlane];
        mat.side = THREE.DoubleSide;
        mat.needsUpdate = true;
      }
    });
  }, [model, worldPlane]);

  // Fly apart + tumble
  useEffect(() => {
    const rb = body.current;
    if (!rb) return;
    const impulse = normal
      .clone()
      .multiplyScalar(sign * 1.1 * size)
      .add(new THREE.Vector3(0, 0.35 * size, 0.2));
    rb.applyImpulse(impulse, true);
    rb.setAngvel(
      {
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 4,
      },
      true
    );
  }, [normal, sign, size]);

  useFrame((state) => {
    // Keep the world-space clipping plane glued to the moving half
    if (visual.current) {
      visual.current.updateMatrixWorld();
      worldPlane
        .copy(localPlane)
        .applyMatrix4(visual.current.matrixWorld);
    }
    // Shrink away after a beat
    const t = state.clock.elapsedTime;
    if (bornAt.current < 0) bornAt.current = t;
    const age = t - bornAt.current;
    const fade = age < 0.9 ? 1 : Math.max(0, 1 - (age - 0.9) / 0.5);
    visual.current?.scale.setScalar(fade);
  });

  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={position}
      quaternion={quaternion}
      linearDamping={0.4}
      angularDamping={0.6}
      gravityScale={0.9}
    >
      <BallCollider args={[size / 3]} />
      <group ref={visual}>
        <primitive object={model} />
        {/* Flesh cap on the cut face */}
        <mesh
          quaternion={new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            localNormal
          )}
        >
          <circleGeometry args={[size * 0.46, 40]} />
          <meshStandardMaterial
            color={FLESH[kind]}
            roughness={0.55}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </RigidBody>
  );
}

/* ------------------------------------------------------------------ */
/* Juice particle burst                                                 */
/* ------------------------------------------------------------------ */

const PARTICLE_COUNT = 26;

function JuiceBurst({
  color,
  origin,
  size,
}: {
  color: string;
  origin: THREE.Vector3;
  size: number;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const bornAt = useRef(-1);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, () => ({
        pos: origin.clone(),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 3.2,
          Math.random() * 2.6 + 0.6,
          (Math.random() - 0.5) * 3.2
        ),
        scale: (0.35 + Math.random() * 0.65) * size * 0.09,
      })),
    [origin, size]
  );

  useFrame((state, delta) => {
    const im = mesh.current;
    if (!im) return;
    const t = state.clock.elapsedTime;
    if (bornAt.current < 0) bornAt.current = t;
    const age = t - bornAt.current;
    const life = Math.max(0, 1 - age / 0.9);
    const dt = Math.min(delta, 0.05);
    particles.forEach((p, i) => {
      p.vel.y -= 6.5 * dt;
      p.pos.addScaledVector(p.vel, dt);
      dummy.position.copy(p.pos);
      dummy.scale.setScalar(p.scale * life);
      dummy.updateMatrix();
      im.setMatrixAt(i, dummy.matrix);
    });
    im.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, PARTICLE_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color={color} roughness={0.3} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/* Cursor pusher — kinematic ball following the pointer                 */
/* ------------------------------------------------------------------ */

function CursorPusher() {
  const body = useRef<RapierRigidBody>(null);
  const pos = useRef(new THREE.Vector3(0, 0, 50));
  const prev = useRef(new THREE.Vector2(0, 0));
  const speed = useRef(0);

  useFrame((state, delta) => {
    const rb = body.current;
    if (!rb) return;
    const { pointer, viewport } = state;
    const x = (pointer.x * viewport.width) / 2;
    const y = (pointer.y * viewport.height) / 2;

    // Track pointer speed (world units/sec, smoothed)
    const dist = Math.hypot(x - prev.current.x, y - prev.current.y);
    prev.current.set(x, y);
    const instSpeed = dist / Math.max(delta, 1e-4);
    speed.current = THREE.MathUtils.lerp(speed.current, instSpeed, 0.25);

    // Only push while the pointer is sweeping; a stationary cursor
    // disengages so fruits settle back and can be clicked/sliced.
    const active = speed.current > 1.2;
    const target = active ? 0 : 50;
    pos.current.x = THREE.MathUtils.lerp(pos.current.x, x, 0.35);
    pos.current.y = THREE.MathUtils.lerp(pos.current.y, y, 0.35);
    pos.current.z = THREE.MathUtils.lerp(pos.current.z, target, 0.2);
    rb.setNextKinematicTranslation(pos.current);
  });

  return (
    <RigidBody ref={body} type="kinematicPosition" colliders={false} position={[0, 0, 50]}>
      <BallCollider args={[0.55]} />
    </RigidBody>
  );
}

/* ------------------------------------------------------------------ */
/* Scene orchestration                                                  */
/* ------------------------------------------------------------------ */

type Entity =
  | { id: number; slot: Slot; phase: number; state: "whole" }
  | {
      id: number;
      slot: Slot;
      phase: number;
      state: "sliced";
      pos: THREE.Vector3;
      quat: THREE.Quaternion;
      normal: THREE.Vector3;
    };

let nextId = 1;

function FruitField({ mobile }: { mobile: boolean }) {
  const slots = mobile ? MOBILE_SLOTS : DESKTOP_SLOTS;
  const [entities, setEntities] = useState<Entity[]>(() =>
    slots.map((slot, i) => ({
      id: nextId++,
      slot,
      phase: i * 1.7,
      state: "whole" as const,
    }))
  );
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const slice = (id: number, pos: THREE.Vector3, quat: THREE.Quaternion) => {
    // Random slice direction, mostly vertical cut
    const normal = new THREE.Vector3(
      Math.random() * 1.6 - 0.8,
      Math.random() * 0.5 - 0.25,
      Math.random() * 0.6 - 0.3
    );
    if (normal.lengthSq() < 0.05) normal.set(1, 0, 0);
    normal.normalize();

    setEntities((prev) =>
      prev.map((e) =>
        e.id === id && e.state === "whole"
          ? { ...e, state: "sliced" as const, pos, quat, normal }
          : e
      )
    );
    // Respawn a fresh fruit in the same slot after the halves fade
    timers.current.push(
      setTimeout(() => {
        setEntities((prev) =>
          prev.map((e) =>
            e.id === id
              ? { id: nextId++, slot: e.slot, phase: e.phase, state: "whole" as const }
              : e
          )
        );
      }, 1500)
    );
  };

  return (
    <>
      <CursorPusher />
      {entities.map((e) =>
        e.state === "whole" ? (
          <FloatingFruit
            key={e.id}
            slot={e.slot}
            phase={e.phase}
            onSlice={(pos, quat) => slice(e.id, pos, quat)}
          />
        ) : (
          <group key={e.id}>
            <FruitHalf
              kind={e.slot.kind}
              size={e.slot.size}
              position={e.pos}
              quaternion={e.quat}
              normal={e.normal}
              sign={1}
            />
            <FruitHalf
              kind={e.slot.kind}
              size={e.slot.size}
              position={e.pos}
              quaternion={e.quat}
              normal={e.normal}
              sign={-1}
            />
            <JuiceBurst
              color={JUICE[e.slot.kind]}
              origin={e.pos}
              size={e.slot.size}
            />
          </group>
        )
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Public component                                                     */
/* ------------------------------------------------------------------ */

export default function FruitHero() {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );
  const [inView, setInView] = useState(true);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Pause rendering & physics entirely when the hero scrolls out of view
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 0, 9], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.localClippingEnabled = true;
        }}
      >
        {/* Soft studio-style lighting */}
        <ambientLight intensity={0.6} />
        <hemisphereLight args={["#fdfbef", "#1B3B2B", 0.5]} />
        <directionalLight position={[5, 7, 6]} intensity={1.7} color="#fff8ec" />
        <directionalLight position={[-6, 2, -4]} intensity={0.65} color="#E6C77E" />
        <pointLight position={[0, -3, 5]} intensity={0.35} color="#9fd8b4" />

        <Suspense fallback={null}>
          <Physics gravity={[0, -4, 0]} colliders={false}>
            {/* key forces a fresh fruit layout when crossing the breakpoint */}
            <FruitField key={mobile ? "mobile" : "desktop"} mobile={mobile} />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
