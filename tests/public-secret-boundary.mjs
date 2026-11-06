import test from 'node:test';import assert from 'node:assert/strict';
import {secretLocations} from '../scripts/check-public-secrets.mjs';
const jwt=role=>Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url')+'.'+Buffer.from(JSON.stringify({role,fixture:true})).toString('base64url')+'.'+'x'.repeat(43);
test('public publishable and legacy anon keys are distinct from private credentials',()=>{
 assert.deepEqual(secretLocations('sb_publishable_'+'x'.repeat(40)+'\n'+jwt('anon')),[]);
 for(const role of ['service_role','authenticated'])assert.equal(secretLocations(jwt(role))[0].kind,'private-session-or-service-jwt');
});
test('credential guard reports location and kind without disclosing the match',()=>{
 const fixtures=['sb_'+'secret_'+'a'.repeat(32),'gh'+'p_'+'a'.repeat(36),'github_'+'pat_'+'b'.repeat(40),'AK'+'IA'+'A'.repeat(16),'-----BEGIN '+'PRIVATE KEY-----'];
 for(const fixture of fixtures){const found=secretLocations('first\n'+fixture);assert.equal(found.length,1);assert.equal(found[0].line,2);assert(!JSON.stringify(found).includes(fixture));}
 assert.deepEqual(secretLocations('SUPABASE_SERVICE_ROLE_KEY = env.get(name)'),[]);
});
