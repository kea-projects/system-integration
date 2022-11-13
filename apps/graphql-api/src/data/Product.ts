import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    product_name: {
        type: String,
    },
    product_sub_title: {
        type: String,
    },
    product_description: {
        type: String,
    },
    main_category: {
        type: String,
    },
    sub_category: {
        type: String,
    },
    price: {
        type: Number,
    },
    link: {
        type: String,
    },
    overall_rating: {
        type: String,
    },
});

export default mongoose.model('Product', ProductSchema);