const Account = require('../models/Account');
const Notification = require('../models/Notification');
const { createError } = require("../ultilities/createError");

const updateStatus = async (req, res, next) => {
  const notificationID = req.params.notificationID;
  try {
    
    const notification = await Notification.findById(notificationID);

    if(!notification)
      return next(createError(404, "Thông báo không tồn tại!"));

    await Notification.findByIdAndUpdate(notificationID, {$set: {
      isRead: true,
    }}, {new:true});
    
    res.status(200).json({success: true, message: "Cập nhật thông báo thành công!"});

  } catch (error) {
    next(error);
  }
}

const updateAllStatus = async (req, res, next) => {
  const accountID = req.params.id;
  try {
    //check account 
    const account = await Account.findById(accountID);
    console.log(account);
    if(!account)
      return next(createError(404, "Tài khoản không tồn tại!"));

    //Load notification with isRead:false
    let total = 0;
    const notification = await Notification.updateMany({receiver: accountID}, {$set: {
      isRead: true
    }})

    res.status(200).json({success: true, message: "Update thành công"});


  } catch (error) {
    next(error);
  }
}

const getNotifications = async (req, res, next) => {
  const {accountID, skip, limit } = req.query;
  try {
    //check account 
    const account = await Account.findById(accountID);
    // console.log(account);
    if(!account)
      return next(createError(404, "Tài khoản không tồn tại!"));
    console.log(account);
    
    let total = await Notification.count({receiver: accountID});
    console.log(total);

    let loadRecord = parseInt(skip) + parseInt(limit);
    if(loadRecord < total){
      isLoadMore = true;
    }
   
    if(total < loadRecord){
      isLoadMore = false
    }
    
    const notification = await Notification.find({receiver: accountID}).sort({"createdAt": -1}).skip(skip).limit(limit);

    res.status(200).json({total: total, notification: notification, skip: parseInt(skip), isLoadMore: isLoadMore});


  } catch (error) {
    next(error);
  }
}

const countNotification = async (req, res, next) => {
  const accountID = req.params.id;
  try {
    
    const count = await Notification.count({receiver: accountID, isRead:false});

    res.status(200).json(count);

  } catch (error) {
    next(error);
  }
}

module.exports = {getNotifications, updateStatus, countNotification, updateAllStatus}
