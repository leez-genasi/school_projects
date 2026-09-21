import processing.net.*; 
Client myClient; 
String data; 
void setup() { 
  myClient = new Client(this,
    "192.168.4.1",5200); 
  println("Connected to Arduino");
  myClient.write("Hello World");
} 

void draw() { 
  data = myClient.readString(); 
  print("Data: "); println(data); 
  delay(500); 
} 
