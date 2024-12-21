"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

export const ParticleSample = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 7, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // const controls = new OrbitControls(camera, renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const loader = new FBXLoader();
    loader.load(
      "/Walking.fbx",
      (fbx) => {
        // Optionally scale the model
        fbx.scale.set(0.05, 0.05, 0.05); // Adjust scale if needed
        group.add(fbx);

        fbx.traverse((child: any) => {
          if (child.isMesh) {
            const faceModel = child;
            // You can access and manipulate bones here
            if (child.skeleton) {
              const bones: any = child.skeleton.bones;

              bones.forEach((bone: any) => {
                console.log(bone.name);
              });

              // Find the arm bones
              const headBone = bones.find(
                (bone: any) => bone.name === "mixamorigHead"
              );
              const leftArm = bones.find(
                (bone: any) => bone.name === "mixamorigLeftArm"
              );
              const leftForeArm = bones.find(
                (bone: any) => bone.name === "mixamorigLeftForeArm"
              );
              const rightArm = bones.find(
                (bone: any) => bone.name === "mixamorigRightArm"
              );
              const RightForeArm = bones.find(
                (bone: any) => bone.name === "mixamorigRightForeArm"
              );

              const spine1 = bones.find(
                (bone: any) => bone.name === "mixamorigHips"
              );

              spine1.rotation.y = 1;
              rightArm.rotation.x = 0.6;
              RightForeArm.rotation.x = Math.PI / 2;
              let headRotationDirection = 1;
              let leftArmRotationDirection = 1;

              // headBone transformations to the arm bones
              if (headBone) {
                headBone.rotation.x += 0.9;

                function animateHands() {
                  requestAnimationFrame(animateHands);

                  const maxRotation = Math.PI / 4; // Maximum angle (45 degrees)
                  const oscillationSpeed = 0.01; // Rotation speed

                  // Reverse direction if max or min rotation is reached
                  if (
                    headBone.rotation.y > maxRotation ||
                    headBone.rotation.y < -maxRotation
                  ) {
                    headRotationDirection *= -1;
                  }

                  headBone.rotation.y +=
                    headRotationDirection * oscillationSpeed;

                  renderer.render(scene, camera);
                }
                animateHands();
              }

              if (leftArm) {
                function animateLeftHand() {
                  requestAnimationFrame(animateLeftHand);

                  const maxRotation = Math.PI / 2.5; // Maximum angle (45 degrees)
                  const oscillationSpeed = 0.04; // Rotation speed

                  // Reverse direction if max or min rotation is reached
                  if (leftArm.rotation.x < maxRotation) {
                    leftArm.rotation.x +=
                      leftArmRotationDirection * oscillationSpeed;
                  } else {
                  }

                  renderer.render(scene, camera);
                }
                animateLeftHand();
              }
              if (leftForeArm) {
                function animateLeftForeArm() {
                  requestAnimationFrame(animateLeftForeArm);

                  const maxRotation = Math.PI - 1.005; // Maximum angle (45 degrees)
                  const oscillationSpeed = 0.05; // Rotation speed

                  // Reverse direction if max or min rotation is reached
                  if (leftForeArm.rotation.z < maxRotation) {
                    leftForeArm.rotation.z +=
                      leftArmRotationDirection * oscillationSpeed;
                    if (leftForeArm.rotation.y < Math.PI / 5) {
                      leftForeArm.rotation.y +=
                        leftArmRotationDirection * oscillationSpeed;
                    }
                  } else {
                  }

                  renderer.render(scene, camera);
                }
                animateLeftForeArm();
              }
            }

            // const sampler = new MeshSurfaceSampler(faceModel).build();

            // const vertices = [];
            // const tempPosition = new THREE.Vector3();
            // for (let i = 0; i < 15000; i++) {
            //   sampler.sample(tempPosition);
            //   vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
            // }

            // const pointsGeometry = new THREE.BufferGeometry();
            // pointsGeometry.setAttribute(
            //   "position",
            //   new THREE.Float32BufferAttribute(vertices, 3)
            // );

            // const pointsMaterial = new THREE.PointsMaterial({
            //   color: 0xff61d5,
            //   size: 0.03,
            // });

            // const points = new THREE.Points(pointsGeometry, pointsMaterial);
            // group.add(points);
          }
        });
      },
      undefined,
      (error) => {
        console.error("Error loading FBX model:", error);
      }
    );

    // let mouseX = 0;

    // function onMouseMove(event: MouseEvent) {
    //   mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    // }

    // window.addEventListener("mousemove", onMouseMove, false);

    function render() {
      group.rotation.y += 0.005;
      //   camera.position.x = mouseX * 5;
      //   camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(render);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", onWindowResize, false);

    return () => {
      //   window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onWindowResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} />;
};
