#include <Arduino.h>
#include <Hash.h>
#include <ESP8266WiFi.h>
#include "./DNSServer.h"  
#include <ESP8266WebServer.h>

#define LED     D2


/* Set these to your desired credentials. */
String flowerID = "1";
const byte DNS_PORT = 53;          // Capture DNS requests on port 53
DNSServer dnsServer;              // Create the DNS object
const char *ssid = "Flower 1";
unsigned int count = 0;

String key = "69696969";
String IP = "192.168.137.1:8080/";
IPAddress apIP(192, 168, 4, 1);

unsigned int pollen = 100;
bool pollen_updated = false;

ESP8266WebServer server(80);


void handleRoot() {

  server.send(200, "text/html", "<a style=\"color:orange;text-decoration:none;display:block;width:70vw;heigth:20vh;margin:10vh auto;padding-bottom:10vh;padding-top:10vh;text-align:center;font-size:7vh;border:thick solid;\" href=\"/collect\">Collect Pollen</button>");
}
void handleCollect() {
  count++;
  String values = flowerID + ',' + String(count) + ',' + String(pollen) + ',';
  
  String msg = "http://" + IP + "deposit/?token=" + values + sha1(values + key);
  server.send(200, "text/html", "<a style=\"color:orange;text-decoration:none;display:block;width:70vw;heigth:20vh;margin:10vh auto;padding-bottom:10vh;padding-top:10vh;text-align:center;font-size:7vh;border:thick solid;\" href=\"" + msg + "\">Drop Pollen</a><style>a:hover{background-color:gold;}</style> <br>><p style=\"text-align:center;font-size:40pt;\">You got " + String(pollen) + " pollen!</p>");

  pollen = 0;
}

void setup() {
  pinMode(LED, OUTPUT);   // LED pin as output. 
  
  delay(1000);
  Serial.begin(115200);
  Serial.println();
  Serial.print("Configuring access point...");
  /* You can remove the password parameter if you want the AP to be open. */
  WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
  WiFi.softAP(ssid);


  dnsServer.start(DNS_PORT, "*", apIP);
    
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
  
  server.on("/", handleRoot);
  server.on("/collect", handleCollect);
  
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  dnsServer.processNextRequest();
  server.handleClient();
  
  if( millis() % 1000 == 0 && pollen < 100){
    if(!pollen_updated){
      pollen_updated = true;
      pollen++;

      int val = map(pollen, 10, 100, 1023, 0);
      analogWrite(LED, val);
    }
    
  }else{
    pollen_updated = false;
  }
}
