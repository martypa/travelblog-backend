let express = require('express');
let router = express.Router();
let BlogRepository = require('./blog.repository');
let path = require('path');
let multer = require('multer');
let fs = require('fs');

const PATH = './public/images';


/* GET home page. */
router.post('/login', function (req, res, next) {
    let body = req.body;
    let blogRepo = new BlogRepository();
    blogRepo.createTravel(body).then(h => {
        if(h == 1){
            res.send({
                status: 200,
                ok: true,
            });
            console.log("create Travel successful");
        }else{
            res.sendStatus(400);
            console.log("fail to create new Travel");
        }
    });
});





module.exports = router;
