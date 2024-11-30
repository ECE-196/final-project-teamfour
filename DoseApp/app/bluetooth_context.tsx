import React, { createContext, useState, useEffect } from 'react';
import { BleManager } from 'react-native-ble-plx';

const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState('Searching...');
  const [deviceID, setDeviceID] = useState(null);
  const bleManager = new BleManager();
  const [deviceRef, setDeviceRef] = useState(null);

  useEffect(() => {
    const searchAndConnectToDevice = () => {
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error(error);
          setConnectionStatus('Error searching for devices');
          return;
        }

        if (device.name === 'ESP32') {
          bleManager.stopDeviceScan();
          setConnectionStatus('Connecting...');
          connectToDevice(device);
        }
      });
    };

    const connectToDevice = async (device) => {
      try {
        await device.connect();
        setDeviceID(device.id);
        setConnectionStatus('Connected');
        setDeviceRef(device);
        await device.discoverAllServicesAndCharacteristics();
      } catch (error) {
        console.log(error);
        setConnectionStatus('Error in Connection');
        searchAndConnectToDevice();
      }
    };

    // Start searching for devices when the component mounts
    searchAndConnectToDevice();

    return () => {
      bleManager.stopDeviceScan();
    };
  }, []);

  return (
    <BluetoothContext.Provider value={{ connectionStatus, deviceID, deviceRef }}>
      {children}
    </BluetoothContext.Provider>
  );
};

export default BluetoothContext;
