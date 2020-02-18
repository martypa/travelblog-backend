let express = require('express');
let router = express.Router();
let BlogRepository = require('./blog.repository');
let multer = require('multer');
let UserRepository = require('./user.repository');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const PATH = './public/images';
const jwtKey = 'b668851328d2992a2a983ae1e1a2c46448a8e8f364bc7311c6b47cc6d5712cede1028d656160da9c765033e0f93a625a0f3642a9787a72cac61a6bdb5f1261a7';
const jwtExpirySeconds = 1800;

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
    let token = req.headers.authorization;
    var payload;
    try{
        payload = jwt.verify(token, jwtKey);
    }catch (e) {
        if(e instanceof jwt.JsonWebTokenError) {
            return res.sendStatus(401);
        }
        return res.sendStatus(400);
    }
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
    let token = req.headers.authorization;
    var payload;
    try{
        payload = jwt.verify(token, jwtKey);
    }catch (e) {
        if(e instanceof jwt.JsonWebTokenError) {
            return res.sendStatus(401);
        }
        return res.sendStatus(400);
    }
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

router.post('/login', function (req, res, next) {
    let {username, password} = req.body;
    let userRepo = new UserRepository();
    userRepo.getUser(username).then(saveUser => {
        if(saveUser == null){
            res.sendStatus(401);
        }else {
            if (saveUser.password == password) {
                const token = jwt.sign({username}, jwtKey, {
                    algorithm: 'HS256',
                    expiresIn: jwtExpirySeconds
                });
                res.cookie('token', token, {maxAge: jwtExpirySeconds * 1000});
                res.status(200).send({
                    username:saveUser.username,
                    role:saveUser.role,
                    token:token
                });
            } else {
                res.sendStatus(401);
            }
        }
    });
});

module.exports = router;
