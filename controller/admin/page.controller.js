// Admin Offer Controller 
const Page = require("../../model/Page.model");

const getPage = async (req, res) => {
  try {
    const page = await Page.findOne({ pageName: req.params.page });

    if (!page) {
      return res.json({ message: "Page not found", sections: [] });
    }

    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addSection = async (req, res) => {
  try {
    const { sectionType, title, subtitle, description, order } = req.body;

    let page = await Page.findOne({ pageName: "home" });
    if (!page) page = new Page({ pageName: "home", sections: [] });

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.filename);
    }

    const newSection = {
      sectionType,
      title,
      subtitle,
      description,
      order,
      images
    };

    page.sections.push(newSection);
    await page.save();

    res.json({ message: "Section added", page });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, subtitle, description, order, isActive } = req.body;

    const page = await Page.findOne({ "sections._id": sectionId });

    if (!page) return res.status(404).json({ message: "Section not found" });

    const section = page.sections.id(sectionId);

    if (title) section.title = title;
    if (subtitle) section.subtitle = subtitle;
    if (description) section.description = description;
    if (order) section.order = order;
    if (isActive !== undefined) section.isActive = isActive;

    if (req.files && req.files.length > 0) {
      section.images = req.files.map((file) => file.filename);
    }

    await page.save();

    res.json({ message: "Section updated", section });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const page = await Page.findOne({ "sections._id": sectionId });

    if (!page) return res.status(404).json({ message: "Section not found" });

    page.sections = page.sections.filter(sec => sec._id.toString() !== sectionId);

    await page.save();

    res.json({ message: "Section deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addItem = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, description, link, price } = req.body;

    const page = await Page.findOne({ "sections._id": sectionId });
    if (!page) return res.status(404).json({ message: "Section not found" });

    const section = page.sections.id(sectionId);

    let image = "";
    if (req.file) image = req.file.filename;

    section.items.push({ title, description, link, price, image });

    await page.save();

    res.json({ message: "Item added", section });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deleteItem = async (req, res) => {
  try {
    const { sectionId, itemId } = req.params;

    const page = await Page.findOne({ "sections._id": sectionId });
    if (!page) return res.status(404).json({ message: "Section not found" });

    const section = page.sections.id(sectionId);

    section.items = section.items.filter(
      (it) => it._id.toString() !== itemId
    );

    await page.save();

    res.json({ message: "Item deleted", section });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
    getPage,
    addSection,
    updateSection,
    deleteSection,
    addItem,
    deleteItem,
};
