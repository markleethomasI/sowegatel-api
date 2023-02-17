const Mongoose = require("mongoose");
const bcrypt = require('bcrypt')


const UserSchema = new Mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: true,
    },
    companyId: {
        type: Mongoose.Types.ObjectId,
    },
    active: { type: Boolean, default: false },
    role: {
        type: String,
        enum: {
            values: ["globalAdmin", "companyAdmin", "companyUser"],
            message: "Role must be companyAdmin, or companyUser",
        },
    },
    tokens: [],
    endpoints: [{
        type: Mongoose.Types.ObjectId
    }]
}, {
    strictQuery: false
});

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 12);
    if (this.isModified("firstName")) this.firstName = this.firstName.trim().toLowerCase();
    if (this.isModified("lastName")) this.lastName = this.lastName.trim().toLowerCase();
    if (this.isModified("email")) this.email = this.email.trim().toLowerCase();

    next();
});

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
UserSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

module.exports = new Mongoose.model("User", UserSchema);
