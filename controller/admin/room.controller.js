const Room = require("../../model/Room.model");

/* -------------------------------------------------------
   ADMIN — CREATE ROOM
-------------------------------------------------------- */
const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* -------------------------------------------------------
   ADMIN — UPDATE ROOM
-------------------------------------------------------- */
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json({
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* -------------------------------------------------------
   ADMIN — DELETE ROOM
-------------------------------------------------------- */
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* -------------------------------------------------------
   PUBLIC — GET ALL ROOMS
-------------------------------------------------------- */
const getAllRooms = async (req, res) => {
  try {
    // get all room from your database if room is created than get all room by find method all rooms store inside the room variable to pass in the json resonse from server side 
    const rooms = await Room.find();

    // her send the response data from server side in json format data change the response inside json i wnat send messagen and status 
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* -------------------------------------------------------
   PUBLIC — GET SINGLE ROOM
-------------------------------------------------------- */
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* -------------------------------------------------------
   MANAGER + ADMIN — UPDATE ROOM AVAILABLE STATUS
-------------------------------------------------------- */
const updateAvailability = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { isAvailable: req.body.isAvailable },
      { new: true }
    );

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json({
      message: "Room availability updated",
      room,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRoom,
  updateRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
  updateAvailability
}