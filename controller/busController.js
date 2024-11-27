const busModel = require("../models/busModel");

const addBus = async (req, res) => {
  try {
    const { name, departure, destination, seats } = req.body;

    // Validate input
    if (!name || !departure || !destination || !seats) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new bus
    const newBus = await busModel.create({
      name,
      departure,
      destination,
      seats,
    });

    return res.status(201).json({ 
      status: 'success', 
      message: 'Bus added successfully', 
      bus: newBus 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add bus', error: error.message });
  }
};


const deleteBus = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the bus exists
      const bus = await busModel.findById(id);
      if (!bus) {
        return res.status(404).json({ message: 'Bus not found' });
      }
  
      // Delete the bus
      await busModel.findByIdAndDelete(id);
  
      return res.status(200).json({ 
        status: 'success', 
        message: 'Bus deleted successfully' 
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete bus', error: error.message });
    }
  };

  
  const updateBus = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, departure, destination, seats } = req.body;
  
      // Find and update the bus
      const updatedBus = await busModel.findByIdAndUpdate(
        id,
        { name, departure, destination, seats },
        { new: true, runValidators: true }
      );
  
      if (!updatedBus) {
        return res.status(404).json({ message: 'Bus not found' });
      }
  
      return res.status(200).json({ 
        status: 'success', 
        message: 'Bus updated successfully', 
        bus: updatedBus 
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update bus', error: error.message });
    }
  };

  const getAllBuses = async (req, res) => {
    try {
      const buses = await busModel.find();
      res.status(200).json(buses);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching buses', error: error.message });
    }
  };

  
module.exports = {addBus, updateBus, deleteBus, getAllBuses}