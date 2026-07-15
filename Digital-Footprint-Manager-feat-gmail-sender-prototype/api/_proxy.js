export async function proxyToPrototype(modPath, req, res) {
  const mod = await import(`../prototype/api/${modPath}.js`);
  return mod.default(req, res);
}
