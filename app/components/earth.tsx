"use client";
import { useRef, useEffect, useState } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";

interface EarthComponentProps {
  setPercent: (data: number) => void;
  setAssetLoaded: (data: boolean) => void;
  assetLoaded: boolean;
}

interface EarthPosInterface {
  xpos: number;
  ypos: number;
}

const DEFAULT_EARTH_POS = {
  xpos: -5,
  ypos: 2,
};

export const EarthComponent = (props: EarthComponentProps) => {
  const { setPercent, setAssetLoaded, assetLoaded } = props;
  const [earthSize, setEarthSize] = useState<number>(0.05);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const moonRef = useRef<THREE.Mesh | null>(null); // Reference to the moon mesh

  useEffect(() => {
    if (!mountRef.current) return;

    const textureURL = "/earth_texture.jpg";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // Set alpha to true for transparent background
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Set the scene background to transparent
    scene.background = null;
    const loadingManager = new THREE.LoadingManager();

    // Set up progress tracking
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      console.log(progress);
      setPercent(progress); // Update the progress in the parent component
    };

    loadingManager.onLoad = () => {
      setAssetLoaded(true);
      setPercent(100); // Ensure progress reaches 100%
    };

    loadingManager.onError = (url) => {
      //to be added error aset load screen
      setAssetLoaded(false);
    };

    const textureLoader = new THREE.TextureLoader(loadingManager);

    const createMoon = (size: number) => {
      const geometry = new THREE.SphereGeometry(size, 60, 60);
      const texture = textureLoader.load(textureURL);

      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: texture,
        displacementMap: null,
        displacementScale: 0.2,
        bumpMap: texture,
        bumpScale: 0.5,
        reflectivity: 0,
        shininess: 10,
      });

      return new THREE.Mesh(geometry, material);
    };

    let moon = createMoon(earthSize); // Create the initial moon
    moonRef.current = moon;
    scene.add(moon);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-100, 10, 50);
    scene.add(light);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 0, 0);
    scene.add(hemiLight);

    scene.add(moon);
    camera.position.z = 5;

    moon.rotation.x = Math.PI * 0.02;
    moon.rotation.y = Math.PI * 1.54;

    // Animation parameters
    const initialRadius = 5; // Starting radius
    const minRadius = 0; // Minimum radius (center)
    const radiusDecreaseRate = 0.05; // Rate at which the radius decreases

    let angle = Math.PI; // Initial angle
    let radius = initialRadius; // Current radius

    // Animation parameters
    const targetSize = 2; // Final size
    const sizeIncreaseRate = 0.03; // Rate at which the size increases

    function animateSize() {
      console.log(moonRef);
      if (moonRef.current) {
        setEarthSize((prevSize) => {
          let newSize = prevSize + sizeIncreaseRate;

          if (newSize >= targetSize) {
            newSize = targetSize;
            cancelAnimationFrame(sizeAnimationFrame);
          }

          // Update the size of the moon by scaling
          moonRef?.current?.scale.set(
            newSize / earthSize,
            newSize / earthSize,
            newSize / earthSize
          );

          return newSize;
        });
      }

      sizeAnimationFrame = requestAnimationFrame(animateSize);
    }

    let sizeAnimationFrame = requestAnimationFrame(animateSize);

   

    function animate() {
      requestAnimationFrame(animate);

      // Update radius and angle
      if (radius > minRadius) {
        radius -= radiusDecreaseRate;
      } else {
        radius = minRadius;
      }
      angle += 0.009;

      const newXPos = radius * Math.cos(angle);
      const newYPos = radius * Math.sin(angle);

      if (moonRef.current) {
        moonRef.current.position.set(newXPos, newYPos, 0);
        moonRef.current.rotation.y += 0.002;
        moonRef.current.rotation.x += 0.0001;
      }

      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", onResize, false);

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", onResize);
      if (sizeAnimationFrame) cancelAnimationFrame(sizeAnimationFrame);
    };
  }, []);

  return <div ref={mountRef} />;
};
