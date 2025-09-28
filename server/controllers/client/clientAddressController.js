import Address from "../../models/client/Address.js";

export const createAddress = async (req, res) => {
  try {
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({
        success: false,
        message: "Address data is required",
      });
    }

    // Attach the logged-in user
    const newAddress = new Address({
      ...formData,
      user: req.user._id,
    });

    const savedAddress = await newAddress.save();

    res.status(201).json({
      success: true,
      message: "Address created successfully!",
      data: savedAddress,
    });
  } catch (error) {
    console.error("Error in creating address", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({});
    if (!addresses)
      return res
        .status(404)
        .json({ success: false, message: "Addresses not found" });

    res.status(200).json({
      success: true,
      message: "Addresses fetched successfully!",
      data: addresses,
    });
  } catch (error) {
    console.error("Error in fetching addresses!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      message: error.message,
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { formData } = req.body;
    const userId = req.user._id;

    // If the updated address is being set as default
    if (formData.isDefault === true) {
      // Reset other addresses
      await Address.updateMany(
        { user: userId, _id: { $ne: formData._id } },
        { $set: { isDefault: false } }
      );
    }

    // Update the selected address
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: formData._id, user: userId },
      { $set: formData },
      { new: true }
    );

    if (!updatedAddress)
      return res.status(404).json({ message: "Address not found!" });

    res.status(200).json({
      success: true,
      message: "Address updated successfully!",
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Error in updating addresses!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user._id;

    // Step 1: Set all user's addresses to isDefault: false
    await Address.updateMany(
      { user: userId, isDefault: true },
      { $set: { isDefault: false } }
    );

    // Step 2: Set the clicked address to isDefault: true
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!updatedAddress)
      return res
        .status(404)
        .json({ success: false, message: "Address not found!" });

    res.status(200).json({
      success: true,
      message: "Default address updated successfully!",
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Error setting default address", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const deletedAddress = await Address.findByIdAndDelete(addressId);
    if (!deletedAddress)
      return res
        .status(404)
        .json({ success: false, message: "Address not found!" });
    res.status(200).json({
      success: true,
      message: "Address deleted successfully!",
      data: deletedAddress,
    });
  } catch (error) {
    console.error("Error in deleting address", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      message: error.message,
    });
  }
};

export default {
  createAddress,
  getAddresses,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
};
