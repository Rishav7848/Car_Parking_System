const express=require("express");
const app=express();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({extended:true}));//Express parse the values coming from post req
const port=8080;
app.listen(port,()=>{
    console.log(`app listening to ${port}`);
})

let emptyslots;//array which give the slots which are empty
const carMap = new Map();//this will store all cars details(where key is string and value is array of object which stores reg_no and slot_no of parked car)

// Function to add a car to the map
function addCar(color, reg_no, slot) {
    if (!carMap.has(color)) {
        carMap.set(color, []); // Initialize the array if color doesn't exist
    }
    carMap.get(color).push({ reg_no, slot });
    emptyslots[slot]=color;//it helps easy retrieval from map
}
// Function to get all cars of a specific color
function getCarsByColor(color) {
    return carMap.get(color) || [];//if no car available of  that color,returns empty array
}
//function to display details of all car parked
function getAllCarsDetails() {
    let carsArray = [];

    carMap.forEach((cars, color) => {
        cars.forEach(car => {
            carsArray.push({
                slot_no: car.slot+1, 
                registration_no: car.reg_no, 
                color: color 
            });
        });
    });

    return carsArray;
}

//function to remove car by slot number 
function removeCarByColorAndSlot(color, slotNumber) {
    if (carMap.has(color)) {
        let cars = carMap.get(color);
        let updatedCars = cars.filter(car => car.slot !== slotNumber);
        emptyslots[slotNumber]=true;
        if (updatedCars.length > 0) {
            carMap.set(color, updatedCars); // Update the Map with the filtered array
        } else {
            carMap.delete(color); //Remove the color if no cars of particular color available
        }
    }
}


app.post("/parking_lot",(req,res)=>{//initialise a parking lot
    let {no_of_slots}=req.body;
    emptyslots=new Array(no_of_slots);//initialise array of this no_of_slots
    for(let i=0;i<no_of_slots;i++){
        emptyslots[i]=true;
    }
    res.send(`Total slots=${no_of_slots}`);
})

app.patch("/parking_lot",(req,res)=>{//update the parking lot
    let {Slots_added}=req.body;
    for(let i=0;i<Slots_added;i++){
        emptyslots.push(true);
    }
    res.send(`Total slots after updation=${emptyslots.length}`);
})

app.post("/park",(req,res)=>{
    try{
        let {car_reg_no,color}=req.body;
        let slot=-1;
        for(let i=0;i<emptyslots.length;i++){
            if(emptyslots[i]===true){
                slot=i;
                break;//allow the car to park in 1st empty slot 
            }
        }

        if(slot==-1){
            throw new Error("No Free Slots available!");
        
        }

        addCar(color,car_reg_no,slot);
        res.send(`Car parked at slot:${slot+1}`);//since we need to start from 1
    }
    catch(err){
        res.status(400).send(err.message);
    }
    
})

app.get("/registration_numbers/:color",(req,res)=>{ //to get all cars_reg_no by color
    let {color}=req.params;
    let cars=getCarsByColor(color);
    console.log("Color requested:", color);
    console.log("Cars found:", cars);
    if(cars.length==0){
        return res.send("No car of this color available");
      
    }

    let cars_registartion=cars.map((car)=>(car.reg_no));//iterating in the particular color to find the reg_no

    res.send(cars_registartion);
})

app.get("/slot_numbers/:color",(req,res)=>{ //to get all cars_slot_no by color
    let {color}=req.params;
    let cars=getCarsByColor(color);
    if(cars.length==0){
        res.send("No car of this color available");
        return;
    }

    let cars_slots=cars.map((car)=>(car.slot+1));//iterating in the particular color to find all the slots 
    res.send(cars_slots);
})

app.post("/clear",(req,res)=>{ //to remove car from the slot
    try{
        let {slot_number}=req.body;
        if(emptyslots[slot_number]===true){
            throw new Error("This Slot is already Free!");
        }
        if (slot_number < 0 || slot_number >= emptyslots.length) {
            throw new Error("Invalid Slot Number!");
        }
        let color=emptyslots[slot_number];
        removeCarByColorAndSlot(color,slot_number);
        res.send(`Slot no.${slot_number} is free now!`);
    }
    catch(err){
        res.status(400).send(err.message);
    }
})

app.get("/status",(req,res)=>{ 
    let Car_Details=getAllCarsDetails();
    res.send(Car_Details);
})

