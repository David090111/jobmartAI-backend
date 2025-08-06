const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: {type: String, required: true},
  price:{type:Number, required: true},
  category: {type: String},
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},{timestamps:true});
module.exports = mongoose.model('Product', productSchema)