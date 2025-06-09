
// Define subnet data with weights for industrial networks
export const subnetData = [
  { subnet: '10.0.1.0/24', weight: 20, name: 'Production Floor A' },
  { subnet: '10.0.2.0/24', weight: 20, name: 'Production Floor B' },
  { subnet: '10.0.3.0/24', weight: 15, name: 'Production Floor C' },
  { subnet: '192.168.1.0/24', weight: 15, name: 'Control Systems' },
  { subnet: '192.168.10.0/24', weight: 10, name: 'SCADA Network' },
  { subnet: '172.16.1.0/24', weight: 8, name: 'Management Network' },
  { subnet: '192.168.100.0/24', weight: 7, name: 'Office Network' },
  { subnet: '10.10.1.0/24', weight: 5, name: 'Remote Monitoring' }
];

// Define device types with industrial focus
export const deviceTypes = [
  'PLC', 'HMI', 'RTU', 'Gateway', 'Switch', 'Router', 
  'Controller', 'Drive', 'Sensor', 'Actuator', 'Workstation', 'Server'
];

export const generateMacAddress = (vendorName: string) => {
  const vendorPrefix = vendorName === "Rockwell Automation" ? "RA" : 
                      vendorName === "Allen-Bradley" ? "AB" : 
                      vendorName.substring(0, 2).toUpperCase();
  return `${vendorPrefix}:${Array.from({ length: 5 }, () => 
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join(':')}`;
};

export const generateIpFromSubnet = (subnet: string) => {
  const [network] = subnet.split('/');
  const [a, b, c] = network.split('.').map(Number);
  const host = Math.floor(Math.random() * 250) + 2; // Avoid .0, .1, .255
  return `${a}.${b}.${c}.${host}`;
};
