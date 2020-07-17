const { Router } = require("express");
const router = Router();
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'user_images/')
    },
    filename: function (req, file, cb) {
        console.log(req.session);
        cb(null, req.session.user_id + '-' + file.originalname + '.png');
    }
})

let upload = multer({storage: storage});

module.exports = (app) => {
    app.use("/free_drawing", router);

    router.get("/", (req, res) => {
        error = req.query.err;
        if (error){
            res.render("errore");
        }
        else {
            res.render("free_drawing/freeDraw",{
            });
        }
    });

    router.post("/save", upload.single('file'), (req, res) => {
        console.log(req.file);
        res.json(req.file);
    });
};

