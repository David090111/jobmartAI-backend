const express = require('express');
const cors  = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
connectDB();



app.get("/", (req,res) =>{
    res.send("API is running...");

})

app.use('/api/products', productRoutes);

app.use('/api/jobs', require('./routes/jobRoutes'));

app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/auth', require('./routes/authRoutes'))

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
   

    
})