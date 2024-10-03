// frontend/srcs/js/PongGame/Game2D/rallyEffect2D.js

import { setSmokeTrail } from './draw2D.js';

export let rallyCount = 0;

export const maxRallyBeforeSmoke = 10;

export function resetRallyCount() {
    rallyCount = 0;
    setSmokeTrail([]);
}

export function incrementRallyCount() {
    rallyCount++;
}
