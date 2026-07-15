import { proxyToPrototype } from "../_proxy.js";
export default (req, res) => proxyToPrototype("auth/logout", req, res);
