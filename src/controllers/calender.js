const { sequelize } = require("../../models/index");
const { Op, where, DATE } = require("sequelize"); 
const { calenderConsumer, updateRecordStatus , findEntity} = require("../services/API'S");
const { createTransactionIdOrId } = require("../../utility/queryBilder/index");
const { dispatcher } = require("../../utility/requestBilder/requestBilder");
const {
  wherINJSON,
} = require("../../utility/queryBilder/index");
const addCalenderConsumer = async (req, res) => {
  // this controller to add events for consumer events
  try {
    // TSK - BKG - HRS
    const {
      id,
      consumer,
      provider,
      services,
      date,
      createdBy,
      timeFrom,
      timeTo,
      status,
      transactionId,
    } = req.body;
    if (
      id &&
      consumer &&
      provider &&
      services &&
      date &&
      timeFrom &&
      timeTo &&
      status 
    ) {
    const { data } = await dispatcher({
      uri: "/lookups/getAllBookings",
    });
    let type = null;
    if (id.startsWith("TSK")) {
      type = data.rows
        .filter((row) => row.name.en == "Task")
        .map((row) => {
          return { id: row.id, name: row.name };
        });
    } else if (id.startsWith("BKG")) {
      type = data.rows
        .filter((row) => row.name.en == "Appointment")
        .map((row) => {
          return { id: row.id, name: row.name };
        });
    } else if (id.startsWith("HRS")) {
      type = data.rows
        .filter((row) => row.name.en == "Leave")
        .map((row) => {
          return { id: row.id, name: row.name };
        });
    }
    let calenderDTO = {
      id: createTransactionIdOrId("CON-CAD-JOR-"),
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CNP-JOR-")
        : transactionId,
      conMtProfileId:consumer.id,
      type: id.startsWith("BKG")? type[0] : id.startsWith("BKG") ? {"id": "LKP-LBT-JOR-0d3a792e-c617-4c65-b60e-67cc5202e416", "name": {"ar": "موعد", "en": "Appointment"}} : null,
      reference: id,
      timeFrom,
      timeTo,
      status,
      provider:{id:provider.id , name:provider.name},
      services,
      dateFrom: date,
      dateTo: date,
      createdBy,
    };
    
    let calender = await calenderConsumer(calenderDTO);
    res.status(200).json(calender);
  }else{
    res.status(400).json({message: "some keys are missed"});
  }
  } catch (error) {
    // console.log(error)
    res.status(402).json({message: error.message});
  }
};
const deleteCalender = async (req, res) => {
  try {
    // this Api to delete record from consumer caleder Soft Delete change Record Status from LATEST To DELETED
    const {
      id, 
      status,
      consumer,
      provider,
      services,
      date,
      createdBy,
      timeFrom,
      timeTo,
      transactionId}= req.body;
      let result;
      if(id && 
        status &&
        consumer &&
        provider &&
        date &&
        timeFrom &&
        timeTo){
      if(status?.id === '7'){
        result = await updateRecordStatus(
         { reference: id, recordStatus: 'LATEST' },
         'calender',
         'DELETED'
       );
     }else{
      let findRecord = await sequelize.models.calender.findOne({
        where: {
             reference: id,
             recordStatus: "LATEST",
        },
      });
        result = await updateRecordStatus(
         { reference: id, recordStatus: 'LATEST' },
         'calender',
         'UPDATED'
       );
     const { data } = await dispatcher({
       uri: '/lookups/getAllBookings',
     });
     let type = null;
     if(data?.rows){
       if (id.startsWith('TSK')) {
         type = data.rows
           .filter((row) => row.name.en == 'Task')
           .map((row) => {
             return { id: row.id, name: row.name };
           });
       } else if (id.startsWith('BKG')) {
         type = data.rows
           .filter((row) => row.name.en == 'Appointment')
           .map((row) => {
             return { id: row.id, name: row.name };
           });
       } else if (id.startsWith('HRS')) {
         type = data.rows
           .filter((row) => row.name.en == 'Leave')
           .map((row) => {
             return { id: row.id, name: row.name };
           });
       }
     }
     let calenderDTO = {
      id: createTransactionIdOrId("CON-CAD-JOR-"),
      transactionId: !transactionId
        ? createTransactionIdOrId("TRN-CON-CNP-JOR-")
        : transactionId,
      conMtProfileId:consumer.id,
      type: id.startsWith("BKG")? type[0] : id.startsWith("BKG") ? {"id": "LKP-LBT-JOR-0d3a792e-c617-4c65-b60e-67cc5202e416", "name": {"ar": "موعد", "en": "Appointment"}} : null,
      reference: id,
      provider:{id:provider?.id , name:provider?.name},
      services : services || findRecord?.services,
      timeFrom,
      timeTo,
      status,
      date,
      dateFrom: date,
      dateTo: date,
      createdBy,
    };
     let calenderProvider = await calenderConsumer(calenderDTO);
     }
    if (result[0] == "0") {
      return res.status(401).json("There is no calender record with this id ");
    }
    res.status(200).json({ id, message: "Calender Record Updated" });
    }
  } catch (error) {
    res.status(402).json(error.message);
  }
};
const getCalendar = async (req, res) =>{
try{
  const { consumerId , providerId } = req.body;
let calendarInfo = await sequelize.models.calender.findAll({
  where: {
    [Op.and]: [
      { conMtProfileId: consumerId },
      providerId ? wherINJSON("provider", "eq", "id", providerId ) : '',
      { recordStatus: "LATEST" },
    ],
  },
});
  res.status(200).json(calendarInfo)
}catch(error){
  res.status(402).json(error.message);
}
};
const getUnavailableService =async (req, res) =>{
  try{
    //first i will get all services used from basket 
    let allServices = await sequelize.models.basket.findAll({
      where: {
        [Op.and]: [
          { conMtProfileId:req.body.conMtProfileId },
          wherINJSON("status", "eq", "id", "2"),
          wherINJSON("item_type", "eq", "id", "3"),
          { recordStatus: "LATEST" },
        ],
      },
    });
    //second i will get packages with both status  
    let getPackages = await sequelize.models.basket.findAll({
      where: {
        [Op.and]: [
          { conMtProfileId:req.body.conMtProfileId },
          wherINJSON("item_type", "eq", "id", "1"),
          { recordStatus: "LATEST" },
        ],
      },
    });
    //third after i got all packages i will get all used services of this package
    let getPackageServices = null
    let usedServices = [];
    getPackages.forEach( async element => { 
      getPackageServices = await sequelize.models.basketDetails.findAll({
        where: {
          [Op.and]: [
            { conRtBasketId: element.id },
            wherINJSON("status", "eq", "id", "2"),
            { recordStatus: "LATEST" },
          ],
        },
      });
      usedServices.push(...getPackageServices)
    });
    //fourth i will get all completed appointment
    let completedAppointment = await sequelize.models.calender.findAll({
      where: {
        [Op.and]: [
          { conMtProfileId:req.body.conMtProfileId },
          wherINJSON("status", "eq", "id", "8"),
          { recordStatus: "LATEST" },
        ],
      },
    });

    res.status(200).json([...allServices , ...usedServices, ...completedAppointment]);
  }
  catch(error){
    res.status(402).json(error.message);
  }
};
const deleteServicesAppointment = async (req, res) =>{
  try{
    const { deletedServices } = req.body;
    let lastEntity = await findEntity(
      { reference: deletedServices[0].bkgMtAppointmentId , recordStatus: 'LATEST' },
      "calender"
    );
    result = await updateRecordStatus(
      { reference: deletedServices[0].bkgMtAppointmentId , recordStatus: 'LATEST' },
      'calender',
      'UPDATED'
    );
    let existServices = lastEntity?.services? lastEntity?.services.filter(ele => ele.id === deletedServices[0].id) : []
    let services = []
    if(existServices == 1){
       services = lastEntity?.services? lastEntity?.services.filter(ele => ele.id !== deletedServices[0].id) : []
    }if(existServices > 1){
       services = lastEntity?.services? lastEntity?.services.filter(ele => ele.id !== deletedServices[0].id) : []
    }
    let calender = null
    if(lastEntity){
      let calenderDTO = {
        id: lastEntity.id,
        transactionId: createTransactionIdOrId('TRN-CON-CAD-JOR-'),
        conMtProfileId: lastEntity.conMtProfileId,
        description:lastEntity.description,
        type: lastEntity.type,
        reference: lastEntity.reference,
        provider:{ id: lastEntity?.provider?.id , name:lastEntity?.provider?.name},
        services : services,
        timeFrom:lastEntity.timeFrom,
        timeTo:lastEntity.timeTo,
        status:lastEntity.status,
        dateFrom: lastEntity.dateFrom ,
        dateTo: lastEntity.dateTo ,
        createdBy: lastEntity.createdBy,
      };
       calender = await calenderConsumer(calenderDTO);
    }
    res.status(200).json(calender);
  }catch(error){
    res.status(402).json({message: error.message});
  }
}
const AddServicesToAppointment = async (req, res) =>{
  try{
    const { bkgMtAppointmentId , service } = req.body;
    let lastEntity = await findEntity(
      { reference:bkgMtAppointmentId , recordStatus: "LATEST" },
      "calender"
    );
    result = await updateRecordStatus(
      { reference: bkgMtAppointmentId, recordStatus: 'LATEST' },
      'calender',
      'UPDATED'
    );
    let Consumer
    if(lastEntity){
      let calenderDTO = {
        id: lastEntity.id,
        transactionId: createTransactionIdOrId('TRN-CON-CAD-JOR-'),
        conMtProfileId: lastEntity.conMtProfileId,
        description:lastEntity.description,
        type: lastEntity.type,
        reference: lastEntity.reference,
        provider:{ id: lastEntity?.provider?.id , name:lastEntity?.provider?.name},
        services : lastEntity.services ? [...lastEntity.services , service] : [service],
        timeFrom:lastEntity.timeFrom,
        timeTo:lastEntity.timeTo,
        status:lastEntity.status,
        dateFrom: lastEntity.dateFrom ,
        dateTo: lastEntity.dateTo ,
        createdBy: lastEntity.createdBy,
      };
      Consumer = await calenderConsumer(calenderDTO);
    }

    res.status(200).json(Consumer);
  }catch(error){
    res.status(402).json({message: error.message});
  }
}
module.exports = { addCalenderConsumer, deleteCalender , getUnavailableService , getCalendar, AddServicesToAppointment , deleteServicesAppointment };
