import express from 'express';
import { connect } from './sql.js';

var router = express.Router();

router.get('/', async function (req, res) {
    res.render('index.ejs');
});

router.post('/login',async function (req, res){
    if(typeof req.body.details != "undefined"){
        var db = await connect("root", "db_aemetal");
        try{
            var details = req.body.details;
            var [results,fields] = await db.query(
                "SELECT * FROM tb_userlist WHERE userName = ? AND userPassword = ?",[details.user,details.pass]
            );
            if(results.length > 0){
                req.session.user = results[0].userName;
                req.session.pass = results[0].userPass;
                req.session.access = results[0].userAccess;
            }
            res.status(200).send();
            db.end();
        }catch(err){
            db.end();
            console.log(err);
            res.status(500).send();
        }
    }else{
        res.status(500).send();
    } 
});

router.get('/transactionList', async function(req,res){
    if(typeof req.session.access != "undefined" && typeof req.query.page != "undefined"){
        if(req.session.access != "Administrator"){
            res.status(404).send();
        }else{
            var db = await connect("root", "db_aemetal");
            try{
                var lowEnd = ((req.query.page - 1) * 10) + 1;
                var highEnd = req.query.page * 10;
                var [results,fields] = await db.query(
                    "SELECT * FROM ( SELECT *, ROW_NUMBER() OVER ( ORDER BY transactionDate desc ) AS RowNum FROM tb_transaction, tb_inventory where transactionItem = inventoryId ) AS RowConstrainedResult WHERE RowNum >= ? AND RowNum <= ? ORDER BY RowNum"
                    [lowEnd, highEnd]
                );
                res.status(200).send(results);
            }catch(err){
                console.log(err);
                db.end();
                res.status(404).send();
            }
        }
    }else{
        res.status(404).send();
    }
});

router.post('/transaction', async function(req, res){
    if(typeof req.session.access == "undefined" && typeof req.body.details != "undefined"){
        if(req.session.access != "Administrator"){
            res.status(500).send();
        }else{
            var db = await connect("root", "db_aemetal");
            var details = req.body.details;
            try{
                await db.query(
                    "INSERT INTO tb_transaction (transactionItem, transactionQuantity, transactionDiscount, transactionShippingFee) VALUES(?,?,?,?)"
                    [details.itemId, details.quantity,details.discount,details.shippingFee]
                );
                db.end();
                res.status(200).send();
            }catch(err){
                db.end();
                console.log(err);
                res.status(500).send();
            }
        }
    }else{
        res.status(500).send();
    }
});

router.put('/transaction', async function(req, res){
    if(typeof req.session.access == "undefined" && typeof req.body.details != "undefined"){
        if(req.session.access != "Administrator"){
            res.status(500).send();
        }else{
            var db = await connect("root", "db_aemetal");
            var details = req.body.details;
            try{
                await db.query(
                    "UPDATE tb_transaction SET transactionItem = ?, transactionQuantity = ?, transactionDiscount = ?, transactionShippingFee = ? WHERE transactionId = ?"
                    [details.itemId, details.quantity,details.discount,details.shippingFee, details.id]
                );
                db.end();
                res.status(200).send();
            }catch(err){
                db.end();
                console.log(err);
                res.status(500).send();
            }
        }
    }else{
        res.status(500).send();
    }
});

router.delete('/transaction', async function(req, res){
    if(typeof req.session.access == "undefined" && typeof req.body.details != "undefined"){
        if(req.session.access != "Administrator"){
            res.status(500).send();
        }else{
            var db = await connect("root", "db_aemetal");
            var details = req.body.details;
            try{
                await db.query(
                    "DELETE FROM tb_transaction WHERE transactionId = ?"
                    [details.id]
                );
                db.end();
                res.status(200).send();
            }catch(err){
                db.end();
                console.log(err);
                res.status(500).send();
            }
        }
    }else{
        res.status(500).send();
    }
});

router.get('/inventoryList', async function(req,res){
    if(typeof req.session.access != "undefined" && typeof req.query.page != "undefined"){
        if(req.session.access != "Administrator"){
            res.status(404).send();
        }else{
            var db = await connect("root", "db_aemetal");
            try{
                var lowEnd = ((req.query.page - 1) * 10) + 1;
                var highEnd = req.query.page * 10;
                var [results,fields] = await db.query(
                    "SELECT * FROM ( SELECT *, ROW_NUMBER() OVER ( ORDER BY transactionDate desc ) AS RowNum FROM tb_inventory ) AS RowConstrainedResult WHERE RowNum >= ? AND RowNum <= ? ORDER BY RowNum"
                    [lowEnd, highEnd]
                );
                res.status(200).send(results);
            }catch(err){
                console.log(err);
                db.end();
                res.status(404).send();
            }
        }
    }else{
        res.status(404).send();
    }
});

router.post('/inventory', async function(req, res){
    if(typeof req.session.access == "undefined" && typeof req.body.details != "undefined"){
        if(req.session.access != "Administrator"){
            res.status(500).send();
        }else{
            var db = await connect("root", "db_aemetal");
            var details = req.body.details;
            try{
                await db.query(
                    "INSERT INTO tb_inventory (inventoryBrand, inventoryCategory, inventoryPrice, inventoryUnitOfMeasurement) VALUES(?,?,?,?)"
                    [details.brand, details.category, details.price, details.unit]
                );
                db.end();
                res.status(200).send();
            }catch(err){
                db.end();
                console.log(err);
                res.status(500).send();
            }
        }
    }else{
        res.status(500).send();
    }
});

router.put('/inventory', async function(req, res){
    if(typeof req.session.access == "undefined" && typeof req.body.details != "undefined"){
        if(req.session.access != "Administrator"){
            res.status(500).send();
        }else{
            var db = await connect("root", "db_aemetal");
            var details = req.body.details;
            try{
                await db.query(
                    "UPDATE tb_inventory SET inventoryBrand = ?, inventoryCategory = ?, inventoryPrice = ?, inventoryUnitOfMeasurement = ? WHERE inventoryId = ?"
                    [details.brand, details.category, details.price, details.unit, details.id]
                );
                db.end();
                res.status(200).send();
            }catch(err){
                db.end();
                console.log(err);
                res.status(500).send();
            }
        }
    }else{
        res.status(500).send();
    }
});

router.delete('/inventory', async function(req, res){
    if(typeof req.session.access == "undefined" && typeof req.body.details != "undefined"){
        if(req.session.access != "Administrator"){
            res.status(500).send();
        }else{
            var db = await connect("root", "db_aemetal");
            var details = req.body.details;
            try{
                await db.query(
                    "Delete From tb_inventory WHERE inventoryId = ?"
                    [details.id]
                );
                db.end();
                res.status(200).send();
            }catch(err){
                db.end();
                console.log(err);
                res.status(500).send();
            }
        }
    }else{
        res.status(500).send();
    }
});

router.get('/admin', async function(req, res){
    if(typeof req.session.access != "undefined"){
        if(req.session.access != "Administrator"){
            res.redirect("/")
        }else{
            res.render('adminView.ejs');
        }
    }else{
        res.redirect("/");
    }
});


router.get('/sales', async function(req, res){
    if(typeof req.session.access != "undefined"){
        if(req.session.access != "Administrator"){
            res.redirect("/")
        }else{
            res.render('adminViewSales.ejs');
        }
    }else{
        res.redirect("/");
    }
});

export function inventory() {
    return router;
};