import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    name: {
        type: String,
    },
    password: {
        type: String,
    },
});

export default mongoose.model('User', UserSchema);