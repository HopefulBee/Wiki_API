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

    ////////////////// Targetting All Articles//////////////////////////////////////
    app.route("/articles")
        .get(async (req, res) => {
            try {
                await Article.find({})
                    .then(foundArticles => { res.send(foundArticles); });
            } catch (error) {
                console.log(error);
            }
        })
        .post(async (req, res) => {
            const topic = new Article({
                title: req.body.title,
                content: req.body.content
            });

            // await topic.save();
            res.send("Added!")
        })
        .delete(async (req, res) => {
            try {
                await Article.deleteMany().then(deletedArticles => { res.send("Successfully deleted") });
            } catch (error) {
                console.log(error);
            }
        });

    //////////////////Targetting Specific Articles//////////////////////////////////
    app.route("/articles/:articleTitle")
        .get(async (req, res) => {
            await Article.findOne({ title: req.params.articleTitle })
                .then(foundArticle => {
                    if (foundArticle) {
                        res.send(foundArticle);
                    } else {
                        res.send("NO MATCH FOUND");
                    }
                });
        })

        .put( async (req, res) => {
            let query = req.params.articleTitle;
            await Article.updateOne( 
                {title: query},
                {title: req.body.title, content: req.body.content},
                {overwrite: true}).then(updatedArticle => {
                    if (updatedArticle) {
                        res.send("Updated Successfully");
                    } else {
                        res.send("No updates made")
                    }
                });
        });

    //Server Check
    app.listen(3000, () => {
        console.log("Server is Running!");
    });
}