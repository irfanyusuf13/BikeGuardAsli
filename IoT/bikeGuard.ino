#include <ESP32Servo.h>
#include <WiFi.h>
#include <WiFiClient.h>
const char ssid[] = "Wokwi-GUEST";
const char password[] = "";

Servo myservo;
bool isLocked = false;
int pos = 0;
int counter = 0;
int pinServo = 13;
int triggerPin = 32;
int echoPin = 34;
int buzzer = 15;
int buttonPin = 25; // Pin untuk button
long duration;
float distance;
bool isBikePresent = false; // Variabel untuk mendeteksi keberadaan sepeda

SemaphoreHandle_t mutex = NULL;

// Variabel untuk debounce button
int buttonState = LOW;
int lastButtonState = LOW;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;

void vTimerTask(void *pvParameters) {
  for (;;) {
    if (isLocked) {
      counter++;
      if (counter == 10) { // Setelah 10 detik, buka kunci otomatis
        xSemaphoreTake(mutex, portMAX_DELAY);
        isLocked = false;
        counter = 0;
        xSemaphoreGive(mutex);
      }
    }
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}

// Task untuk membaca sensor ultrasonic dan mendeteksi sepeda
void sensorTask(void *pvParameters) {
  for (;;) {
    digitalWrite(triggerPin, LOW);
    delayMicroseconds(2);
    digitalWrite(triggerPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(triggerPin, LOW);

    duration = pulseIn(echoPin, HIGH);
    distance = duration * 0.034 / 2; // Menghitung jarak

    Serial.print("Distance: ");
    Serial.println(distance);

    // Ambang batas jarak untuk mendeteksi sepeda (misalnya 10 cm)
    if (distance < 10) {
      xSemaphoreTake(mutex, portMAX_DELAY);
      isBikePresent = true; // Sepeda terdeteksi
      xSemaphoreGive(mutex);
    } else {
      xSemaphoreTake(mutex, portMAX_DELAY);
      isBikePresent = false; // Sepeda tidak terdeteksi
      xSemaphoreGive(mutex);
    }

    vTaskDelay(500 / portTICK_PERIOD_MS);
  }
}

// Task untuk membaca tombol dan mengontrol lock/unlock
void buttonTask(void *pvParameters) {
  for (;;) {
    int reading = digitalRead(buttonPin);

    if (reading != lastButtonState) {
      lastDebounceTime = millis();
    }

    if ((millis() - lastDebounceTime) > debounceDelay) {
      if (reading != buttonState) {
        buttonState = reading;

        if (buttonState == HIGH) {
          xSemaphoreTake(mutex, portMAX_DELAY);
          isLocked = !isLocked; // Toggle lock/unlock
          xSemaphoreGive(mutex);
        }
      }
    }

    lastButtonState = reading;

    vTaskDelay(50 / portTICK_PERIOD_MS);
  }
}

// Task untuk mengontrol servo dan buzzer
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

void setup() {
  Serial.begin(115200);
  myservo.attach(pinServo);  
  pinMode(triggerPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzer, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP); // Gunakan INPUT_PULLUP untuk button

  mutex = xSemaphoreCreateMutex();
  if (mutex == NULL) {
    Serial.println("Gagal membuat mutex!");
    while (1);
  }

  xTaskCreate(vTimerTask, "TimerTask", 1000, NULL, 1, NULL);
  xTaskCreate(sensorTask, "SensorTask", 1000, NULL, 1, NULL);
  xTaskCreate(buttonTask, "ButtonTask", 1000, NULL, 1, NULL);
  xTaskCreate(lockControlTask, "LockControlTask", 1000, NULL, 1, NULL);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  if (isBikePresent) {
    Serial.println("Sepeda terdeteksi di lokasi parkir.");
  } else {
    Serial.println("Lokasi parkir kosong.");
  }
  delay(1000); 
}
