// Smallest check that fails if moco-mcp breaks: spawn the server over stdio,
// initialize, list components, fetch one, assert sane shapes.
import { spawn } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const child = spawn("node", [join(ROOT, "packages/mcp/index.mjs")], { stdio: ["pipe", "pipe", "inherit"] });

const send = (msg) => child.stdin.write(JSON.stringify(msg) + "\n");
const responses = new Map();
let buf = "";
child.stdout.on("data", (c) => {
  buf += c;
  let i;
  while ((i = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, i); buf = buf.slice(i + 1);
    if (!line.trim()) continue;
    const j = JSON.parse(line);
    if (j.id !== undefined) responses.get(j.id)?.(j);
  }
});
const call = (id, method, params) =>
  new Promise((res, rej) => {
    responses.set(id, res);
    setTimeout(() => rej(new Error(`timeout waiting for response ${id} (${method})`)), 10000);
    send({ jsonrpc: "2.0", id, method, params });
  });

try {
  const init = await call(1, "initialize", {
    protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "smoke", version: "0" },
  });
  assert.equal(init.result.serverInfo.name, "moco");
  send({ jsonrpc: "2.0", method: "notifications/initialized" });

  const tools = await call(2, "tools/list", {});
  const names = tools.result.tools.map((t) => t.name).sort();
  assert.deepEqual(names, ["get_component", "get_setup", "get_theme", "list_components", "search_components"]);
  for (const t of tools.result.tools) assert.equal(t.annotations?.readOnlyHint, true, `${t.name} missing readOnlyHint`);

  const list = await call(3, "tools/call", { name: "list_components", arguments: {} });
  const items = JSON.parse(list.result.content[0].text);
  assert.ok(items.length >= 20, `expected >=20 items, got ${items.length}`);

  const comp = await call(4, "tools/call", { name: "get_component", arguments: { name: "compare" } });
  const c = JSON.parse(comp.result.content[0].text);
  assert.ok(c.files.some((f) => f.target === "components/moco/compare.tsx" && f.content.includes("CompareProps")));
  assert.ok(c.registryDependencies.includes("tokens"));
  assert.ok(c.usage, "usage example missing");

  console.log(`smoke-mcp: ok (${items.length} items, 5 read-only tools)`);
  process.exit(0);
} catch (err) {
  console.error("smoke-mcp: FAIL —", err.message);
  process.exit(1);
} finally {
  child.kill();
}
