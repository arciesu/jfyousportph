import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  uniform float uTime;
  uniform float uSpeed;
  uniform float uAmplitude;
  uniform vec3 uClickDisplacement;
  uniform float uDepth;
  uniform vec3 uMouse3D;
  uniform float uHover;

  vec3 mod289v3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289v4(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289v4(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289v3(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float fbm(vec3 p) {
    float sum = 0.0;
    float amp = 1.0;
    float freq = 1.0;
    for (int i = 0; i < 6; i++) {
      sum += amp * snoise(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return sum;
  }

  float elasticDeform(vec3 p, float t) {
    float noise = fbm(p * 1.2 + t * 0.2);
    float yDeform = sin(p.y * 2.0 + t * 0.5) * 0.15;
    float xzStretch = sin(p.x * 0.5 + t * 0.3) * cos(p.z * 0.5 + t * 0.2) * 0.1;
    float verticalPulse = sin(p.y * 1.5 - t * 0.8) * 0.05;
    return (noise * 0.3) + yDeform + xzStretch + verticalPulse;
  }

  void main() {
    float baseNoise = snoise(vec3(position.x * 0.5, position.y * 0.5, position.z * 0.5 + uTime * 0.2));
    vec3 clickDeform = length(uClickDisplacement) > 0.01 ? uClickDisplacement * exp(-distance(position, vPosition) * 2.0) : vec3(0.0);
    vec3 mouseDirection = uMouse3D - position;
    float mouseDistance = length(mouseDirection);
    float mouseInfluence = smoothstep(1.5, 0.0, mouseDistance);
    vec3 bulge = normalize(mouseDirection) * (uHover * mouseInfluence * 0.4);
    vec3 elasticPos = position + vec3(elasticDeform(position, uTime * 0.5));
    vec3 animatedPos = elasticPos + bulge + clickDeform;
    animatedPos.xy += (baseNoise * 0.1) * uAmplitude;
    vec3 finalPosition = animatedPos + (normal * uDepth * 0.5);
    vUv = uv;
    vPosition = finalPosition;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);
  }
`

const fragmentShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;

  uniform float uLowFreq;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform float uOpacity;
  uniform float uTime;

  float aastep(float threshold, float value) {
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold - afwidth, threshold + afwidth, value);
  }

  vec3 warpColor(float intensity, float time) {
    float animTime = time * 0.2;
    vec3 colorPos = vec3(vPosition.x * 0.1 + animTime, vPosition.y * 0.1, vPosition.z * 0.1);
    vec3 offset1 = vec3(sin(animTime * 0.7), cos(animTime * 0.5), sin(animTime * 0.3)) * 0.3;
    vec3 offset2 = vec3(cos(animTime * 0.4), sin(animTime * 0.6), cos(animTime * 0.8)) * 0.3;
    vec3 offset3 = vec3(sin(animTime * 0.9), cos(animTime * 0.2), sin(animTime * 0.5)) * 0.3;
    vec3 offset4 = vec3(cos(animTime * 0.3), sin(animTime * 0.8), cos(animTime * 0.4)) * 0.3;
    float t1 = smoothstep(0.0, 1.0, sin(colorPos.x + offset1.x) * 0.5 + 0.5);
    float t2 = smoothstep(0.0, 1.0, cos(colorPos.y + offset2.y) * 0.5 + 0.5);
    float t3 = smoothstep(0.0, 1.0, sin(colorPos.z + offset3.z) * 0.5 + 0.5);
    vec3 baseColor = mix(mix(uColor1, uColor2, t1), mix(uColor3, uColor4, t2), t3);
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float lightIntensity = max(dot(normalize(vNormal), lightDir), 0.0);
    return (baseColor * intensity) + (vec3(1.0, 0.9, 0.8) * pow(lightIntensity, 3.0) * 0.4);
  }

  void main() {
    vec3 viewPosition = normalize(-vPosition);
    float fresnel = pow(1.0 - max(dot(viewPosition, normalize(vNormal)), 0.0), 3.0);
    float intensity = (fresnel * 0.8) + (uLowFreq * fresnel * 0.2);
    float edge = aastep(0.5, intensity);
    if (edge < 0.01) discard;
    vec3 glowColor = warpColor(intensity, uTime);
    gl_FragColor = vec4(glowColor * 1.2, edge * uOpacity);
  }
`

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex)
  return new THREE.Vector3(c.r, c.g, c.b)
}

export function useFluidIcosahedron(containerRef: React.RefObject<HTMLDivElement | null>) {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const w = container.offsetWidth
    const h = container.offsetHeight

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Geometry & Mesh
    const geometry = new THREE.IcosahedronGeometry(3, 64)
    const uniforms = {
      uTime: { value: 0.0 },
      uSpeed: { value: 0.0 },
      uAmplitude: { value: 1.0 },
      uClickDisplacement: { value: new THREE.Vector3(0, 0, 0) },
      uDepth: { value: 0.25 },
      uHover: { value: 0.0 },
      uMouse3D: { value: new THREE.Vector3(0, 0, 0) },
      uLowFreq: { value: 0.0 },
      uOpacity: { value: 0.7 },
      uColor1: { value: hexToVec3('#03045e') },
      uColor2: { value: hexToVec3('#219ebc') },
      uColor3: { value: hexToVec3('#8ecae6') },
      uColor4: { value: hexToVec3('#fffbff') },
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.scale.set(1.5, 1, 1)
    scene.add(mesh)

    // Interaction state
    let targetRotationX = 0
    let targetRotationY = 0
    let rotationX = 0
    let rotationY = 0
    let wheelSpeedY = 0
    let wheelSpeedX = 0
    let hoverTarget = 0
    let lowFreqTarget = 0

    const raycaster = new THREE.Raycaster()
    const mouseNDC = new THREE.Vector2()

    const onMouseMove = (e: MouseEvent) => {
      const ndcX = (e.pageX / window.innerWidth) * 2 - 1
      const ndcY = -(e.pageY / window.innerHeight) * 2 + 1
      mouseNDC.set(ndcX, ndcY)

      targetRotationX = ndcY * 0.5
      targetRotationY = ndcX * 0.5

      // Raycast for mouse 3D position
      raycaster.setFromCamera(mouseNDC, camera)
      const intersects = raycaster.intersectObject(mesh)
      if (intersects.length > 0) {
        uniforms.uMouse3D.value.copy(intersects[0].point)
        hoverTarget = 1.0
      } else {
        hoverTarget = 0.0
      }
    }

    const onWheel = (e: WheelEvent) => {
      wheelSpeedY += e.deltaY * 0.001
      wheelSpeedX += e.deltaX * 0.001
      lowFreqTarget = Math.abs(e.deltaY) * 0.01
    }

    const onClick = () => {
      raycaster.setFromCamera(mouseNDC, camera)
      const intersects = raycaster.intersectObject(mesh)
      if (intersects.length > 0) {
        const normal = intersects[0].face?.normal?.clone() || new THREE.Vector3(0, 1, 0)
        normal.transformDirection(mesh.matrixWorld).multiplyScalar(0.3)
        uniforms.uClickDisplacement.value.copy(normal)
      }
    }

    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('wheel', onWheel, { passive: true })
    container.addEventListener('click', onClick)

    // Render loop
    const clock = new THREE.Clock()

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      uniforms.uTime.value = elapsed

      // Lerp rotations
      rotationX += (targetRotationX + wheelSpeedY - rotationX) * 0.05
      rotationY += (targetRotationY + wheelSpeedX - rotationY) * 0.05
      wheelSpeedY *= 0.95
      wheelSpeedX *= 0.95

      mesh.rotation.x = rotationX
      mesh.rotation.y = rotationY

      // Lerp hover
      uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * 0.05

      // Decay click displacement
      uniforms.uClickDisplacement.value.multiplyScalar(0.92)

      // Lerp low freq
      uniforms.uLowFreq.value += (lowFreqTarget - uniforms.uLowFreq.value) * 0.05
      lowFreqTarget *= 0.95

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const onResize = () => {
      const nw = container.offsetWidth
      const nh = container.offsetHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameRef.current)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('click', onClick)
      window.removeEventListener('resize', onResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [containerRef])
}
