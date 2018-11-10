
#include <Arduino.h>
#include <Hash.h>
#include <ESP8266WiFi.h>

#include <WiFiClient.h>
#include <ESP8266WebServer.h>

/* Set these to your desired credentials. */
const char *ssid = "ESPap";
unsigned int count = 0;

String key = "69696969";
String IP = = "192.168.4.1";
unsigned int pollen = 100;

ESP8266WebServer server(80);

/* Just a little test message.  Go to http://192.168.4.1 in a web browser
   connected to this access point to see it.
*/
void handleRoot() {
  count++;
  String values = flowerId + ',' + String(count) + ',' + String(pollen) + ',';
  
  String msg = "http://" + IP + "/" + values + ',' + sha1(values + key);
  server.send(200, "text/html", "<h1>" + msg + "</h1>");
  
  delay(250);
}

void setup() {
  delay(1000);
  Serial.begin(115200);
  Serial.println();
  Serial.print("Configuring access point...");
  /* You can remove the password parameter if you want the AP to be open. */
  WiFi.softAP(ssid);

  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
  
  server.on("/", handleRoot);
  
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}
