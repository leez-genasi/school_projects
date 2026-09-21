// #include "WiFiS3.h"

// char ssid[] = "Linda"; 
// char pass[] = "Lindaplswork"; 

// int status = WL_IDLE_STATUS;
// WiFiServer server(5200); 


// void setup() {
// 	Serial.begin (115200);
	
// 	Serial.print ("Network named: ");  // Starting an access point
// 	Serial.println (ssid);
// 	status = WiFi.beginAP (ssid, pass);
// 	Serial.println ("Network started");

// 	IPAddress ip = WiFi.localIP ();
// 	Serial.print ("IP Address: ");   
// 	Serial.println (ip);
// 	server.begin();     // Starting a server
// }

// void loop() { 
// 	String msg;
// 	WiFiClient client = server.available ();  
// 	if ( client.connected () ) {
// 		client.write("Hello Client\n"); 
// 		msg = client.readString();
// 		Serial.println(msg); 
// 	} 
// 	delay(1000);
// }
