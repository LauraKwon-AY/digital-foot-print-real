const globalKey = "__dfm_v1_state__";

const state = globalThis[globalKey] || {
  sessions: new Map(),
  savedCandidates: new Map(),
};

globalThis[globalKey] = state;

export default state;
