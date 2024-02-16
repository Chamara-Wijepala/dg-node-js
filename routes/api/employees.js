const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');

router
	.route('/')
	.get(employeesController.getAllEmployees)
	.post(employeesController.createEmployee)
	.put(employeesController.updateEmployee)
	.delete(employeesController.deleteEmployee);

router
	.route('/:id')
	.get(employeesController.getEmployee)
	.post((req, res) => {})
	.put((req, res) => {})
	.delete((req, res) => {});

module.exports = router;
