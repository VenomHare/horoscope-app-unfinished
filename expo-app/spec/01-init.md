# Introduction

This is Andriod-IOS App for the web app Hora Detector which resides in `./web-app`. The motive for building the app is to add Widgets and Sticky Notifications showing the current active hora with start and end time.

# Tech Stack

- React Native with Expo Router
- Zustand

# Screens

1. Permission Screen
   - This will be a stack screen.
   - Permission screen will be first screen If the app doesn't have notifications and location permission granted
   - To make it a good ux maintain a variable in zustand to mark if permissions are granted or not
   - When app loads and if user has revoked the permissions then change those variables and show the ppermission screen

2. Dashboard Screen
   -It should have following tabs
   1. Home Tab
      - This Screen will be the main and first screen which should load if permissions are granted
      - It should contain a the current Hora along with start time,end time, the time of sunrise and date.
      - Below it should be list of timings or Hora Table for today


   2. Personalize Tab
        - In this tab user can add a specific hora within following lists:
            1. Highlight List : If added the hora will have different color everywhere (including widgets and notificaitons).
            2. Start Alert List : It will send user notification of hora hour starting before the offset time (each hora should have different configurable offset time).
            3. End Alert List : It will send user notification of hora hour ending before the offset time (each hora should have different configurable offset time).
        - It should have changing App Language Option 
            - Compatible Languages: English, Marathi, Hindi.
        - For Android, add a toogle flag for sticky notifications

# Widgets
- The App should provide widget for the current active hora along with start and end time and current date.
- It should highlight the hora which is in users highlight list.
- This widget should update whenever the hora data changes.

# Sticky Notifactions 
- For Andriod, Add a sticky notifaction which functions similar to widget 
- Data should show in notification and update itself along with highlighted horas looking different

# Compatiblity
- The App should be Compatible for Android as well as IOS
- Implement different applications where require 
- eg. Android's Widget application is different from IOS widget implementation.

# Security 
- The Application is Client-sided only for the sunrise time it should rely on server.
- The app should be secured and data should be safe.
- The App currently doesn't have Auth System, all data is stored locally.

# Typography    
- Fonts : switzer (installed locally in ./native-app/), Poppins (google font)
- Use Font weight 800,700,600,400 for showing heirarchy
- Use Inner shadow and Outer shadow show importance 

# Locales 
- Store locales for Marathi English and Hindi, use it when configuration changes (Marathi should be default)

# Hora Logic
- Use the hora logic from the web app and *isolate* the logic in a class which should be easy to modify.
