import express from 'express';

var router = express.Router();

router.get('/', async function (req, res) {
    res.render('index.ejs');
});

export function inventory() {
    return router;
};