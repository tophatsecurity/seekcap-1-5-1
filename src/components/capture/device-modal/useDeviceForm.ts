
import { useState, useEffect } from "react";
import { CaptureDevice } from "@/lib/db/types";
import { DEFAULT_CAPTURE_FILTER, DEFAULT_SCADA_PROTOCOLS, DEFAULT_INTERFACES } from "./deviceConstants";

export const useDeviceForm = (editDeviceName?: string | null, devices?: CaptureDevice[]) => {
  const [name, setName] = useState("");
  const [vendor, setVendor] = useState("");
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("22");
  const [protocol, setProtocol] = useState("ssh");
  const [credentialSet, setCredentialSet] = useState("");
  const [returnPathCredentialSet, setReturnPathCredentialSet] = useState("");
  const [captureFilter, setCaptureFilter] = useState(DEFAULT_CAPTURE_FILTER);
  
  // Cisco configuration fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [certificate, setCertificate] = useState("");
  const [enableRequired, setEnableRequired] = useState(true);
  const [enablePassword, setEnablePassword] = useState("");
  const [autoDiscovery, setAutoDiscovery] = useState(true);
  const [rawScada, setRawScada] = useState(true);
  const [scadaProtocols, setScadaProtocols] = useState<string>(DEFAULT_SCADA_PROTOCOLS.join(", "));
  const [interfaces, setInterfaces] = useState<string>(DEFAULT_INTERFACES.join(", "));

  // Find device if in edit mode
  useEffect(() => {
    if (editDeviceName && devices) {
      const deviceToEdit = devices.find(device => device.name === editDeviceName);
      if (deviceToEdit) {
        setName(deviceToEdit.name);
        setVendor(deviceToEdit.vendor);
        setIp(deviceToEdit.ip);
        setPort(deviceToEdit.port.toString());
        setProtocol(deviceToEdit.protocol);
        setCredentialSet(deviceToEdit.credential_set);
        setReturnPathCredentialSet(deviceToEdit.return_path_credential_set);
        setCaptureFilter(deviceToEdit.capture_filter || DEFAULT_CAPTURE_FILTER);
        
        // Set Cisco configuration fields if available in the device data
        if (deviceToEdit.config) {
          setUsername(deviceToEdit.config.username || "");
          setPassword(deviceToEdit.config.password || "");
          setCertificate(deviceToEdit.config.certificate || "");
          setEnableRequired(deviceToEdit.config.enable_required !== undefined 
            ? deviceToEdit.config.enable_required : true);
          setEnablePassword(deviceToEdit.config.enable_password || "");
          setAutoDiscovery(deviceToEdit.config.auto_discovery !== undefined 
            ? deviceToEdit.config.auto_discovery : true);
          
          if (deviceToEdit.config.advanced) {
            setRawScada(deviceToEdit.config.advanced.raw_scada === "True");
            
            if (Array.isArray(deviceToEdit.config.advanced.scada_protocols)) {
              setScadaProtocols(deviceToEdit.config.advanced.scada_protocols.join(", "));
            }
            
            if (Array.isArray(deviceToEdit.config.advanced.interfaces)) {
              setInterfaces(deviceToEdit.config.advanced.interfaces.join(", "));
            }
          }
        }
      }
    }
  }, [editDeviceName, devices]);

  return {
    // Basic config
    name, setName,
    vendor, setVendor,
    ip, setIp,
    port, setPort,
    protocol, setProtocol,
    credentialSet, setCredentialSet,
    returnPathCredentialSet, setReturnPathCredentialSet,
    captureFilter, setCaptureFilter,
    
    // Cisco config
    username, setUsername,
    password, setPassword,
    certificate, setCertificate,
    enableRequired, setEnableRequired,
    enablePassword, setEnablePassword,
    autoDiscovery, setAutoDiscovery,
    
    // Advanced config
    rawScada, setRawScada,
    scadaProtocols, setScadaProtocols,
    interfaces, setInterfaces,
  };
};
