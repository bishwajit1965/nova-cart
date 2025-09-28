import Permission from "../../models/Permission.js";
import Role from "../../models/Role.js";
import { validationResult } from "express-validator";

// Create a new role manually
export const createRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, description, permissions } = req.body;

    const existing = await Role.findOne({ name: name.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Role name already exists" });
    }

    // permissions is expected to be an array of permission IDs
    const role = new Role({
      name: name.toLowerCase(),
      description,
      permissions,
    });
    await role.save();

    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all roles with populated permissions
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find()
      .populate("permissions", "name key")
      .sort({ name: 1 });
    res.status(200).json({
      success: true,
      message: "Roles fetched successfully",
      data: roles,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params.id;
    const role = await Role.findById(id).populate("permissions");
    if (!role)
      return res
        .status(404)
        .json({ success: false, message: "Role not found!" });
    res.status(200).json({
      success: true,
      message: "Role is fetched successfully!",
      data: role,
    });
  } catch (error) {
    console.error("Error in fetching role", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: "Permissions must be an array" });
    }

    // Validate permissions exist
    const validPermissions = await Permission.find({
      _id: { $in: permissions },
    }).select("_id");

    if (validPermissions.length !== permissions.length) {
      return res
        .status(400)
        .json({ message: "One or more permissions are invalid" });
    }

    // Update role with validators
    const updatedRole = await Role.findByIdAndUpdate(
      id,
      {
        name,
        description,
        permissions: validPermissions.map((p) => p._id),
      },
      {
        new: true, // return updated doc
        runValidators: true, // enforce schema validations
      }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Populate permissions after update
    await updatedRole.populate("permissions", "name key description");

    res.status(200).json({
      message: "Role updated successfully",
      role: updatedRole,
    });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a role by id
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Role.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Role not found" });

    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Seeder for default roles with assigned permissions
export const seedRoles = async (req, res) => {
  try {
    // Fetch permissions once
    const permissions = await Permission.find();

    // Helper to get permission IDs by key
    const permIds = (keys) =>
      permissions.filter((p) => keys.includes(p.key)).map((p) => p._id);

    const defaultRoles = [
      {
        name: "superAdmin",
        description: "Has all permissions",
        permissions: permissions.map((p) => p._id), // all perms
      },
      {
        name: "admin",
        description: "Admin with management permissions",
        permissions: permIds([
          "product_create",
          "product_read",
          "product_update",
          "product_delete",
          "category_create",
          "category_read",
          "category_update",
          "category_delete",
          "order_read",
          "order_update",
          "order_delete",
          "user_read",
          "user_update",
          "user_delete",
        ]),
      },
      {
        name: "vendor",
        description: "Vendor with limited product management",
        permissions: permIds([
          "product_create",
          "product_read",
          "product_update",
          "category_read",
          "order_read",
        ]),
      },
      {
        name: "customer",
        description: "Regular user with read-only permissions",
        permissions: permIds(["product_read", "category_read", "order_read"]),
      },
      {
        name: "user",
        description: "Regular user with read-only permissions",
        permissions: permIds(["product_read"]),
      },
    ];

    let createdCount = 0;
    for (const roleData of defaultRoles) {
      const existing = await Role.findOne({ name: roleData.name });
      if (!existing) {
        await Role.create(roleData);
        createdCount++;
      }
    }

    res.json({ message: `Seeder completed. ${createdCount} new roles added.` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  seedRoles,
};

//POSTMAN
// POST http://localhost:3000/api/admin/roles/seed
