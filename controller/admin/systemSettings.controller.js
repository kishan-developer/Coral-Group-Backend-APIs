const SystemSettings = require("../../model/SystemSettings.model");

// GET Settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne();

    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// UPDATE Settings
exports.updateSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();

    if (!settings) {
      settings = await SystemSettings.create(req.body);
      return res.json({ message: "Settings created", settings });
    }

    const updatedSettings = await SystemSettings.findOneAndUpdate(
      {},
      { ...req.body, updatedBy: req.adminId || "system" },
      { new: true }
    );

    res.json({ message: "Settings updated", settings: updatedSettings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// RESET Settings (optional)
exports.resetSettings = async (req, res) => {
  try {
    await SystemSettings.deleteMany();

    res.json({ message: "System settings reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};