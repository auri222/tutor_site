const express = require('express')
const router = express.Router()

const Province = require('../models/Province')
const District = require('../models/District')
const Ward = require('../models/Ward')

// @route GET api/location/province
// @desc GET all province
// @access Public
router.get('/provinces', async(req, res) => {
    const { ...others } = req.query;
    try {
        const provinces = await Province.find({...others}).limit(req.query.limit)
        res.status(200).json(provinces)
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    
    }
})

// @route GET api/location/province
// @desc GET one province
// @access Public
router.get('/provinces/:code', async(req, res) => {
    try {
        console.log(req.params.code);
        const province = await Province.findOne({code: req.params.code})
        res.status(200).json(province)
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    
    }
})

// @route GET api/location/districts
// @desc GET districts
// @access Public
router.get('/districts', async(req, res) => {
    const {...others} = req.query;
    try {
        const districts = await District.find({...others})
        res.status(200).json(districts)
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    
    }
})
// @route GET api/location/districts
// @desc GET districts by parent_code
// @access Public
router.get('/districts/:province', async(req, res) => {
    try {
        const districts = await District.find({parent_code: req.params.province})
        console.log(districts)
        res.status(200).json(districts)
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    
    }
})

// @route GET api/location/wards
// @desc GET wards
// @access Public
router.get('/wards', async(req, res) => {
    const {...others} = req.query;
    try {
        const wards = await Ward.find({...others})
        res.status(200).json(wards)
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    
    }
})
// @route GET api/location/wards
// @desc GET wards by districts
// @access Public
router.get('/wards/:district', async(req, res) => {
    try {
        const wards = await Ward.find({parent_code: req.params.district})
        console.log(wards)
        res.status(200).json(wards)
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    
    }
})

module.exports = router