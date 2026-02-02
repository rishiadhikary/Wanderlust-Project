const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const initData = require("./data.js");

main() 
.then((res)=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async ()=>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:'69737fff8ebdac87edade70b'}));
    await listing.insertMany(initData.data);
};
initDB();