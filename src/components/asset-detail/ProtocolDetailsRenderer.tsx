
import React from 'react';
import { ModbusDetails } from './ModbusDetails';
import { DNP3Details } from './DNP3Details';
import { IEC61850Details } from './IEC61850Details';
import { OPCUADetails } from './OPCUADetails';
import { EtherNetIPDetails } from './EtherNetIPDetails';
import { GenericProtocolDetails } from './GenericProtocolDetails';
import { getProtocolDetails } from './protocol-parsers';

interface ProtocolDetailsRendererProps {
  protocol: string;
  scadaData?: Record<string, any>;
}

export const ProtocolDetailsRenderer: React.FC<ProtocolDetailsRendererProps> = ({ protocol, scadaData }) => {
  const protocolData = getProtocolDetails(protocol, scadaData);
  if (!protocolData) return null;

  const protocolLower = protocol.toLowerCase();
  
  if (protocolLower.includes('modbus')) {
    return <ModbusDetails protocolData={protocolData} />;
  } else if (protocolLower.includes('dnp3')) {
    return <DNP3Details protocolData={protocolData} />;
  } else if (protocolLower.includes('iec') || protocolLower.includes('61850')) {
    return <IEC61850Details protocolData={protocolData} />;
  } else if (protocolLower.includes('opc') || protocolLower.includes('ua')) {
    return <OPCUADetails protocolData={protocolData} />;
  } else if (protocolLower.includes('ethernet') || protocolLower.includes('enip')) {
    return <EtherNetIPDetails protocolData={protocolData} />;
  } else {
    return <GenericProtocolDetails protocol={protocol} protocolData={protocolData} />;
  }
};
