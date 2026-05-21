const state = {
  ip: '',
  port: '5201',
  streams: '8',
  bandwidth: '0',
  protocol: 'tcp',           // Default protocol
  mode: 'download',          // Default mode
  displayMode: 'gauge',      // Display mode: gauge | counter | both
  activeDisplay: 'gauge',    // Currently active display when displayMode is "both"
  units: 'Mbps',             // Default unit
  speedtest_state: 'READY',  // Test state: READY or RUNNING

  bandwidthSum: 0,
  bandwidthCount: 0,
  maxBandwidth: 0,

  bidirDownloadSum: 0,
  bidirDownloadCount: 0,
  bidirUploadSum: 0,
  bidirUploadCount: 0
};

export default {
  get ip() {
    return state.ip;
  },
  set ip(value) {
    state.ip = value;
  },

  get port() {
    return state.port;
  },
  set port(value) {
    state.port = value;
  },

  get streams() {
    return state.streams;
  },
  set streams(value) {
    state.streams = value;
  },

  get bandwidth() {
    return state.bandwidth;
  },
  set bandwidth(value) {
    state.bandwidth = value;
  },

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

  get displayMode() {
    return state.displayMode;
  },
  set displayMode(value) {
    state.displayMode = value;
  },

  get activeDisplay() {
    return state.activeDisplay;
  },
  set activeDisplay(value) {
    state.activeDisplay = value;
  },

  get effectiveDisplay() {
    if (state.mode === 'bidir') return 'counter';
    if (state.displayMode === 'both') return state.activeDisplay;
    return state.displayMode;
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

  get bidirDownloadSum() { return state.bidirDownloadSum; },
  set bidirDownloadSum(v) { state.bidirDownloadSum = v; },

  get bidirDownloadCount() { return state.bidirDownloadCount; },
  set bidirDownloadCount(v) { state.bidirDownloadCount = v; },

  get bidirUploadSum() { return state.bidirUploadSum; },
  set bidirUploadSum(v) { state.bidirUploadSum = v; },

  get bidirUploadCount() { return state.bidirUploadCount; },
  set bidirUploadCount(v) { state.bidirUploadCount = v; },

  resetStats() {
    state.bandwidthSum = 0;
    state.bandwidthCount = 0;
    state.maxBandwidth = 0;
    state.bidirDownloadSum = 0;
    state.bidirDownloadCount = 0;
    state.bidirUploadSum = 0;
    state.bidirUploadCount = 0;
  }
};

  