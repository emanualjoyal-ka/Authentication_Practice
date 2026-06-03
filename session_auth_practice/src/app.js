import express from "express";
import session from "express-session";
import authRouter from "./routes/auth.route.js";
// import cookieParser from "cookie-parser";



const app=express();

app.use(express.json()); //middleware to read JSON
// app.use(cookieParser()); 
app.use(
    session({
        secret:process.env.SESSION_SECRET || "mysecretkey",
        resave:false,
        saveUninitialized:false,
        cookie:{
            secure:process.env.NODE_ENV==="production", // Use secure cookies in production
            httpOnly:true, // Prevent client-side JavaScript from accessing the cookie
            maxAge:1000*60*60, // 1 hour
        }
    })
)

app.use("/api/auth",authRouter);

app.get("/", (_req, res) => {
  res.send("API is running 🚀");
});


export default app;