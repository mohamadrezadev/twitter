import mongoose  from "mongoose";

// Function to connect to MongoDB
const connectMongoDB = async (retryAttempts = 5) => {
    let attempt = 0;
    const connectWithRetry = async () => {
        try {
            const conn = await mongoose.connect(process.env.MONGODB_URL, {
                connectTimeoutMS: 30000,
                socketTimeoutMS: 45000,
            });
            console.log(`MongoDB connected: ${conn.connection.host}`);
        } catch (error) {
            attempt++;
            console.error(`MongoDB connection error (attempt ${attempt}): ${error.message}`);
            if (attempt < retryAttempts) {
                const retryDelay = Math.min(attempt * 2000, 10000); // Exponential backoff: 2s, 4s, 6s, 8s, 10s
                console.log(`Retrying connection in ${retryDelay / 1000} seconds...`);
                setTimeout(connectWithRetry, retryDelay); // Retry after a delay
            } else {
                console.error('Max retry attempts reached. Could not connect to MongoDB.');
                process.exit(1); // Exit if max attempts reached
            }
        }
    };

    connectWithRetry(); 
};

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected to the database.');
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose is disconnected from the database.');
});

mongoose.connection.on('reconnected', () => {
    console.log('Mongoose has reconnected to the database.');
});

mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err.message}`);
});

// Export the connection function

// const connectMongoDB=async ()=>{
//     try {
//         const conn=await mongoose.connect(process.env.mongodb_Url,{
//             connectTimeoutMS: 30000, // 30 seconds
//             socketTimeoutMS: 45000
//         });
    
//         console.log(`MongoDB connected: ${conn.connection.host}`);

//     } catch (error) {
//         console.log(`Error Connection to mongodb : ${error.message} `);
//         process.exit(1);
        

//     }
// }
export default connectMongoDB;