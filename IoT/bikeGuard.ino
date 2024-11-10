#include <ESP32Servo.h>
#include <WiFi.h>
#include <WifiClient.h>



const char ssid[] = "Wokwi-GUEST";
const char password[] = "";

Servo myservo;  // create servo object to control a servo

bool isLocked = false;
int pos = 0;    // variable to store the servo position
int counter = 0;
int pinServo = 13;
int triggerPin = 12;
int echoPin = 14;
int buzzer = 15;
long duration;
float distance;

SemaphoreHandle_t mutex = NULL;



void vTimerTask( void * pvParameters )
{
  for(;;)
  {
    if (isLocked)
    {
      counter++;
      if (counter == 10)
      {
        isLocked = false;
        counter = 0;
      }
    }
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}


void sensorTask (void * pvParameters)
{
  for(;;)
  {
    digitalWrite(triggerPin, LOW);
    delayMicroseconds(2);
    digitalWrite(triggerPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(triggerPin, LOW);
    duration = pulseIn(echoPin, HIGH);
    distance = duration * 0.034 / 2;
    Serial.print("Distance: ");
    Serial.println(distance);
    if (distance < 10)
    {
      isLocked = true;
    }
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}


void setup() {
  Serial.begin(115200);
  myservo.attach(pinServo);  // attaches the servo on pin 13 to the servo object
  pinMode(triggerPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzer, OUTPUT);
  xTaskCreate(vTimerTask, "TimerTask", 1000, NULL, 1, NULL);
  xTaskCreate(sensorTask, "SensorTask", 1000, NULL, 1, NULL);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

