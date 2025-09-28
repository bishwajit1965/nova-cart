import Contact from "../../models/client/Contact.js";

export const createContact = async (req, res) => {
  try {
    const { name, subject, email, message, avatar, phone } = req.body;
    const newContact = new Contact({
      name,
      subject,
      email,
      message,
      avatar,
      phone,
    });
    const savedContact = await newContact.save();
    res.status(201).json({
      status: "success",
      message: "Contact message created successfully",
      data: savedContact,
    });
  } catch (error) {
    console.error("Error creating contact message:", error);
    res.status(500).json({
      status: "error",
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      results: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({
      status: "error",
      message: "Server Error",
      error: error.message,
    });
  }
};

export default { createContact, getAllContacts };
