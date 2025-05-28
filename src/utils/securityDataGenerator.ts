
export interface SecurityAlert {
  id: string;
  type: 'regular' | 'scada';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  assetIp: string;
  assetMac: string;
  assetName: string;
  protocol: string;
  sourceIp: string;
  destinationIp: string;
  port: number;
  timestamp: string;
  rule: string;
  category: string;
  details: {
    packets: number;
    bytes: number;
    duration: string;
    signature: string;
  };
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
}

const regularIDSRules = [
  'HTTP SQL Injection Attempt',
  'SSH Brute Force Attack',
  'Suspicious Network Scan',
  'Malware Communication',
  'Port Scan Detected',
  'DNS Tunneling Attempt',
  'FTP Brute Force',
  'Web Shell Upload',
  'Buffer Overflow Attempt',
  'Privilege Escalation',
  'Lateral Movement',
  'Data Exfiltration'
];

const scadaIDSRules = [
  'Modbus Unauthorized Read',
  'DNP3 Protocol Violation',
  'HMI Unauthorized Access',
  'PLC Command Injection',
  'SCADA Network Anomaly',
  'Industrial Protocol Misuse',
  'Control System Intrusion',
  'OPC UA Security Bypass',
  'Ethernet/IP Manipulation',
  'Profinet Unauthorized Access',
  'CIP Protocol Anomaly',
  'HART Command Tampering'
];

const assetNames = [
  'PLC-001', 'HMI-Server-01', 'SCADA-Gateway', 'Control-Panel-A',
  'Workstation-01', 'File-Server', 'Domain-Controller', 'Database-Server',
  'Web-Server', 'Email-Server', 'Firewall-01', 'Switch-Core-01',
  'Turbine-Controller', 'Pump-Station-01', 'Sensor-Array-01', 'RTU-001'
];

const protocols = ['TCP', 'UDP', 'ICMP', 'Modbus', 'DNP3', 'HTTP', 'HTTPS', 'SSH', 'FTP', 'SNMP'];

const generateIP = () => {
  const subnets = ['192.168.1', '10.0.1', '172.16.1', '192.168.100', '10.10.1'];
  const subnet = subnets[Math.floor(Math.random() * subnets.length)];
  return `${subnet}.${Math.floor(Math.random() * 254) + 1}`;
};

const generateMAC = () => {
  return Array.from({ length: 6 }, () => 
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join(':');
};

export const generateSecurityAlerts = (): SecurityAlert[] => {
  const alerts: SecurityAlert[] = [];
  
  // Generate regular IDS alerts (60% of total)
  for (let i = 0; i < 45; i++) {
    const severity = Math.random() < 0.2 ? 'high' : Math.random() < 0.4 ? 'medium' : 'low';
    const rule = regularIDSRules[Math.floor(Math.random() * regularIDSRules.length)];
    const assetIp = generateIP();
    const sourceIp = generateIP();
    
    alerts.push({
      id: `reg_${i + 1}`,
      type: 'regular',
      severity,
      title: rule,
      description: `${rule} detected from ${sourceIp} targeting ${assetIp}`,
      assetIp,
      assetMac: generateMAC(),
      assetName: assetNames[Math.floor(Math.random() * assetNames.length)],
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      sourceIp,
      destinationIp: assetIp,
      port: Math.floor(Math.random() * 65535) + 1,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      rule: `SID:${Math.floor(Math.random() * 9999) + 1000}`,
      category: severity === 'high' ? 'Critical Threat' : severity === 'medium' ? 'Suspicious Activity' : 'Policy Violation',
      details: {
        packets: Math.floor(Math.random() * 1000) + 1,
        bytes: Math.floor(Math.random() * 100000) + 1000,
        duration: `${Math.floor(Math.random() * 300)}s`,
        signature: `ET ${rule.toUpperCase()}`
      },
      status: 'new'
    });
  }
  
  // Generate SCADA IDS alerts (40% of total)
  for (let i = 0; i < 30; i++) {
    const severity = Math.random() < 0.3 ? 'high' : Math.random() < 0.5 ? 'medium' : 'low';
    const rule = scadaIDSRules[Math.floor(Math.random() * scadaIDSRules.length)];
    const assetIp = generateIP();
    const sourceIp = generateIP();
    
    alerts.push({
      id: `scada_${i + 1}`,
      type: 'scada',
      severity,
      title: rule,
      description: `${rule} - Industrial control system security event detected`,
      assetIp,
      assetMac: generateMAC(),
      assetName: assetNames.filter(name => 
        name.includes('PLC') || name.includes('HMI') || name.includes('SCADA') || 
        name.includes('Control') || name.includes('Turbine') || name.includes('Pump') || 
        name.includes('Sensor') || name.includes('RTU')
      )[Math.floor(Math.random() * 8)],
      protocol: ['Modbus', 'DNP3', 'Ethernet/IP', 'OPC UA', 'Profinet'][Math.floor(Math.random() * 5)],
      sourceIp,
      destinationIp: assetIp,
      port: [502, 20000, 44818, 4840, 34962][Math.floor(Math.random() * 5)],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      rule: `ICS:${Math.floor(Math.random() * 999) + 100}`,
      category: severity === 'high' ? 'Critical ICS Threat' : severity === 'medium' ? 'ICS Anomaly' : 'ICS Policy Violation',
      details: {
        packets: Math.floor(Math.random() * 500) + 1,
        bytes: Math.floor(Math.random() * 50000) + 500,
        duration: `${Math.floor(Math.random() * 180)}s`,
        signature: `ICS ${rule.replace(' ', '_').toUpperCase()}`
      },
      status: 'new'
    });
  }
  
  // Sort by severity (high first) then by timestamp (newest first)
  return alerts.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[b.severity] - severityOrder[a.severity];
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};
