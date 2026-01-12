import { xtryifySync } from './tryify.js';

export const parseJson = xtryifySync(JSON.parse);
export const parseJSON = parseJson;
