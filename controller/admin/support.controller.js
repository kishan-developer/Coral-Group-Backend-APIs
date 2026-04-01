const Support = require("../../model/Support.model");

const createSupport = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const support = await Support.create({
            name,
            email,
            phone,
            subject,
            message,
        });

        res.status(201).json({
            message: "Support request submitted",
            support,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllSupport = async (req, res) => {
    try {
        const supports = await Support.find().sort({ createdAt: -1 });

        res.json({
            total: supports.length,
            supports,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSingleSupport = async (req, res) => {
    try {
        const support = await Support.findById(req.params.id);

        if (!support) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.json(support);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSupportStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const support = await Support.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json({
            message: "Status updated",
            support,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const replySupport = async (req, res) => {
    try {
        const { adminReply } = req.body;

        const support = await Support.findByIdAndUpdate(
            req.params.id,
            { adminReply, status: "resolved" },
            { new: true }
        );

        res.json({
            message: "Reply sent",
            support,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteSupport = async (req, res) => {
  try {
    await Support.findByIdAndDelete(req.params.id);

    res.json({
      message: "Support ticket deleted",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    createSupport,
    getAllSupport,
    getSingleSupport,
    updateSupportStatus,
    replySupport,
    deleteSupport,
    
};