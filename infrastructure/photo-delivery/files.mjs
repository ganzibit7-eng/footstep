import fs from 'node:fs';
import path from 'node:path';
export function readPhoto(root,photo){
 const file=fs.realpathSync(photo.sourceFile?path.resolve(photo.sourceFile):path.join(root,photo.key));
 const allowed=[path.join(root,'assets/place-photos'),path.join(root,'assets/place-supplement'),path.resolve(root,'../../outputs')].filter(p=>fs.existsSync(p)).map(p=>fs.realpathSync(p));
 if(!allowed.some(base=>{const relative=path.relative(base,file);return relative!==''&&!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative);}))throw Error('Photo source is outside the approved photo/cache folders');
 return fs.readFileSync(file);
}
