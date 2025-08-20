const Patient = require("../models/patient.model");

exports.getAllPatient = async (req, res) => {
    try {
      const patient = await Patient.findAll();
  
      res.json({ message: 'Patient retrieved successfully', data: patient });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving Patient', error });
    }
  };
  
exports.getOnePatient = async (req, res) => {
    try {
      const patient = await Patient.findByPk(req.params.id);
      if (!patient) return res.status(404).json({ message: 'Patient not found' });
      
      res.json({ message: 'Patient retrieved successfully', data: patient });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving Patient', error });
    }
  };

  exports.postPatient = async (req, res) => {
    try {
      const reqData = req.body;
      const newPatient = await Patient.create(reqData);
  
      res.status(201).json({ message: 'User created successfully', data: newPatient });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  };
  
exports.putPatient = async (req, res) => {
    try {
      const { Patientname, email, role } = req.body;
  
      const [updated] = await Patient.update({ Patientname, email, role }, { where: { id: req.params.id } });
      if (!updated) return res.status(404).json({ message: 'Patient not found' });
  
      const updatedPatient = await Patient.findByPk(req.params.id);
  
      res.json({ message: 'Patient updated successfully', data: updatedPatient });
    } catch (error) {
      res.status(500).json({ message: 'Error updating Patient', error });
    }
  };
  
exports.deletePatient = async (req, res) => {
    try {
      const deleted = await Patient.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ message: 'Patient not found' });
  
      res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting Patient', error });
    }
  };