import express from 'express';
import { connect } from './sql.js';
import Cache from 'node-cache';
import { myCacheList } from './myCache.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var router = express.Router();
const myCache = new Cache();
function isThisWeek (date) {
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
                for (var i=0;i<results.length;++i){
                    var inputDate = new Date(results[i].transactionDate.split("T")[0]);
                    var todaysDate = new Date();
                    var thisSale = (parseInt(results[i].transactionPrice) * parseInt(results[i].transactionQuantity));
                    if(inputDate.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)) {
                        daySales += thisSale;
                        weekSales += thisSale;
                        yearSales += thisSale;
                    }else if (isThisWeek(inputDate)){
                        weekSales += thisSale;
                        yearSales += thisSale;
                    }else if(inputDate.getFullYear() == todaysDate.getFullYear()){
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
    if (typeof req.session.access != "undefined" && typeof req.query.page != "undefined") {
        if (req.session.access == "Administrator" || req.session.access == "Secretary") {
            var db = await connect("root", "db_aemetal");
            try {
                var lowEnd = ((req.query.page - 1) * 10) + 1;
                var highEnd = req.query.page * 10;
                if (typeof req.query.searchTarget != "undefined" || typeof req.query.searchQuery != "undefined") {
                    var doContinue = true;
                    var sql = "SELECT * FROM ( SELECT *, ROW_NUMBER() OVER ( ORDER BY inventoryId asc ) AS RowNum FROM tb_inventory WHERE ({{target}} LIKE ? or {{target}} LIKE ? or {{target}} LIKE ?) ) AS RowConstrainedResult WHERE RowNum >= ? AND RowNum <= ? ORDER BY RowNum";
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
                        "SELECT * FROM ( SELECT *, ROW_NUMBER() OVER ( ORDER BY inventoryId asc ) AS RowNum FROM tb_inventory ) AS RowConstrainedResult WHERE RowNum >= ? AND RowNum <= ? ORDER BY RowNum",
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

router.post('/inventory', async function (req, res) {
    if (typeof req.session.access != "undefined" && typeof req.body.details != "undefined") {
        if (req.session.access != "Administrator") {
            res.status(500).send();
        } else {
            var db = await connect("root", "db_aemetal");
            var details = req.body.details;
            try {
                await db.query(
                    "INSERT INTO tb_inventory (inventoryBrand, inventoryPrice202, inventoryPrice304, inventoryQuantity202, inventoryQuantity304) VALUES(?,?,?,?,?)",
                    [details.brand, details.price202, details.price304, details.quantity202, details.quantity304]
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
                    "SELECT * FROM tb_inventory WHERE inventoryId = ?",
                    [inventoryId]
                );
                
                db.end();
                
                if (results.length > 0) {
                    res.status(200).send(results[0]);
                } else {
                    res.status(404).send({ message: "Inventory item not found" });
                }
            } catch (err) {
                console.log(err);
                db.end();
                res.status(404).send({ error: "Database error" });
            }
        } else {
            res.status(403).send({ message: "Unauthorized access" });
        }
    } else {
        res.status(401).send({ message: "Not authenticated" });
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
                    "UPDATE tb_inventory SET inventoryBrand = ?, inventoryPrice202 = ?, inventoryPrice304 = ?, inventoryQuantity202 = ?, inventoryQuantity304 = ? WHERE inventoryId = ?",
                    [details.brand, details.price202, details.price304, details.quantity202, details.quantity304, details.id]
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
                    "Delete From tb_inventory WHERE inventoryId = ?",
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
            try {
                var cachedData = await myCacheList();
                var theData = (cachedData.get("biteClubData")).storeData;
                var detected = false;
                for (var i = 0; i < theData.items.length; ++i) {
                    if (theData.items[i].merchantName == req.query.store) {
                        detected = true;
                        if (typeof req.session.orders == "undefined") req.session.orders = [];
                        var trueData = {
                            webData: req.session.orders
                            
                        };
                        if (typeof req.session.orders != "undefined") trueData.cartCount = req.session.orders.length;
                        else trueData.cartCount = 0;
                        res.render(path.join(__dirname, 'views/secretaryView.ejs'), trueData);
                        break;
                    }
                }
                if (!detected) {
                    res.status(404).send({ message: "Store not found" });
                }
            } catch (err) {
                console.log(err);
                res.status(500).send({ error: "Internal Server Error" });
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
            var itemSQL = "SELECT * FROM tb_inventory WHERE inventoryId = ?";
            var [results, fields] = await db.query(itemSQL, [details.itemId]);
            if (results.length > 0) {
                order.item = results[0];
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