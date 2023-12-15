import "dotenv/config";
import express from "express";
import RecipeDb from "./recipeDb.js";
import RecipeController from "./controllers/recipeController.js";
import multer from "multer";
import fs from "fs";

class RecipeServer {
  constructor(dburl) {
    this.app = express();
    this.app.use(express.static("client"));
    this.app.use(express.json());
    this.upload = multer({ dest: "server/uploads" });
    this.dburl = dburl;
  }

  async init_db() {
    this.recipeDb = new RecipeDb(this.dburl);
    await this.recipeDb.connect();
  }
  async init_controller() {
    this.recipeController = new RecipeController(this.recipeDb);
  }

  async init_routes() {
    const _deleteOldImage = (imageUrl) => {
      fs.unlink(`server/uploads/${imageUrl}`, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    };

    this.app.post("/create", this.upload.single("file"), async (req, res) => {
      console.log("Received request to create recipe");
      const reqBody = req.body;
      const valid = ["name", "ingredients", "instructions"].every(
        (e) => reqBody[e] !== undefined && reqBody[e] !== ""
      );
      reqBody["imageUrl"] = req.file.filename;
      if (valid) {
        const worked = await this.recipeController.saveRecipe(reqBody);
        if (worked !== -1) {
          res.send("<h1>Recipe Saved</h1>");
        } else {
          res.status(400).send("<h1>Recipe Already Exists</h1>");
        }
      } else {
        _deleteOldImage(reqBody["imageUrl"]);
        res.status(400).send("<h1>Bad Request</h1>");
      }
    });

    this.app.get("/recipe", async (req, res) => {
      console.log("Received request to get recipe");
      const worked = await this.recipeController.getRecipe(req.query.name);
      if (worked !== -1) {
        res.send(worked);
      } else {
        res.status(400).send("<h1>Recipe Not Found</h1>");
      }
    });

    this.app.get("/img", async (req, res) => {
      console.log("Received request to get image");
      if (req.query.id !== undefined) {
        const imgId = req.query.id.toString();
        res.sendFile(`server/uploads/${imgId}`, { root: "." });
      } else {
        res.status(400).send("<h1>Bad Request</h1>");
      }
    });

    this.app.get("/filter", async (req, res) => {
      console.log("Received request to get filtered recipes");
      const worked = await this.recipeController.getFilterRecipes(
        req.query.name
      );
      if (worked !== -1) {
        res.send(worked);
      } else {
        res.status(400).send("<h1>No Such Recipes Found</h1>");
      }
    });

    this.app.get("/dump", async (req, res) => {
      console.log("Received request to get all recipes");
      const worked = await this.recipeController.getAllRecipes();
      if (worked !== -1) {
        res.send(worked);
      } else {
        res.status(400).send("<h1>Recipe Not Found</h1>");
      }
    });

    this.app.put("/update", this.upload.single("file"), async (req, res) => {
      console.log("Received request to update recipe");
      const reqBody = req.body;
      const valid = ["name", "ingredients", "instructions"].every(
        (e) => reqBody[e] !== undefined && reqBody[e] !== ""
      );
      reqBody["imageUrl"] = req.file.filename;
      if (valid) {
        const worked = await this.recipeController.modifyRecipe(reqBody);
        if (worked !== -1) {
          res.send("<h1>Recipe Modified</h1>");
        } else {
          res.status(400).send("<h1>Recipe Not Found</h1>");
        }
      } else {
        _deleteOldImage(reqBody["imageUrl"]);
        res.status(400).send("<h1>Bad Request</h1>");
      }
    });

    this.app.delete("/delete", async (req, res) => {
      console.log("Received request to delete recipe");
      const worked = await this.recipeController.deleteRecipe(req.query.name);
      if (worked !== -1) {
        res.send("<h1>Recipe Deleted</h1>");
      } else {
        res.status(400).send("<h1>Recipe Not Found</h1>");
      }
    });
  }

  async start() {
    await this.init_db();
    await this.init_controller();
    await this.init_routes();
    this.app.listen(process.env.PORT || 3000, () => {
      console.log(
        "Server started at",
        `http://127.0.0.1:${process.env.PORT || 3000}`
      );
    });
  }
}
const server = new RecipeServer(process.env.DB_URL);
await server.start();
