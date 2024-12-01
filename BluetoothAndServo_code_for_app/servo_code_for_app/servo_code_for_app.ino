#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <ESP32Servo.h>

#define LED_PIN 17  // Built-in LED on most ESP32 boards

// Define pins for each servo
const int servoPins[4] = {13, 14, 15, 16}; // Example GPIO pins for servos

const int minPulse = 500;          // Minimum pulse width (0 degrees)
const int maxPulse = 2500;         // Maximum pulse width (135 degrees)

// BLE Service and Characteristic UUIDs (customize if needed)
#define SERVICE_UUID        "12345678-1234-5678-1234-56789abcdef0"
#define CHARACTERISTIC_UUID "12345678-1234-5678-1234-56789abcdef1"


Servo servos[4];

BLECharacteristic *Characteristic;

// Callback class for handling write events
class ControlCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    String value = pCharacteristic->getValue();

    if (value == "1") {
      digitalWrite(LED_PIN, HIGH);
      Serial.println("LED ON");
    }
    else if (value == "0") {
      digitalWrite(LED_PIN, LOW);
      Serial.println("LED OFF");
    }

    else if (value == "2") { // Operate servo 1
      servos[0].write(0);    // Move to 0 degrees
      delay(1000);
      servos[0].write(135);  // Move to 135 degrees
      delay(1000);
      servos[0].write(0);    // Move back to 0 degrees
      delay(1000);
      Serial.println("Servo 1 dispensed a pill");
    }

    else if (value == "3") { // Operate servo 2
      servos[1].write(0);    // Move to 0 degrees
      delay(1000);
      servos[1].write(135);  // Move to 135 degrees
      delay(1000);
      servos[1].write(0);    // Move back to 0 degrees
      delay(1000);
      Serial.println("Servo 2 dispensed a pill");
    }

    else if (value == "4") { // Operate servo 3
      servos[2].write(0);    // Move to 0 degrees
      delay(1000);
      servos[2].write(135);  // Move to 135 degrees
      delay(1000);
      servos[2].write(0);    // Move back to 0 degrees
      delay(1000);
      Serial.println("Servo 3 dispensed a pill");
    }

    else if (value == "5") { // Operate servo 4
      servos[3].write(0);    // Move to 0 degrees
      delay(1000);
      servos[3].write(135);  // Move to 135 degrees
      delay(1000);
      servos[3].write(0);    // Move back to 0 degrees
      delay(1000);
      Serial.println("Servo 4 dispensed a pill");
    }
  }
};

// BLE server and advertising setup
class MyServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    Serial.println("Client connected");
  }

  void onDisconnect(BLEServer* pServer) {
    Serial.println("Client disconnected");
    
    // Restart advertising when the device is disconnected
    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->start();
    Serial.println("Advertising restarted after disconnect");
  }
};

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);  // Set LED as output

  for (int i = 0; i < 4; i++) {
    servos[i].setPeriodHertz(50);          // Standard 50 Hz PWM frequency for servos
    servos[i].attach(servoPins[i], minPulse, maxPulse); // Attach and set pulse range
  }


//initializing esp
  BLEDevice::init("ESP32");
  BLEServer *pServer = BLEDevice::createServer();
  
  // Set callback for connect and disconnect events
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create a writable characteristic for controlling the LED
  ledCharacteristic = pService->createCharacteristic(
                        CHARACTERISTIC_UUID,
                        BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE
                      );
  
  // Set the callback function for when data is written to the characteristic
  ledCharacteristic->setCallbacks(new LEDControlCallbacks());

  pService->start();

  // Start BLE advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->start();

  Serial.println("BLE LED Control Initialized. Waiting for client...");
}


void loop() {
  //Serial.println("connected");
  // Nothing to do in the loop for this example
}


