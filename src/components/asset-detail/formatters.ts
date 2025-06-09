
export const formatBandwidth = (bps?: number) => {
  if (!bps) return "0 bps";
  if (bps > 1000000000) return `${(bps / 1000000000).toFixed(1)} Gbps`;
  if (bps > 1000000) return `${(bps / 1000000).toFixed(1)} Mbps`;
  if (bps > 1000) return `${(bps / 1000).toFixed(1)} Kbps`;
  return `${bps} bps`;
};

export const formatBytes = (mb?: number) => {
  if (!mb) return "0 MB";
  if (mb > 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
};

export const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return "Never";
  return new Date(timestamp).toLocaleString();
};
