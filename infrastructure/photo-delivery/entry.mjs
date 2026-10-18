import {createHandler} from './worker.mjs';
import {photos} from './allowlist.mjs';
export default createHandler(photos);
