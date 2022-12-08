const Notification = require('../models/Notification');
const Contact = require('../models/Contact');
const {createError} = require('../ultilities/createError');
const {receiveMail} = require('../ultilities/sendMail');
const { default: mongoose } = require('mongoose');
const Account = require('../models/Account');

const createContact = async (req, res, next) => {
  const {contact} = req.body;
  try {
    // console.log(contact);
    const newContact = new Contact({
      content: contact.content,
      sender: contact.sender,
      isCheck: false,
      createdAt: new Date()
    });

    const admin = await Account.find({accountType: 'ADMIN', isAdmin: true});
    

    const newNotification = new Notification({
      receiver: '638e4c36ec0debf428f7f6c0',
      sender: contact.sender,
      type: 'SYSTEM',
      message: `Người dùng ${contact.sender} (${contact.email}) đã liên hệ với bạn thông qua email.`,
      isRead: false,
      typeID: null
    });

    const subject = `Liên hệ từ ${contact.sender} <${contact.email}>`;
    await receiveMail(contact.sender, contact.email, subject, contact.content);
    await newContact.save();
    await newNotification.save();

    res.status(200).json({success: true, message: "Liên hệ thành công!"});

  } catch (error) {
    next(error);
  }
}

const checkContact = async (req, res, next) => {
  const contactID = req.params.contactID;
  try {
    
    const contact = await Contact.findById(contactID);
    if(!contact)
      return next(createError(404, "Thông tin liên hệ không tồn tại!"));

    await Contact.findByIdAndUpdate(contactID, {$set: {
      isCheck: true
    }}, {new:true});

    res.status(200).json({success: true, message: "Check thành công!"});

  } catch (error) {
    next(error);
  }
}

const getContact = async (req, res, next) => {

  try {
    
    const contact = await Contact.find().sort({"createdAt":-1});

    res.status(200).json({contact: contact, total: contact.length});

  } catch (error) {
    next(error);
  }
}

module.exports = {getContact, checkContact, createContact};