var express = require('express');
var router = express.Router();
let BlogRepository = require('./blog.repository');


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
})




module.exports = router;
