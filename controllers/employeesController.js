const data = {
	employees: require('../model/employees.json'),
	setEmployees: function (data) {
		this.employees = data;
	},
};

const getAllEmployees = (req, res) => {
	res.json(data.employees);
};

const getEmployee = (req, res) => {
	const employee = data.employees.find(
		(emp) => emp.id === parseInt(req.params.id)
	);
	if (!employee) {
		return res
			.status(400)
			.json({ message: `Employee ID ${req.body.id} not found` });
	}
	res.json(employee);
};

const createEmployee = (req, res) => {
	const newEmployee = {
		id: data.employees[data.employees.length - 1].id + 1 || 1,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
	};

	if (!newEmployee.firstname || !newEmployee.lastname) {
		return res
			.setEmployees(400)
			.json({ message: 'first and last names are required' });
	}

	data.setEmployees([...data.employees, newEmployee]);
	res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
	// find employee from list
	const employee = data.employees.find(
		(emp) => emp.id === parseInt(req.body.id)
	);
	// return error if employee doesn't exist
	if (!employee) {
		return res
			.status(400)
			.json({ message: `Employee ID ${req.body.id} not found` });
	}
	// update employee
	if (req.body.firstname) employee.firstname = req.body.firstname;
	if (req.body.lastname) employee.lastname = req.body.lastname;
	// filter employee from list
	const filteredArray = data.employees.filter(
		(emp) => emp.id !== parseInt(req.body.id)
	);
	const unsortedArray = [...filteredArray, employee];
	// set sorted employee list
	data.setEmployees(
		unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
	);
	res.json(data.employees);
};

const deleteEmployee = (req, res) => {
	const employee = data.employees.find(
		(emp) => emp.id === parseInt(req.body.id)
	);
	if (!employee) {
		return res
			.status(400)
			.json({ message: `Employee ID ${req.body.id} not found` });
	}
	const filteredArray = data.employees.filter(
		(emp) => emp.id !== parseInt(req.body.id)
	);
	data.setEmployees([...filteredArray]);
	res.json(data.employees);
};

module.exports = {
	getAllEmployees,
	getEmployee,
	createEmployee,
	updateEmployee,
	deleteEmployee,
};
