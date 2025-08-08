require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/prodcategoryRoute");
const blogcategoryRouter = require("./routes/blogCatRoute");
const brandRouter = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const enqRouter = require("./routes/enqRoute");
const couponRouter = require("./routes/couponRoute");
const uploadRouter = require("./routes/uploadRoute");
const bannerRouter = require("./routes/bannerRoute");
const paymentRoute = require("./routes/paymentRoute");
const webhookRoute = require("./routes/webhookRoute");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const PORT = 5001;

// Connexion à la base de données
dbConnect();

// Middleware de journalisation
app.use(morgan("dev"));

// Configuration du middleware CORS
const corsOptions = {
  origin: '*', // Autoriser toutes les origines en développement
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Supporter les requêtes prévol (OPTIONS)
app.options("*", cors());

// Middleware pour le traitement du corps des requêtes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes de l'application
app.use("/api/webhook", webhookRoute);

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/payments", paymentRoute);
// Route pour la racine
app.get("/", (req, res) => {
  res.send(`API is running on port`);
});

// Gestion des erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running at PORT`);
});
