const { registerUser, loginUser, logoutUser } = require("../controller/authController");
const { addBus, updateBus, deleteBus, getAllBuses } = require("../controller/busController");
const { uploadTicket, updateTicket, deleteTicket, getAvailableTickets, purchaseTicket } = require("../controller/ticketController");

const router = require("express").Router();

// Authentication APIs
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/logout', logoutUser);

//Admin APIs
router.post('/admin/bus', addBus);
router.put('/admin/bus/:id', updateBus);
router.delete('/admin/bus/:id', deleteBus);
router.post('/admin/ticket', uploadTicket);
router.put('/admin/ticket/:id', updateTicket);
router.delete('/admin/ticket/:id', deleteTicket);

//User APIs
router.get('/buses', getAllBuses);
router.get('/tickets', getAvailableTickets);
router.post('/tickets/purchase', purchaseTicket);

module.exports = router;