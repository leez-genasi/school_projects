import processing.net.*;
import controlP5.*;

Client myClient;
ControlP5 cp5;

String statusMessage = "Waiting...";

String tempMessage = "";        // for Turning Left/Right
int tempMessageTime = 0;
int tempDuration = 1500;        // 1.5 seconds

String liveDistance = "0";

boolean obstacle = false;
boolean running = true;
boolean isConnected = false;

int reconnectTimer = 0;
int targetDistance = 0;

void setup() { 
  size(500, 420);
  
  cp5 = new ControlP5(this);

  connectToArduino();

  cp5.addButton("START")
     .setPosition(75, 70)
     .setSize(100, 40);

  cp5.addButton("STOP")
     .setPosition(75, 130)
     .setSize(100, 40);
   
  cp5.addButton("RESET")
     .setPosition(75, 190)
     .setSize(100, 40);
     
  cp5.addButton("FORWARD")
     .setPosition(275, 70)
     .setSize(100, 40);
     
  cp5.addButton("LEFT")
     .setPosition(215, 130)
     .setSize(100, 40);
  
  cp5.addButton("RIGHT")
     .setPosition(335, 130)
     .setSize(100, 40);
     
  cp5.addButton("PAUSE")
     .setPosition(275, 190)
     .setSize(100, 40);
     
  cp5.addTextfield("distanceInput")
   .setPosition(275, 30)
   .setSize(100, 30)
   .setAutoClear(false)
   .setLabel("Distance (cm)");
  fill(255);
  text("Distance (cm)", 275, 20);
}

void draw() { 
  background(30);

  checkConnection();
  drawConnectionStatus();
  drawBuggyStatus();

  readArduino();
}

void readArduino() {

  if (isConnected && myClient.available() > 0) {

    String msg = myClient.readStringUntil('\n');

    if (msg != null) {
      msg = trim(msg);
      println(msg);

      // Temporary messages
      if (msg.equals("Turning Left") || msg.equals("Turning Right")) {
        tempMessage = msg;
        tempMessageTime = millis();
        return;   // don't overwrite main status
      }
      
      // Distance update
      if (msg.startsWith("DIST:")) {
        String value = msg.substring(5);
        liveDistance = value;
        return;   // don't overwrite status
      }

      // Persistent states
      if (msg.equals("Obstacle Detected")) {
        obstacle = true;
        statusMessage = msg;
      }
      else if (msg.equals("Obstacle Cleared")) {
        obstacle = false;
        statusMessage = msg;
      }
      else {
        statusMessage = msg;
      }
    }
  }
}


void connectToArduino() {
  try {
    myClient = new Client(this, "192.168.4.1", 5200);
    isConnected = true;
  } catch(Exception e) {
    isConnected = false;
  }
}

void checkConnection() {

  if (myClient == null || !myClient.active()) {
    isConnected = false;

    if (millis() - reconnectTimer > 3000) {
      println("Attempting reconnect...");
      try {
        myClient = new Client(this, "192.168.4.1", 5200);
        isConnected = true;
        println("Reconnected!");
      } catch(Exception e) {
        println("Reconnect failed.");
      }
      reconnectTimer = millis();
    }
  }
  else {
    isConnected = true;
  }
}


void drawConnectionStatus() {
  fill(isConnected ? color(0,200,0) : color(200,0,0));
  ellipse(25,25,15,15);
  fill(255);
  text("Connection", 45,30);
}

void drawBuggyStatus() {

  fill(0);
  rect(50, 260, 400, 120);

  textSize(16);
  fill(255);
  text("Buggy Status:", 60, 285);

  // Indicator color
  if (!running) {
    fill(255, 200, 0);
  }
  else if (obstacle) {
    fill(255, 0, 0);
  }
  else {
    fill(0, 255, 0);
  }

  ellipse(420, 285, 18, 18);

  // Main persistent message
  fill(0,255,0);
  text(statusMessage, 60, 315);

  // Temporary turning message
  if (millis() - tempMessageTime < tempDuration) {
    fill(0,150,255);
    text(tempMessage, 60, 345);
  }
  
  fill(255);
  textSize(16);
  text("Distance Travelled: " + liveDistance + " cm", 60, 370);
}


// BUTTONS

public void START() {
  if (isConnected) {
    myClient.write("START\n");
    running = true;
    statusMessage = "Sent START";
  }
}

public void STOP() {
  if (isConnected) {
    myClient.write("STOP\n");
    running = false;
    statusMessage = "Sent STOP";
  }
}

public void RESET() {
  if (isConnected) {
    myClient.write("RESET\n");
    running = true;
    statusMessage = "Sent RESET";
  }
}

public void FORWARD() {

  if (isConnected) {

    String input = cp5.get(Textfield.class, "distanceInput").getText();

    if (input != null && input.length() > 0) {

      targetDistance = int(input);

      // Send distance first
      myClient.write("DIST:" + targetDistance + "\n");

      // Then send forward command
      myClient.write("FORWARD\n");

      running = true;
      statusMessage = "Forward " + targetDistance + " cm";
    }
  }
}

public void RIGHT() {
  if (isConnected) {
    myClient.write("RIGHT\n");
    running = true;
    statusMessage = "Sent RIGHT";
  }
}

public void LEFT() {
  if (isConnected) {
    myClient.write("LEFT\n");
    running = true;
    statusMessage = "Sent LEFT";
  }
}

public void PAUSE() {
  if (isConnected) {
    myClient.write("PAUSE\n");
    running = true;
    statusMessage = "Sent PAUSE";
  }
}
