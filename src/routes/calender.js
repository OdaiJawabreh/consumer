const express = require("express");
const {
  addCalenderConsumer,
  deleteCalender,
  getUnavailableService,
  AddServicesToAppointment,
  deleteServicesAppointment,
  getCalendar,
} = require("../controllers/calender");
const consumerCalender = express.Router();

consumerCalender.post("/addToCalendar", addCalenderConsumer);
consumerCalender.post("/getCalendar", getCalendar);
consumerCalender.post("/deleteFromCalendar", deleteCalender);
consumerCalender.post("/getUnavailableServices", getUnavailableService);
consumerCalender.post("/AddServicesToAppointment", AddServicesToAppointment);
consumerCalender.post(
  "/deleteServicesFromAppointment",
  deleteServicesAppointment
);
// consumerCalender.post("/updateRescheduledCalendar", addCalender);

module.exports = consumerCalender;
