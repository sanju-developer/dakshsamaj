const mongoose = require('mongoose');

const UserBackgroundInfoSchema = mongoose.Schema({
    name: { type: String },
    lastname: { type: String },
    caste: { type: String },
    contact: { type: Number },
    address: { type: String },
    city: { type: String },
    area: { type: String },
    state: { type: String },
    email: { type: String },
    password: { type: String },
    age: { type: Number},
    dob: { typ: String },
    gender: { type: String },
    married: { type: String },
    fathers_name: { type: String },
    no_of_family_member: { type: Array },
    occupation: { type: String },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
});

UserBackgroundInfoSchema.pre('save', () => {
    updated_date: new Date();
});

const UserBackgroundInfo = module.exports = mongoose.model('UserBackgroundInfo', UserBackgroundInfoSchema);
