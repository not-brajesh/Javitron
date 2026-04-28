





#link : https://not-brajesh.github.io/Javitron/


---

# 🏎️ Team Javitron Racing — Official Website

Official website of **Team Javitron Racing**, the Formula Student & Go-Kart racing team of Ajeenkya D. Y. Patil University.

---

## 🚀 About the Project

This website represents the complete digital presence of Team Javitron Racing — showcasing our journey, achievements, engineering excellence, and motorsport passion.

It is designed as a **modern, interactive, and 3D-driven website** with smooth animations and a premium UI.

---

## 🎯 Features

* 🏎️ 3D Hero Section (Formula Car Animation)
* 🎬 Cinematic Scroll Effects
* 🧊 Glassmorphism / Glossy UI Design
* 📊 Achievements Showcase
* 🧑‍🔧 Team & Department Structure
* 📸 Gallery Section
* 🏁 Competition Highlights
* 🤝 Sponsors Section (Future Ready)
* 📱 Fully Responsive Design

---

## 🏆 Achievements

* 🥇 Autocross — 1st Position
* 🥇 Cleanest Pit Award
* 🥈 Design Evaluation — 2nd
* 🥈 Acceleration — 2nd
* 🏆 All India Rank — 6

---

## 🧠 Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Framework:** React (Vite)
* **3D:** Three.js / React Three Fiber
* **Animations:** GSAP / Framer Motion

---

## 📂 Website Sections

* Home
* About
* Team
* Vehicle
* Achievements
* Competitions
* Gallery
* Sponsors
* Contact

---

## 🏁 Team Overview

Team Javitron Racing is a group of passionate engineering students focused on:

* Performance Engineering
* Vehicle Dynamics
* Manufacturing & Fabrication
* Motorsport Competitions

---

## 📸 Gallery Includes

* Competition Photos
* Workshop Builds
* Manufacturing Process
* Team Moments
* Vehicle Showcase

---

## 🎯 Vision

To become one of India’s top Formula Student teams and compete at global levels.

---

## 📬 Contact

📍 Pune, Maharashtra
📸 Instagram: **@team_javitron_racing**

---

## ⚡ Future Enhancements

* Full 3D Car Interaction
* Exploded View Animation
* Real-time Telemetry UI
* Sponsor Integration System

---

## 💡 Inspiration

“Built to Race. Engineered to Win.”

---













---------


autodrone_py


````markdown
# Drone Auto Mission Setup (Raspberry Pi + Pixhawk)

Babu Jha, **ab terminal me hi direct kaam karte hain** — ekdum step by step.  
Main maan ke chal raha hoon tum **Raspberry Pi 4** pe ho aur **Pixhawk** se connect karna hai.

---

## Step 1: Pehle basic check

Terminal me ye chalao:

```bash
pwd
ls
````

Agar home folder dikh raha hai, tab bhi okay hai.

---

## Step 2: Python packages install karo

Ye 1 baar karna hoga:

```bash
sudo apt update
sudo apt install -y python3-pip
pip3 install dronekit pymavlink
```

Agar `pip3 install` me error aaye, to ye chalao:

```bash
python3 -m pip install --upgrade pip
pip3 install dronekit pymavlink
```

---

## Step 3: Ab direct file banao

```bash
nano drone_auto.py
```

---

## Step 4: Is code ko poora paste karo

```python
#!/usr/bin/env python3
from dronekit import connect, VehicleMode
import time
import sys

CONNECTION_STRING = '/dev/ttyAMA0'   # Raspberry Pi UART
BAUD_RATE = 57600
TARGET_ALTITUDE = 2.0
HOVER_TIME = 30
TAKEOFF_TIMEOUT = 30


def connect_vehicle():
    print("[INFO] Connecting to Pixhawk...")
    vehicle = connect(CONNECTION_STRING, baud=BAUD_RATE, wait_ready=True)
    print("[INFO] Connected.")
    return vehicle


def wait_for_armable(vehicle):
    print("[INFO] Waiting for vehicle to become armable...")
    while not vehicle.is_armable:
        print("[WAIT] Vehicle not armable yet...")
        time.sleep(2)
    print("[INFO] Vehicle is armable.")


def arm(vehicle):
    print("[INFO] Setting GUIDED mode...")
    vehicle.mode = VehicleMode("GUIDED")
    time.sleep(2)

    print("[INFO] Arming...")
    vehicle.armed = True

    while not vehicle.armed:
        print("[WAIT] Arming...")
        time.sleep(1)

    print("[INFO] Vehicle armed.")


def takeoff(vehicle, target_altitude):
    print(f"[INFO] Taking off to {target_altitude} meters...")
    vehicle.simple_takeoff(target_altitude)

    start_time = time.time()

    while True:
        current_alt = vehicle.location.global_relative_frame.alt
        print(f"[ALT] {current_alt:.2f} m")

        if current_alt >= target_altitude * 0.95:
            print("[INFO] Target altitude reached.")
            break

        if time.time() - start_time > TAKEOFF_TIMEOUT:
            print("[ERROR] Takeoff timeout.")
            return False

        time.sleep(1)

    return True


def hover(duration):
    print(f"[INFO] Hovering for {duration} seconds...")
    for i in range(duration):
        print(f"[HOVER] {i + 1}/{duration}")
        time.sleep(1)


def land(vehicle):
    print("[INFO] Switching to LAND mode...")
    vehicle.mode = VehicleMode("LAND")

    while vehicle.armed:
        print("[WAIT] Landing...")
        time.sleep(2)

    print("[INFO] Landed and disarmed.")


def main():
    vehicle = None

    try:
        vehicle = connect_vehicle()
        wait_for_armable(vehicle)
        arm(vehicle)

        success = takeoff(vehicle, TARGET_ALTITUDE)
        if not success:
            print("[FAIL] Mission aborted.")
            vehicle.mode = VehicleMode("LAND")
            return

        hover(HOVER_TIME)
        land(vehicle)

        print("[SUCCESS] Mission complete.")

    except Exception as e:
        print(f"[ERROR] {e}")
        if vehicle:
            print("[SAFE] Emergency landing...")
            vehicle.mode = VehicleMode("LAND")

    finally:
        if vehicle:
            vehicle.close()
        print("[INFO] Connection closed.")
        sys.exit(0)


if __name__ == "__main__":
    main()
```

---

## Step 5: Save file

Nano ke andar:

* `CTRL + O`
* Enter
* `CTRL + X`

---

## Step 6: Raspberry Pi pe serial enable karo

Ye chalao:

```bash
sudo raspi-config
```

Phir:

* **Interface Options**
* **Serial Port**
* “Login shell over serial?” → **No**
* “Enable serial port hardware?” → **Yes**

Phir reboot:

```bash
sudo reboot
```

---

## Step 7: Reboot ke baad dubara terminal kholo

Phir ye check karo:

```bash
ls /dev/tty*
```

Agar Pixhawk connected hai, to usually koi aisa port milega:

* `/dev/ttyAMA0`
* ya `/dev/ttyUSB0`

Agar `/dev/ttyUSB0` mile, to code me `CONNECTION_STRING` usse replace karna hai.

---

## Step 8: Code me port change karo

Dubara file kholo:

```bash
nano drone_auto.py
```

Phir line badlo:

```python
CONNECTION_STRING = '/dev/ttyAMA0'
```

Isko karo:

```python
CONNECTION_STRING = '/dev/ttyUSB0'
```

Agar tumhare system me USB port wahi dikhe.

Save again:

* `CTRL + O`
* Enter
* `CTRL + X`

---

## Step 9: Code run karo

```bash
python3 drone_auto.py
```

---

## Step 10: Agar test nahi hai aur sirf check karna hai

Pehle props hata ke test karo.
Agar real drone connected nahi hai, to code run nahi karega.

---

## Step 11: Agar error aaye to ye bhejo

Agar kuch error aaye, to mujhe bas ye 2 cheezein bhej dena:

```bash
ls /dev/tty*
```

aur

```bash
python3 drone_auto.py
```

ka error message.

---

Agar tu chahe to ab main **Raspberry Pi ka exact Pixhawk wiring** bhi step by step likh deta hoon.


```
-----











sudo apt update
sudo apt install raspi-config


sudo nano /boot/config.txt



