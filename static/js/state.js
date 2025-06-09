const state = {
  protocol: 'tcp',           // Default protocol
  mode: 'download',          // Default mode
  units: 'Mbps',             // Default unit
  speedtest_state: 'READY',  // Test state: READY or RUNNING

  bandwidthSum: 0,           // Sum of bandwidth values
  bandwidthCount: 0,         // Count of bandwidth samples
  maxBandwidth: 0            // Max bandwidth observed
};

export default {
  get protocol() {
    return state.protocol;
  },
  set protocol(value) {
    state.protocol = value;
  },

  get mode() {
    return state.mode;
  },
  set mode(value) {
    state.mode = value;
  },

  get units() {
    return state.units;
  },
  set units(value) {
    state.units = value;
  },

  get speedtest_state() {
    return state.speedtest_state;
  },
  set speedtest_state(value) {
    state.speedtest_state = value;
  },

  get bandwidthSum() {
    return state.bandwidthSum;
  },
  set bandwidthSum(value) {
    state.bandwidthSum = value;
  },

  get bandwidthCount() {
    return state.bandwidthCount;
  },
  set bandwidthCount(value) {
    state.bandwidthCount = value;
  },

  get maxBandwidth() {
    return state.maxBandwidth;
  },
  set maxBandwidth(value) {
    state.maxBandwidth = value;
  },

  resetStats() {
    state.bandwidthSum = 0;
    state.bandwidthCount = 0;
    state.maxBandwidth = 0;
  }
};

  