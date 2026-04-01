const Room = require("../../model/Room.model");

/* -------------------------------------------------------
   ADMIN — CREATE ROOM
-------------------------------------------------------- */
const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    return res.success("Room created successfully", room);
  } catch (error) {
    return res.error(error.message, 500);
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

    if (!room) return res.error("Room not found", 404);

    return res.success("Room updated successfully", room);
  } catch (error) {
    return res.error(error.message, 500);
  }
};

/* -------------------------------------------------------
   ADMIN — DELETE ROOM
-------------------------------------------------------- */
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.error("Room not found", 404);

    return res.success("Room deleted successfully");
  } catch (error) {
    return res.error(error.message, 500);
  }
};

/* -------------------------------------------------------
   PUBLIC — GET ALL ROOMS
-------------------------------------------------------- */
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    return res.success("Rooms fetched successfully", rooms);
  } catch (error) {
    return res.error(error.message, 500);
  }
};

/* -------------------------------------------------------
   PUBLIC — GET SINGLE ROOM
-------------------------------------------------------- */
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) return res.error("Room not found", 404);

    return res.success("Room details fetched", room);
  } catch (error) {
    return res.error(error.message, 500);
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

    if (!room) return res.error("Room not found", 404);

    return res.success("Room availability updated", room);
  } catch (error) {
    return res.error(error.message, 500);
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