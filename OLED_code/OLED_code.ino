


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
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;); // Halt execution
  }
  display.display();
  delay(2000);
  display.clearDisplay();
    
  display.setTextSize(1); // Small font size
  display.setTextColor(SSD1306_WHITE);

  // Display temperature
  display.setCursor(0, 0);
  display.print("Temp: ");
  
  // Show updated data
  display.display();
}



void loop() {
  // No actions in the loop
   // Display data on OLED screen

}
