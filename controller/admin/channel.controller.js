const Channel = require("../../model/Channel.model");

// ====================================
// CREATE CHANNEL
// ====================================
const createChannel = async (req, res) => {
  try {
    const { name, apiKey, apiSecret } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Channel name is required" });
    }

    // Check duplicate
    const existing = await Channel.findOne({ name: name.toLowerCase(), isDeleted: false });
    if (existing) {
      return res.status(409).json({ error: "Channel already exists" });
    }

    const channel = await Channel.create({
      ...req.body,
      name: name.toLowerCase(),
    });

    res.status(201).json({
      success: true,
      message: "Channel created successfully",
      data: channel,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================================
// GET ALL CHANNELS (with search + pagination)
// ====================================
const getChannels = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;

    const query = {
      isDeleted: false,
      name: { $regex: search, $options: "i" },
    };

    const channels = await Channel.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Channel.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: channels,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================================
// UPDATE CHANNEL
// ====================================
const updateChannel = async (req, res) => {
  try {
    if (req.body.name) {
      req.body.name = req.body.name.toLowerCase();
    }

    const channel = await Channel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    res.json({
      success: true,
      message: "Channel updated successfully",
      data: channel,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================================
// SOFT DELETE CHANNEL
// ====================================
const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel || channel.isDeleted) {
      return res.status(404).json({ error: "Channel not found" });
    }

    channel.isDeleted = true;
    await channel.save();

    res.json({
      success: true,
      message: "Channel deleted successfully",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================================
// ACTIVATE / DEACTIVATE CHANNEL
// ====================================
const toggleChannelStatus = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel || channel.isDeleted) {
      return res.status(404).json({ error: "Channel not found" });
    }

    channel.isActive = !channel.isActive;
    await channel.save();

    res.json({
      success: true,
      message: `Channel ${channel.isActive ? "activated" : "deactivated"}`,
      data: channel,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createChannel,
  getChannels,
  updateChannel,
  deleteChannel,
  toggleChannelStatus
};