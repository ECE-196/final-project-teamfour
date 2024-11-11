#include <ESP32Servo.h>

const int minPulse = 500;          // Minimum pulse width (0 degrees)
const int maxPulse = 2000;         // Maximum pulse width (135 degrees)

// Define pins for each servo
const int servoPins[4] = {13, 14, 15, 16}; // Example GPIO pins for servos

// Create Servo objects
Servo servos[4];

void setup() {
  // Attach each servo to its respective pin
  for (int i = 0; i < 4; i++) {
    servos[i].setPeriodHertz(50);          // Standard 50 Hz PWM frequency for servos
    servos[i].attach(servoPins[i], minPulse, maxPulse); // Attach and set pulse range
  }
}

void loop() {
  // Move each servo from 0 to 135 degrees
  for (int i = 0; i < 4; i++) {
    servos[i].write(0);    // Move to 0 degrees
    delay(1000);
    servos[i].write(135);  // Move to 135 degrees
    delay(1000);
    servos[i].write(0);    // Move back to 0 degrees
    delay(1000);
  }
}
