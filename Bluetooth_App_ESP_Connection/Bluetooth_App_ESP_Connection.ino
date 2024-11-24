
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define LED_PIN 17  // Built-in LED on most ESP32 boards

// BLE Service and Characteristic UUIDs (customize if needed)
#define SERVICE_UUID        "12345678-1234-5678-1234-56789abcdef0"
#define CHARACTERISTIC_UUID "12345678-1234-5678-1234-56789abcdef1"

BLECharacteristic *ledCharacteristic;

// Callback class for handling write events
class LEDControlCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    String value = pCharacteristic->getValue();

    if (value == "1") {
      digitalWrite(LED_PIN, HIGH);
      Serial.println("LED ON");
    }
    if (value == "0") {
      digitalWrite(LED_PIN, LOW);
      Serial.println("LED OFF");
    }

    if (value == "2") {
      Serial.println("motor 1 turning");
    }
    
    if (value == "3") {
      Serial.println("motor 2 turning");
    }
    
    if (value == "4") {
      Serial.println("motor 3 turning");
    }
    if (value == "5") {
      Serial.println("motor 4 turing");
    }
  }
};


void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);  // Set LED as output

  // Initialize BLE
  BLEDevice::init("ESP32");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create a writable characteristic for controlling the LED
  ledCharacteristic = pService->createCharacteristic(
                        CHARACTERISTIC_UUID,
                        BLECharacteristic::PROPERTY_READ |BLECharacteristic::PROPERTY_WRITE
                      );
  
  // Set the callback function for when data is written to the characteristic
  ledCharacteristic->setCallbacks( new LEDControlCallbacks());

  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->start();

  Serial.println("BLE LED Control Initialized. Waiting for client...");
}



void loop() {
  //Serial.println("connected");
  // Nothing to do in the loop for this example
}
