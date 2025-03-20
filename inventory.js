import express from 'express';
import {
    connect
} from './sql.js';
import Cache from 'node-cache';
import path from 'path';
import {
    fileURLToPath
} from 'url';
import {
    dirname
} from 'path';
import {
    formidable
} from 'formidable';

// Define __filename and __dirname
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

var router = express.Router();
const myCache = new Cache();

function isThisWeek(date) {
    const now = new Date();

    const weekDay = (now.getDay() + 6) % 7; // Make sure Sunday is 6, not 0
    const monthDay = now.getDate();
    const mondayThisWeek = monthDay - weekDay;

    const startOfThisWeek = new Date(+now);
    startOfThisWeek.setDate(mondayThisWeek);
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfNextWeek = new Date(+startOfThisWeek);
    startOfNextWeek.setDate(mondayThisWeek + 7);

    return date >= startOfThisWeek && date < startOfNextWeek;
}

router.get('/', async function (req, res) {
    res.render('index.ejs');
});

router.post('/login', async function (req, res) {
    if (typeof req.body.details != "undefined") {
        var db = await connect("root", "db_aemetal");
        try {
            var details = req.body.details;
            var [results, fields] = await db.query(
                "SELECT * FROM tb_userlist WHERE userName = ? AND userPassword = ?", [details.user, details.pass]
            );

            if (results.length > 0) {
                req.session.user = results[0].userName;
                req.session.pass = results[0].userPass;
                req.session.access = results[0].userAccess;
            }
            db.end();
            res.status(200).send(req.session.access);
        } catch (err) {
            db.end();
            console.log(err);
            res.status(500).send();
        }
    } else {
        res.status(500).send();
    }
});

router.get('/stats', async function (req, res) {
    if (typeof req.session.access != "undefined") {
        if (req.session.access == "Administrator") {
            var db = await connect("root", "db_aemetal");
            try {
                var [results, fields] = await db.query(
                    "SELECT transactionPrice, transactionQuantity, transactionDate FROM tb_transaction, tb_inventory WHERE transactionItem = inventoryId"
                );
                var daySales = 0;
                var weekSales = 0;
                var yearSales = 0;
                for (var i = 0; i < results.length; ++i) {
                    var inputDate = new Date(results[i].transactionDate.split("T")[0]);
                    var todaysDate = new Date();
                    var thisSale = (parseInt(results[i].transactionPrice) * parseInt(results[i].transactionQuantity));
                    if (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
                        daySales += thisSale;
                        weekSales += thisSale;
                        yearSales += thisSale;
                    } else if (isThisWeek(inputDate)) {
                        weekSales += thisSale;
                        yearSales += thisSale;
                    } else if (inputDate.getFullYear() == todaysDate.getFullYear()) {
                        yearSales += thisSale;
                    }
                }
                db.end();
                res.status(200).send(results);
            } catch (err) {
                console.log(err);
                db.end();
                res.status(404).send();
            }
        } else {
            res.status(404).send();
        }
    } else {
        res.status(404).send();
    }
});

/*
router.get('/transaction', async function (req, res) {
    
    if (typeof req.session.access != "undefined" && typeof req.query.page != "undefined") {
        if (req.session.access == "Administrator" || req.session.access == "Secretary" || req.session.access == "Assistant") {
            var db = await connect("root", "db_aemetal");
            try{
                //CODE
                db.end();
                res.status(200).send();
            }catch(err){
                console.log(err);
                db.end()
                res.status(500).send();
            }
        }else{
            res.status(404).send();
        }
    }else{
        res.status(404).send();
    }
})*/
// TRANSACTION //
router.get('/transactionList', async function (req, res) {
    if (typeof req.session.access != "undefined" && typeof req.query.page != "undefined") {
        if (req.session.access == "Administrator" || req.session.access == "Secretary" || req.session.access == "Assistant") {
            var db = await connect("root", "db_aemetal");
            try {
                var lowEnd = ((req.query.page - 1) * 10) + 1;
                var highEnd = req.query.page * 10;
                if (typeof req.query.searchTarget != "undefined" || typeof req.query.searchQuery != "undefined") {
                    var doContinue = true;
                    var sql = "SELECT * FROM ( SELECT *, ROW_NUMBER() OVER ( ORDER BY transactionDate desc ) AS RowNum FROM tb_transaction, tb_inventory where transactionItem = inventoryId and ( {{target}} LIKE ? OR {{target}} LIKE ? OR {{target}} LIKE ? ) ) AS RowConstrainedResult WHERE RowNum >= ? AND RowNum <= ? ORDER BY RowNum";
                    if (req.query.searchTarget == "brand") {
                        sql = sql.replaceAll("{{target}}", "inventoryBrand");
                    } else if (req.query.searchTarget == "category") {
                        sql = sql.replaceAll("{{target}}", "inventoryCategory");
                    } else {
                        doContinue = false;
                    }
                    if (doContinue) {
                        var [results, fields] = await db.query(
                            sql,
                            ['%' + req.query.searchQuery, req.query.searchQuery + '%', '%' + req.query.searchQuery + '%', lowEnd, highEnd]
                        );
                        db.end();
                        res.status(200).send(results);
                    } else {
                        db.end();
                        res.status(404).send();
                    }
                } else {
                    var [results, fields] = await db.query(
                        "SELECT * FROM ( SELECT *, ROW_NUMBER() OVER ( ORDER BY transactionDate desc ) AS RowNum FROM tb_transaction, tb_inventory where transactionItem = inventoryId ) AS RowConstrainedResult WHERE RowNum >= ? AND RowNum <= ? ORDER BY RowNum",
                        [lowEnd, highEnd]
                    );
                    db.end();
                    res.status(200).send(results);
                }
            } catch (err) {
                console.log(err);
                db.end();
                res.status(404).send();
            }
        } else {
            res.status(404).send();
        }
    } else {
        res.status(404).send();
    }
});

router.get('/transactionListG', async function (req, res) {
    if (typeof req.session.access != "undefined") {
        if (req.session.access == "Administrator" || req.session.access == "Secretary" || req.session.access == "Assistant") {
            var db = await connect("root", "db_aemetal");
            try {
                var [results, fields] = await db.query(
                    "SELECT * FROM tb_batchlist,tb_transaction,tb_inventory where batchId = transactionBatch and inventoryId = transactionItem group by batchId order by transactionId asc",
                );
                db.end();
                res.status(200).send(results);
            } catch (err) {
                db.end();
                console.log(err);
                res.status(404).send();
            }
        } else {
            res.status(404).send();
        }
    } else {
        res.status(404).send();
    }
});

router.get('/transactionBatch', async function (req, res) {
    if (typeof req.query.batch != "undefined") {
        var db = await connect("root", "db_aemetal");
        try {
            var [results, fields] = await db.query(
                "SELECT * FROM tb_batchlist, tb_transaction, tb_inventory WHERE batchId = transactionBatch AND inventoryId = transactionItem AND batchId = ? ORDER BY transactionId ASC",
                [req.query.batch]
            );
            db.end();
            res.status(200).send(results);
        } catch (err) {
            db.end();
            console.log(err);
            res.status(404).send();
        }
    } else {
        res.status(404).send();
    }
});

router.post('/transaction', async function (req, res) {
    if (typeof req.session.access != "undefined" && typeof req.body.details != "undefined") {
        if (req.session.access == "Administrator" || req.session.access == "Assistant") {
            var db = await connect("root", "db_aemetal");
            try {
                var details = req.body.details;
                await db.query(
                    "INSERT INTO tb_transaction (transactionItem, transactionQuantity, transactionPrice, transactionDiscount, transactionShippingFee, transactionDeliveryStatus, transactionPaymentMethod) VALUES(?,?,?,?,?,?,?)",
                    [details.itemId, details.quantity, details.price, details.discount, details.shippingFee, details.status, details.payment]
                );
                db.end();
                res.status(200).send();
            } catch (err) {
                db.end();
                console.log(err);
                res.status(500).send();
            }
        } else {
            res.status(500).send();
        }
    } else {
        res.status(500).send();
    }
});

router.put('/transaction', async function (req, res) {
    if (typeof req.session.access != "undefined" && typeof req.body.details != "undefined") {
        if (req.session.access == "Administrator" || req.session.access == "Assistant") {
            var db = await connect("root", "db_aemetal");
            var details = req.body.details;
            try {
                await db.query(
                    "UPDATE tb_transaction SET transactionItem = ?, transactionQuantity = ?, transactionPrice = ?, transactionDiscount = ?, transactionShippingFee = ?, transactionDelivaryStatus = ?, transactionPaymentMethod = ? WHERE transactionId = ?",
                    [details.itemId, details.quantity, details.price, details.discount, details.shippingFee, details.status, details.payment, details.id]
                );
                db.end();
                res.status(200).send();
            } catch (err) {
                db.end();
                console.log(err);
                res.status(500).send();
            }
        } else {
            res.status(500).send();
        }
    } else {
        res.status(500).send();
    }
});

router.delete('/transaction', async function (req, res) {
    if (typeof req.session.access != "undefined" && typeof req.body.details != "undefined") {
        if (req.session.access != "Administrator") {
            res.status(500).send();
        } else {
            var db = await connect("root", "db_aemetal");
            var details = req.body.details;
            try {
                await db.query(
                    "DELETE FROM tb_transaction WHERE transactionId = ?",
                    [details.id]
                );
                db.end();
                res.status(200).send();
            } catch (err) {
                db.end();
                console.log(err);
                res.status(500).send();
            }
        }
    } else {
        res.status(500).send();
    }
});

// INVENTORY //
router.get('/inventoryList', async function (req, res) {
    if (typeof req.session.access != "undefined") {
        if (req.session.access == "Administrator" || req.session.access == "Secretary") {
            var db = await connect("root", "db_aemetal");
            try {
                //var lowEnd = ((req.query.page - 1) * 10) + 1;
                //var highEnd = req.query.page * 10;
                if (typeof req.query.searchTarget != "undefined" || typeof req.query.searchQuery != "undefined") {
                    var doContinue = true;
                    var sql = "SELECT * FROM tb_inventory WHERE {{target}} LIKE ? or {{target}} LIKE ? or {{target}} LIKE ?";
                    if (req.query.searchTarget == "brand") {
                        sql = sql.replaceAll("{{target}}", "inventoryBrand");
                    } else if (req.query.searchTarget == "category") {
                        sql = sql.replaceAll("{{target}}", "inventoryCategory");
                    } else {
                        doContinue = false;
                    }
                    if (doContinue) {
                        var [results, fields] = await db.query(
                            sql,
                            ['%' + req.query.searchQuery, req.query.searchQuery + '%', '%' + req.query.searchQuery + '%']
                        );
                        var theData = {
                            items: []
                        };
                        for (var k = 0; k < results.length; ++k) {
                            var brandExist = -1;
                            for(var l=0;l< theData.items.length;++l){
                                if(theData.items[l].name == results[k].inventoryBrand){
                                    brandExist = l;
                                    break;
                                }
                            }
                            if(brandExist == -1){
                                var l = {};
                                l.itemId = results[k].inventorySId;
                                l.name = results[k].inventoryBrand;
                                theData.items.push(l);
                                theData.items[theData.items.length-1].details = [];
                                theData.items[theData.items.length-1].details[0] = {};
                                theData.items[theData.items.length-1].details[0].type = results[k].inventoryType;
                                theData.items[theData.items.length-1].details[0].price = results[k].inventoryPrice;
                                theData.items[theData.items.length-1].details[0].quantity = results[k].inventoryQuantity;
                            }else{
                                var l = {};
                                l.type = results[k].inventoryType;
                                l.price = results[k].inventoryPrice;
                                l.quantity = results[k].inventoryQuantity;
                                theData.items[brandExist].details.push(l);
                            }
                        }
                        db.end();
                        res.status(200).send(theData.items);
                    } else {
                        db.end();
                        res.status(404).send();
                    }
                } else {
                    var [results, fields] = await db.query(
                        "SELECT * FROM tb_inventory"
                    );
                    var theData = {
                        items: []
                    };
                    for (var k = 0; k < results.length; ++k) {
                        var brandExist = -1;
                        for(var l=0;l< theData.items.length;++l){
                            if(theData.items[l].name == results[k].inventoryBrand){
                                brandExist = l;
                                break;
                            }
                        }
                        if(brandExist == -1){
                            var l = {};
                            l.itemId = results[k].inventorySId;
                            l.name = results[k].inventoryBrand;
                            theData.items.push(l);
                            theData.items[theData.items.length-1].details = [];
                            theData.items[theData.items.length-1].details[0] = {};
                            theData.items[theData.items.length-1].details[0].type = results[k].inventoryType;
                            theData.items[theData.items.length-1].details[0].price = results[k].inventoryPrice;
                            theData.items[theData.items.length-1].details[0].quantity = results[k].inventoryQuantity;
                        }else{
                            var l = {};
                            l.type = results[k].inventoryType;
                            l.price = results[k].inventoryPrice;
                            l.quantity = results[k].inventoryQuantity;
                            theData.items[brandExist].details.push(l);
                        }
                    }
                    var trueData = {
                        webData : theData.items
                    }
                    db.end();
                    res.status(200).send(theData.items);
                }
            } catch (err) {
                console.log(err);
                db.end();
                res.status(404).send();
            }
        } else {
            res.status(404).send();
        }
    } else {
        res.status(404).send();
    }
});

router.post('/inventory', async function (req, res) {
    if (typeof req.session.access != "undefined" && typeof req.body.details != "undefined") {
        if (req.session.access != "Administrator") {
            res.status(500).send();
        } else {
            var db = await connect("root", "db_aemetal");
            var details = req.body.details;
            try {
                var [results, fields] = await db.query(
                    "SELECT * FROM tb_inventory order by inventorySId desc limit 3"
                )
                await db.query(
                    "INSERT INTO tb_inventory (inventoryBrand, inventoryPrice, inventoryQuantity, inventoryType, inventorySId) VALUES(?,?,?,?,?)",
                    [details.brand, details.price202, details.quantity202, details.type202, parseInt(results[0].inventorySId) + 1]
                );
                await db.query(
                    "INSERT INTO tb_inventory (inventoryBrand, inventoryPrice, inventoryQuantity, inventoryType, inventorySId) VALUES(?,?,?,?,?)",
                    [details.brand, details.price304, details.quantity304, details.type304, parseInt(results[0].inventorySId) + 1]
                );
                db.end();
                res.status(200).send();
            } catch (err) {
                db.end();
                console.log(err);
                res.status(500).send();
            }
        }
    } else {
        res.status(500).send();
    }
});

router.get('/inventory/:id', async function (req, res) {
    if (typeof req.session.access != "undefined") {
        if (req.session.access == "Administrator" || req.session.access == "Secretary") {
            var db = await connect("root", "db_aemetal");
            try {
                const inventoryId = req.params.id;

                var [results, fields] = await db.query(
                    "SELECT * FROM tb_inventory WHERE inventorySId = ?",
                    [inventoryId]
                );

                

                db.end();

                if (results.length > 0) {
                    res.status(200).send(results[0]);
                } else {
                    res.status(404).send({
                        message: "Inventory item not found"
                    });
                }
            } catch (err) {
                console.log(err);
                db.end();
                res.status(404).send({
                    error: "Database error"
                });
            }
        } else {
            res.status(403).send({
                message: "Unauthorized access"
            });
        }
    } else {
        res.status(401).send({
            message: "Not authenticated"
        });
    }
});

router.put('/inventory', async function (req, res) {
    if (typeof req.session.access != "undefined" && typeof req.body.details != "undefined") {
        if (req.session.access != "Administrator") {
            res.status(500).send();
        } else {
            var db = await connect("root", "db_aemetal");
            var details = req.body.details;
            try {
                await db.query(
                    "UPDATE tb_inventory SET inventoryBrand = ?, inventoryPrice = ?, inventoryQuantity = ? WHERE inventorySId = ? and inventoryType = ?",
                    [details.brand, details.price202, details.quantity202, details.id, 202]
                );

                await db.query(
                    "UPDATE tb_inventory SET inventoryBrand = ?, inventoryPrice = ?, inventoryQuantity = ? WHERE inventorySId = ? and inventoryType = ?",
                    [details.brand, details.price304, details.quantity304, details.id, 304]
                );
                
                db.end();
                res.status(200).send();
            } catch (err) {
                db.end();
                console.log(err);
                res.status(500).send();
            }
        }
    } else {
        res.status(500).send();
    }
});

router.delete('/inventory', async function (req, res) {
    if (typeof req.session.access != "undefined" && typeof req.body.details != "undefined") {
        if (req.session.access != "Administrator") {
            res.status(500).send();
        } else {
            var db = await connect("root", "db_aemetal");
            var details = req.body.details;
            try {
                await db.query(
                    "Delete From tb_inventory WHERE inventorySId = ?",
                    [details.id]
                );
                db.end();
                res.status(200).send();
            } catch (err) {
                db.end();
                console.log(err);
                res.status(500).send();
            }
        }
    } else {
        res.status(500).send();
    }
});

// TO SITE //
router.get('/admin', async function (req, res) {
    if (typeof req.session.access != "undefined") {
        if (req.session.access != "Administrator") {
            res.redirect("/")
        } else {
            res.render('adminView.ejs');
        }
    } else {
        res.redirect("/");
    }
});

router.get('/secretary', async function (req, res) {
    if (typeof req.session.access != "undefined") {
        if (req.session.access != "Secretary") {
            res.redirect("/");
        } else {
            var db = await connect("root", "db_aemetal");
            try {
                var itemSQL = "SELECT * FROM tb_inventory";
                var [iresults, ifields] = await db.query(itemSQL);
                var theData = {
                    items: []
                };
                for (var k = 0; k < iresults.length; ++k) {
                    var brandExist = -1;
                    for(var l=0;l< theData.items.length;++l){
                        if(theData.items[l].name == iresults[k].inventoryBrand){
                            brandExist = l;
                            break;
                        }
                    }
                    if(brandExist == -1){
                        var l = {};
                        l.name = iresults[k].inventoryBrand;
                        theData.items.push(l);
                        theData.items[theData.items.length-1].details = [];
                        theData.items[theData.items.length-1].details[0] = {};
                        theData.items[theData.items.length-1].details[0].type = iresults[k].inventoryType;
                        theData.items[theData.items.length-1].details[0].price = iresults[k].inventoryPrice;
                        theData.items[theData.items.length-1].details[0].quantity = iresults[k].inventoryQuantity;
                    }else{
                        var l = {};
                        l.type = iresults[k].inventoryType;
                        l.price = iresults[k].inventoryPrice;
                        l.quantity = iresults[k].inventoryQuantity;
                        theData.items[brandExist].details.push(l);
                    }
                }
                if(typeof (req.session.orders) == "undefined") req.session.orders = [];
                var trueData = {
                    webData : theData.items,
                    orders: req.session.orders
                }
                db.end();
                /*webData:[
                    {
                        name:"asd",
                        details:[{
                            type:"202",
                            price:"1",
                            quantity:"1"
                        },{
                            type:"304",
                            price:"1",
                            quantity:"1"
                        },{

                        }]
                    }
                ]*/
                console.log(trueData.webData[0].name);
                res.render(path.join(__dirname, 'views/secretaryView.ejs'), trueData);
            } catch (err) {
                console.log(err);
                db.end();
                res.status(500).send({
                    error: "Internal Server Error"
                });
            }
        }
    } else {
        res.redirect("/");
    }
});

router.get('/inventory', async function (req, res) {
    if (typeof req.session.access != "undefined") {
        if (req.session.access == "Administrator" || req.session.access == "Secretary") {
            res.render('adminViewInventory.ejs');
        } else {
            res.redirect("/");
        }
    } else {
        res.redirect("/");
    }
});

router.get('/sales', async function (req, res) {
    if (typeof req.session.access != "undefined") {
        if (req.session.access != "Administrator") {
            res.redirect("/")
        } else {
            res.render('adminViewSales.ejs');
        }
    } else {
        res.redirect("/");
    }
});

router.get('/salesAdd', async function (req, res) {
    if (typeof req.session.access != "undefined") {
        if (req.session.access != "Administrator") {
            res.redirect("/")
        } else {
            res.render('adminAddSales.ejs');
        }
    } else {
        res.redirect("/");
    }
});

// DELIVERY //
router.get('/deliveryList', async function (req, res) {
    if (typeof req.session.access != "undefined" && typeof req.query.page != "undefined") {
        if (req.session.access == "Administrator" || req.session.access == "Secretary" || req.session.access == "Assistant") {
            var db = await connect("root", "db_aemetal");
            try {
                var lowEnd = ((req.query.page - 1) * 10) + 1;
                var highEnd = req.query.page * 10;
                if (typeof req.query.searchTarget != "undefined" || typeof req.query.searchQuery != "undefined") {
                    var doContinue = true;
                    var sql = "SELECT * FROM ( SELECT *, ROW_NUMBER() OVER ( ORDER BY deliveryId asc ) AS RowNum FROM tb_delivery where ( {{target}} LIKE ? OR {{target}} LIKE ? OR {{target}} LIKE ? ) ) AS RowConstrainedResult WHERE RowNum >= ? AND RowNum <= ? ORDER BY RowNum";
                    if (req.query.searchTarget == "item") {
                        sql = sql.replaceAll("{{target}}", "delivaryItem");
                    } else if (req.query.searchTarget == "status") {
                        sql = sql.replaceAll("{{target}}", "delivaryStatus");
                    } else if (req.query.searchTarget == "notes") {
                        sql = sql.replaceAll("{{target}}", "delivaryNotes");
                    } else {
                        doContinue = false;
                    }
                    if (doContinue) {
                        var [results, fields] = await db.query(
                            sql,
                            ['%' + req.query.searchQuery, req.query.searchQuery + '%', '%' + req.query.searchQuery + '%', lowEnd, highEnd]
                        );
                        db.end();
                        res.status(200).send(results);
                    } else {
                        db.end();
                        res.status(404).send();
                    }
                } else {
                    var [results, fields] = await db.query(
                        "SELECT * FROM ( SELECT *, ROW_NUMBER() OVER ( ORDER BY deliveryId asc ) AS RowNum FROM tb_delivery ) AS RowConstrainedResult WHERE RowNum >= ? AND RowNum <= ? ORDER BY RowNum",
                        [lowEnd, highEnd]
                    );
                    db.end();
                    res.status(200).send(results);
                }
            } catch (err) {
                console.log(err);
                db.end();
                res.status(404).send();
            }
        } else {
            res.status(404).send();
        }
    } else {
        res.status(404).send();
    }
});

router.post('/delivery', async function (req, res) {
    if (typeof req.session.access != "undefined" && typeof req.body.details != "undefined") {
        if (req.session.access == "Administrator" || req.session.access == "Assistant") {
            var db = await connect("root", "db_aemetal");
            try {
                var details = req.body.details;
                await db.query(
                    "INSERT INTO tb_delivery (deliveryItem, deliveryStatus, deliveryNotes) VALUES(?,?,?)",
                    [details.item, details.status, details.notes]
                );
                db.end();
                res.status(200).send();
            } catch (err) {
                db.end();
                console.log(err);
                res.status(500).send();
            }
        } else {
            res.status(500).send();
        }
    } else {
        res.status(500).send();
    }
});

router.put('/delivery', async function (req, res) {
    if (typeof req.session.access != "undefined" && typeof req.body.details != "undefined") {
        if (req.session.access == "Administrator" || req.session.access == "Assistant") {
            var db = await connect("root", "db_aemetal");
            var details = req.body.details;
            try {
                await db.query(
                    "UPDATE tb_delivery SET deliveryItem = ?, deliveryStatus = ?, deliveryNotes = ? WHERE deliveryId = ?",
                    [details.item, details.status, details.notes, details.id]
                );
                db.end();
                res.status(200).send();
            } catch (err) {
                db.end();
                console.log(err);
                res.status(500).send();
            }
        } else {
            res.status(500).send();
        }
    } else {
        res.status(500).send();
    }
});

router.delete('/delivery', async function (req, res) {
    if (typeof req.session.access != "undefined" && typeof req.body.details != "undefined") {
        if (req.session.access != "Administrator") {
            res.status(500).send();
        } else {
            var db = await connect("root", "db_aemetal");
            var details = req.body.details;
            try {
                await db.query(
                    "DELETE FROM tb_delivery WHERE deliveryId = ?",
                    [details.id]
                );
                db.end();
                res.status(200).send();
            } catch (err) {
                db.end();
                console.log(err);
                res.status(500).send();
            }
        }
    } else {
        res.status(500).send();
    }
});

// OTHERS //
router.post('/saveOrder', async function (req, res) {
    console.log("Received request to save order");
    if (typeof req.session.access != "undefined" && typeof req.body.details != "undefined") {
        var db = await connect("root", "db_aemetal");
        try {
            var details = req.body.details;
            console.log("Order details:", details);
            if (typeof req.session.orders == "undefined") req.session.orders = [];
            var order = {};
            var itemSQL = "SELECT * FROM tb_inventory WHERE inventorySId = ? and inventoryType = ?";
            var [results, fields] = await db.query(
                itemSQL, [details.itemId, details.type]
            );
            if (results.length > 0) {
                order.item = results[0];
                order.itemName = details.itemName;
                order.quantity = details.quantity;
                order.type = details.type;
                order.price = details.price;
                req.session.orders.push(order);
                res.status(200).send();
            } else {
                res.status(404).send();
            }
            db.end();
        } catch (err) {
            db.end();
            console.log("Error:", err);
            res.status(500).send();
        }
    } else {
        console.log("Invalid session or request body");
        res.status(500).send();
    }
});

router.post('/checkOut', async function(req, res){
    var details={
        customername:"",
        proofImage:"",
        deliveryfee:"",
        deliveryaddress:"",
        discount:""
    }
    if (typeof req.session.access != "undefined" && typeof req.session.orders != "undefined") {
        if(req.session.orders.length == 0){
            console.log("Invalid session or request body");
            res.status(500).send();
        }else{
            var db = await connect("root", "db_aemetal");
            try {
                const form = formidable({
                    uploadDir: path.join(path.dirname(__dirname), 'upload'), // don't forget the __dirname here
                    keepExtensions: true,
                    maxFileSize: (5 * 1024 * 1024)
                });
                var doContinue = true;
        
                var formfields = await new Promise(function (resolve, reject) {
                    form.parse(req, function (err, fields, files) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        //console.log("within form.parse method, subject field of fields object is: " + fields.subjects);
                        resolve([fields, files]);
                    }); // form.parse
                });
                var details = JSON.parse(JSON.parse(JSON.stringify(formfields))[0].details[0]);
                console.log(details);
                console.log("Order details:", details);
                var orders = req.session.orders;
                var total = 0;

                for(var i=0;i<req.session.orders.length - 1;++i){
                    var truePrice = (parseInt(orders[i].quantity) * parseFloat(orders[i].price)).toFixed(2);
                    total += (parseInt(orders[i].quantity) * parseFloat(orders[i].price)).toFixed(2);
                    if(details.deliveryfee == ""){

                    }else{
                        total = (((parseFloat(total) * 100) + (parseFloat(parseFloat(details.deliveryfee).toFixed(2)) * 100)) / 100).toFixed(2);
                        truePrice = (((parseFloat(truePrice) * 100) + (parseFloat(parseFloat(details.deliveryfee).toFixed(2)) * 100)) / 100).toFixed(2);
                    }
                        
                }

                var [results,fields] = await db.query("insert into tb_batchlist(batchPayment, batchName, batchDateCreated, batchReceipt) VALUES(?,?,?,?)"
                            ,[total, details.customername, new Date().toLocaleDateString(), JSON.parse(JSON.stringify(formfields))[1].file[0].newFilename]);

                total = 0;
                for(var i=0;i<req.session.orders.length - 1;++i){
                    var itemSQL = "insert into tb_transaction(transactionItem, transactionQuantity, transactionPrice, transactionDate, transactionCustomerName, transactionPaymentProof) VALUES(?,?,?,?,?,?)";
                    var truePrice = (parseInt(orders[i].quantity) * parseFloat(orders[i].price)).toFixed(2);
                    total += (parseInt(orders[i].quantity) * parseFloat(orders[i].price)).toFixed(2);
                    if(details.deliveryfee == ""){
                        await db.query("insert into tb_transaction(transactionItem, transactionQuantity, transactionPrice, transactionDate, transactionCustomerName, transactionPaymentProof, transactionDelivery) VALUES(?,?,?,CURRENT_TIMESTAMP,?,?,?)"
                            ,[orders[i].item.inventoryId, orders[i].quantity, truePrice, details.customername, JSON.parse(JSON.stringify(formfields))[1].file[0].newFilename, 0]);
                    }else{
                        total = (((parseFloat(total) * 100) + (parseFloat(parseFloat(details.deliveryfee).toFixed(2)) * 100)) / 100).toFixed(2);
                        truePrice = (((parseFloat(truePrice) * 100) + (parseFloat(parseFloat(details.deliveryfee).toFixed(2)) * 100)) / 100).toFixed(2);
                        await db.query("insert into tb_transaction(transactionItem, transactionQuantity, transactionPrice, transactionDate, transactionCustomerName, transactionPaymentProof, transactionDelivery, transactionDeliveryAddress) VALUES(?,?,?,CURRENT_TIMESTAMP,?,?,?,?)"
                            ,[orders[i].item.inventoryId, orders[i].quantity, truePrice, details.customername, JSON.parse(JSON.stringify(formfields))[1].file[0].newFilename, 0, details.deliveryaddress]);
                    }
                        
                }
                //if (typeof req.session.orders == "undefined") req.session.orders = [];
                //var order = {};
                /*var [results, fields] = await db.query(itemSQL, [details.itemId]);
                if (results.length > 0) {
                    order.item = results[0];
                    order.quantity = details.quantity;
                    order.type = details.type;
                    order.price = details.price;
                    req.session.orders.push(order);
                    res.status(200).send();
                } else {
                    res.status(404).send();
                }*/
               
                db.end();
                req.session.orders = [];
                res.status(200).send();
            } catch (err) {
                db.end();
                console.log("Error:", err);
                res.status(500).send();
            }
        }
    }else {
        console.log("Invalid session or request body");
        res.status(500).send();
    }
});


router.post('/delete', async function (req, res) {
    if (typeof req.body.details != "undefined" && typeof req.session.orders != "undefined") {
        try {
            var dIndex = req.body.details.index;

            var orders = req.session.orders.filter(function (item, index, arr) {
                if (index == dIndex) return false;
                else return true;
            });
            req.session.orders = orders;
            res.status(200).send();
        } catch (err) {
            console.log(err);
            res.status(500).send();
        }
    } else {
        res.status(500).send();
    }
});

router.post('/logout', async function (req, res) {
    req.session.destroy();
    res.redirect("/");
});

export function inventory() {
    return router;
};