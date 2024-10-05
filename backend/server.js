import path from "path";
import express, { json }  from "express";
import {v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import notificationRoutes from "./routes/notification.routes.js"
import cookieParser from "cookie-parser";
import connectMongoDB from "./db/connectMongoDB.js";
import postRoutes from "./routes/post.routes.js";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';



cloudinary.config({
    
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const app=express()
const port=process.env.port || 5000;
const __dirname = path.resolve();dotenv.config()

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Social Media API',
        version: '1.0.0',
        description: 'API for managing posts in a social media app',
      },
      servers: [
        {
          url: 'http://localhost:5000/api',
        },
      ],
    },
    apis: ['./routes/*.js'], // Path to the API docs
  };
  
if (process.env.NODE_ENV === "development") {
  const swaggerDocs = swaggerJSDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes);
app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(port,()=>{

    console.log(`Server twitter is running on port:${port}`) 
    connectMongoDB();
})

