// AutomatikPOST — publishToWordPress Deno function
// This function is called server-side via backend.js
// See: src/api/backend.js for the full implementation

import { Backend } from '../../src/api/backend.js';

export default async function handler(req) {
  const body = await req.json();
  const result = await Backend.publishToWordPress(body);
  return Response.json(result);
}
