const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://alanpozzi:VxOlk5AISmF1SFk2@cluster0.em2gb.mongodb.net/backend2', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
};

module.exports = connectDB;
