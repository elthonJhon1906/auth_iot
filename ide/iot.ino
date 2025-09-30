#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>   // untuk parsing JSON

// WiFi
const char* ssid = "KOSAN AZZAHRA";
const char* pass = "semogaberkah";

// Ultrasonic pins
#define TRIG D0
#define ECHO D1

// LED jarak
#define LED1 D2
#define LED2 D3
#define LED3 D4

#define TV_PIN D7
#define BUZZER D6

// Server backend
String serverDistance = "http://192.168.1.16:3000/api/distance_1"; // gunakan IP PC
String serverControl  = "http://192.168.1.16:3000/api/controller";

// Relay aktif LOW?
bool relayActiveHigh = true;

// WiFi client global
WiFiClient client;

void setup() {
  Serial.begin(115200);

  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(TV_PIN, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  // Connect WiFi
  WiFi.begin(ssid, pass);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected!");
  Serial.println(WiFi.localIP());
}

void loop() {
  long duration, distance;

  // --- Ultrasonic ---
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);

  duration = pulseIn(ECHO, HIGH);
  distance = (duration * 0.034) / 2;

  String status = "";
  if (distance < 10) {
    digitalWrite(LED1,HIGH); digitalWrite(LED2,HIGH); digitalWrite(LED3,HIGH);
    tone(BUZZER, 10000); delay(350); noTone(BUZZER);
    status = "DEKAT";
  } else if (distance < 20) {
    digitalWrite(LED1,HIGH); digitalWrite(LED2,HIGH); digitalWrite(LED3,LOW);
    tone(BUZZER, 1000); delay(450); noTone(BUZZER);
    status = "SEDANG";
  } else {
    digitalWrite(LED1,HIGH); digitalWrite(LED2,LOW); digitalWrite(LED3,LOW);
    tone(BUZZER, 400); delay(550); noTone(BUZZER);
    status = "JAUH";
  }

  // --- Kirim data ultrasonic ---
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(client, serverDistance); // pakai global client
    http.addHeader("Content-Type", "application/json");

    String json = "{\"jarak\":" + String(distance) + ",\"status\":\"" + status + "\"}";
    int httpCode = http.POST(json);

    if (httpCode > 0) Serial.println("Data terkirim: " + json);
    else Serial.println("Error send: " + String(httpCode));

    http.end();
  } else {
    Serial.println("WiFi not connected");
  }

  // --- Ambil status TV dari backend ---
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(client, serverControl);
    int httpCode = http.GET();

    if (httpCode == 200) {
      String payload = http.getString();
      Serial.println("Control data: " + payload);

      StaticJsonDocument<128> doc;
      DeserializationError error = deserializeJson(doc, payload);

      if (!error) {
        int tv = doc["tv_status"]; // sesuai backend

        if (relayActiveHigh) digitalWrite(TV_PIN, tv ? HIGH : LOW);
        else digitalWrite(TV_PIN, tv ? LOW : HIGH);

        Serial.printf("TV status set ke: %d\n", tv);
      } else {
        Serial.print("JSON parse error: "); Serial.println(error.c_str());
      }
    } else {
      Serial.println("Error GET control: " + String(httpCode));
    }

    http.end();
  }

  delay(1000);
}
