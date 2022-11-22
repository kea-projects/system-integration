import mongoose from 'mongoose';

// Changed from products_additional_info => product_additional_info
const ProductAdditionalInfoSchema = new mongoose.Schema({
    product_id: {       
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    choices: {
        type: String,
    },
    additional_info: {
        type: String,
    },
});

export default mongoose.model('ProductAdditionalInfo', ProductAdditionalInfoSchema);