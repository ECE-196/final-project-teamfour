#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "DHT.h"

// OLED display settings
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// DHT sensor settings
#define DHTPIN 11     // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Custom I2C pins
#define SDA_PIN 5
#define SCL_PIN 4

void setup() {
  // Initialize serial monitor
  Serial.begin(115200);

  // Initialize custom I2C pins
  Wire.begin(SDA_PIN, SCL_PIN);

  // Initialize DHT sensor
  dht.begin();

  // Initialize OLED display
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;); // Halt execution
  }
  display.display();
  delay(2000);
  display.clearDisplay();
}

void loop() {
  // Read temperature and humidity
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Check for failed readings
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  // Display data on OLED screen
  display.clearDisplay();
  display.setTextSize(1); // Small font size
  display.setTextColor(SSD1306_WHITE);

  // Display temperature
  display.setCursor(0, 0);
  display.print("Temp: ");
  display.print(temperature);
  display.println(" C");

  // Display humidity
  display.setCursor(0, 10);
  display.print("Humidity: ");
  display.print(humidity);
  display.println(" %");

  // Show updated data
  display.display();

  // Print data to Serial Monitor (optional)
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" C");
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  delay(2000); // Update every 2 seconds
}
