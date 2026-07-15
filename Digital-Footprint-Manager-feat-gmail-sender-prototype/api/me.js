import { proxyToPrototype } from "./_proxy.js";
export default (req, res) => proxyToPrototype("me", req, res);
