const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/WikiDB');

    const articlesSchema = new mongoose.Schema({
        title: String,
        content: String
    });

    const Article = mongoose.model('Article', articlesSchema);

    const lesson = new Article({
        title: "DOM",
        content: "Document Object Model. It connects web pages to scripts or programming languages by representing the structure of a document—such as the HTML representing a web page—in memory. Usually it refers to JavaScript, even though modeling HTML, SVG, or XML documents as objects are not part of the core JavaScript language."
    });

    // await lesson.save();
    app.get("/articles", async (req, res) => {
        try {
            await Article.find({})
            .then( foundArticles => { res.send(foundArticles); });
        } catch (error) {
            console.log(error);
        }
    });
    //Server Check
    app.listen(3000, () => {
        console.log("Server is Running!");
    });
}