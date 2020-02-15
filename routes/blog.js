var express = require('express');
var router = express.Router();
let BlogRepository = require('./blog.repository');
let fs = require('fs');


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

router.post('/upload', function (req, res, next) {
    file: File = req.body
    console.log('test');
});



module.exports = router;
