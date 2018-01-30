# globalgamejam2018
An unfinished game for the GlobalGameJam2018

Due to an accident the PB-2 virus has escaped from Laboratorios Futuro to the outside. This dangerous virus is transmitted through
the air and causes severe damage to human health. You, as a worker of Laboratorios Futuro, must immediately go out and fight this
threat. For this you will have a biological detector, an advanced device that allows detecting infected people in a certain area. 
If the person detected is in Phase 1, you must send it to the nearest medical center, it is shown on the map. 

If the person is in Phase 2 he is in danger, and must be cured immediately. You have a limited number of cures initially. For every
person you send to the medical center you receive an extra cure. Remember that you have a limited time to find and cure infected 
people. If you run out of cures you can look for the reserve cures at the medical center, or the additional cures that you earn 
for each patient in Phase 1 that you send.

**Technology Notes:**
We only use javascript for development. In server side we are using nodejs and mongodb. To play the game is required a mobile with GPS and camera. Also, the game runs on Firefox or Chrome browser. 

**Installation Instructions:**

To install the game is required git,  npm.
  1.  Using the github URL clone the game: 
  ```bash
  git clone https://github.com/luismojena/globalgamejam2018
  ```
  2.  Then in the server folder, to satisfy dependencies, we execute: 
  ```bash
  npm install
  ```
  3.  To run the server: 
  ```bash
  npm start
  ```
  4.  According to your ip you should use your phone to access to: https://localhost:8443 and play the game
