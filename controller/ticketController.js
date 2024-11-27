const busModel = require("../models/busModel");
const ticketModel = require("../models/ticketModel");

const uploadTicket = async (req, res) => {
    try {
      const { bus, user, price, seatNumber, timeSlot } = req.body;
  
      // Validate input
      if (!bus || !user || !price || !seatNumber || !timeSlot) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Check if the bus exists
      const busExists = await busModel.findById(bus);
      if (!busExists) {
        return res.status(404).json({ message: 'Bus not found' });
      }
  
      // Create a new ticket
      const newTicket = await ticketModel.create({
        bus,
        user,
        price,
        seatNumber,
        timeSlot,
      });
  
      return res.status(201).json({ 
        status: 'success', 
        message: 'Ticket uploaded successfully', 
        ticket: newTicket 
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to upload ticket', error: error.message });
    }
  };


  const updateTicket = async (req, res) => {
    try {
      const { id } = req.params;
      const { bus, user, price, seatNumber, timeSlot } = req.body;
  
      // Find and update the ticket
      const updatedTicket = await ticketModel.findByIdAndUpdate(
        id,
        { bus, user, price, seatNumber, timeSlot },
        { new: true, runValidators: true }
      );
  
      if (!updatedTicket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
  
      return res.status(200).json({ 
        status: 'success', 
        message: 'Ticket updated successfully', 
        ticket: updatedTicket 
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update ticket', error: error.message });
    }
  };

  const deleteTicket = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the ticket exists
      const ticket = await ticketModel.findById(id);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
  
      // Delete the ticket
      await ticketModel.findByIdAndDelete(id);
  
      return res.status(200).json({ 
        status: 'success', 
        message: 'Ticket deleted successfully' 
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete ticket', error: error.message });
    }
  };

  const getAvailableTickets = async (req, res) => {
    try {
      const { busId, timeSlot } = req.query;
      const query = {};
      if (busId) query.bus = busId;
      if (timeSlot) query.timeSlot = new Date(timeSlot);
  
      const tickets = await ticketModel.find(query).populate('bus user', '-password');
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
  };

  const purchaseTicket = async (req, res) => {
    try {
      const { busId, userId, price, seatNumber, timeSlot } = req.body;
  
      // Validate the bus existence and seat availability
      const bus = await busModel.findById(busId);
      if (!bus) {
        return res.status(404).json({ message: 'Bus not found' });
      }
  
      // Check if the seat is already booked for the specified time slot
      const isSeatBooked = await ticketModel.findOne({
        bus: busId,
        timeSlot: new Date(timeSlot),
        seatNumber,
      });
  
      if (isSeatBooked) {
        return res.status(400).json({ message: 'Seat is already booked' });
      }
  
      // Create a new ticket
      const ticket = new ticketModel({
        bus: busId,
        user: userId,
        price,
        seatNumber,
        timeSlot: new Date(timeSlot),
      });
  
      await ticket.save();
  
      res.status(201).json({ message: 'Ticket purchased successfully', ticket });
    } catch (error) {
      res.status(500).json({ message: 'Error purchasing ticket', error: error.message });
    }
  };


module.exports = {uploadTicket, updateTicket, deleteTicket,getAvailableTickets,purchaseTicket}
  