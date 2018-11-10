#include <Arduino.h>
#include <Hash.h>
#include <ESP8266WiFi.h>

#include <WiFiClient.h>
#include <ESP8266WebServer.h>

#define LED     2


/* Set these to your desired credentials. */
String flowerID = "1";
const char *ssid = "Flower 1";
unsigned int count = 0;

String key = "69696969";
String IP = "192.168.4.1";

unsigned int pollen = 100;
bool pollen_updated = false;

ESP8266WebServer server(80);

/* Just a little test message.  Go to http://192.168.4.1 in a web browser
   connected to this access point to see it.
*/
void handleRoot() {
  count++;
  String values = flowerID + ',' + String(count) + ',' + String(pollen) + ',';
  
  String msg = "http://" + IP + "/" + values + sha1(values + key);
  server.send(200, "text/html", "<h1>" + msg + "</h1>");

  pollen = 0;  
  delay(250);
}

void setup() {
  pinMode(LED, OUTPUT);   // LED pin as output. 
  
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
  
  if( millis() % 1000 == 0 && pollen < 100){
    if(!pollen_updated){
      pollen_updated = true;
      pollen++;

      int val = map(pollen, 0, 100, 1023, 0);
      analogWrite(LED, val);
    }
    
  }else{
    pollen_updated = false;
  }
}
