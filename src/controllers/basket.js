const { sequelize } = require("../../models/index");
const { Op, where, DATE } = require("sequelize");

 
const {
  createBasket,
  createBasketDetails,
  updateRecordStatus,
  findEntity,
} = require("../services/API'S");
const {
  createTransactionIdOrId,
  wherINJSON,
} = require("../../utility/queryBilder/index");
const addBasket = async (req, res) => {
  // this function to add address to consumer profile
  try {
    let allBasket = [];
    const { mainRevenues, Revenues } = req.body;
    if(Revenues.length ){
    for (let i = 0; i < Revenues?.length; i++) {
      let count = parseInt(Revenues[i].quantity);
      for (let j = 0; j < count; j++) {
        if (Revenues[i].itemType.id === "3") {
          //this is a service so item key is contain provider
          let basketDTO = {
            id: createTransactionIdOrId("CON-CPK-JOR-"),
            transactionId: createTransactionIdOrId("TRN-CON-CPK-JOR-"),
            conMtProfileId: mainRevenues.consumer.id,
            billId: Revenues[i].id,
            itemType: Revenues[i].itemType,
            amount: Revenues[i].amount,
            buyingDate: mainRevenues?.date ? mainRevenues?.date || Revenues[i]?.buyingDate : "",
            expiaryDate: Revenues[i]?.expiaryDate ? Revenues[i].expiaryDate : "",
            status: { id: "1", name: { ar: "متاح", en: "Available" } },
            facility: Revenues[i].facility,
            item: {
              item: Revenues[i].item,
              provider: Revenues[i].price.provider,
            },
          };
          let Basket = await createBasket(basketDTO);
          allBasket.push(Basket);
        } else {
          let basketDTO = {
            id: createTransactionIdOrId("CON-CPK-JOR-"),
            transactionId: createTransactionIdOrId("TRN-CON-CPK-JOR-"),
            conMtProfileId: mainRevenues.consumer.id,
            billId: Revenues[i].id,
            itemType: Revenues[i].itemType,
            //if Revenues.itemType.id == '2' so its product without provider
            item: Revenues[i].item,
            amount: Revenues[i].amount,
            buyingDate: mainRevenues?.date ? mainRevenues?.date || Revenues[i]?.buyingDate : "",
            expiaryDate: Revenues[i]?.expiaryDate ? Revenues[i].expiaryDate : "",
            status: { id: "1", name: { ar: "متاح", en: "Available" } },
            facility: Revenues[i].facility,
          };
          let Basket = await createBasket(basketDTO);
          allBasket.push(Basket);
          if (Revenues[i].itemType.id === "1") {
            let items = Revenues[i].price;
            for (let ele = 0; ele < items?.length; ele++) {
              let count = parseInt(items[ele].quantity);
              for (let tem = 0; tem < count; tem++) {
                let basketDetailsDTO = {
                  id: createTransactionIdOrId("CON-CPS-JOR-"),
                  transactionId: createTransactionIdOrId("TRN-CON-CPS-JOR-"),
                  conRtBasketId: Basket.dataValues.id,
                  price: items[ele].price,
                  status: { id: "1", name: { ar: "متاح", en: "Available" } },
                  item: {
                    service: items[ele].service,
                    provider: items[ele].provider,
                  },
                };
                let basketdetailResponse = await createBasketDetails(
                  basketDetailsDTO
                );
              }
            }
          }
        }
      }
    }
    res.status(200).json(allBasket);
  }
  else{
    res.status(400).json("some of required keys are missed");
  }
  } catch (error) {
    res.status(402).json(error.message);
  }
};
const updateBasket = async (req, res) => {
  try {
    let { servicePackageId, id, itemType, status, usedDate } = req.body;
    let Basket = null;
    if (itemType?.id === "1") {
      let basketDetail = await sequelize.models.basketDetails.findOne({
        where: {
          [Op.and]: [
            { id: servicePackageId },
            status.id === '2' ? wherINJSON("status", "eq", "id", "1"):wherINJSON("status", "eq", "id", "2"),
            { recordStatus: "LATEST" },
          ],
        },
      });
      if (basketDetail) {
        await updateRecordStatus(
          { id: servicePackageId, recordStatus: "LATEST" },
          "basketDetails",
          "UPDATED"
        );
        let details = basketDetail.dataValues;
        details.status = status;
        details.usedDate = status.id === '1'? null : usedDate;
        details.recordStatus = "LATEST";
        delete details.seq;
        let basketResponse = await createBasketDetails(details);
        const givenBasket = await sequelize.models.basketDetails.findOne({
          where: {
            [Op.and]: [
              { conRtBasketId: id },
              wherINJSON("status", "eq", "id", "1"),
              { recordStatus: "LATEST" },
            ],
          },
        });
        if (!givenBasket) {
          let enttt = await sequelize.models.basket.findOne({
            where: {
              [Op.and]: [
                { id: id },
                wherINJSON("status", "eq", "id", "1"),
                { recordStatus: "LATEST" },
              ],
            },
          });
          await updateRecordStatus(
            { id, recordStatus: "LATEST" },
            "basket",
            "UPDATED"
          );
          let baskewtBody = enttt.dataValues;
          delete baskewtBody.seq;
          baskewtBody.status = { id: "2", name: { ar: "مستخدم", en: "Used" } };
          baskewtBody.recordStatus = "LATEST";
          baskewtBody.usedDate = usedDate;
          Basket = await createBasket(baskewtBody);
          // console.log("must  create  new  value");
        }
        res.status(200).json(basketResponse);
      } else {
        res.status(200).json("This service found");
      }

      return;

      // if (basketDetail) {
      //   let enttt = await sequelize.models.basket.findOne({
      //     where: {
      //       [Op.and]: [
      //         { id: id },
      //         wherINJSON("status", "eq", "id", "1"),
      //         { recordStatus: "LATEST" },
      //       ],
      //     },
      //   });
      //   await updateRecordStatus(
      //     { id, recordStatus: "LATEST" },
      //     "basket",
      //     "UPDATED"
      //   );
      //   if (enttt) {
      //     let baskewtBody = enttt.dataValues;
      //     delete baskewtBody.seq;
      //     baskewtBody.recordStatus = "LATEST";
      //     console.log(Basket, "Basket");
      //     await updateRecordStatus(
      //       { id: servicePackageId, recordStatus: "LATEST" },
      //       "basketDetails",
      //       "UPDATED"
      //     );
      //     Basket = await createBasket(baskewtBody);
      //     let details = basketDetail.dataValues;
      //     details.status = { id: "2", name: { ar: "مستخدم", en: "Used" } };
      //     details.usedDate = usedDate;
      //     details.recordStatus = "LATEST";
      //     delete details.seq;
      //     let basketResponse = await createBasketDetails(details);
      //   }
      // } else {
      //   let enttt = await sequelize.models.basket.findOne({
      //     where: {
      //       [Op.and]: [
      //         { id: id },
      //         wherINJSON("status", "eq", "id", "1"),
      //         { recordStatus: "LATEST" },
      //       ],
      //     },
      //   });

      //   if (enttt) {
      //     let checkIfServicePackage =
      //       await sequelize.models.basketDetails.findOne({
      //         where: {
      //           [Op.and]: [
      //             { conRtBasketId: id },
      //             wherINJSON("status", "eq", "id", "1"),
      //             { recordStatus: "LATEST" },
      //           ],
      //         },
      //       });
      //     await updateRecordStatus(
      //       { id, recordStatus: "LATEST" },
      //       "basket",
      //       "UPDATED"
      //     );
      //     let baskewtBody = enttt.dataValues;
      //     delete baskewtBody.seq;
      //     baskewtBody.recordStatus = "LATEST";
      //     console.log(
      //       checkIfServicePackage,
      //       "checkIfServicePackage checkIfServicePackage"
      //     );
      //     if (checkIfServicePackage) {
      //       baskewtBody.status = {
      //         id: "1",
      //         name: { ar: "متاح", en: "Available" },
      //       };
      //     } else {
      //       baskewtBody.status = {
      //         id: "2",
      //         name: { ar: "مستخدم", en: "Used" },
      //       };
      //       baskewtBody.usedDate = usedDate;
      //     }
      //     Basket = await createBasket(baskewtBody);
      //     console.log(Basket, "Basket");
      //   } else {
      //     return res.status(200).json("this package already used");
      //   }
      // }
    } else {
      let itemP = await sequelize.models.basket.findOne({
        where: {
          [Op.and]: [
            { id: id },
            status.id === '2' ? wherINJSON("status", "eq", "id", "1"):wherINJSON("status", "eq", "id", "2"),
            { recordStatus: "LATEST" },
          ],
        },
      });
      // console.log(itemP, "item item item");
      if (itemP) {
        await updateRecordStatus(
          { id, recordStatus: "LATEST" },
          "basket",
          "UPDATED"
        );
        let newItem = itemP.dataValues;
        newItem.status = status;
        newItem.usedDate = status.id === '1'? null : usedDate;
        newItem.recordStatus = "LATEST";
        delete newItem.seq;
        Basket = await createBasket(newItem);
        // console.log(Basket, "Basket Basket ");
      }
    }
    return res.status(200).json({ basket: Basket });
  } catch (error) {
    // console.log(error)
    return res.status(402).json({ message: error.message });
  }
};
module.exports = { addBasket, updateBasket };
