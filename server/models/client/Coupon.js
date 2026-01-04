import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ["fixed", "percentage"], required: true },
    value: { type: Number, required: true }, // fixed amount or percentage
    minPurchase: { type: Number, default: 0 }, // optional minimum order total
    maxDiscount: { type: Number }, // optional max discount for percentage
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 1 }, // per user or global
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

couponSchema.pre("save", async function (next) {
  if (!this.code) {
    const generateCode = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let newCode = generateCode();

    // Ensure uniqueness
    let exists = await mongoose.models.Coupon.findOne({ code: newCode });
    while (exists) {
      newCode = generateCode();
      exists = await mongoose.models.Coupon.findOne({ code: newCode });
    }

    this.code = newCode;
  }
  next();
});

// couponSchema.pre("save", async function (next) {
//   if (!this.code) {
//     const generateCode = () => {
//       const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//       return Array.from({ length: 8 }, () =>
//         chars.charAt(Math.floor(Math.random() * chars.length))
//       ).join("");
//     };

//     let newCode;
//     let exists = true;

//     while (exists) {
//       newCode = generateCode();
//       exists = await mongoose.models.Coupon.findOne({ code: newCode });
//     }

//     this.code = newCode;
//   } else {
//     this.code = this.code.toUpperCase().trim();
//   }

//   next();
// });

// Pre-save hook to generate a unique coupon code if not provided

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
