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
const int sensorPinRight = A0;
const int sensorPinLeft = A1;

const int motorRightH = 240;
const int motorRightTurnH = 200;
const int motorRightL = 70;

const int motorLeftH = 250;
const int motorLeftTurnH = 200;
const int motorLeftL = 75;

bool run = false; 
bool obstacle = false;

const int test = 0;

int count = 0;
char ssid[] = "Linda";
char pass[] = "Lindaplswork";
WiFiServer server(5200);
WiFiClient client;

int status = WL_IDLE_STATUS;

float duration;
float distance;

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

  pinMode(sensorPinRight, INPUT);
  pinMode(sensorPinLeft, INPUT);

  Serial.print("Network named: ");  // Starting an access point
  Serial.println(ssid);
  status = WiFi.beginAP(ssid, pass);
  Serial.println("Network started");

  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
  server.begin();  // Starting a server

  pinMode(test, INPUT);
}

void straight() {
  analogWrite(motorPinREN, motorRightH);
  analogWrite(motorPinLEN, motorLeftH);

  digitalWrite(motorPinR1, HIGH);  // pin 10
  digitalWrite(motorPinR2, LOW);   // pin 9
  digitalWrite(motorPinL1, HIGH);  // pin 6
  digitalWrite(motorPinL2, LOW);   // pin 7
}

void right() {
  analogWrite(motorPinREN, motorRightTurnH);
  analogWrite(motorPinLEN, motorLeftL);

  digitalWrite(motorPinR1, HIGH);  // pin 10
  digitalWrite(motorPinR2, LOW);   // pin 9
  digitalWrite(motorPinL1, HIGH);  // pin 6
  digitalWrite(motorPinL2, LOW);   // pin 7
}

void left() {
  analogWrite(motorPinREN, motorRightL);
  analogWrite(motorPinLEN, motorLeftTurnH);

  digitalWrite(motorPinR1, HIGH);  // pin 10
  digitalWrite(motorPinR2, LOW);   // pin 9
  digitalWrite(motorPinL1, HIGH);  // pin 6
  digitalWrite(motorPinL2, LOW);   // pin 7
}

void stop() {
  // brakes the buggy
  digitalWrite(motorPinREN, LOW);
  digitalWrite(motorPinLEN, LOW);

  digitalWrite(motorPinR1, LOW);  // pin 10
  digitalWrite(motorPinR2, LOW);  // pin 9
  digitalWrite(motorPinL1, LOW);  // pin 6
  digitalWrite(motorPinL2, LOW);  // pin 7
}

void sensor() {
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(100);
  digitalWrite(trigPin, LOW); 
}

void loop() {
  // Serial.println("");
  if (!client || !client.connected()) {
    client = server.available();
  }

  if (client && client.available()) {
    String command = client.readStringUntil('\n');
    command.trim();

    Serial.print("Received: ");
    Serial.println(command);

    if (command == "START") {
      Serial.println("Motor Running");
      client.println("Started");
      run = true;
    }

    if (command == "STOP") {
      Serial.println("Motor Stopped");
      client.println("Stopped");
      run = false;
    }
  }
  
  if (run) {
    // Ultrasonic Sensor
    count++;
    if (count==10){
      sensor();
      count = 0;
      
      duration = pulseIn(echoPin, HIGH, 30000);
      distance = (duration * .0343) / 2;
    }

    // Serial.print("Distance (cm):" );
    // Serial.println(distance);

    // IR Sensor
    bool sensorRight = digitalRead(sensorPinRight);  // black - HIGH
    bool sensorLeft = digitalRead(sensorPinLeft);    // white - LOW

    // Movement
    if (distance < 30) {
      // Serial.print(" Stop ");
      // Serial.print(distance);
      sensor(); // pings sensor immediately
      duration = pulseIn(echoPin, HIGH, 30000);
      distance = (duration * .0343) / 2;
      if (distance < 30) {
        stop();
        if (!obstacle) {
          obstacle = true;
          if (client.connected()) {
            client.write("Obstacle Detected\n");
          }
        }
      }
    } 
    else {
      if (obstacle) { 
        obstacle = false;
        if (client.connected()) {
          client.write("Obstacle Removed\n");
        }
      }

      if (sensorRight == 1 && sensorLeft == 1) {
        // Serial.print("Straight ");
        straight();
      } 
      else if (sensorRight == 1 && sensorLeft == 0) {
        // Serial.print("Right ");
        right();
        if (client.connected()) {
          client.write("Turning Left\n");
        }
      } 
      else if (sensorRight == 0 && sensorLeft == 1) {
        // Serial.print("Left ");
        left();
        if (client.connected()) {
          client.write("Turning Right\n");
        }
      } 
      else if (sensorRight == 0 && sensorLeft == 0) {
        // Serial.print("Spin ");
        right();
      }
    }
  }
  else { stop(); }

  
  // voltmeter pin
  // int pinState = digitalRead(test);
  // if (pinState == HIGH) {
  //   Serial.print("HIGH ");
  // } else {
  //   Serial.print("LOW ");
  // };
}