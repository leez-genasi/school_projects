#include "WiFiS3.h"

// Global Variables //
const int trigPin = 3;
const int echoPin = 4;

const int motorPinREN = 11;
const int motorPinR1 = 10;
const int motorPinR2 = 9;

const int motorPinLEN = 5;
const int motorPinL1 = 6;
const int motorPinL2 = 7;

const int motorRightH = 100;
const int motorRightL = 0;

const int motorLeftH = 103;
const int motorLeftL = 0;

// Shift register pins
const int dataPin = 13;
const int latchPin = 8;
const int clockPin = 12;
const int resetPin = 2;

byte previousPulseCount = 0;
byte pulseCount = 0;
byte deltaPulse = 0;

const float wheelCircumference = 20.4;
float distancePerPulse = wheelCircumference / 4.0;

float distanceRightTravelled = 0;
float totalDistance = 0;

// TURN STATE
bool turning = false;
float turnStartDistance = 0;
float turnTarget = 0;
const float DIST_90 = 13.3 * 2.4;
const float DIST_270 = 39.9 * 3.4;

bool run = false;
bool obstacle = false;
String command = "";
float targetDistance = 0;
float startMoveDistance = 0;

int count = 0;

char ssid[] = "Linda";
char pass[] = "Lindaplswork";
int status = WL_IDLE_STATUS;

WiFiServer server(5200);
WiFiClient client;

float duration;
float distance;

// ================= MOTOR =================
void straight() {
  analogWrite(motorPinREN, motorRightH);
  analogWrite(motorPinLEN, motorLeftH);
  digitalWrite(motorPinR1, HIGH);
  digitalWrite(motorPinR2, LOW);
  digitalWrite(motorPinL1, HIGH);
  digitalWrite(motorPinL2, LOW);
}

void left() {
  analogWrite(motorPinREN, motorRightH);
  analogWrite(motorPinLEN, motorLeftL);
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

// ================= SENSOR =================
void sensor() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
}

// ================= COUNTER =================
byte readCounter() {
  byte dataIn = 0;
  digitalWrite(latchPin, HIGH);
  delayMicroseconds(20);
  digitalWrite(latchPin, LOW);
  dataIn = shiftIn(dataPin, clockPin, MSBFIRST);
  return dataIn;
}

void reset() {
  stop();
  digitalWrite(resetPin, HIGH);
  delay(5);
  digitalWrite(resetPin, LOW);
  delay(5);
  
  previousPulseCount = readCounter();
  pulseCount = previousPulseCount;
  deltaPulse = 0;
  distanceRightTravelled = 0;
  totalDistance = 0;
  turning = false;
  command = "";
}

// ================= DISTANCE =================
void updateDistance() {
  pulseCount = readCounter();
  if (pulseCount >= previousPulseCount) {
    deltaPulse = pulseCount - previousPulseCount;
  } else {
    deltaPulse = (256 - previousPulseCount) + pulseCount;
  }
  previousPulseCount = pulseCount;

  Serial.println(pulseCount);

  float deltaDist = deltaPulse * distancePerPulse;
  distanceRightTravelled += deltaDist;
  totalDistance += deltaDist;

  static unsigned long lastSend = 0;
  if (millis() - lastSend > 150 && client.connected()) {
    client.println("DIST:" + String(totalDistance));
    lastSend = millis();
  }
}

// ================= TURN EXECUTION =================
void executeTurn() {

  updateDistance(); // 🔥 moved inside turn

  float turned = distanceRightTravelled - turnStartDistance;

  if (turned < turnTarget) {
    left(); // keep turning
  } else {
    stop();
    turning = false;
    client.println("Turn Complete");
  }
}

// ================= SETUP =================
void setup() {

  Serial.begin(115200);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  pinMode(motorPinREN, OUTPUT);
  pinMode(motorPinR1, OUTPUT);
  pinMode(motorPinR2, OUTPUT);

  pinMode(motorPinLEN, OUTPUT);
  pinMode(motorPinL1, OUTPUT);
  pinMode(motorPinL2, OUTPUT);

  pinMode(dataPin, INPUT);
  pinMode(clockPin, OUTPUT);
  pinMode(latchPin, OUTPUT);
  pinMode(resetPin, OUTPUT);

  reset();

  Serial.print("Network named: ");
  Serial.println(ssid);
  status = WiFi.beginAP(ssid, pass);
  Serial.println("Network started");

  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
  server.begin();
}

// ================= LOOP =================
void loop() {
  if (!client || !client.connected()) {
    client = server.available();
  }

  if (client && client.available()) {
    String incoming = client.readStringUntil('\n');
    incoming.trim();

    if (incoming == "START") { run = true; }
    else if (incoming == "STOP") { 
      run = false; 
      stop(); 
    }
    else if (incoming == "RESET") { reset(); }
    else if (incoming.startsWith("DIST:")) {
      targetDistance = incoming.substring(5).toFloat();
    }
    else if (incoming == "FORWARD") {
      command = "FORWARD";
      startMoveDistance = distanceRightTravelled;
    }
    else if (incoming == "LEFT") {
      turning = true;
      turnTarget = DIST_90;
      turnStartDistance = distanceRightTravelled;
    }
    else if (incoming == "RIGHT") {
      turning = true;
      turnTarget = DIST_270;
      turnStartDistance = distanceRightTravelled;
    }
  }

  if (run) {
    count++;
    if (count >= 10) {
      sensor();
      duration = pulseIn(echoPin, HIGH, 30000);
      distance = (duration * 0.0343) / 2;

      // only update distance here if NOT turning
      if (!turning) {
        updateDistance();
      }

      count = 0;
    }

    if (distance < 30 && distance > 0) {
      stop();
      if (!obstacle) {
        obstacle = true;
        client.println("Obstacle Detected");
      }
    } 
    else {
      if (obstacle) {
        obstacle = false;
        client.println("Obstacle Removed");
      }

      if (turning) {
        executeTurn(); // 🔥 clean call
      } 
      else if (command == "FORWARD") {
        float moved = distanceRightTravelled - startMoveDistance;
        if (moved < targetDistance) {
          straight();
        } else {
          stop();
          command = "IDLE";
          client.println("Target Reached");
        }
      }
    }
  } else {
    stop();
  }
}