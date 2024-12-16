import express from 'express';
import { connect } from './sql.js';

var router = express.Router();

router.get('/', async function (req, res) {
    res.render('index.ejs');
});

router.post('/login',async function (req, res){
    if(typeof req.body.details == "undefined"){
        try{
            var db = await connect("root", "db_ticket");
            var details = req.body.details;
            var [results,fields] = await db.query(
                "SELECT * FROM tb_userlist WHERE userName = ? AND userPassword = ?",[details.user,details.pass]
            );
            if(results.length > 0){
                req.session.user = results[0].userName;
                req.session.pass = results[0].userPass;
                req.session.access = results[0].userAccess;
            }
        }catch(err){
            console.log(err);
            res.status(500).send();
        }
    }else{
        res.status(500).send();
    } 
});

router.get('/admin', async function(req, res){
    if(typeof req.session.access == "undefined"){
        if(req.session.access != "Administrator"){
            res.redirect("/")
        }else{
            res.render('adminView.ejs');
        }
    }else{
        res.redirect("/");
    }
});

export function inventory() {
    return router;
};