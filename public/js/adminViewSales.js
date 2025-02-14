var data;
var adminFieldList;
var batchData;
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
var passTime;
function init() {
    adminFieldList = [{
            name: "Order List",
            type: "button",
            method: "checkDetails",
            args: "batchId",
            other: "#myModal",
            display: "Show Orders",
            visible: true
        },
        {
            name: "Transaction ID",
            type: "text",
            ref: "transactionId",
            visible: true
        },
        {
            name: "Item",
            type: "text",
            ref: "inventoryBrand",
            visible: true
        },
        {
            name: "Quantity",
            type: "text",
            ref: "transactionQuantity",
            visible: true
        },
        {
            name: "Total Price",
            type: "text",
            ref: "inventoryPrice",
            visible: "true"
        },
        {
            name: "Edit",
            type: "button",
            method: "editModal",
            args: "batchId",
            other: "#editModal",
            display: "Edit",
            visible: true
        },
        {
            name: "Delete",
            type: "button",
            method: "deleteModal",
            args: "batchId",
            other: "#deleteModal",
            display: "Delete",
            visible: true
        }

    ];
    trueFieldList = adminFieldList;
    showConfirmed = '0';
    document.getElementById('searchText').value = '';
    savedSelection = 0;
    refreshTable();
}

function refreshTable() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", window.location.origin + "/transactionList?page=" + encodeURIComponent(1));
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
        var headData;
        var nextData;
        var trueData;

        var headHtml = '';
        var bodyHtml = '';
        var setHtml = '';
        var searchHtml = '';
        var dontChange = false;

        savedSelection = document.getElementById('searchField').value;

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
    
                                    if (aItem.ref == 'batchPaymentAmount') {
    
                                        if (item['batchPaymentMethod'].includes('PayPal')) {
    
                                            bodyHtml = bodyHtml.concat('<td class="randomTotalCost '.concat(colorClass).concat('"><div id="randomTotalCost">').concat(item[aItem.ref].replace('|', '<br>').replace('P', '₱') + ' USD').concat('</div></td>'));
                                        } else {
                                            bodyHtml = bodyHtml.concat('<td class="randomTotalCost '.concat(colorClass).concat('"><div id="randomTotalCost">').concat(item[aItem.ref]).replace('P', '₱').concat('</div></td>'));
                                        }
                                    }else if(aItem.ref == 'batchDateCreated'){
                                        bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('"><time datetime="').concat(item[aItem.ref.getDate()]).concat('"</td>'));
                                    } else if(aItem.ref == 'batchClaimTime') {
                                        bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat(item[aItem.ref].replace("|||"," - ")).concat('</td>'));
                                    } else {
                                        bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat(item[aItem.ref]).concat('</td>'));
                                    }
                                }
                                if (aItem.type == 'button') {
                                    if (aItem.name == 'Options') {
                                        bodyHtml = bodyHtml.concat('<td class="aksepDenay ').concat(colorClass).concat('">').concat('<a onclick="'.concat('acceptFree').concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class=" btnAccept btn" data-bs-toggle="modal">Accept</a> &nbsp;'))
                                            .concat('<a onclick="'.concat('denyTicket').concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnDeny btn" data-bs-toggle="modal">Deny</a></ttd>'));
                                    } else if (aItem.name == 'Edit') {
                                        bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat('<a onclick="'.concat(aItem.method).concat('(').concat(item[aItem.args]).concat(',false)"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnOther btn" data-bs-toggle="modal">').concat(aItem.display).concat('</a></ttd>'));
                                    } else {
                                        bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat('<a onclick="'.concat(aItem.method).concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnOther btn" data-bs-toggle="modal">').concat(aItem.display).concat('</a></ttd>'));
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
    
                                if (aItem.ref == 'batchPaymentAmount') {
    
                                    if (item['batchPaymentMethod'].includes('PayPal')) {
    
                                        bodyHtml = bodyHtml.concat('<td class="randomTotalCost '.concat(colorClass).concat('"><div id="randomTotalCost">').concat(item[aItem.ref].replace('|', '<br>').replace('P', '') + ' ').concat('</div></td>'));
                                    } else {
                                        bodyHtml = bodyHtml.concat('<td class="randomTotalCost '.concat(colorClass).concat('"><div id="randomTotalCost">').concat(item[aItem.ref]).replace('P', '').concat('</div></td>'));
                                    }
                                    
                                }else if(aItem.ref == 'batchClaimTime') {
                                    bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat(item[aItem.ref].replace("|||"," - ")).concat('</td>'));
                                }else {
                                    bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat(item[aItem.ref]).concat('</td>'));
                                }
                            }
                            if (aItem.type == 'button') {
                                if (aItem.name == 'Options') {
                                    bodyHtml = bodyHtml.concat('<td class="aksepDenay ').concat(colorClass).concat('">').concat('<a onclick="'.concat('acceptFree').concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class=" btnAccept btn" data-bs-toggle="modal">Accept</a> &nbsp;'))
                                        .concat('<a onclick="'.concat('denyTicket').concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnDeny btn" data-bs-toggle="modal">Deny</a></ttd>'));
                                } else if (aItem.name == 'Edit') {
                                    bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat('<a onclick="'.concat(aItem.method).concat('(').concat(item[aItem.args]).concat(',false)"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnOther btn" data-bs-toggle="modal">').concat(aItem.display).concat('</a></ttd>'));
                                } else {
                                    bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat('<a onclick="'.concat(aItem.method).concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnOther btn" data-bs-toggle="modal">').concat(aItem.display).concat('</a></ttd>'));
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
                });
   
            if (document.getElementById('searchText').value.length > 0) {
                if (item[adminFieldList[document.getElementById('searchField').value].ref].toLowerCase().includes(document.getElementById('searchText').value.toLowerCase())) {
                    bodyHtml = bodyHtml.concat('</tr>');
                }
            }
        });
        document.getElementById('tableHead').innerHTML = headHtml;
        document.getElementById('tableBody').innerHTML = bodyHtml;
        document.getElementById('searchField').innerHTML = searchHtml;
        if (dontChange) document.getElementById('searchField').value = savedSelection;
    }
}

function showAddModal() {
    $('#addModal').modal('show');
}

function saveAdd() {
    var inProduct = document.getElementById('inProduct').value;
    var inQuantity = document.getElementById('inQuantity').value;
    var inTP = document.getElementById('inTP').value;
    var inDiscount = document.getElementById('inDiscount').value;
    var inSF = document.getElementById('inSF').value;
    console.log(inProduct)
    let xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin + "/transaction");
    xhr.setRequestHeader("Accept", "/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(xhr);
            if (xhr.status == 200) {
                $('#addModal').modal('hide');
                //refreshTable();
            } else {
                console.log(xhr.status);
                console.log(xhr.responseText);
                console.log(xhr);
            }
        }
    };
    data = {
        details: {
            itemId: inProduct,
            quantity: inQuantity,
            price: inTP,
            discount: inDiscount,
            shippingFee: inSF,
            status: "Delivered",
            payment: "Cash"
        }
    };
    console.log(JSON.stringify(data));
    xhr.send(JSON.stringify(data));



}

function cancelAdd() {
    $('#addModal').modal('hide');
    document.getElementById('inTime').value = '';
    document.getElementById('inProduct').value = '';
    document.getElementById('inVariant').value = 'noVariant';
    document.getElementById('inQuantity').value = '';
    document.getElementById('inPPI').value = '';
    document.getElementById('inTP').value = '';
    document.getElementById('inPPM').value = '';
    document.getElementById('inDiscount').value = '';
    document.getElementById('inSF').value = '';
}

function goSales() {
    window.location.replace("/sales");
}

function goRecords() {
    window.location.replace("/admin");
}

function goInventory() {
    window.location.replace("/inventory");
}

function goDashboard() {
    window.location.replace("/admin");
}