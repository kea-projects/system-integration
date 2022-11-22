import mongoose from 'mongoose';

const ProductImageSchema = new mongoose.Schema({
    product_id: {       
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    image_url: {
        type: String,
    },
    alt_text: {
        type: String,
    },
    additional_info: {
        type: String,
    },
});

export default mongoose.model('ProductImage', ProductImageSchema);