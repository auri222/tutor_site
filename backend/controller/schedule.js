const Schedule = require('../models/Schedule');
const { createError } = require("../ultilities/createError");

const getSchedules = async (req, res, next) => {
  try {
    const schedules = await Schedule.find();
    res.status(200).json(schedules);
  } catch (error) {
    next(error)
  }
}

module.exports = {getSchedules}