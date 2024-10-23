const express = require("express");
const bodyParser = require("body-parser");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const dotenv = require("dotenv").config();
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const blogRoute = require("./routes/blogRoute");
const prodcategoryRoute = require("./routes/prodcategoryRoute");
const blogCatRoute = require("./routes/blogCatRoute");
const brandRoute = require("./routes/brandRoute");
const colorRoute = require("./routes/colorRoute");
const enqRoute = require("./routes/enqRoute");
const couponRoute = require("./routes/couponRoute");
const uploadRoute = require("./routes/uploadRoute");
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
const allowedOrigins = ["https://admin.ritzglobal.org"];

app.use(cors({
  origin: function (origin, callback) {
    // Vérifier si l'origine est dans la liste des origines autorisées
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Inclure toutes les méthodes autorisées
  credentials: true, // Permettre l'envoi des cookies et des en-têtes d'identification
  allowedHeaders: ["Content-Type", "Authorization"], // Spécifiez les en-têtes autorisés
  optionsSuccessStatus: 200 // Pour certains navigateurs plus anciens
}));

// Supporter les requêtes prévol (OPTIONS)
app.options('*', cors());

// Middleware pour le traitement du corps des requêtes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes de l'application
app.use("/api/user", authRoute);
app.use("/api/product", productRoute);
app.use("/api/blog", blogRoute);
app.use("/api/category", prodcategoryRoute);
app.use("/api/blogcategory", blogCatRoute);
app.use("/api/brand", brandRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/color", colorRoute);
app.use("/api/enquiry", enqRoute);
app.use("/api/upload", uploadRoute);

// Route pour la racine
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Gestion des erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
