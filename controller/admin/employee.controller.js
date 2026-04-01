
const Employee = require("../../model/Employee.model");

const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, position, salary, joiningDate } =
      req.body;

    let profileImage = "";
    if (req.file) profileImage = req.file.filename;

    const newEmp = await Employee.create({
      name,
      email,
      phone,
      department,
      position,
      salary,
      joiningDate,
      profileImage,
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee: newEmp,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getEmployees = async (req, res) => {
  try {
    const { search, department, status, page = 1, limit = 10, sort = "-createdAt" } =
      req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
      ];
    }

    if (department) query.department = department;
    if (status) query.status = status;

    const employees = await Employee.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Employee.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      employees,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, position, salary, joiningDate, status } =
      req.body;

    let updateData = {
      name,
      email,
      phone,
      department,
      position,
      salary,
      joiningDate,
      status,
    };

    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
};

