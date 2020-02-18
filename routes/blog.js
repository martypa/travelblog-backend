let express = require('express');
let router = express.Router();
let BlogRepository = require('./blog.repository');
let path = require('path');
let multer = require('multer');
let fs = require('fs');

const PATH = './public/images';

storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, PATH);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

upload = multer({
    storage: storage
});


/* GET home page. */
router.get('/', function(req, res, next) {
    let blogRepo = new BlogRepository();
    blogRepo.getTravels().then(travels => res.send(travels));
});

router.get('/header/:id', function (req, res, next) {
    let blogRepo = new BlogRepository();
    blogRepo.getHeader(req.params.id).then(header => {
        res.send(header);
    });
});

router.get('/entries/:id', function (req, res, next) {
    let blogRepo = new BlogRepository();
    blogRepo.getEntries(req.params.id).then(entries => res.send(entries));
});

router.get('/picture/:pictureName', function (req, res, next) {
    fs.readFile('public/images/' + req.params.pictureName, function (err, content) {
        if(err){
            res.writeHead(400, {'Content-type':'image/jpg'});
            res.end("no such image");
        }else {
            res.writeHead(200, {'Content-type': 'image/jpg'});
            res.end(content);
        }
    })
});

router.post('/upload/BlogEntry', function (req, res, next) {
    let body = req.body;
    let blogRepo = new BlogRepository();
    blogRepo.saveBlogEntry(body).then(h => console.log(h));
    return res.send({
        success: true
    });
});

router.post('/upload/Picture', upload.single('image'), function (req, res) {
    if (!req.file){
        console.log('no file is available!');
        return res.send({
            success: false
        });
    }else{
        console.log('File is available!');
        return res.send({
            filename: req.file.filename
        })
    }
});

router.post('/upload/createTravel', function (req, res, next) {
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
