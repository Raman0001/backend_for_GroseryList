const express = require('express');
const router = express.Router();
const dataController = require('../../controller/dataController');

router.route('/')
    .get(dataController.readAllData)
    .post(dataController.createNewData)

router.route('/:id')
    .get(dataController.getData)
    .patch(dataController.updateData)
    .delete(dataController.deleteData);

module.exports = router;