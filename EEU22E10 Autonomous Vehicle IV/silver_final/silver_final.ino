#include "WiFiS3.h"

// Global Variables
// Sensor Pins
const int trigPin = 3;
const int echoPin = 4;

float duration;
float distance;

// Motor Pins
const int motorPinREN = 11;
const int motorPinR1 = 10;
const int motorPinR2 = 9;

const int motorPinLEN = 5;
const int motorPinL1 = 6;
const int motorPinL2 = 7;

// Motor Speeds
const int motorTurnH = 120;

const int ConstMotorRH = 117;
int motorRH = ConstMotorRH;
const int motorRL = 0;

const int ConstMotorLH = 128;
int motorLH = ConstMotorLH;
const int motorLL = 0;

// Shift Register Pins
const int dataPin = 13;
const int latchPin = 8;
const int clockPin = 12;
const int resetPin = 1;

// Interrupt
const int interruptPin = 2;
volatile int interruptCount = 0;
int leftCount = 0;

// Wheel Encoder Data
const float wheelCircumference = 20.8;
const float distancePerPulse = wheelCircumference / 8.0;
float distanceRightTravelled = 0;
float offsetRight = 0;
float distanceLeftTravelled = 0;
float totalDistance = 0;
float targetDistance = 0;

byte previousPulseCount;
byte pulseOffset = 0;
byte pulseCount;
byte deltaPulse;

float quarterDistance = 7.4;
float turnLeftDistance = quarterDistance;
float turnRightDistance = quarterDistance * 3.85;

// Run States
bool run = false;
bool obstacle = false;
String command = "";

int count = 0;

// Server
char ssid[] = "Linda";
char pass[] = "Lindaplswork";
int status = WL_IDLE_STATUS;

WiFiServer server(5200);
WiFiClient client;


void setup() {

  Serial.begin(115200);
  // I/O Decln
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
  pinMode(motorPinREN, OUTPUT);
  pinMode(motorPinR1, OUTPUT);
  pinMode(motorPinR2, OUTPUT);
  pinMode(motorPinLEN, OUTPUT);
  pinMode(motorPinL1, OUTPUT);
  pinMode(motorPinL2, OUTPUT);

  pinMode(dataPin, INPUT);
  pinMode(latchPin, OUTPUT);
  pinMode(clockPin, OUTPUT);
  pinMode(resetPin, OUTPUT);

  attachInterrupt(digitalPinToInterrupt(interruptPin), ISR, CHANGE);

  // Server
  Serial.print("Network Named: ");
  Serial.println(ssid);

  status = WiFi.beginAP(ssid, pass);
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
  server.begin();

  reset();
}

// Execute Ultrasonic Sensor
void sensor() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH, 30000);
  distance = (duration * 0.0343) / 2;
}

// Distance Measurement //
// Interrupt
void ISR() {
  interruptCount++;
}

// Reset 4040 Counter
void softReset() {
  digitalWrite(resetPin, HIGH);
  delay(5);
  digitalWrite(resetPin, LOW);
  delay(2);

  deltaPulse = 0;
  previousPulseCount = 0;
  pulseOffset = readCounter();
  pulseCount = readCounter() - pulseOffset;
  updateDistance();
  offsetRight = distanceRightTravelled;
  distanceRightTravelled = 0;
  interruptCount = 0;
  distanceLeftTravelled = 0;
}

void reset() {
  softReset();
  totalDistance = 0;
  motorRH = ConstMotorRH;
  motorLH = ConstMotorLH;
}

// Read 4040 Counter
byte readCounter() {
  byte dataIn = 0;
  digitalWrite(latchPin, LOW);
  delayMicroseconds(20);
  digitalWrite(latchPin, HIGH);
  delayMicroseconds(20);
  digitalWrite(latchPin, LOW);

  dataIn = shiftIn(dataPin, clockPin, MSBFIRST);

  Serial.println(dataIn, BIN);

  return dataIn;
}

// Distance Calculations
void updatePulse() {
  pulseCount = readCounter() - pulseOffset;
  
  if (pulseCount > previousPulseCount) {
    deltaPulse = pulseCount - previousPulseCount;
  } 
  else { // Overflow bits
    deltaPulse = (256 - previousPulseCount) + pulseCount;
  }
  if (deltaPulse > 20) {
    deltaPulse = 0; // ignore the measurement
  }
  previousPulseCount = pulseCount;
}

void updateDistance() {
  updatePulse();
  distanceRightTravelled += (deltaPulse * distancePerPulse);
  leftCount = interruptCount;
  distanceLeftTravelled = leftCount * distancePerPulse;
  
  totalDistance = (distanceLeftTravelled + distanceRightTravelled) / 2;


  static unsigned long lastSend = 0;
  if (millis() - lastSend > 150 && client.connected()) {
    client.println("DIST:" + String(distanceRightTravelled) + " " + String(distanceLeftTravelled) + " " + String(totalDistance));
    lastSend = millis();
  }
}

// Movement
// Turning
void turn(float turnTarget) {
  softReset();
  float turned = 0;
  Serial.print("turnTarget: ");
  Serial.println(turnTarget);

  while (turned < turnTarget) {
    analogWrite(motorPinREN, motorTurnH);
    analogWrite(motorPinLEN, motorTurnH);

    digitalWrite(motorPinR1, HIGH);
    digitalWrite(motorPinR2, LOW);
    digitalWrite(motorPinL1, LOW);
    digitalWrite(motorPinL2, HIGH);

    int leftCount = interruptCount;
    turned = (leftCount * distancePerPulse);
    Serial.print(leftCount);
    Serial.print("\t");
    Serial.println(turned);
    delay(5);
  }

  Serial.println("Turn Completed");
  if (client.connected()) {
    client.write("Turn Completed");
  }
  softReset();
  stop();
}

void straight() {
  analogWrite(motorPinREN, motorRH);
  analogWrite(motorPinLEN, motorLH);

  digitalWrite(motorPinR1, HIGH);
  digitalWrite(motorPinR2, LOW);
  digitalWrite(motorPinL1, HIGH);
  digitalWrite(motorPinL2, LOW);
}

void stop() {
  digitalWrite(motorPinREN, LOW);
  digitalWrite(motorPinLEN, LOW);
  
  digitalWrite(motorPinR1, LOW);
  digitalWrite(motorPinR2, LOW);
  digitalWrite(motorPinL1, LOW);
  digitalWrite(motorPinL2, LOW);
}

void loop() {
  if (!client || !client.connected()) {
    client = server.available();
  }
  if (client && client.available()) {
    command = client.readStringUntil('\n');
    command.trim();
    Serial.print("COMMAND:");
    Serial.println(command);

    if (command == "START") { 
      run = true;
      Serial.println("STARTED");
    }
    else if (command == "STOP") { 
      run = false; 
      Serial.println("STOPPED");
    }
    else if (command == "RESET") { 
      reset(); 
      Serial.println("RESET");
    }
    else if (command.startsWith("DIST:")) {
      targetDistance = command.substring(5).toFloat();
      Serial.print("DIST:");
      Serial.print(targetDistance);
      Serial.println("cm");

      softReset();
    }
  }

  if (run) {
    count++;
    if (count == 10) {
      sensor();
      updateDistance();

      // Debugging
      Serial.print("pulseCount: ");
      Serial.println(pulseCount);
      Serial.print("distanceRightTravelled: ");
      Serial.println(distanceRightTravelled);
      Serial.print("interruptCount: ");
      Serial.println(interruptCount);
      Serial.print("distanceLeftTravelled: ");
      Serial.println(distanceLeftTravelled);
      Serial.print("totalDistance: ");
      Serial.println(totalDistance);
      Serial.print("motorRH: ");
      Serial.println(motorRH);
      Serial.print("motorLH: ");
      Serial.println(motorLH);
      Serial.println("");

      count = 0;
    }

    if (distance < 30 && distance > 0) {
      stop();
      if (!obstacle) {
        obstacle = true;
        client.write("Obstacle Detected");
      }
    }
    else {
      if (obstacle) {
        obstacle = false;
        client.write("Obstacle Removed");
      }
      if (command == "LEFT") {
        turn(turnLeftDistance);
        motorRH = ConstMotorRH;
        command = "";
      }
      else if (command == "RIGHT") {
        turn(turnRightDistance);
        motorLH = ConstMotorLH;
        command = "";
      }
      else if (command == "PAUSE") {
        stop();
      }
      else if (command == "FORWARD") {
        // Serial.println("Moving");
        // Serial.println(totalDistance);
        if (totalDistance < targetDistance) {
            int rightCount = (int)pulseCount;
          while (leftCount > 255) {
            leftCount -= 255;
          }

          if (leftCount - rightCount > 1) {
            motorLH = 0;
            straight();
            delay(5);
            motorLH = ConstMotorLH;
          }
          else if (rightCount - leftCount > 1) {
            motorRH = 0;
            straight();
            delay(5);
            motorRH = ConstMotorRH;
          }
          straight();
        } else { 
          command = "";
          stop(); 
        }
      }
    }
  } else { stop(); }
}
