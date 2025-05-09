var batchData;
var currentDate;
var theDate;
var initMonths = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
var monthSales = []
var trueMonthSales = [];
var priceJanuary = 0;
var priceFeburary = 0;
var priceMarch = 0;
var priceApril = 0;
var priceMay = 0;
var priceJune = 0;
var priceJuly = 0;
var priceAugust = 0;
var priceSeptember = 0;
var priceOctober = 0;
var priceNovember = 0;
var priceDecember = 0;
var btnImg = false;
var a = '';
var textDark = '';
var tableDark = '';
var adminFieldList;
var batchData;
var batchData2;
var editBatch;
var selectedBatch;
var prioBatch;
var showConfirmed;
var data;
var noOfPass;
var passData;
var passSel;
var fieldNo;
var slotData;
var medPad;
var legPad;
var isAdding;
var batchEdit;
var maxDay;
var chosenDay;
var savedSelection;
var textListDL;
var tableListDL;
var btnImgDL = false;
var a;
function init() {
    adminFieldList = [{
        name: "Item Name",
        type: "text",
        ref: "name",
        visible: true

    },
    {
        name: "Type",
        type: "text",
        ref: "inventoryPrice202",
        visible: true
    },
    {
        name: "Price",
        type: "text",
        ref: "inventoryPrice304",
        visible: true
    },
    {
        name: "Quantity",
        type: "text",
        ref: "inventoryQuantity202",
        visible: true
    }
];
 priceJanuary = 0;
 priceFeburary = 0;
 priceMarch = 0;
 priceApril = 0;
 priceMay = 0;
 priceJune = 0;
 priceJuly = 0;
 priceAugust = 0;
 priceSeptember = 0;
 priceOctober = 0;
 priceNovember = 0;
 priceDecember = 0;
refreshTable();
prioBatch = true;
    const date = new Date();
    currentDate = date.getFullYear();
    getSalesData();
}

function getSalesData() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", window.location.origin + "/transactionList?page=" + encodeURIComponent(1));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                batchData2 = JSON.parse(xhr.responseText);
                console.log(batchData2);
                formatDate();
            } else if (xhr.status == 404) {
                console.log("GAGFSADFDS");
            }
        }
    };
    xhr.send(); 
}

function refreshTable() {
    var page = 1;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", window.location.origin + "/inventoryList?page=" + encodeURIComponent(page));
    console.log(xhr.responseText);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                batchData = JSON.parse(xhr.responseText);
                console.log(batchData);
                formatTable();
            } else if (xhr.status == 404) {
                console.log("GAGFSADFDS");
            }
        }
    };
    xhr.send();
}

function formatTable() {
    if (typeof batchData != "undefined") {
        var headHtml = '';
        var bodyHtml = '';
        var setHtml = '';
        var searchHtml = '';
        var dontChange = false;

        //savedSelection = document.getElementById('searchField').value;

        /*if (prioBatch.length > 0) {
            headData = batchData.data.filter(function (item, index, arr) {
                return prioBatch.includes(item.batchId);
            });
            nextData = batchData.data.filter(function (item, index, arr) {
                return !prioBatch.includes(item.batchId);
            });
            trueData = headData.concat(nextData);
        }else{
            trueData = batchData.data;
        }*/
        /*        var batchLength = batchData[0].details.length;
                batchData.slice().reverse().forEach(function (item, index, arr) {
                    adminFieldList.forEach(function (aItem, aIndex, aArr) {
                        var colorClass = '';
                        //if (prioBatch.includes(item.batchId)) colorClass = "prio";
                        //else colorClass = "none";
                        if (index == 0) {

                            if (aItem.visible) headHtml = headHtml.concat('<th scope="col" class="text-center">').concat(aItem.name).concat('</th>')
                            setHtml = setHtml.concat('<tr><td class="text-center">').concat(aItem.name).concat('</td>');
                            if (aItem.visible) setHtml = setHtml.concat('<td class="text-center"><button onclick="setFieldSetting(').concat(aIndex).concat(',0)" class="btn btn-success">Visible</button></td>');
                            else setHtml = setHtml.concat('<td class="text-center"><button onclick="setFieldSetting(').concat(aIndex).concat(',0)" class="btn btn-danger">Invisible</button></td>');
                            setHtml = setHtml.concat('<td class="text-center"><button id="btnUD1" onclick="setFieldSetting(').concat(aIndex).concat(',-1)" class="btn btn-primary me-1">Move up</button><button id="btnUD2" onclick="setFieldSetting(').concat(aIndex).concat(',1)" class="btn btn-primary ">Move Down</button></td></tr>')
                            if (aItem.visible && (aItem.type == 'text' || aItem.type == 'date')) {
                                searchHtml = searchHtml.concat('<option value="').concat(aIndex.toString()).concat('">'.concat(aItem.name).concat('</option>'));
                                if (savedSelection == aIndex) dontChange = true;
                            }
                        }
                        if (document.getElementById('searchText').value.length > 0) {
                            console.log(item[adminFieldList[document.getElementById('searchField').value].ref]);
                            if (item[adminFieldList[parseInt(document.getElementById('searchField').value)].ref].toLowerCase().includes(document.getElementById('searchText').value.toLowerCase())) {
                                if (aIndex == 0) bodyHtml = bodyHtml.concat('<tr>');
                                if (aItem.visible) {
                                    //edited
                                    if (aItem.type == 'text') {
                                        if (aItem.ref == 'batchDateCreated') {
                                            bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('"><time datetime="').concat(item[aItem.ref.getDate()]).concat('"</td>'));
                                        } else {
                                            bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat(item[aItem.ref]).concat('</td>'));
                                        }
                                    }
                                    if (aItem.type == 'button') {
                                        if (aItem.name == 'Options') {
                                            bodyHtml = bodyHtml.concat('<td class="aksepDenay ').concat(colorClass).concat('">').concat('<a onclick="'.concat('acceptFree').concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class=" btnAccept btn" data-bs-toggle="modal">Accept</a> &nbsp;'))
                                                .concat('<a onclick="'.concat('denyTicket').concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnDeny btn" data-bs-toggle="modal">Deny</a></ttd>'));
                                        } else if (aItem.name == 'Edit') {
                                            bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat('<a onclick="'.concat(aItem.method).concat('(').concat(item[aItem.args]).concat(',false)"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnOther btn btn-primary" data-bs-toggle="modal">').concat(aItem.display).concat('</a></ttd>'));
                                        } else {
                                            bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat('<a onclick="'.concat(aItem.method).concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnOther btn btn-primary" data-bs-toggle="modal">').concat(aItem.display).concat('</a></ttd>'));
                                        }

                                        //to here
                                    }
                                    if (aItem.type == 'date') {
                                        var theDate = new Date(item[aItem.ref]).toLocaleString('default', {
                                            month: 'long',
                                            year: 'numeric',
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "numeric"
                                        });
                                        bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat(theDate).concat('</td>');
                                    }
                                }
                            }
                        } else { //non search
                            if (aIndex == 0) bodyHtml = bodyHtml.concat('<tr class="prioRow">');
                            if (aItem.visible) {
                                //edited

                                if (aItem.type == 'text') {
                                    if (aItem.ref == 'batchDateCreated') {
                                        bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('"><time datetime="').concat(item[aItem.ref.getDate()]).concat('"</td>'));
                                    }else if(aItem.ref == 'inventoryPrice202'){
                                        bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat('Php ').concat(item.details[index].price).concat('</td>'));
                                        console.log(batchData[index].details[index].type);
                                    }
                                    else {
                                        bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat(item[aItem.ref]).concat('</td>'));
                                    }
                                }
                                if (aItem.type == 'button') {
                                    if (aItem.name == 'Edit') {
                                        bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat('<a onclick="'.concat(aItem.method).concat('(').concat(item[aItem.args]).concat(',false)"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnOther btn btn-primary" data-bs-toggle="modal">').concat(aItem.display).concat('</a></ttd>'));
                                    } else {
                                        bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat('<a onclick="'.concat(aItem.method).concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnOther btn btn-primary" data-bs-toggle="modal">').concat(aItem.display).concat('</a></ttd>'));
                                    }
                                }
                                if (aItem.type == 'date') {
                                    var theDate = new Date(item[aItem.ref]).toLocaleString('default', {
                                        month: 'long',
                                        year: 'numeric',
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric"
                                    });
                                    bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat(theDate).concat('</td>');
                                }
                            }
                        }
                    });

                    if (document.getElementById('searchText').value.length > 0) {
                        if (item[adminFieldList[document.getElementById('searchField').value].ref].toLowerCase().includes(document.getElementById('searchText').value.toLowerCase())) {
                            bodyHtml = bodyHtml.concat('</tr>');
                        }
                    }
                }); */

        batchData.forEach(function (item, index, arr) {
            var price202 = '0';
            var price304 = '0';
            var quantity202 = '0';
            var quantity304 = '0';
            if (index == 0) {
                adminFieldList.forEach(function (aItem, aIndex, aArr) {
                    if (aItem.visible) headHtml = headHtml.concat('<th scope="col" class="text-center">').concat(aItem.name).concat('</th>')
                    setHtml = setHtml.concat('<tr><td class="text-center">').concat(aItem.name).concat('</td>');
                    if (aItem.visible) setHtml = setHtml.concat('<td class="text-center"><button onclick="setFieldSetting(').concat(aIndex).concat(',0)" class="btn btn-success">Visible</button></td>');
                    else setHtml = setHtml.concat('<td class="text-center"><button onclick="setFieldSetting(').concat(aIndex).concat(',0)" class="btn btn-danger">Invisible</button></td>');
                    setHtml = setHtml.concat('<td class="text-center"><button id="btnUD1" onclick="setFieldSetting(').concat(aIndex).concat(',-1)" class="btn btn-primary me-1">Move up</button><button id="btnUD2" onclick="setFieldSetting(').concat(aIndex).concat(',1)" class="btn btn-primary ">Move Down</button></td></tr>')
                    if (aItem.visible && (aItem.type == 'text' || aItem.type == 'date')) {
                        searchHtml = searchHtml.concat('<option value="').concat(aIndex.toString()).concat('">'.concat(aItem.name).concat('</option>'));
                    }
                });
            }
            for (var i = 0; i < batchData[index].details.length; i++) {
                if(prioBatch){
                    if(parseInt(batchData[index].details[i].quantity) <= 5){
                    bodyHtml = bodyHtml.concat('<tr> <td class="text-center">').concat(item.name).concat('</td>');

                    /*if(batchData[index].details[i].type == '202'){
                                        price202 = batchData[index].details[i].price;
                                        quantity202 = batchData[index].details[i].quantity;
                                    } else if(batchData[index].details[i].type == '304'){
                                        price304 = batchData[index].details[i].price;
                                        quantity304 = batchData[index].details[i].quantity;
                                    } */
                    bodyHtml = bodyHtml.concat('<td class="text-center" id="type').concat(index).concat('">').concat(batchData[index].details[i].type).concat('</td>');
                    bodyHtml = bodyHtml.concat('<td class="text-center" id="price').concat(index).concat('">').concat(batchData[index].details[i].price).concat('</td>');
                    
                        bodyHtml = bodyHtml.concat('<td class="lowQuanty text-center" name="critikal" id="quantity').concat(index).concat('">').concat(batchData[index].details[i].quantity).concat('</td>');
                    
                    document.getElementById('tableHead').innerHTML = headHtml;
                    document.getElementById('tableBody').innerHTML = bodyHtml;
                    }
                }else{
                    bodyHtml = bodyHtml.concat('<tr> <td class="text-center">').concat(item.name).concat('</td>');

                    /*if(batchData[index].details[i].type == '202'){
                                        price202 = batchData[index].details[i].price;
                                        quantity202 = batchData[index].details[i].quantity;
                                    } else if(batchData[index].details[i].type == '304'){
                                        price304 = batchData[index].details[i].price;
                                        quantity304 = batchData[index].details[i].quantity;
                                    } */
                    bodyHtml = bodyHtml.concat('<td class="text-center" id="type').concat(index).concat('">').concat(batchData[index].details[i].type).concat('</td>');
                    bodyHtml = bodyHtml.concat('<td class="text-center" id="price').concat(index).concat('">').concat(batchData[index].details[i].price).concat('</td>');
                    if(parseInt(batchData[index].details[i].quantity) <= 100){
                        bodyHtml = bodyHtml.concat('<td class="text-center" name="critikal" id="quantity').concat(index).concat('">').concat(batchData[index].details[i].quantity).concat('</td>');
                    }else{
                        bodyHtml = bodyHtml.concat('<td class="text-center" id="quantity').concat(index).concat('">').concat(batchData[index].details[i].quantity).concat('</td>');
                    }
                    bodyHtml = bodyHtml.concat('<td class="text-center"><button onclick="editModal(').concat(index).concat(')" class="btn btn-primary">Edit</button></td>');
                    bodyHtml = bodyHtml.concat('<td class="text-center"><button onclick="deleteModal(').concat(index).concat(')" class="btn btn-danger">Delete</button></td></tr>');
                    document.getElementById('tableHead').innerHTML = headHtml;
                    document.getElementById('tableBody').innerHTML = bodyHtml;
                    document.getElementById('searchField').innerHTML = searchHtml;
                }

            }
        });

        if (dontChange) document.getElementById('searchField').value = savedSelection;
    }
}

function formatDate() {
    theDate = [];
    batchData2.forEach(function (item, index, arr) {
        if(item.transactionAccepted == 1){
            if (new Date(item.transactionDate).getFullYear() == currentDate) {
                if (new Date(item.transactionDate).getMonth().toString() == "0") {
                    priceJanuary += parseFloat(item.inventoryPrice) * parseFloat(item.transactionQuantity);
                }else if(new Date(item.transactionDate).getMonth().toString() == "1"){
                    priceFeburary += parseFloat(item.inventoryPrice) * parseFloat(item.transactionQuantity);
                }else if(new Date(item.transactionDate).getMonth().toString() == "2"){
                    priceMarch += parseFloat(item.inventoryPrice) * parseFloat(item.transactionQuantity);
                }else if(new Date(item.transactionDate).getMonth().toString() == "3"){
                    priceApril += parseFloat(item.inventoryPrice) * parseFloat(item.transactionQuantity);
                }else if(new Date(item.transactionDate).getMonth().toString() == "4"){
                    priceMay += parseFloat(item.inventoryPrice) * parseFloat(item.transactionQuantity);
                }else if(new Date(item.transactionDate).getMonth().toString() == "5"){
                    priceJune += parseFloat(item.inventoryPrice) * parseFloat(item.transactionQuantity);
                }else if(new Date(item.transactionDate).getMonth().toString() == "6"){
                    priceJuly += parseFloat(item.inventoryPrice) * parseFloat(item.transactionQuantity);
                }else if(new Date(item.transactionDate).getMonth().toString() == "7"){
                    priceAugust += parseFloat(item.inventoryPrice) * parseFloat(item.transactionQuantity);
                }else if(new Date(item.transactionDate).getMonth().toString() == "8"){
                    priceSeptember += parseFloat(item.inventoryPrice) * parseFloat(item.transactionQuantity);
                }else if(new Date(item.transactionDate).getMonth().toString() == "9"){
                    priceOctober += parseFloat(item.inventoryPrice) * parseFloat(item.transactionQuantity);
                }else if(new Date(item.transactionDate).getMonth().toString() == "10"){
                    priceNovember += parseFloat(item.inventoryPrice) * parseFloat(item.transactionQuantity);
                }else if(new Date(item.transactionDate).getMonth().toString() == "11"){
                    priceDecember += parseFloat(item.inventoryPrice) * parseFloat(item.transactionQuantity);
                }
            }
        }

    });
    console.log(priceJanuary);
    setChart();
}

function setChart(){
    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: "Current Year " + currentDate,
                data: [priceJanuary, priceFeburary, priceMarch, priceApril, priceMay, priceJune, priceJuly, priceAugust, priceSeptember, priceOctober, priceNovember, priceDecember],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function goSales() {
    window.location.replace("/sales");
}

function goInventory() {
    window.location.replace("/inventory");
}

function goDashboard() {
    window.location.replace("/admin");
}

function goSalesReport(){
    window.location.replace("/salesReport");
}

function logout(){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin + "/logout");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                window.location.href = '/';
            } else if (xhr.status == 404) {
                console.log("GAGFSADFDS");
            }
        }
    };
    xhr.send();
}