
export const getProtocolDetails = (protocol: string, scadaData?: Record<string, any>) => {
  if (!scadaData) return null;
  
  const protocolData: any = {};
  const protocolLower = protocol.toLowerCase();
  
  Object.entries(scadaData).forEach(([key, value]) => {
    if (key.toLowerCase().includes(protocolLower)) {
      protocolData[key] = value;
    }
  });
  
  return Object.keys(protocolData).length > 0 ? protocolData : null;
};
