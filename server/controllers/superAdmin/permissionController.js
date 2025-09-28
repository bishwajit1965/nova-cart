import Permission from "../../models/Permission.js";

export const createPermission = async (req, res) => {
  try {
    const { key, name, description } = req.body;
    if (!key || !name)
      return res.status(400).json({ message: "key and name are required" });
    const existing = await Permission.findOne({ key });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Permission already exists." });
    }
    const permission = new Permission({ key, name, description });
    await permission.save();
    res.status(201).json({
      success: true,
      message: "Permission created successfully",
      data: permission,
    });
  } catch (error) {
    console.error("Permission creation error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      message: "Permissions fetched successfully",
      data: permissions,
    });
  } catch (error) {
    console.error("Permission not fetched", error);
    res.status.json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getPermission = async (req, res) => {
  try {
    const { id } = req.params.id;
    const permission = await Permission.findById(id);
    if (!permission)
      return res
        .status(404)
        .json({ success: false, message: "Permission not found" });
  } catch (error) {
    console.error("Error in fetching Permission", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { key, name, description } = req.body;

    const updateData = {};
    if (key !== undefined) updateData.key = key;
    if (name) {
      updateData.name = name;
    }
    if (description !== undefined) updateData.description = description;

    const permission = await Permission.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!permission)
      return res
        .status(404)
        .json({ success: false, message: "Permission not found." });
    res.status(200).json({
      success: true,
      message: "Permission updated successfully!",
      data: permission,
    });
  } catch (error) {
    console.error("Permission not updated.", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Permission.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Permission is not found!" });
    res
      .status(200)
      .json({ success: true, message: "Permission deleted successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Seeder for default permissions
export const seedPermissions = async (req, res) => {
  try {
    const defaultPermissions = [
      // Permission management
      {
        key: "permission:create",
        name: "Create Permission",
        description: "Can create permission",
      },
      {
        key: "permission:read",
        name: "Read Permission",
        description: "Can read permission",
      },
      {
        key: "permission:update",
        name: "Update Permission",
        description: "Can update permission",
      },
      {
        key: "permission:delete",
        name: "Delete Permission",
        description: "Can delete permission",
      },

      // Product Management
      {
        key: "product:create",
        name: "Create product",
        description: "Create products",
      },
      {
        key: "product:read",
        name: "Read product",
        description: "View products",
      },
      {
        key: "product:update",
        name: "Update product",
        description: "Update products",
      },
      {
        key: "product:delete",
        name: "Delate product",
        description: "Delete products",
      },

      // Category Management
      {
        key: "category:create",
        name: "Can create category",
        description: "Create categories",
      },
      {
        key: "category:read",
        name: "Can read category",
        description: "View categories",
      },
      {
        key: "category:update",
        name: "Can update category",
        description: "Update categories",
      },
      {
        key: "category:delete",
        name: "Can delete category",
        description: "Delete categories",
      },

      // Order Management
      {
        key: "order:read",
        name: "Can create order",
        description: "View orders",
      },
      {
        key: "order:update",
        name: "Can update order",
        description: "Update orders",
      },
      {
        key: "order:delete",
        name: "Can delete order",
        description: "Delete orders",
      },

      // User Management
      { key: "user:read", name: "Can read users", description: "View users" },
      {
        key: "user:update",
        name: "Can update users",
        description: "Update users",
      },
      {
        key: "user:delete",
        name: "Can delete users",
        description: "Delete users",
      },
    ];

    let createdCount = 0;

    for (const perm of defaultPermissions) {
      const exists = await Permission.findOne({ key: perm.key });
      if (!exists) {
        await Permission.create(perm);
        createdCount++;
      }
    }

    res.json({
      message: `Seeder completed. ${createdCount} new permissions added.`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default {
  createPermission,
  getAllPermissions,
  getPermission,
  deletePermission,
  updatePermission,
  seedPermissions,
};

//POSTMAN seeding uri
//POST http://localhost:3000/api/superAdmin/permissions/seed
