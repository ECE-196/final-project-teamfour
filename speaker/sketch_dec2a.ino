#define SPEAKER_PIN 15 // Replace with the GPIO pin you're using for the speaker

void setup() {
  // Initialize the speaker pin as output
  pinMode(SPEAKER_PIN, OUTPUT);
}

void loop() {
  // Generate a beep sound
  beep(1000, 500); // Frequency: 1000 Hz, Duration: 500 ms
  delay(1000);     // Wait 1 second before the next beep
}

void beep(int frequency, int duration) {
  int period = 1000000 / frequency; // Period in microseconds
  int halfPeriod = period / 2;     // Half period for toggling HIGH/LOW

  unsigned long startTime = millis();
  while (millis() - startTime < duration) {
    digitalWrite(SPEAKER_PIN, HIGH);
    delayMicroseconds(halfPeriod);
    digitalWrite(SPEAKER_PIN, LOW);
    delayMicroseconds(halfPeriod);
  }
}
