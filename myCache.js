import { connect } from './sql.js';
import Cache from 'node-cache';

const myCache = new Cache();

export async function myCacheList() {
    try {
        if (!myCache.has("biteClubData")) {
            await refreshBiteClub();
        }
        return myCache;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function refreshBiteClub() {
    var db = await connect("root", "db_aemetal");
    try {
        var itemSQL = "SELECT inventoryBrand, inventoryPrice202, inventoryPrice304, inventoryQuantity202, inventoryQuantity304 FROM tb_inventory";
        var [iresults, ifields] = await db.query(itemSQL);
        var itemData = {
            items: []
        };
        for (var k = 0; k < iresults.length; ++k) {
            var l = {};
            l.name = iresults[k].inventoryBrand;
            l.inventoryPrice202 = iresults[k].inventoryPrice202;
            l.inventoryPrice304 = iresults[k].inventoryPrice304;
            l.inventoryQuantity202 = iresults[k].inventoryQuantity202;
            l.inventoryQuantity304 = iresults[k].inventoryQuantity304;
            itemData.items.push(l);
        }
        var trueData = {
            storeData: itemData,
        };
        myCache.set('biteClubData', trueData);
        db.end();
    } catch (err) {
        console.log(err);
        db.end();
        throw err;
    }
}