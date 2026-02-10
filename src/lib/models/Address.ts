import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });

export const Address =
    mongoose.models.Address || mongoose.model("Address", AddressSchema);
