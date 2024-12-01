
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// Define screen dimensions
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

// Define I2C pins (use default ESP32 pins or customize)
#define SDA_PIN 26
#define SCL_PIN 21

// Create display object (set I2C address, default is 0x3C)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);


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
      display.clearDisplay();
        
      display.setTextSize(1); // Small font size
      display.setTextColor(SSD1306_WHITE);
    // Display temperature
      display.setCursor(0, 0);
      display.print("LED! ");
      
      // Show updated data
      display.display();

    }
    if (value == "0") {
      digitalWrite(LED_PIN, LOW);
      Serial.println("LED OFF");
      display.clearDisplay();
        
      display.setTextSize(1); // Small font size
      display.setTextColor(SSD1306_WHITE);
    // Display temperature
      display.setCursor(0, 0);
      display.print("LED ! ");
      
      // Show updated data
      display.display();
    }

    if (value == "2") {
      Serial.println("motor 1 turning");
      display.clearDisplay();
        
      display.setTextSize(1); // Small font size
      display.setTextColor(SSD1306_WHITE);
    // Display temperature
      display.setCursor(0, 0);
      display.print("Pill 1 dispensed!  ");
      
      // Show updated data
      display.display();
    }
    
    if (value == "3") {
      Serial.println("motor 2 turning");
      display.clearDisplay();

      display.setTextSize(1); // Small font size
      display.setTextColor(SSD1306_WHITE);
    // Display temperature
      display.setCursor(0, 0);
      display.print("Pill 2 dispensed!  ");
      
      // Show updated data
      display.display();
    }
    
    if (value == "4") {
      Serial.println("motor 3 turning");
      display.clearDisplay();

      display.setTextSize(1); // Small font size
      display.setTextColor(SSD1306_WHITE);
    // Display temperature
      display.setCursor(0, 0);
      display.print("Pill 3 dispensed!  ");
      
      // Show updated data
      display.display();
    }
    if (value == "5") {
      Serial.println("motor 4 turing");
      display.clearDisplay();

      display.setTextSize(1); // Small font size
      display.setTextColor(SSD1306_WHITE);
    // Display temperature
      display.setCursor(0, 0);
      display.print("Pill 4 dispensed!  ");
      
      // Show updated data
      display.display();
    }
    if (value == "6") {
      Serial.println("clear display");
      display.clearDisplay();
      // Show updated data
      display.display();
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

 
  // Initialize BLE
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


   // Initialize I2C with custom pins if necessary
  Wire.begin(SDA_PIN, SCL_PIN);

  // Initialize the display
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;); // Halt execution
  }

  display.display();
  display.clearDisplay();
    


}

void loop() {
  // Nothing to do in the loop for this example
}
