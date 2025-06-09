
export const getProtocolDetails = (protocol: string, scadaData?: Record<string, any>) => {
  // If no SCADA data, generate realistic sample data based on protocol
  if (!scadaData || Object.keys(scadaData).length === 0) {
    return generateSampleProtocolData(protocol);
  }
  
  const protocolData: any = {};
  const protocolLower = protocol.toLowerCase();
  
  // Extract protocol-specific data from SCADA data
  Object.entries(scadaData).forEach(([key, value]) => {
    if (key.toLowerCase().includes(protocolLower)) {
      protocolData[key] = value;
    }
  });
  
  // If we found specific data, return it, otherwise generate sample data
  return Object.keys(protocolData).length > 0 ? protocolData : generateSampleProtocolData(protocol);
};

const generateSampleProtocolData = (protocol: string) => {
  const protocolLower = protocol.toLowerCase();
  
  if (protocolLower.includes('modbus')) {
    return {
      unit_id: Math.floor(Math.random() * 255) + 1,
      function_codes: ['01', '03', '04', '16'],
      coils_count: `0-${Math.floor(Math.random() * 200) + 100}`,
      registers_count: `40001-${40001 + Math.floor(Math.random() * 50) + 20}`,
      last_update: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      status: 'Connected',
      connection_type: 'TCP',
      port: 502,
      response_time: `${Math.floor(Math.random() * 50) + 10}ms`,
      error_count: Math.floor(Math.random() * 5),
      transaction_count: Math.floor(Math.random() * 1000) + 500
    };
  } else if (protocolLower.includes('dnp3')) {
    return {
      source_address: Math.floor(Math.random() * 10) + 1,
      destination_address: Math.floor(Math.random() * 200) + 100,
      app_layer: `Level ${Math.floor(Math.random() * 3) + 1}`,
      object_groups: ['Analog Input', 'Binary Input', 'Counter'],
      class_polls: ['Class 0', 'Class 1', 'Class 2'],
      connection_status: 'Online',
      data_link_layer: 'Confirmed',
      unsolicited_enabled: Math.random() > 0.5,
      integrity_poll_rate: `${Math.floor(Math.random() * 30) + 10}s`,
      event_buffer_size: Math.floor(Math.random() * 100) + 50
    };
  } else if (protocolLower.includes('iec') || protocolLower.includes('61850')) {
    return {
      ied_name: `IED_${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
      logical_devices: ['LD0', 'CTRL', 'PROT'],
      dataset_count: Math.floor(Math.random() * 20) + 5,
      rcb_count: Math.floor(Math.random() * 10) + 3,
      goose_enabled: Math.random() > 0.3,
      mms_status: 'Active',
      server_mode: 'Active',
      access_point: `AP_${Math.floor(Math.random() * 99) + 1}`,
      association_count: Math.floor(Math.random() * 5) + 1
    };
  } else if (protocolLower.includes('opc') || protocolLower.includes('ua')) {
    return {
      server_uri: `opc.tcp://192.168.1.${Math.floor(Math.random() * 200) + 50}:4840`,
      security_policy: ['None', 'Basic256', 'Basic256Sha256'][Math.floor(Math.random() * 3)],
      session_status: 'Active',
      subscription_count: Math.floor(Math.random() * 5) + 1,
      monitored_items: Math.floor(Math.random() * 50) + 20,
      namespace_count: Math.floor(Math.random() * 3) + 2,
      endpoint_count: Math.floor(Math.random() * 3) + 1,
      certificate_status: 'Valid',
      authentication_mode: 'Anonymous'
    };
  } else if (protocolLower.includes('ethernet') || protocolLower.includes('enip')) {
    return {
      vendor_id: `0x${Math.floor(Math.random() * 255).toString(16).padStart(3, '0')}`,
      product_code: `0x${Math.floor(Math.random() * 255).toString(16).padStart(3, '0')}`,
      device_type: ['Generic Device', 'Communications Adapter', 'Motor Drive'][Math.floor(Math.random() * 3)],
      assembly_instances: `Input: ${Math.floor(Math.random() * 50) + 100}, Output: ${Math.floor(Math.random() * 50) + 150}`,
      connection_status: 'Connected',
      revision: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
      serial_number: Math.floor(Math.random() * 1000000),
      connection_path: `20 04 24 01 30 03`
    };
  } else {
    return {
      version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
      status: 'Active',
      last_communication: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      data_points: Math.floor(Math.random() * 100) + 50,
      connection_status: 'Connected',
      uptime: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`
    };
  }
};
