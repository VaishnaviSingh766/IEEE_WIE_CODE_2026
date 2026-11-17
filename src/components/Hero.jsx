import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import Button from '../utils/Button'

const MAG = 0xe6007e
const MAGL = 0xff4db8
const C = { mag: '#E6007E', lite: '#FF4DB8', white: '#ff9fd6' }
const PANEL = '#5a0031'
const rad = (d) => (d * Math.PI) / 180
const rnd = (n) => {
  const x = Math.sin(n * 127.1) * 43758.5453
  return x - Math.floor(x)
}

// ===================== Canvas textures =====================
function makeScreen(w, h, draw, transparent = false) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  const s = {
    tex,
    redraw: (t) => {
      if (transparent) {
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, w, h)
      }
      draw(ctx, w, h, t)
      tex.needsUpdate = true
    }
  }
  s.redraw(0)
  return s
}

function panelFrame(ctx, w, h) {
  ctx.fillStyle = PANEL
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = C.mag
  ctx.fillRect(0, 0, w, 14)
  ctx.fillStyle = '#fff'
  ctx.fillRect(6, 5, 34, 4)
  ctx.strokeStyle = 'rgba(255,77,184,.4)'
  ctx.strokeRect(1, 1, w - 2, h - 2)
}

const SCREENS = {
  code(ctx, w, h, t) {
    panelFrame(ctx, w, h)
    const row = Math.floor(t * 6)
    for (let i = 0; i < 13; i++) {
      const r = row + i
      const y = 24 + i * 17 - ((t * 6) % 1) * 17
      if (y < 18) continue
      ctx.globalAlpha = 0.9
      ctx.fillStyle = rnd(r * 7) > 0.82 ? C.white : rnd(r * 5) > 0.5 ? C.lite : C.mag
      ctx.fillRect(10 + Math.floor(rnd(r * 3.1) * 3) * 14, y, 30 + rnd(r) * (w - 100), 6)
    }
    ctx.globalAlpha = 1
  },
  chart(ctx, w, h, t) {
    panelFrame(ctx, w, h)
    const n = 8
    const bw = (w - 24) / n
    for (let i = 0; i < n; i++) {
      const bh = (0.25 + 0.75 * Math.abs(Math.sin(t * 1.2 + i * 0.7))) * (h - 44)
      ctx.fillStyle = i % 5 === 0 ? C.white : C.lite
      ctx.fillRect(12 + i * bw, h - 10 - bh, bw - 4, bh)
    }
    ctx.strokeStyle = C.white
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i <= 40; i++) {
      const x = 12 + (i / 40) * (w - 24)
      const y = 50 + Math.sin(i * 0.4 + t * 2) * 14 + Math.sin(i * 0.15 - t) * 10
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
    }
    ctx.stroke()
  },
  radar(ctx, w, h, t) {
    panelFrame(ctx, w, h)
    const cx = w / 2
    const cy = h / 2 + 7
    const r = h * 0.38
    ctx.strokeStyle = 'rgba(255,77,184,.6)'
    ctx.lineWidth = 1.5
    for (let k = 1; k <= 3; k++) {
      ctx.beginPath()
      ctx.arc(cx, cy, (r * k) / 3, 0, 7)
      ctx.stroke()
    }
    const a = t * 2
    ctx.fillStyle = 'rgba(255,77,184,.55)'
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, a - 0.7, a)
    ctx.fill()
    ctx.fillStyle = '#fff'
    for (let i = 0; i < 5; i++) {
      const aa = rnd(i + 1) * 6.28
      const rr = (0.3 + rnd(i + 9) * 0.65) * r
      ctx.fillRect(cx + Math.cos(aa) * rr - 2, cy + Math.sin(aa) * rr - 2, 4, 4)
    }
  },
  wave(ctx, w, h, t) {
    panelFrame(ctx, w, h)
    for (let k = 0; k < 3; k++) {
      ctx.strokeStyle = k === 1 ? C.white : k ? C.lite : C.mag
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let i = 0; i <= 60; i++) {
        const x = 8 + (i / 60) * (w - 16)
        const y = h / 2 + 8 + Math.sin(i * (0.25 + k * 0.12) + t * (2 + k)) * (22 - k * 5)
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
      }
      ctx.stroke()
    }
  },
  stats(ctx, w, h, t) {
    panelFrame(ctx, w, h)
    for (let i = 0; i < 3; i++) {
      const y = 34 + i * 40
      ctx.fillStyle = 'rgba(255,77,184,.25)'
      ctx.fillRect(12, y, w - 24, 12)
      ctx.fillStyle = i === 0 ? C.white : C.lite
      ctx.fillRect(12, y, (w - 24) * (0.35 + 0.6 * Math.abs(Math.sin(t * 0.6 + i * 1.7))), 12)
    }
  }
}

// transparent "glass screen" that sits behind the floating holograms
function drawPanel(ctx, w, h, t) {
  ctx.fillStyle = 'rgba(230,0,126,.10)'
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = 'rgba(255,77,184,.18)'
  ctx.lineWidth = 1
  for (let i = 1; i < 8; i++) {
    ctx.beginPath()
    ctx.moveTo((i * w) / 8, 0)
    ctx.lineTo((i * w) / 8, h)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, (i * h) / 8)
    ctx.lineTo(w, (i * h) / 8)
    ctx.stroke()
  }
  const L = 28
  const m = 6
  const corners = [
    [m, m, 1, 1],
    [w - m, m, -1, 1],
    [m, h - m, 1, -1],
    [w - m, h - m, -1, -1]
  ]
  ctx.strokeStyle = C.lite
  ctx.lineWidth = 3
  corners.forEach(([x, y, sx, sy]) => {
    ctx.beginPath()
    ctx.moveTo(x + sx * L, y)
    ctx.lineTo(x, y)
    ctx.lineTo(x, y + sy * L)
    ctx.stroke()
  })
  ctx.fillStyle = C.mag
  ctx.fillRect(18, 18, 54, 5)
  ctx.fillStyle = 'rgba(255,77,184,.28)'
  ctx.fillRect(0, ((t * 0.35) % 1) * h, w, 6)
}

// ===================== IK + limbs =====================
const _a = new THREE.Vector3()
const _b = new THREE.Vector3()
const _c = new THREE.Vector3()
const Y = new THREE.Vector3(0, 1, 0)

function solveIK(S, T, L1, L2, pole, elbow, hand) {
  _a.subVectors(T, S)
  const d = Math.min(Math.max(_a.length(), 0.05), L1 + L2 - 1e-3)
  _a.normalize()
  hand.copy(S).addScaledVector(_a, d)
  const a = (L1 * L1 - L2 * L2 + d * d) / (2 * d)
  const h = Math.sqrt(Math.max(L1 * L1 - a * a, 0))
  _b.copy(pole).addScaledVector(_a, -pole.dot(_a)).normalize()
  elbow.copy(S).addScaledVector(_a, a).addScaledVector(_b, h)
}
const limb = (radius, len, mat) =>
  new THREE.Mesh(new THREE.CapsuleGeometry(radius, Math.max(len - 2 * radius, 0.001), 6, 12), mat)
function place(m, p0, p1) {
  m.position.addVectors(p0, p1).multiplyScalar(0.5)
  _c.subVectors(p1, p0).normalize()
  m.quaternion.setFromUnitVectors(Y, _c)
}

// ===================== World =====================
function createWorld() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  scene.fog = new THREE.FogExp2(0x000000, 0.1)

  // ---- lights ----
  scene.add(new THREE.AmbientLight(0x3a1830, 0.8))
  scene.add(new THREE.HemisphereLight(0x7a2a55, 0x000000, 0.5))
  const key = new THREE.DirectionalLight(0xffd6ec, 0.9)
  key.position.set(1.5, 3.5, 3.5)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  scene.add(key)
  const rimL = new THREE.PointLight(MAG, 9, 8, 2)
  rimL.position.set(-1.4, 1.6, -1.0)
  const rimR = rimL.clone()
  rimR.position.set(1.4, 1.6, -1.0)
  const top = new THREE.PointLight(MAGL, 5, 7, 2)
  top.position.set(0, 2.6, -1.4)
  const screenGlow = new THREE.PointLight(0xff3a9a, 3, 3, 2)
  screenGlow.position.set(0, 1.3, -1.0)
  const fill = new THREE.PointLight(0xff5ab0, 6, 6, 2)
  fill.position.set(0, 1.8, 1.2)
  scene.add(rimL, rimR, top, screenGlow, fill)

  // ---- floor ----
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(9, 64),
    new THREE.MeshStandardMaterial({ color: 0x08000c, roughness: 0.25, metalness: 0.7 })
  )
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)
  const grid = new THREE.GridHelper(18, 36, MAG, 0x2a0018)
  grid.position.y = 0.002
  grid.material.transparent = true
  grid.material.opacity = 0.28
  scene.add(grid)
  const gc = document.createElement('canvas')
  gc.width = gc.height = 256
  const gx = gc.getContext('2d')
  const gg = gx.createRadialGradient(128, 128, 0, 128, 128, 128)
  gg.addColorStop(0, 'rgba(255,40,160,.9)')
  gg.addColorStop(1, 'rgba(0,0,0,0)')
  gx.fillStyle = gg
  gx.fillRect(0, 0, 256, 256)
  const pool = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 7),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(gc), transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false })
  )
  pool.rotation.x = -Math.PI / 2
  pool.position.set(0, 0.01, -0.8)
  scene.add(pool)

  // ---- curved desk ----
  const DESK_Y = 0.8
  const shape = new THREE.Shape()
  const a0 = rad(15)
  const a1 = rad(165)
  shape.moveTo(Math.cos(a0) * 1.75, Math.sin(a0) * 1.75)
  shape.absarc(0, 0, 1.75, a0, a1, false)
  shape.absarc(0, 0, 1.05, a1, a0, true)
  const deskGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: false, curveSegments: 48 })
  deskGeo.rotateX(-Math.PI / 2)
  const desk = new THREE.Mesh(deskGeo, new THREE.MeshStandardMaterial({ color: 0x14141c, metalness: 0.9, roughness: 0.28 }))
  desk.position.y = DESK_Y - 0.06
  desk.receiveShadow = true
  scene.add(desk)
  const edges = new THREE.Group()
  edges.rotation.x = -Math.PI / 2
  edges.position.y = DESK_Y
  ;[1.75, 1.05].forEach((r) => {
    const e = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.01, 8, 96, rad(150)),
      new THREE.MeshBasicMaterial({ color: MAGL, toneMapped: false })
    )
    e.rotation.z = a0
    edges.add(e)
  })
  scene.add(edges)
  const legMat = new THREE.MeshStandardMaterial({ color: 0x1b1b24, metalness: 0.8, roughness: 0.4 })
  ;[-55, 0, 55].forEach((d) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, DESK_Y - 0.06, 12), legMat)
    leg.position.set(Math.sin(rad(d)) * 1.5, (DESK_Y - 0.06) / 2, -Math.cos(rad(d)) * 1.5)
    scene.add(leg)
  })

  // ---- monitors ----
  const screens = []
  const kinds = ['radar', 'chart', 'wave', 'code', 'stats']
  const angles = [-62, -31, 0, 31, 62]
  const words = ['<Build/>', '<Hack/>', '<Innovate/>', '<Code/>', '<Create/>']
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x0a0a10, metalness: 0.6, roughness: 0.4 })
  angles.forEach((deg, i) => {
    const s = makeScreen(256, 160, SCREENS[kinds[i]])
    screens.push({ s, kind: kinds[i] })
    const g = new THREE.Group()
    const sc = i === 2 ? 1.25 : 1
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.39, 0.025), frameMat))
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.585, 0.355), new THREE.MeshBasicMaterial({ map: s.tex, toneMapped: false, color: 0xffffff }))
    face.position.z = 0.014
    g.add(face)
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.09, 10), legMat)
    stand.position.y = -0.24
    g.add(stand)
    // text printed on the back of the monitor
    const back = makeScreen(
      512,
      128,
      (ctx, w, h) => {
        ctx.font = 'bold 60px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = C.mag
        ctx.fillText(words[i], w / 2, h / 2)
      },
      true
    )
    const print = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 0.125),
      new THREE.MeshBasicMaterial({ map: back.tex, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
    )
    print.position.z = -0.0135
    print.rotation.y = Math.PI
    g.add(print)
    g.scale.setScalar(sc)
    const y = DESK_Y + 0.09 + (0.195 + 0.045) * sc
    g.position.set(Math.sin(rad(deg)) * 1.4, y, -Math.cos(rad(deg)) * 1.4)
    g.lookAt(0, y + 0.1, 0)
    scene.add(g)
  })

  // ---- transparent hologram screens (left + right) ----
  const holoTex = []
  const makeHoloPanel = (w, h) => {
    const s = makeScreen(256, Math.round((256 * h) / w), drawPanel, true)
    holoTex.push(s)
    const g = new THREE.Group()
    g.add(
      new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ map: s.tex, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false, toneMapped: false })
      )
    )
    return g
  }

  const holoLine = new THREE.LineBasicMaterial({ color: MAGL, transparent: true, opacity: 0.9, toneMapped: false })

  // left: wireframe solid + orbit rings
  const holoA = new THREE.Group()
  holoA.position.set(-1.15, 2.0, -0.95)
  const panelA = makeHoloPanel(0.7, 0.8)
  const coreA = new THREE.Group()
  coreA.position.z = 0.04
  coreA.scale.setScalar(0.6)
  const ico = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(0.2, 1)), holoLine)
  const ringA1 = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.004, 6, 64), new THREE.MeshBasicMaterial({ color: 0xff9fd6, toneMapped: false }))
  const ringA2 = ringA1.clone()
  ringA2.scale.setScalar(1.35)
  coreA.add(ico, ringA1, ringA2)
  panelA.add(coreA)
  holoA.add(panelA)
  scene.add(holoA)

  // right: point-cloud globe
  const holoB = new THREE.Group()
  holoB.position.set(1.15, 2.0, -0.95)
  const panelB = makeHoloPanel(0.7, 0.8)
  const coreB = new THREE.Group()
  coreB.position.z = 0.04
  coreB.scale.setScalar(0.6)
  const N = 700
  const pts = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / N)
    const th = Math.PI * (1 + Math.sqrt(5)) * i
    pts.set([0.26 * Math.cos(th) * Math.sin(phi), 0.26 * Math.cos(phi), 0.26 * Math.sin(th) * Math.sin(phi)], i * 3)
  }
  const globeGeo = new THREE.BufferGeometry()
  globeGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3))
  const globe = new THREE.Points(globeGeo, new THREE.PointsMaterial({ color: MAGL, size: 0.012, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }))
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.004, 6, 64), new THREE.MeshBasicMaterial({ color: MAGL, toneMapped: false }))
  ringB.rotation.x = 1.2
  coreB.add(globe, ringB)
  panelB.add(coreB)
  holoB.add(panelB)
  scene.add(holoB)

  // ---- centre floating hologram (shader) ----
  const holoMat = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(MAGL) } },
    vertexShader: `
      varying vec3 vN; varying vec3 vP; varying vec3 vW;
      void main(){
        vN = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vP = mv.xyz;
        vW = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform float uTime; uniform vec3 uColor;
      varying vec3 vN; varying vec3 vP; varying vec3 vW;
      void main(){
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(-vP))), 2.0);
        float scan = 0.55 + 0.45 * sin(vW.y * 90.0 - uTime * 3.0);
        float flick = 0.92 + 0.08 * sin(uTime * 40.0);
        gl_FragColor = vec4(uColor * (0.15 + f * 1.2) * scan * flick, (0.12 + f * 0.7) * scan);
      }`
  })
  const reactor = new THREE.Group()
  reactor.position.set(0, 2.2, -1.5)
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.16, 0.05, 140, 16), holoMat)
  const shell = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(0.34, 1)),
    new THREE.LineBasicMaterial({ color: MAGL, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, toneMapped: false })
  )
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.004, 6, 96), new THREE.MeshBasicMaterial({ color: 0xff9fd6, toneMapped: false }))
  orbit.rotation.x = 1.2
  reactor.add(knot, shell, orbit)
  reactor.scale.setScalar(0.85)
  scene.add(reactor)

  const emitter = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.008, 8, 64), new THREE.MeshBasicMaterial({ color: MAGL, toneMapped: false }))
  emitter.rotation.x = Math.PI / 2
  emitter.position.set(0, 1.78, -1.5)
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.47, 32, 1, true),
    new THREE.MeshBasicMaterial({ color: MAGL, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false, toneMapped: false })
  )
  beam.position.set(0, 2.0, -1.5)
  scene.add(emitter, beam)

  // ---- dust ----
  const DN = 260
  const dp = new Float32Array(DN * 3)
  for (let i = 0; i < DN; i++) dp.set([(rnd(i) - 0.5) * 7, rnd(i + 50) * 4.5, (rnd(i + 99) - 0.5) * 6], i * 3)
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3))
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: MAGL, size: 0.018, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })))

  // ---- ambient twinkle dots (fills empty screen space, follows the camera target) ----
  const SN = 320
  const sp = new Float32Array(SN * 3)
  const sPhase = new Float32Array(SN)
  const sSize = new Float32Array(SN)
  for (let i = 0; i < SN; i++) {
    const r = 3 + rnd(i + 200) * 6
    const th = rnd(i + 300) * Math.PI * 2
    const y = (rnd(i + 400) - 0.25) * 7
    sp.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3)
    sPhase[i] = rnd(i + 500) * 6.28
    sSize[i] = 1.2 + rnd(i + 600) * 2.2
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3))
  starGeo.setAttribute('aPhase', new THREE.BufferAttribute(sPhase, 1))
  starGeo.setAttribute('aSize', new THREE.BufferAttribute(sSize, 1))
  const starMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
    uniforms: {
      uTime: { value: 0 },
      uPx: { value: Math.min(window.devicePixelRatio || 1, 1.75) },
      uColor: { value: new THREE.Color(MAGL) },
      uOpacity: { value: 0.55 }
    },
    vertexShader: `
      attribute float aPhase; attribute float aSize;
      uniform float uTime; uniform float uPx;
      varying float vA;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uPx * (6.0 / -mv.z);
        vA = 0.3 + 0.7 * (0.5 + 0.5 * sin(uTime * 1.3 + aPhase));
      }`,
    fragmentShader: `
      uniform vec3 uColor; uniform float uOpacity;
      varying float vA;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(uColor, a * vA * uOpacity);
      }`
  })
  const stars = new THREE.Points(starGeo, starMat)
  scene.add(stars)

  // ---- the hacker (seen from behind), built from primitives ----
  const hood = new THREE.MeshStandardMaterial({ color: 0x1e1e2a, roughness: 0.85 })
  const pants = new THREE.MeshStandardMaterial({ color: 0x0e0e14, roughness: 0.9 })
  const skin = new THREE.MeshStandardMaterial({ color: 0x9a6b52, roughness: 0.7 })
  const hair = new THREE.MeshStandardMaterial({ color: 0x140d0a, roughness: 0.9 })
  const glove = new THREE.MeshStandardMaterial({ color: 0x101016, roughness: 0.8 })
  const man = new THREE.Group()
  scene.add(man)

  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.07, 24), new THREE.MeshStandardMaterial({ color: 0x15151c, roughness: 0.6 }))
  seat.position.y = 0.5
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.45, 10), legMat)
  column.position.y = 0.25
  man.add(seat, column)
  for (let i = 0; i < 5; i++) {
    const sp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.04), legMat)
    sp.position.set(Math.cos((i * Math.PI * 2) / 5) * 0.15, 0.03, Math.sin((i * Math.PI * 2) / 5) * 0.15)
    sp.rotation.y = -(i * Math.PI * 2) / 5
    man.add(sp)
  }

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.42, 6, 16), hood)
  torso.scale.set(1.3, 1, 0.8)
  torso.position.set(0, 0.97, 0.02)
  torso.rotation.x = -0.12
  const pelvis = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.22, 6, 12), pants)
  pelvis.rotation.z = Math.PI / 2
  pelvis.position.set(0, 0.58, 0)
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.1, 12), skin)
  neck.position.set(0, 1.4, -0.01)

  // head: hood up + headphones
  const head = new THREE.Group()
  head.position.set(0, 1.5, -0.01)
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 18), hair)
  const hoodShell = new THREE.Mesh(new THREE.SphereGeometry(0.15, 28, 20), hood)
  hoodShell.scale.set(1, 1.08, 1.15)
  hoodShell.position.set(0, 0.015, 0.025)
  const phoneMat = new THREE.MeshStandardMaterial({ color: 0x0c0c12, metalness: 0.6, roughness: 0.4 })
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.012, 8, 40, Math.PI), phoneMat)
  band.position.y = 0.015
  head.add(skull, hoodShell, band)
  // rectangular magenta glasses, with temple arms running back along the hood to the ears
  const gMat = new THREE.MeshBasicMaterial({ color: MAGL, side: THREE.DoubleSide, toneMapped: false })
  const gLens = new THREE.MeshBasicMaterial({ color: 0xff2aa0, transparent: true, opacity: 0.85, side: THREE.DoubleSide, toneMapped: false })
  const gGlow = new THREE.MeshBasicMaterial({
    color: 0xff2aa0, transparent: true, opacity: 0.25,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false
  })
  const rrect = (w, h, r, p = new THREE.Shape()) => {
    const x = -w / 2
    const y = -h / 2
    p.moveTo(x + r, y)
    p.lineTo(x + w - r, y)
    p.quadraticCurveTo(x + w, y, x + w, y + r)
    p.lineTo(x + w, y + h - r)
    p.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    p.lineTo(x + r, y + h)
    p.quadraticCurveTo(x, y + h, x, y + h - r)
    p.lineTo(x, y + r)
    p.quadraticCurveTo(x, y, x + r, y)
    return p
  }
  const frameShape = rrect(0.09, 0.066, 0.012)
  frameShape.holes.push(rrect(0.074, 0.05, 0.008, new THREE.Path()))
  const frameGeo = new THREE.ShapeGeometry(frameShape)
  const lensGeo = new THREE.ShapeGeometry(rrect(0.074, 0.05, 0.008))
  const glowGeo = new THREE.ShapeGeometry(rrect(0.11, 0.085, 0.02))

  const LX = 0.056
  const LY = 0.012
  const LZ = -0.138
  const TH = 0.5
  const edge = (s, d, y) => new THREE.Vector3(s * (LX + d * Math.cos(TH)), LY + y, LZ + d * Math.sin(TH))

  ;[-1, 1].forEach((s) => {
    const g = new THREE.Group()
    g.position.set(s * LX, LY, LZ)
    g.rotation.y = -s * TH
    const glow = new THREE.Mesh(glowGeo, gGlow)
    glow.position.z = 0.003
    g.add(new THREE.Mesh(lensGeo, gLens), new THREE.Mesh(frameGeo, gMat), glow)
    head.add(g)

    // temple arm: from the outer top corner of the frame, hugging the hood back to the ear
    const pts = [edge(s, 0.045, 0.018)]
    ;[38, 52, 66, 80, 92].forEach((deg) => {
      const u = rad(deg)
      pts.push(new THREE.Vector3(s * 0.153 * Math.sin(u), LY + 0.018, 0.025 - 0.176 * Math.cos(u)))
    })
    head.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.0035, 6, false), gMat))
  })

  // nose bridge joining the two frames
  const bridgeZ = LZ - 0.045 * Math.sin(TH) + 0.004
  head.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([edge(-1, -0.045, 0.012), new THREE.Vector3(0, LY + 0.016, bridgeZ), edge(1, -0.045, 0.012)]),
        12, 0.0035, 6, false
      ),
      gMat
    )
  )
  ;[-1, 1].forEach((s) => {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.035, 20), phoneMat)
    cup.rotation.z = Math.PI / 2
    cup.position.set(s * 0.17, 0.015, 0)
    const glow = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.005, 6, 32), new THREE.MeshBasicMaterial({ color: MAGL, toneMapped: false }))
    glow.rotation.y = Math.PI / 2
    glow.position.set(s * 0.19, 0.015, 0)
    head.add(cup, glow)
  })

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.055, 10, 24), hood)
  collar.rotation.x = Math.PI / 2
  collar.position.set(0, 1.36, 0.0)

  // IEEE printed on the back of the hoodie: a thin curved skin that hugs the torso
  const printScreen = makeScreen(
    512,
    256,
    (ctx, w, h) => {
      ctx.fillStyle = C.mag
      ctx.font = 'bold 170px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('IEEE', w / 2, h / 2)
    },
    true
  )
  const PRINT_ARC = rad(80) // how far the print wraps around the back
  const backPrint = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1815, 0.1815, 0.155, 32, 1, true, -PRINT_ARC / 2, PRINT_ARC),
    new THREE.MeshBasicMaterial({
      map: printScreen.tex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
      toneMapped: false
    })
  )
  backPrint.position.y = 0.05
  torso.add(backPrint) // child of the torso, so it follows its shape, lean and breathing

  man.add(torso, pelvis, neck, head, collar)

  // legs (static, seated)
  ;[-1, 1].forEach((s) => {
    const hip = new THREE.Vector3(s * 0.12, 0.58, 0)
    const knee = new THREE.Vector3(s * 0.14, 0.58, -0.4)
    const foot = new THREE.Vector3(s * 0.14, 0.09, -0.44)
    const th = limb(0.075, hip.distanceTo(knee), pants)
    place(th, hip, knee)
    const sh = limb(0.062, knee.distanceTo(foot), pants)
    place(sh, knee, foot)
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.06, 0.27), new THREE.MeshStandardMaterial({ color: 0x55555c, roughness: 0.5 }))
    shoe.position.set(s * 0.14, 0.04, -0.52)
    man.add(th, sh, shoe)
  })

  // arms (2-bone IK, gloved hands gesturing at the interface)
  const mkArm = (side) => ({
    side,
    S: new THREE.Vector3(side * 0.24, 1.2, 0),
    T: new THREE.Vector3(),
    E: new THREE.Vector3(),
    H: new THREE.Vector3(),
    pole: new THREE.Vector3(side * 0.6, -1, 0.35),
    up: limb(0.058, 0.32, hood),
    lo: limb(0.047, 0.3, hood),
    hand: new THREE.Mesh(new THREE.SphereGeometry(0.052, 14, 10), glove)
  })
  const arms = [mkArm(-1), mkArm(1)]
  arms.forEach((a) => man.add(a.up, a.lo, a.hand))
  man.traverse((o) => {
    if (o.isMesh && !o.material.transparent) o.castShadow = true
  })

  const upd = { acc: 0, hacc: 0 }
  const tgt = new THREE.Vector3(0, 1.4, -0.5)
  const cam = { az: 0, rise: 0, dist: 4.4 }

  function update(camera, t, dt, p, mx, my, aspect, intro = 1) {
    // man
    torso.scale.y = 1 + Math.sin(t * 1.6) * 0.008
    head.rotation.y = Math.sin(t * 0.45) * 0.25
    head.rotation.x = Math.sin(t * 0.7) * 0.04 - 0.05
    arms.forEach((a) => {
      const s = a.side
      const swipe = Math.max(0, Math.sin(t * 0.5 + (s > 0 ? 0 : 3)))
      a.T.set(
        s * (0.55 + Math.sin(t * 1.2 + s) * 0.1 + swipe * 0.12),
        1.13 + Math.sin(t * 1.8 + s * 2) * 0.06 + swipe * 0.32,
        -0.45 + Math.cos(t * 0.9 + s) * 0.05
      )
      solveIK(a.S, a.T, 0.32, 0.3, a.pole, a.E, a.H)
      place(a.up, a.S, a.E)
      place(a.lo, a.E, a.H)
      a.hand.position.copy(a.H)
    })

    // screens + holograms
    upd.acc += dt
    if (upd.acc > 1 / 12) {
      upd.acc = 0
      screens.forEach((o) => o.s.redraw(t))
    }
    upd.hacc += dt
    if (upd.hacc > 1 / 8) {
      upd.hacc = 0
      holoTex.forEach((s) => s.redraw(t))
    }
    ico.rotation.set(t * 0.5, t * 0.8, 0)
    ringA1.rotation.set(t * 0.9, t * 0.3, 0)
    ringA2.rotation.set(-t * 0.6, t * 0.5, 1)
    holoA.position.y = 2.0 + Math.sin(t * 1.1) * 0.03
    globe.rotation.y = t * 0.6
    ringB.rotation.z = -t * 0.7
    holoB.position.y = 2.0 + Math.cos(t * 1.1) * 0.03

    holoMat.uniforms.uTime.value = t
    knot.rotation.set(t * 0.5, t * 0.8, 0)
    shell.rotation.set(-t * 0.3, t * 0.4, 0)
    orbit.rotation.z = t * 0.7
    reactor.position.y = 2.2 + Math.sin(t * 1.2) * 0.03

    const pos = dustGeo.attributes.position
    for (let i = 0; i < DN; i++) {
      let y = pos.getY(i) + dt * 0.05
      if (y > 4.5) y = 0
      pos.setY(i, y)
    }
    pos.needsUpdate = true
    starMat.uniforms.uTime.value = t
    stars.position.copy(tgt)
    stars.rotation.y = t * 0.012
    rimL.intensity = 9 + Math.sin(t * 3) * 0.9
    rimR.intensity = 9 + Math.cos(t * 2.6) * 0.9

    // camera: orbit around the scene as the page scrolls
    const narrow = aspect < 1 ? Math.min((1 / aspect - 1) * 1.1, 2.2) : 0
    const base = 4.4
    const fitW = 1.0 / (Math.tan(rad(19)) * aspect)
    const e = 1 - intro
    cam.az = p * rad(180) + mx * 0.1 + e * 0.35
    cam.rise = 0.8 - p * 0.2 + my * 0.12 + e * 0.25
    cam.dist = (aspect < 1 ? Math.max(base, fitW) : base) * (1 + e * 0.5)
    camera.position.set(tgt.x + Math.sin(cam.az) * cam.dist, tgt.y + cam.rise, tgt.z + Math.cos(cam.az) * cam.dist)
    camera.lookAt(tgt.x, tgt.y + (narrow ? 0.12 : 0), tgt.z)

    // hologram screens always face the viewer
    panelA.lookAt(camera.position)
    panelB.lookAt(camera.position)
  }

  function dispose() {
    scene.traverse((o) => {
      o.geometry?.dispose?.()
      const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : []
      ms.forEach((m) => {
        m.map?.dispose?.()
        m.dispose()
      })
    })
  }
  return { scene, update, dispose }
}

// ===================== 3D scene component =====================
function Scene({ progress, onReady }) {
  const mount = useRef(null)
  const readyCb = useRef(onReady)

  useEffect(() => {
    readyCb.current = onReady
  }, [onReady])

  useEffect(() => {
    const el = mount.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' })
    } catch {
      readyCb.current?.()
      return
    }
    const small = window.innerWidth < 768
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.25 : 1.75))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = small ? 1.35 : 1.0
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'
    el.appendChild(renderer.domElement)

    const world = createWorld()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60)
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(world.scene, camera))
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(256, 256), small ? 0.55 : 0.35, 0.45, 0.8))
    composer.addPass(new OutputPass())

    let aspect = 1
    const resize = () => {
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      aspect = w / h
      renderer.setSize(w, h, false)
      composer.setSize(w, h)
      camera.aspect = aspect
      if (w >= 1024) camera.setViewOffset(w, h, -w * 0.2, 0, w, h) // desktop: scene to the right of the text
      else camera.setViewOffset(w, h, 0, -h * 0.15, w, h) // phone/tablet: scene shifted below the heading
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    if (!reduced) window.addEventListener('pointermove', onMove)

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)

    let compiled = false
    let ready = false
    let warmFrames = 0
    let stable = 0
    let introT = 0
    const INTRO = 3.2
    const easeOutQuint = (x) => 1 - Math.pow(1 - x, 5)
    const baseExposure = renderer.toneMappingExposure
    ;(async () => {
      try {
        if (renderer.compileAsync) await renderer.compileAsync(world.scene, camera)
        else renderer.compile(world.scene, camera)
      } catch {
        // Rendering can still proceed when shader compilation is unavailable.
      }
      compiled = true
    })()

    let raf
    let last = performance.now()
    let t = 0
    let p = 0
    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const raw = (now - last) / 1000
      const dt = Math.min(raw, 1 / 30)
      last = now
      if (!compiled) return
      if (!visible && ready) return
      if (!reduced) t += dt
      const k = 1 - Math.exp(-dt * 5)
      p += ((progress?.current ?? 0) - p) * k
      mouse.x += (mouse.tx - mouse.x) * k
      mouse.y += (mouse.ty - mouse.y) * k
      let intro = 0
      if (ready) {
        introT += dt
        intro = reduced ? 1 : easeOutQuint(Math.min(introT / INTRO, 1))
      }
      renderer.toneMappingExposure = baseExposure * (0.35 + 0.65 * intro)
      world.update(camera, t, dt, p, mouse.x, mouse.y, aspect, intro)
      composer.render()

      if (!ready) {
        warmFrames++
        stable = raw < 0.024 ? stable + 1 : 0
        if ((warmFrames >= 4 && stable >= 3) || warmFrames > 45) {
          ready = true
          el.style.opacity = '1'
          readyCb.current?.()
        }
      }
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      world.dispose()
      composer.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [progress])

  return (
    <div
      ref={mount}
      aria-hidden
      className="absolute inset-0 z-0 transition-opacity duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{ opacity: 0, willChange: 'opacity' }}
    />
  )
}

// ===================== Hero (default export) =====================
const reveal = (ready, delay) => ({
  style: { transitionDelay: ready ? `${delay}ms` : '0ms' },
  className: `transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
    ready ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-5 blur-[6px]'
  }`
})

export default function Hero({ onReady }) {
  const progress = useRef(0)
  const section = useRef(null)
  const [ready, setReady] = useState(false)
  const handleReady = useCallback(() => {
    const go = () => {
      setTimeout(() => {
        setReady(true)
        onReady?.()
      }, 250)
    }
    document.fonts?.ready ? document.fonts.ready.then(go) : go()
  }, [onReady])

  useEffect(() => {
    const fixed = []
    let el = section.current?.parentElement
    while (el) {
      const s = getComputedStyle(el)
      if (['hidden', 'auto', 'scroll'].includes(s.overflowX)) {
        fixed.push([el, el.style.overflowX, el.style.overflowY])
        el.style.overflowX = 'clip'
        el.style.overflowY = 'visible'
      }
      el = el.parentElement
    }

    const onScroll = () => {
      const node = section.current
      if (!node) return
      const r = node.getBoundingClientRect()
      const max = Math.max(node.offsetHeight - window.innerHeight, 1)
      progress.current = Math.min(Math.max(-r.top / max, 0), 1)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      fixed.forEach(([node, x, y]) => {
        node.style.overflowX = x
        node.style.overflowY = y
      })
    }
  }, [])

  return (
    <section ref={section} className="relative h-[220vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        <Scene progress={progress} onReady={handleReady} />
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[45vh]"
    style={{
      background:
        "linear-gradient(to bottom, transparent 0%, rgba(194, 24, 145, 0.12) 35%, rgba(0, 0, 0, 0.86) 76%, #000 100%)",
    }}
  />

  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-5 pt-28 sm:px-10 sm:pt-24 lg:inset-0 lg:flex lg:items-center lg:px-16 lg:pt-0">
          <div className="relative w-full text-center uppercase sm:text-left">
            <h2 {...reveal(ready, 0)} className={`${reveal(ready, 0).className} font-Subheading mb-1.5 font-black leading-tight text-[#E6007E] text-[6.8vw] sm:mb-0 sm:text-[4vw] lg:text-[2.8vw]`}>
              WIE IEEE SIT SB
            </h2>
            <p {...reveal(ready, 150)} className={`${reveal(ready, 150).className} font-subheading mt-2.5 ml-2 font-bold tracking-tight text-[#E6007E] text-[4.8vw] sm:mt-1 sm:text-[2.8vw] lg:mt-2 lg:text-[1.4vw]`}>
              Presents
            </p>

            <h1 {...reveal(ready, 300)} className={`${reveal(ready, 300).className} font-wiecode mt-7 whitespace-nowrap leading-none text-white text-[7.3vw] sm:mt-3 sm:text-[5.4vw] lg:mt-3 lg:text-[3.3vw]`}>
              WIE CODE 2K26-27
            </h1>

            <div {...reveal(ready, 500)} className={`${reveal(ready, 500).className} mt-[60px] flex justify-center sm:mt-9 sm:justify-start lg:mt-10`}>
              <span className="font-paragraph inline-block origin-center sm:origin-left scale-110 sm:scale-100">
                <Button to="/register" color="#E6007E">Register Now</Button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
