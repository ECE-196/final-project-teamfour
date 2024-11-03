#include <WiFi.h>
#include "time.h"
const long utcOffsetInSeconds = -8 * 3600; 
const char* ssid     = ""; //get from user's app ******
const char* password = ""; // for school with open network just leave the string empty
int pill_taken_check=1; // have the app decide if pill has been taken and set the variable accordingly 

void testdrawchar(void) {
  display.clearDisplay();

  display.setTextSize(1);      // Normal 1:1 pixel scale
  display.setTextColor(SSD1306_WHITE); // Draw white text
  display.setCursor(0, 0);     // Start at top-left corner
  display.cp437(true);         // Use full 256 char 'Code Page 437' font

  // Not all the characters will fit on the display. This is normal.
  // Library will draw what it can and the rest will be clipped.
  }

  display.display();
  delay(2000);
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");

  configTime(utcOffsetInSeconds, 0, "pool.ntp.org"); // Configures NTP server
}


void loop() {
  
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return;
  }

  //Serial.printf("Current time: %02d:%02d:%02d\n", timeinfo.tm_hour, timeinfo.tm_min, timeinfo.tm_sec); ------to check if the current time is right on serial


//Writes the time that the pill is being dispensed at on the screen
  if hour==timeinfo.tm_hour && min==timeinfo.tm_min && sec==timeinfo.tm_sec){
    display.clearDisplay();
    display.setCursor(0, 0);
    display.write("Pill dispensed at: %02d:%02d:%02d\n", timeinfo.tm_hour, timeinfo.tm_min, timeinfo.tm_sec);
  }

  if (pill_taken){
  display.clearDisplay(); 
  display.setCursor(0, 0);     // Start at top-left corner
  }

  delay(1000); // Update every second
}

