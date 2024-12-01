// #include <Wire.h>

// void setup() {
//   Wire.begin(26, 21);
//   Serial.begin(115200);
//   Serial.println("\nI2C Scanner");
//   for (byte i = 8; i < 120; i++) {
//     Wire.beginTransmission(i);
//     if (Wire.endTransmission() == 0) {
//       Serial.print("I2C device found at address 0x");
//       Serial.println(i, HEX);
//     }
//   }
// }

// void loop() {}


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

void setup() {
  // Start the serial monitor for debugging
  Serial.begin(115200);

  // Initialize I2C with custom pins if necessary
  Wire.begin(SDA_PIN, SCL_PIN);

  // Initialize the display
  if (!display.begin(0x3C)) { // 0x3C is the default address
    Serial.println(F("SSD1306 allocation failed"));
    for (;;); // Stop execution if display is not found
  }
  else{ Serial.print("connection began");}
  
  delay(500);
    // Clear the display buffer
  display.clearDisplay();

  // Display "Hello, World!" on the screen
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(1, 0);
  display.println(F("1"));
  display.display(); // Render text to the screen
  delay(2000);
}


void loop() {
  // No actions in the loop
}
