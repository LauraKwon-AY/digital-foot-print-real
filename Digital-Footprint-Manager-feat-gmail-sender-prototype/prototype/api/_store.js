const globalKey = "__dfm_v1_api_store__";

const store = globalThis[globalKey] || {
  sessions: new Map(),
  savedCandidates: new Map(),
  history: new Map(),
  rules: [
    {
      id: "generic-domains",
      label: "General senders",
      pattern: "*",
    },
  ],
};

globalThis[globalKey] = store;

export default store;
