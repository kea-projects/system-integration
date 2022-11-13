import mongoose from 'mongoose';

const InviteSchema = new mongoose.Schema({
    invitee_id: {       // TODO: Changed invitee_email to invitee_id since the email isn't needed
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    invited_email: {
        type: String,
    },
    // TODO: bonus
    // token: {
    //     type: String,
    // },
    // expiration: {
    //     type: String,
    // },
});

export default mongoose.model('Invite', InviteSchema);