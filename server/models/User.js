const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    avatar: { 
        public_id: String,
        url: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }
    },
     coverImage: { public_id: String, url: String },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    about: { type: String, default: "Hey there! I am using ChatApp." },
    status: { type: String, enum: ['Online', 'Offline'], default: 'Offline' },
    lastSeen: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    otp: String,
    otpExpiry: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isAdmin: {
    type: Boolean,
    default: false
}
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);