Overview-
This is a simple Parking Lot Management API built using Node.js and Express.js. The API allows users to create a parking lot, park cars, remove cars, check parked car details, and update parking slots dynamically.

Dependencies-
The project uses the following npm packages:

express: Web framework for Node.js
Install manually if required:npm install express

Running the Server
To start the server, run:node index.js

By default, the server will start on port 8080.


API Endpoints

1. Create a Parking Lot:
Endpoint: POST /parking_lot
Request Body:
{
  "no_of_slots": 5
}
Response:Total slots=5

2. Add More Slots in the lot:
Endpoint: PATCH /parking_lot
Request Body:
{
  "Slots_added": 3
}
Response:Total slots after updation=8

3. Park a Car:
Endpoint: POST /park
Request Body:
{
  "car_reg_no": "KA-01-HH-1234",
  "color": "Red"
}
Response:Car parked at slot:1

4. Get Registration Numbers by Car Color:
Endpoint: GET /registration_numbers/:color
Request:GET /registration_numbers/Red
Response:["KA-01-HH-1234"]

5. Get Slot Numbers by Car Color:
Endpoint: GET /slot_numbers/:color
Request:GET /slot_numbers/Red
Response:[0]

6. Remove Car from a Slot:
Endpoint: POST /clear
Request Body:
{
  "slot_number": 0
}

Response:Slot no.1 is free now!

7. Get Parking Status:
Endpoint: GET /status
Response:[] //since there was only 1 car and which is removed from the slot

Test for these inputs and result are as expected and also error is handled properly using try and catch block

 
[ 
  { 
  "slot_no":1, 
  "registration_no":"KA-01-HH-1234", 
  "color":"red" 
  }, 
  { 
  "slot_no":2, 
  "registration_no":"KA-01-HH-1235", 
  "color":"blue" 
  }, 
  { 
  "slot_no":4, 
  "registration_no":"KA-01-HH-1236", 
  "color":"black" 
  }, 
  { 
  "slot_no":5, 
  "registration_no":"KA-01-HH-1237", 
  "color":"green" 
  }
]