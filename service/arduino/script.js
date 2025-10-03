// Project data with code and circuit information
const projects = {
    1: {
        title: "LED Blink Controller",
        description: "A basic Arduino project to control LED blinking patterns with customizable timing.",
        components: [
            "Arduino Uno",
            "LED (any color)",
            "220Ω Resistor",
            "Breadboard",
            "Jumper wires"
        ],
        code: `// LED Blink Controller
int ledPin = 13;
int delayTime = 1000;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(delayTime);
  digitalWrite(ledPin, LOW);
  delay(delayTime);
  
  // Optional: Change blink speed via Serial
  if (Serial.available()) {
    delayTime = Serial.parseInt();
    if (delayTime < 100) delayTime = 100;
  }
}`,
        circuit: "Connect LED anode to pin 13 through 220Ω resistor, cathode to GND. Power Arduino via USB.",
        difficulty: "Beginner"
    },
    
    2: {
        title: "Temperature Monitor",
        description: "Real-time temperature monitoring system with LCD display and serial output.",
        components: [
            "Arduino Uno",
            "DHT22 Temperature Sensor",
            "16x2 LCD Display",
            "10kΩ Potentiometer",
            "Breadboard",
            "Jumper wires"
        ],
        code: `// Temperature Monitor
#include <DHT.h>
#include <LiquidCrystal.h>

#define DHT_PIN 2
#define DHT_TYPE DHT22

DHT dht(DHT_PIN, DHT_TYPE);
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

void setup() {
  Serial.begin(9600);
  dht.begin();
  lcd.begin(16, 2);
  lcd.print("Temp Monitor");
  delay(2000);
}

void loop() {
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  if (!isnan(temp) && !isnan(humidity)) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Temp: ");
    lcd.print(temp);
    lcd.print("C");
    
    lcd.setCursor(0, 1);
    lcd.print("Humidity: ");
    lcd.print(humidity);
    lcd.print("%");
    
    Serial.print("Temperature: ");
    Serial.print(temp);
    Serial.print("°C, Humidity: ");
    Serial.print(humidity);
    Serial.println("%");
  }
  
  delay(2000);
}`,
        circuit: "DHT22 VCC to 5V, GND to GND, Data to pin 2. LCD: VSS to GND, VDD to 5V, V0 to potentiometer center, RS to pin 12, Enable to pin 11, D4-D7 to pins 5-2.",
        difficulty: "Intermediate"
    },
    
    3: {
        title: "Servo Motor Control",
        description: "Precise servo motor control using potentiometer input for smooth positioning.",
        components: [
            "Arduino Uno",
            "Servo Motor (SG90)",
            "10kΩ Potentiometer",
            "Breadboard",
            "Jumper wires"
        ],
        code: `// Servo Motor Control
#include <Servo.h>

Servo myServo;
int potPin = A0;
int servoPin = 9;
int potValue = 0;
int angle = 0;

void setup() {
  myServo.attach(servoPin);
  Serial.begin(9600);
}

void loop() {
  potValue = analogRead(potPin);
  angle = map(potValue, 0, 1023, 0, 180);
  
  myServo.write(angle);
  
  Serial.print("Potentiometer: ");
  Serial.print(potValue);
  Serial.print(" -> Angle: ");
  Serial.println(angle);
  
  delay(15);
}`,
        circuit: "Servo red wire to 5V, brown to GND, orange to pin 9. Potentiometer: one end to 5V, other to GND, center to A0.",
        difficulty: "Intermediate"
    },
    
    4: {
        title: "Ultrasonic Security System",
        description: "Motion detection security system using ultrasonic sensor with buzzer alert.",
        components: [
            "Arduino Uno",
            "HC-SR04 Ultrasonic Sensor",
            "Buzzer",
            "LED",
            "220Ω Resistor",
            "Breadboard",
            "Jumper wires"
        ],
        code: `// Ultrasonic Security System
int trigPin = 9;
int echoPin = 10;
int buzzerPin = 8;
int ledPin = 13;
int threshold = 20; // cm

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  long duration, distance;
  
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;
  
  Serial.print("Distance: ");
  Serial.println(distance);
  
  if (distance < threshold && distance > 0) {
    digitalWrite(ledPin, HIGH);
    digitalWrite(buzzerPin, HIGH);
    delay(100);
    digitalWrite(buzzerPin, LOW);
    delay(100);
  } else {
    digitalWrite(ledPin, LOW);
  }
  
  delay(100);
}`,
        circuit: "HC-SR04: VCC to 5V, GND to GND, Trig to pin 9, Echo to pin 10. Buzzer positive to pin 8, negative to GND. LED anode to pin 13 through 220Ω resistor.",
        difficulty: "Advanced"
    },
    
    5: {
        title: "Arduino Music Player",
        description: "Simple music player that plays melodies using a buzzer with different tones.",
        components: [
            "Arduino Uno",
            "Buzzer",
            "Push Button",
            "10kΩ Resistor",
            "Breadboard",
            "Jumper wires"
        ],
        code: `// Arduino Music Player
int buzzerPin = 8;
int buttonPin = 2;
bool isPlaying = false;

// Note frequencies
#define NOTE_C4  262
#define NOTE_D4  294
#define NOTE_E4  330
#define NOTE_F4  349
#define NOTE_G4  392
#define NOTE_A4  440
#define NOTE_B4  494

int melody[] = {
  NOTE_C4, NOTE_D4, NOTE_E4, NOTE_F4,
  NOTE_G4, NOTE_A4, NOTE_B4, NOTE_C4
};

int noteDurations[] = {
  4, 4, 4, 4, 4, 4, 4, 2
};

void setup() {
  pinMode(buzzerPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(buttonPin) == LOW && !isPlaying) {
    playMelody();
    delay(500); // Debounce
  }
}

void playMelody() {
  isPlaying = true;
  Serial.println("Playing melody...");
  
  for (int i = 0; i < 8; i++) {
    int noteDuration = 1000 / noteDurations[i];
    tone(buzzerPin, melody[i], noteDuration);
    
    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
    noTone(buzzerPin);
  }
  
  isPlaying = false;
  Serial.println("Melody finished!");
}`,
        circuit: "Buzzer positive to pin 8, negative to GND. Button: one pin to pin 2, other to GND. 10kΩ resistor from pin 2 to 5V (pull-up).",
        difficulty: "Intermediate"
    },
    
    6: {
        title: "RC Car Controller",
        description: "Remote controlled car using motor drivers and wireless communication.",
        components: [
            "Arduino Uno",
            "L298N Motor Driver",
            "2x DC Motors",
            "HC-05 Bluetooth Module",
            "9V Battery",
            "Jumper wires",
            "Chassis"
        ],
        code: `// RC Car Controller
#include <SoftwareSerial.h>

SoftwareSerial bluetooth(2, 3);

// Motor pins
int motor1Pin1 = 5;
int motor1Pin2 = 6;
int motor2Pin1 = 9;
int motor2Pin2 = 10;
int enableA = 7;
int enableB = 8;

void setup() {
  pinMode(motor1Pin1, OUTPUT);
  pinMode(motor1Pin2, OUTPUT);
  pinMode(motor2Pin1, OUTPUT);
  pinMode(motor2Pin2, OUTPUT);
  pinMode(enableA, OUTPUT);
  pinMode(enableB, OUTPUT);
  
  digitalWrite(enableA, HIGH);
  digitalWrite(enableB, HIGH);
  
  bluetooth.begin(9600);
  Serial.begin(9600);
}

void loop() {
  if (bluetooth.available()) {
    char command = bluetooth.read();
    
    switch(command) {
      case 'F': // Forward
        moveForward();
        break;
      case 'B': // Backward
        moveBackward();
        break;
      case 'L': // Left
        turnLeft();
        break;
      case 'R': // Right
        turnRight();
        break;
      case 'S': // Stop
        stopMotors();
        break;
    }
  }
}

void moveForward() {
  digitalWrite(motor1Pin1, HIGH);
  digitalWrite(motor1Pin2, LOW);
  digitalWrite(motor2Pin1, HIGH);
  digitalWrite(motor2Pin2, LOW);
}

void moveBackward() {
  digitalWrite(motor1Pin1, LOW);
  digitalWrite(motor1Pin2, HIGH);
  digitalWrite(motor2Pin1, LOW);
  digitalWrite(motor2Pin2, HIGH);
}

void turnLeft() {
  digitalWrite(motor1Pin1, LOW);
  digitalWrite(motor1Pin2, HIGH);
  digitalWrite(motor2Pin1, HIGH);
  digitalWrite(motor2Pin2, LOW);
}

void turnRight() {
  digitalWrite(motor1Pin1, HIGH);
  digitalWrite(motor1Pin2, LOW);
  digitalWrite(motor2Pin1, LOW);
  digitalWrite(motor2Pin2, HIGH);
}

void stopMotors() {
  digitalWrite(motor1Pin1, LOW);
  digitalWrite(motor1Pin2, LOW);
  digitalWrite(motor2Pin1, LOW);
  digitalWrite(motor2Pin2, LOW);
}`,
        circuit: "L298N: IN1-IN4 to pins 5,6,9,10. Enable pins to 7,8. Motors to OUT1-OUT4. VCC to 9V battery, GND to Arduino GND. HC-05: VCC to 3.3V, GND to GND, TX to pin 2, RX to pin 3.",
        difficulty: "Advanced"
    },
    
    7: {
        title: "Digital Clock",
        description: "Real-time digital clock display using 7-segment displays and RTC module.",
        components: [
            "Arduino Uno",
            "DS1307 RTC Module",
            "4x 7-Segment Display",
            "74HC595 Shift Register",
            "Resistors",
            "Breadboard",
            "Jumper wires"
        ],
        code: `// Digital Clock
#include <Wire.h>
#include <RTClib.h>

RTC_DS1307 rtc;

// 7-segment display pins
int dataPin = 2;
int clockPin = 3;
int latchPin = 4;

// Digit patterns for 0-9
byte digits[] = {
  0b11111100, // 0
  0b01100000, // 1
  0b11011010, // 2
  0b11110010, // 3
  0b01100110, // 4
  0b10110110, // 5
  0b10111110, // 6
  0b11100000, // 7
  0b11111110, // 8
  0b11110110  // 9
};

void setup() {
  Serial.begin(9600);
  
  if (!rtc.begin()) {
    Serial.println("RTC not found");
    while (1);
  }
  
  if (!rtc.isrunning()) {
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }
  
  pinMode(dataPin, OUTPUT);
  pinMode(clockPin, OUTPUT);
  pinMode(latchPin, OUTPUT);
}

void loop() {
  DateTime now = rtc.now();
  
  int hours = now.hour();
  int minutes = now.minute();
  
  displayTime(hours, minutes);
  
  Serial.print(hours);
  Serial.print(":");
  Serial.println(minutes);
  
  delay(1000);
}

void displayTime(int hours, int minutes) {
  int h1 = hours / 10;
  int h2 = hours % 10;
  int m1 = minutes / 10;
  int m2 = minutes % 10;
  
  // Display each digit
  displayDigit(digits[h1]);
  displayDigit(digits[h2]);
  displayDigit(digits[m1]);
  displayDigit(digits[m2]);
}

void displayDigit(byte digit) {
  digitalWrite(latchPin, LOW);
  shiftOut(dataPin, clockPin, MSBFIRST, digit);
  digitalWrite(latchPin, HIGH);
  delay(5);
}`,
        circuit: "DS1307: VCC to 5V, GND to GND, SDA to A4, SCL to A5. 74HC595: pins 14,12 to dataPin,clockPin. Connect 7-segment displays through shift registers with current limiting resistors.",
        difficulty: "Intermediate"
    },
    
    8: {
        title: "IoT Weather Station",
        description: "WiFi-enabled weather monitoring system with web interface and data logging.",
        components: [
            "ESP32/NodeMCU",
            "DHT22 Sensor",
            "BMP180 Pressure Sensor",
            "OLED Display",
            "Breadboard",
            "Jumper wires"
        ],
        code: `// IoT Weather Station
#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>
#include <Wire.h>
#include <Adafruit_BMP085.h>

#define DHT_PIN 4
#define DHT_TYPE DHT22

DHT dht(DHT_PIN, DHT_TYPE);
Adafruit_BMP085 bmp;
WebServer server(80);

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

float temperature, humidity, pressure;

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  if (!bmp.begin()) {
    Serial.println("BMP180 not found");
  }
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  server.on("/", handleRoot);
  server.on("/data", handleData);
  server.begin();
}

void loop() {
  server.handleClient();
  
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  pressure = bmp.readPressure() / 100.0F;
  
  delay(2000);
}

void handleRoot() {
  String html = "<html><head><title>Weather Station</title>";
  html += "<meta http-equiv='refresh' content='5'></head>";
  html += "<body><h1>IoT Weather Station</h1>";
  html += "<p>Temperature: " + String(temperature) + "°C</p>";
  html += "<p>Humidity: " + String(humidity) + "%</p>";
  html += "<p>Pressure: " + String(pressure) + " hPa</p>";
  html += "</body></html>";
  
  server.send(200, "text/html", html);
}

void handleData() {
  String json = "{";
  json += "\\"temperature\\":" + String(temperature) + ",";
  json += "\\"humidity\\":" + String(humidity) + ",";
  json += "\\"pressure\\":" + String(pressure);
  json += "}";
  
  server.send(200, "application/json", json);
}`,
        circuit: "ESP32: DHT22 data to pin 4, VCC to 3.3V. BMP180: SDA to pin 21, SCL to pin 22, VCC to 3.3V. All GND connections to ESP32 GND.",
        difficulty: "Expert"
    },
    
    9: {
        title: "Arduino Game Controller",
        description: "Custom game controller with buttons, joystick, and USB HID functionality.",
        components: [
            "Arduino Leonardo",
            "Analog Joystick",
            "6x Push Buttons",
            "10kΩ Resistors",
            "Breadboard",
            "Jumper wires"
        ],
        code: `// Arduino Game Controller
#include <Keyboard.h>
#include <Mouse.h>

// Joystick pins
int joyX = A0;
int joyY = A1;
int joyButton = 2;

// Button pins
int buttonA = 3;
int buttonB = 4;
int buttonX = 5;
int buttonY = 6;
int buttonStart = 7;
int buttonSelect = 8;

// Button states
bool lastJoyButton = HIGH;
bool lastButtonA = HIGH;
bool lastButtonB = HIGH;
bool lastButtonX = HIGH;
bool lastButtonY = HIGH;
bool lastStart = HIGH;
bool lastSelect = HIGH;

void setup() {
  // Initialize pins
  pinMode(joyButton, INPUT_PULLUP);
  pinMode(buttonA, INPUT_PULLUP);
  pinMode(buttonB, INPUT_PULLUP);
  pinMode(buttonX, INPUT_PULLUP);
  pinMode(buttonY, INPUT_PULLUP);
  pinMode(buttonStart, INPUT_PULLUP);
  pinMode(buttonSelect, INPUT_PULLUP);
  
  Keyboard.begin();
  Mouse.begin();
  Serial.begin(9600);
}

void loop() {
  // Read joystick
  int xValue = analogRead(joyX);
  int yValue = analogRead(joyY);
  
  // Map joystick to mouse movement
  int mouseX = map(xValue, 0, 1023, -5, 5);
  int mouseY = map(yValue, 0, 1023, -5, 5);
  
  if (abs(mouseX) > 1 || abs(mouseY) > 1) {
    Mouse.move(mouseX, mouseY);
  }
  
  // Handle joystick button
  bool joyButtonState = digitalRead(joyButton);
  if (joyButtonState != lastJoyButton && joyButtonState == LOW) {
    Mouse.click(MOUSE_LEFT);
  }
  lastJoyButton = joyButtonState;
  
  // Handle game buttons
  handleButton(buttonA, lastButtonA, 'a');
  handleButton(buttonB, lastButtonB, 'b');
  handleButton(buttonX, lastButtonX, 'x');
  handleButton(buttonY, lastButtonY, 'y');
  handleButton(buttonStart, lastStart, ' '); // Space
  handleButton(buttonSelect, lastSelect, KEY_ESC);
  
  delay(10);
}

void handleButton(int pin, bool &lastState, char key) {
  bool currentState = digitalRead(pin);
  if (currentState != lastState && currentState == LOW) {
    Keyboard.press(key);
    delay(50);
    Keyboard.release(key);
  }
  lastState = currentState;
}`,
        circuit: "Joystick: VRX to A0, VRY to A1, SW to pin 2, VCC to 5V, GND to GND. Buttons: one pin to digital pins 3-8, other pins to GND. Use 10kΩ pull-up resistors for each button.",
        difficulty: "Advanced"
    },
    
    10: {
        title: "Smart Home Hub",
        description: "Complete home automation system with sensors, relays, and smartphone control.",
        components: [
            "ESP32",
            "Relay Module (4-channel)",
            "DHT22 Sensor",
            "PIR Motion Sensor",
            "LDR Light Sensor",
            "OLED Display",
            "Buzzer",
            "LEDs",
            "Resistors",
            "Breadboard"
        ],
        code: `// Smart Home Hub
#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define DHT_PIN 4
#define PIR_PIN 5
#define LDR_PIN A0
#define BUZZER_PIN 18
#define RELAY1_PIN 19
#define RELAY2_PIN 21
#define RELAY3_PIN 22
#define RELAY4_PIN 23

DHT dht(DHT_PIN, DHT22);
Adafruit_SSD1306 display(128, 64, &Wire, -1);
WebServer server(80);

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

bool relay1State = false;
bool relay2State = false;
bool relay3State = false;
bool relay4State = false;
bool motionDetected = false;
bool autoLightMode = true;

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  // Initialize pins
  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(RELAY1_PIN, OUTPUT);
  pinMode(RELAY2_PIN, OUTPUT);
  pinMode(RELAY3_PIN, OUTPUT);
  pinMode(RELAY4_PIN, OUTPUT);
  
  // Initialize display
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("SSD1306 allocation failed");
  }
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("WiFi connected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  
  // Web server routes
  server.on("/", handleRoot);
  server.on("/toggle", handleToggle);
  server.on("/status", handleStatus);
  server.begin();
  
  updateDisplay();
}

void loop() {
  server.handleClient();
  
  // Read sensors
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();
  int lightLevel = analogRead(LDR_PIN);
  motionDetected = digitalRead(PIR_PIN);
  
  // Auto light control
  if (autoLightMode && motionDetected && lightLevel < 500) {
    digitalWrite(RELAY1_PIN, HIGH);
    relay1State = true;
  } else if (autoLightMode && !motionDetected) {
    digitalWrite(RELAY1_PIN, LOW);
    relay1State = false;
  }
  
  // Security alert
  if (motionDetected) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
  }
  
  updateDisplay();
  delay(1000);
}

void handleRoot() {
  String html = "<html><head><title>Smart Home Hub</title>";
  html += "<style>body{font-family:Arial;background:#1a1a2e;color:#00eeff;}";
  html += "button{background:#00eeff;color:#000;padding:10px;border:none;margin:5px;}</style>";
  html += "</head><body><h1>Smart Home Control</h1>";
  html += "<button onclick='toggleRelay(1)'>Light " + String(relay1State ? "OFF" : "ON") + "</button>";
  html += "<button onclick='toggleRelay(2)'>Fan " + String(relay2State ? "OFF" : "ON") + "</button>";
  html += "<button onclick='toggleRelay(3)'>AC " + String(relay3State ? "OFF" : "ON") + "</button>";
  html += "<button onclick='toggleRelay(4)'>Outlet " + String(relay4State ? "OFF" : "ON") + "</button>";
  html += "<script>function toggleRelay(n){fetch('/toggle?relay='+n);location.reload();}</script>";
  html += "</body></html>";
  
  server.send(200, "text/html", html);
}

void handleToggle() {
  int relay = server.arg("relay").toInt();
  
  switch(relay) {
    case 1:
      relay1State = !relay1State;
      digitalWrite(RELAY1_PIN, relay1State);
      autoLightMode = false;
      break;
    case 2:
      relay2State = !relay2State;
      digitalWrite(RELAY2_PIN, relay2State);
      break;
    case 3:
      relay3State = !relay3State;
      digitalWrite(RELAY3_PIN, relay3State);
      break;
    case 4:
      relay4State = !relay4State;
      digitalWrite(RELAY4_PIN, relay4State);
      break;
  }
  
  server.send(200, "text/plain", "OK");
}

void handleStatus() {
  String json = "{";
  json += "\\"relay1\\":" + String(relay1State) + ",";
  json += "\\"relay2\\":" + String(relay2State) + ",";
  json += "\\"relay3\\":" + String(relay3State) + ",";
  json += "\\"relay4\\":" + String(relay4State) + ",";
  json += "\\"motion\\":" + String(motionDetected);
  json += "}";
  
  server.send(200, "application/json", json);
}

void updateDisplay() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0,0);
  display.println("Smart Home Hub");
  display.println("IP: " + WiFi.localIP().toString());
  display.println("Temp: " + String(dht.readTemperature()) + "C");
  display.println("Motion: " + String(motionDetected ? "YES" : "NO"));
  display.println("Lights: " + String(relay1State ? "ON" : "OFF"));
  display.display();
}`,
        circuit: "ESP32: DHT22 to pin 4, PIR to pin 5, LDR to A0 with voltage divider, OLED SDA/SCL to pins 21/22, Relays to pins 19,21,22,23, Buzzer to pin 18. All VCC to 3.3V, GND to GND.",
        difficulty: "Expert"
    }
};

// Modal functionality
const modal = document.getElementById('projectModal');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.querySelector('.close');

// View project details
function viewProject(projectId) {
    const project = projects[projectId];
    if (!project) return;
    
    modalContent.innerHTML = `
        <h2>${project.title}</h2>
        <p>${project.description}</p>
        
        <h3>Components Required:</h3>
        <ul>
            ${project.components.map(component => `<li>${component}</li>`).join('')}
        </ul>
        
        <h3>Arduino Code:</h3>
        <div class="code-block">
            <pre>${project.code}</pre>
        </div>
        
        <h3>Circuit Connections:</h3>
        <div class="circuit-diagram">
            <p>${project.circuit}</p>
        </div>
        
        <div class="download-section">
            <h3>Download Project Files</h3>
            <button class="download-btn" onclick="downloadCode(${projectId})">
                <i class="fas fa-download"></i> Download Code (.ino)
            </button>
            <button class="download-btn" onclick="downloadCircuit(${projectId})">
                <i class="fas fa-download"></i> Download Circuit Diagram
            </button>
            <button class="download-btn" onclick="downloadComplete(${projectId})">
                <i class="fas fa-download"></i> Download Complete Project
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Download functions
function downloadProject(projectId) {
    downloadComplete(projectId);
}

function downloadCode(projectId) {
    const project = projects[projectId];
    if (!project) return;
    
    const blob = new Blob([project.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '_')}.ino`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadCircuit(projectId) {
    const project = projects[projectId];
    if (!project) return;
    
    const circuitInfo = `
${project.title} - Circuit Diagram

Components Required:
${project.components.map(component => `- ${component}`).join('\n')}

Circuit Connections:
${project.circuit}

Difficulty Level: ${project.difficulty}

Description:
${project.description}
    `;
    
    const blob = new Blob([circuitInfo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '_')}_Circuit.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadComplete(projectId) {
    const project = projects[projectId];
    if (!project) return;
    
    const completeProject = `
${project.title}
${'='.repeat(project.title.length)}

Description:
${project.description}

Difficulty Level: ${project.difficulty}

Components Required:
${project.components.map(component => `- ${component}`).join('\n')}

Arduino Code:
${'-'.repeat(20)}
${project.code}

Circuit Connections:
${'-'.repeat(20)}
${project.circuit}

Instructions:
1. Gather all required components
2. Set up the circuit as described
3. Upload the Arduino code to your board
4. Test the project functionality
5. Modify code as needed for your specific requirements

Happy Making!
    `;
    
    const blob = new Blob([completeProject], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '_')}_Complete_Project.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Modal close functionality
closeBtn.onclick = function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Smooth scrolling for navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 238, 255, 0.15)';
        header.style.backdropFilter = 'blur(15px)';
    } else {
        header.style.background = 'rgba(0, 238, 255, 0.1)';
        header.style.backdropFilter = 'blur(10px)';
    }
});

// Add animation on scroll for project cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});