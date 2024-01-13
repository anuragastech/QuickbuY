const express = require('express');
const router=express.Router();
const multer = require("../models/admin/multerconfig");
const upload = multer.single("image");
