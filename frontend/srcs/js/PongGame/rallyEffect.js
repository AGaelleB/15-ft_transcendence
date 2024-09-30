// frontend/srcs/js/PongGame/rallyEffect.js

import { setSmokeTrail } from './draw.js';

export let rallyCount = 0;

export const maxRallyBeforeSmoke = 10;

export function resetRallyCount() {
    rallyCount = 0;
    setSmokeTrail([]);
}

export function incrementRallyCount() {
    rallyCount++;
    // console.log(`Rally count: ${rallyCount}`);
}
