#include <ESP32Servo.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <HttpClient.h>

const char ssid[] = "Wokwi-GUEST";
const char password[] = "";

Servo myservo;         // Object servo untuk mengontrol servo
bool isLocked = false; // Status kunci
int pos = 0;           // Variabel untuk posisi servo
int counter = 0;       // Counter untuk durasi kunci
int pinServo = 13;
int triggerPin = 12;
int echoPin = 14;
int buzzer = 15;
long duration;
float distance;

SemaphoreHandle_t mutex = NULL;

// Task untuk menghitung waktu kunci otomatis terbuka setelah 10 detik
void vTimerTask(void *pvParameters) {
  for (;;) {
    if (isLocked) {
      counter++;
      if (counter == 10) { // Setelah 10 detik, buka kunci
        xSemaphoreTake(mutex, portMAX_DELAY);
        isLocked = false;
        xSemaphoreGive(mutex);
        counter = 0;
      }
    }
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}

// Task untuk membaca sensor ultrasonic
void sensorTask(void *pvParameters) {
  for (;;) {
    digitalWrite(triggerPin, LOW);
    delayMicroseconds(2);
    digitalWrite(triggerPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(triggerPin, LOW);

    
    duration = pulseIn(echoPin, HIGH);
    distance = duration * 0.034 / 2; /
    
    Serial.print("Distance: ");
    Serial.println(distance);

    if (distance < 10) { 
      xSemaphoreTake(mutex, portMAX_DELAY);
      isLocked = true;
      xSemaphoreGive(mutex);
    }
    
    vTaskDelay(500 / portTICK_PERIOD_MS); 
  }
}


void lockControlTask(void *pvParameters) {
  for (;;) {
    xSemaphoreTake(mutex, portMAX_DELAY);
    if (isLocked) {
      myservo.write(0); 
      digitalWrite(buzzer, HIGH); 
    } else {
      myservo.write(90); 
      digitalWrite(buzzer, LOW); 
    }
    xSemaphoreGive(mutex);

    vTaskDelay(100 / portTICK_PERIOD_MS); 
  }
}

void vDataUploadTask(void *pvParameters) {
  while (1) {
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin("http://server-url/upload_data"); // ganti dengan URL server

      // Buat data JSON dengan status lock dan waktu parkir
      String data = "{\"isLocked\": " + String(isLocked) + ", \"duration\": " + String(counter) + "}";

      http.addHeader("Content-Type", "application/json");
      int httpResponseCode = http.POST(data);

      if (httpResponseCode > 0) {
        Serial.println("Data uploaded to server");
      } else {
        Serial.println("Data upload failed");
      }
      http.end();
    }
    vTaskDelay(pdMS_TO_TICKS(10000)); // Upload setiap 10 detik
  }
}



void setup() {
  Serial.begin(115200);
  myservo.attach(pinServo);  
  pinMode(triggerPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzer, OUTPUT);


  mutex = xSemaphoreCreateMutex();
  if (mutex == NULL) {
    Serial.println("Gagal membuat mutex!");
    while (1);
  }

  
  xTaskCreate(vTimerTask, "TimerTask", 1000, NULL, 1, NULL);
  xTaskCreate(sensorTask, "SensorTask", 1000, NULL, 1, NULL);
  xTaskCreate(lockControlTask, "LockControlTask", 1000, NULL, 1, NULL);
  xTaskCreate(vDataUploadTask, "DataUploadTask", 1000, NULL, 1, NULL);


  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
}
