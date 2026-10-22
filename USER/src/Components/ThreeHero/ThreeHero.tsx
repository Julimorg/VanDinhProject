import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Box } from '@mui/material';

/**
 * Hero 3D nhe - vai khoi mau son (icosahedron) lo lung xoay cham, phoi mau
 * den/trang/xam theo tong mau thuong hieu. Dung three.js thuan (khong fiber)
 * de giu dependency toi thieu va de kiem soat vong doi (mount/unmount/resize).
 *
 * Thiet ke co y: it polygon, khong bong do nang -> nhe cho may yeu,
 * khong lam phan tan khoi noi dung chinh cua hero section.
 */
export default function ThreeHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Anh sang
    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(4, 6, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x1c1917, 0.5);
    rim.position.set(-6, -3, -4);
    scene.add(rim);

    // Cac khoi "giot son" - icosahedron be nho, phoi mau den/trang/xam
    const colors = [0xffffff, 0x1c1917, 0xe7e5e4, 0x44403c, 0x78716c];
    const meshes: THREE.Mesh[] = [];
    const group = new THREE.Group();

    for (let i = 0; i < 7; i++) {
      const size = 0.55 + Math.random() * 0.85;
      const geometry = new THREE.IcosahedronGeometry(size, 0);
      const material = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        roughness: 0.35,
        metalness: 0.15,
        flatShading: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4
      );
      mesh.userData.speed = 0.15 + Math.random() * 0.25;
      mesh.userData.axis = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
      group.add(mesh);
      meshes.push(mesh);
    }
    scene.add(group);

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const dt = clock.getDelta();
      meshes.forEach((mesh) => {
        mesh.rotateOnAxis(mesh.userData.axis, mesh.userData.speed * dt);
      });
      group.rotation.y += (mouseX * 0.25 - group.rotation.y) * 0.03;
      group.rotation.x += (mouseY * 0.12 - group.rotation.x) * 0.03;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        '& canvas': { display: 'block' },
      }}
    />
  );
}
