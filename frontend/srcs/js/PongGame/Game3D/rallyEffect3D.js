// frontend/srcs/js/PongGame/Game3D/rallyEffect3D.js

import { gameSettings3D } from "../gameSettings.js";

export let rallyCount3D = 0;
const smokeLifetime = 150;
let smokeParticles = [];

export function setRallyCount3D() {
    rallyCount3D = rallyCount3D + 1;
};

export function resetRallyCount3D() {
    rallyCount3D = 0;
}

export const psychedelicShaderMaterial = new THREE.ShaderMaterial({
	uniforms: {
		time: { value: 0.0 },
		resolution: { value: new THREE.Vector2() },
	},
	vertexShader: `
		varying vec3 vNormal;
		void main() {
			vNormal = normalize(normalMatrix * normal);
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`,
	fragmentShader: `
	uniform float time;
	varying vec3 vNormal;

	void main() {
		// Calcule la couleur en fonction de la normale et du temps
		float hue = mod(vNormal.x + vNormal.y + time * 0.5, 1.0); // Ajout du temps pour faire tourner les couleurs
		vec3 color = vec3(0.5 + 0.5 * cos(6.28318 * (hue + time * 0.2) + vec3(0.0, 2.0, 4.0))); // Rotation des couleurs

		gl_FragColor = vec4(color, 1.0);
	}
	`,
});

export function applyPsychedelicEffect3D(ball) {
	ball.material = psychedelicShaderMaterial;
}

export function addSmokeTrail3D(position, scene) {
    const smokeSize = gameSettings3D.ballRadius3D * 0.6;
    const sphereGeometry = new THREE.SphereGeometry(smokeSize, 16, 16);
    const smokeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.2 });
    const smokeSphere = new THREE.Mesh(sphereGeometry, smokeMaterial);

    smokeSphere.position.copy(position);
    scene.add(smokeSphere);
    smokeParticles.push(smokeSphere);

    setTimeout(() => {
        scene.remove(smokeSphere);
        smokeSphere.geometry.dispose();
        smokeSphere.material.dispose();
        smokeParticles = smokeParticles.filter(particle => particle !== smokeSphere); // Retirer du tableau
    }, smokeLifetime);
}

export function clearSmokeTrail3D(scene) {
    smokeParticles.forEach((smokeSphere) => {
        scene.remove(smokeSphere);
        smokeSphere.geometry.dispose();
        smokeSphere.material.dispose();
    });
    smokeParticles = [];
}



