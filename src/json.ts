import { xtryifySync } from './tryify.js';

export const parseJson = xtryifySync<SyntaxError>(JSON.parse);
export const parseJSON = parseJson;
