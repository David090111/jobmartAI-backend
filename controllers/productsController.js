const Product = require('../models/Product');


exports.createProduct = async (req, res) => {
  try {
    console.log(" Uploaded file info:", req.file); 

    const { name, description, price, category, phone, email, address } = req.body;

    if (!name || !description || !price) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    const imageUrl = req.file?.path || ""; 

    const product = await Product.create({
      name,
      description,
      price,
      category,
      phone,
      email,
      address,
      image: imageUrl,
      owner: req.user._id,
    });
console.log("Product saved to DB:", product);
    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Server error while creating product" });
  }
};


exports.getProducts = async (req, res) => {
  try {
   
    const { search = "", category } = req.query;
    const regex = new RegExp(search, "i");

    const orConditions = [
      { name: { $regex: regex } },
      { category: { $regex: regex } },
      { description: { $regex: regex } },
      { address: { $regex: regex } },
    ];

    let filter = { $or: orConditions };

    if (category) {
      filter = { $and: [filter, { category }] };
    }

    const products = await Product.find(filter).populate("owner", "name email");
    res.json(products);
  } catch (err) {
    console.error(" Failed to fetch products:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('owner', 'name email');
    if(!product){
        return res.status(404).json({message: "Product not found"})
    }
    res.json(product);
}


exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user._id });
    res.status(200).json(products);
  } catch (error) {
    console.error("Failed to get my products:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    const { name, description, price, category, phone, email, address } = req.body;
    const image = req.file?.path || product.image;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.image = image;
    product.phone = phone || product.phone;
    product.email = email || product.email;
    product.address = address || product.address;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error during update" });
  }
};

exports.deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return res.status(404).json({message: "Product not found"})
    }
    if(product.owner.toString()!== req.user.id){
        return res.status(403).json({message: "You are not authorized to delete this product"})
    }
    await Product.findByIdAndDelete(product._id);

    res.json({message: "Product deleted successfully"});
}
