require("dotenv").config();
const express = require("express");
const cors = require("cors");
 
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

const { sequelize } = require("./models/index");
// sequelize.sync({alter: true}).then(() => {
  //console.log("db successfilly");
// }).catch((err) => {console.log(err.message)});

(async function(){
  try {
    await sequelize.sync({alter:true})
    // await sequelize.sync()
    console.log("db connected successfully");
  } catch (error) {
    console.log(error);
      console.log({error});
  }


})()
// import Routes
const consumerProfile = require("./src/routes/consumerProfile");
const consumerAddress = require("./src/routes/address");
const consumerFacility = require("./src/routes/facility");
const consumerEstablishment = require("./src/routes/establishment");
const consumerEmergenctContact = require("./src/routes/emergencyContact");
const consumerAttachment = require("./src/routes/attachments");
const consumerRelated = require("./src/routes/relatedMember");
const consumerBasket = require("./src/routes/basket");
const consumerBasketDetails = require("./src/routes/basketDetails");
const consumerBlackList = require("./src/routes/blackList");
const consumerCalender = require("./src/routes/calender");
const consumerProperties = require("./src/routes/properties");
const consumerSettings = require("./src/routes/settings");
const consumerUniversalSearch = require("./src/routes/universalSearch")
const consumerMedicalRecord = require("./src/routes/medicalRecord");
const consumerPreferences = require("./src/routes/preferences");
const consumerSegment = require("./src/routes/segment");
const consumerProviders = require("./src/routes/provider");

// app.use
app.use("/consumers/profile", consumerProfile);
app.use("/consumers/address", consumerAddress);
app.use("/consumers/facilities", consumerFacility);
app.use("/consumers/establishments", consumerEstablishment);
app.use("/consumers/attachments", consumerAttachment); 
app.use("/consumers/relatedMember", consumerRelated);
app.use("/consumers/basket", consumerBasket);
app.use("/consumers/basketDetails", consumerBasketDetails);
app.use("/consumers/calendar", consumerCalender);
app.use("/consumers/blacklist", consumerBlackList);
app.use("/consumers/settings", consumerSettings);
app.use("/consumers/properties", consumerProperties); 
app.use("/consumers/medicalRecord", consumerMedicalRecord); 
app.use("/consumers/emergencyContact", consumerEmergenctContact);
app.use("/consumers/Preferences", consumerPreferences);
app.use("/consumers/segment", consumerSegment);
app.use("/consumers", consumerUniversalSearch);
app.use("/consumers/provider", consumerProviders);



app.listen(PORT, () => {
  // console.log(`Server listening on port  ${PORT}`);
});
