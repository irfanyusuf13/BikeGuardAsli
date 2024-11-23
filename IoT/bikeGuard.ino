#define BLYNK_TEMPLATE_ID "TMPL6hql2uTNs"
#define BLYNK_TEMPLATE_NAME "Button Lock and Unlock"
#define BLYNK_AUTH_TOKEN "rqQu0JXfFPM106lHE90gpShcMxHQwNPV"

#include <ESP32Servo.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>

const char ssid[] = "Wokwi-GUEST";
const char password[] = "";

Servo myservo;
bool isLocked = false;
bool lastLockState = false; // Variabel untuk melacak perubahan status
int pos = 0;
int pinServo = 13;
int triggerPin = 32;
int echoPin = 34;
int buzzer = 15;
int buttonPin = 5; 
long duration;
float distance;
bool isBikePresent = false; 

SemaphoreHandle_t mutex = NULL;

// Variabel untuk debounce button
int buttonState = LOW;
int lastButtonState = LOW;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;

// Variabel tambahan untuk mengurangi spam pencetakan jarak
float lastDistance = -1; // Inisialisasi dengan nilai yang tidak mungkin
unsigned long lastDistancePrintTime = 0;
const unsigned long distancePrintInterval = 2000; // Cetak setiap 2 detik jika tidak berubah signifikan

// Blynk button handler
BLYNK_WRITE(V0) {
  xSemaphoreTake(mutex, portMAX_DELAY);
  isLocked = param.asInt(); // Ambil nilai button dari Blynk
  xSemaphoreGive(mutex);
}

// Task untuk membaca sensor ultrasonik dan mendeteksi sepeda
void sensorTask(void *pvParameters) {
  for (;;) {
    digitalWrite(triggerPin, LOW);
    delayMicroseconds(2);
    digitalWrite(triggerPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(triggerPin, LOW);

    duration = pulseIn(echoPin, HIGH);
    distance = duration * 0.034 / 2; // Menghitung jarak

    xSemaphoreTake(mutex, portMAX_DELAY);
    if (distance < 200) {
      isBikePresent = true; // Sepeda terdeteksi
    } else {
      isBikePresent = false; // Sepeda tidak terdeteksi
    }

    // Cetak jarak hanya jika berubah signifikan atau pada interval waktu tertentu
    unsigned long currentMillis = millis();
    if (abs(distance - lastDistance) > 1 || 
        currentMillis - lastDistancePrintTime >= distancePrintInterval) {
      Serial.print("Distance: ");
      Serial.println(distance);
      lastDistance = distance; // Perbarui jarak terakhir
      lastDistancePrintTime = currentMillis; // Perbarui waktu cetak terakhir
    }
    xSemaphoreGive(mutex);

    vTaskDelay(500 / portTICK_PERIOD_MS);
  }
}

// Task untuk membaca tombol fisik dan mengontrol lock/unlock
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

// Task untuk mengontrol servo, buzzer, dan status kunci
void lockControlTask(void *pvParameters) {
  for (;;) {
    xSemaphoreTake(mutex, portMAX_DELAY);
    if (isLocked) {
      myservo.write(0);       // Kunci
      digitalWrite(buzzer, HIGH); // Aktifkan buzzer

      if (lastLockState != isLocked) { // Hanya tampilkan jika status berubah
        Serial.println("Sepeda sedang terkunci.");
        lastLockState = isLocked;
      }
    } else {
      myservo.write(90);      // Buka kunci
      digitalWrite(buzzer, LOW);  // Nonaktifkan buzzer

      if (lastLockState != isLocked) { // Hanya tampilkan jika status berubah
        Serial.println("Sepeda terbuka.");
        lastLockState = isLocked;
      }
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

  xTaskCreate(sensorTask, "SensorTask", 1000, NULL, 1, NULL);
  xTaskCreate(buttonTask, "ButtonTask", 1000, NULL, 1, NULL);
  xTaskCreate(lockControlTask, "LockControlTask", 1000, NULL, 1, NULL);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, password);
}

void loop() {
  Blynk.run(); // Menjaga koneksi Blynk tetap berjalan

  xSemaphoreTake(mutex, portMAX_DELAY);
  if (isBikePresent) {
    Serial.println("Sepeda terdeteksi di lokasi parkir.");
  } else {
    Serial.println("Lokasi parkir kosong.");
  }
  xSemaphoreGive(mutex);

  delay(1000); 
}
