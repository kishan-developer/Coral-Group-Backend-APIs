const express = require("express");
const {
  createRoom,
  updateRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
  updateAvailability,
} = require("../../controller/admin/room.controller");

const {
    isAuthenticated,
    isAdmin,
} = require("../../middleware/auth.middleware");

const roomrouter = express.Router();

/* Public */
roomrouter.get("/", getAllRooms);
roomrouter.get("/:id", getRoomById);

/* Admin */
roomrouter.post("/",  createRoom);
roomrouter.put("/:id",  updateRoom);
roomrouter.delete("/:id",  deleteRoom);

/* Manager + Admin */
roomrouter.put("/availability/:id",  updateAvailability);

module.exports = roomrouter;