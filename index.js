const express = require("express");
const bodyParser = require("body-parser");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const dotenv = require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const app = express();
const PORT = 5001;

// Connexion à la base de données
dbConnect();

// Middleware de journalisation
app.use(morgan("dev"));

// Configuration du middleware CORS
const allowedOrigins = ["https://admin.ritzglobal.org", "https://ritzglobal.org"];

app.use(cors({
  origin: function (origin, callback) {
    // Vérifier si l'origine est dans la liste des origines autorisées
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true // Permettre l'envoi des cookies et des en-têtes d'identification
}));

// Middleware pour le traitement du corps des requêtes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes de l'application
app.use("/api/user", require("./routes/authRoute"));
app.use("/api/product", require("./routes/productRoute"));
app.use("/api/blog", require("./routes/blogRoute"));
app.use("/api/category", require("./routes/prodcategoryRoute"));
app.use("/api/blogcategory", require("./routes/blogCatRoute"));
app.use("/api/brand", require("./routes/brandRoute"));
app.use("/api/coupon", require("./routes/couponRoute"));
app.use("/api/color", require("./routes/colorRoute"));
app.use("/api/enquiry", require("./routes/enqRoute"));
app.use("/api/upload", require("./routes/uploadRoute"));

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
