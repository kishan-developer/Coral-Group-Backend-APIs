const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  apiKey: {
    type: String,
  },

  endpoint: {
    type: String,
  },

  status: {
    type: Boolean,
    default: true,
  },

  lastSync: {
    type: Date,
  }
});

module.exports = mongoose.model("Channel", channelSchema);