// BluetoothService.js
import { BleManager } from "react-native-ble-plx";
import { atob, btoa } from "react-native-quick-base64";
import { Device } from "react-native-ble-plx";

const bleManager = new BleManager();

class BluetoothService {
    private static instance: BluetoothService | undefined;
    private connectedDevice: Device | null = null;  SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
  CHARACTERISTIC_UUID = "12345678-1234-5678-1234-56789abcdef1";

  static getInstance() {
    if (!this.instance) {
      this.instance = new BluetoothService();
    }
    return this.instance;
  }
  async connectToDevice(device: Device): Promise<void> {
    try {
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      this.connectedDevice = device; // Assign the connected device
      console.log("Connected to device:", device.name);
    } catch (error) {
      console.error("Connection error:", error);
      this.connectedDevice = null; // Reset if connection fails
    }
  }

  async sendData(data: string): Promise<void> {
    if (!this.connectedDevice) {
      console.error("No connected device to send data.");
      return;
    }

    const encodedData = btoa(data);
    try {
      await this.connectedDevice.writeCharacteristicWithResponseForService(
        "12345678-1234-5678-1234-56789abcdef0", // SERVICE_UUID
        "12345678-1234-5678-1234-56789abcdef1", // CHARACTERISTIC_UUID
        encodedData
      );
      console.log("Data sent:", data);
    } catch (error) {
      console.error("Data send error:", error);
    }
  }
}

export default BluetoothService;
