import Vendor from "../../models/Vendor.js";

// Create Vendor
export const createVendor = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const vendor = await Vendor.create({ name, email, phone, address });
    res.status(201).json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Vendors
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Vendor
export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!vendor)
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Vendor
export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor)
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    res
      .status(200)
      .json({ success: true, message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default { createVendor, getVendors, updateVendor, deleteVendor };
