//import e = require("express");

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
    adminFieldList = [/* {
            name: "Order List",
            type: "button",
            method: "checkDetails",
            args: "transactionBatch",
            other: "#myModal",
            display: "Show Orders",
            visible: true
        }, */
        {
            name: "Customer Name",
            type: "text",
            ref: "transactionCustomerName",
            visible: true
        },
        {
            name: "Item Name",
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
            ref: "transactionPrice",
            visible: "true"
        },
        {
            name: "Delivery Fee",
            type: "text",
            ref: "transactionDelivery",
            visible: "true"
        },
        {
            name: "Delivery Address",
            type: "text",
            ref: "transactionDeliveryAddress",
            visible: "true"
        },
        {
            name: "Proof of Payment",
            type: "button",
            method: "showImage",
            args: "transactionId",
            other: "#showImage",
            display: "Show",
            visible: true
        },
        {
            name: "Date",
            type: "date",
            ref: "transactionDate",
            visible: "true"
        },
        {
            name: "Sales Invoice Number",
            type: "text",
            ref: "transactionSalesInvoiceNumber",
            visible: "true"
        },

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

        batchData.forEach(function (item, index, arr) {
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
                            if (aItem.ref == 'transactionPrice') {
                            }else if (aItem.ref == 'transactionDelivery') {
                            }else if (aItem.ref == 'transactionDate') {
                            }else{
                                if(aItem.name == searchField){
                                    
                                    searchHtml = searchHtml.concat('<option value="').concat(aIndex.toString()).concat('" Selected>'.concat(aItem.name).concat('</option>'));
                                    }else{
                                        searchHtml = searchHtml.concat('<option value="').concat(aIndex.toString()).concat('">'.concat(aItem.name).concat('</option>'));
                                    }
                            }
                            
                        }
                    }
                    if(batchData[index].transactionAccepted == 1){
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
                                        }else if(aItem.ref == 'transactionPrice'){
                                            var a = item[aItem.ref].toLocaleString();
                                            bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat(a).concat('</td>'));
                                        }else if(aItem.ref == 'transactionDeliveryAddress'){
                                            if (item[aItem.ref] == null) {
                                                bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat('No Address').concat('</td>'));
                                            }else{
                                                bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat(item[aItem.ref]).concat('</td>'));
                                            }
                                        }
                                        else {
                                            bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat(item[aItem.ref]).concat('</td>'));
                                        }
                                    }
                                    if (aItem.type == 'button') {
                                    if (aItem.name == 'Options') {
                                        bodyHtml = bodyHtml.concat('<td class="aksepDenay ').concat(colorClass).concat('">').concat('<a onclick="'.concat('acceptFree').concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class=" btnAccept btn" data-bs-toggle="modal">Accept</a> &nbsp;'))
                                            .concat('<a onclick="'.concat('denyTicket').concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnDeny btn" data-bs-toggle="modal">Deny</a></ttd>'));
                                    } else if (aItem.name == 'Edit Transaction') {
                                        bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat('<a onclick="'.concat(aItem.method).concat('(').concat(index).concat(',false)"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnOther btn btn-primary" data-bs-toggle="modal">').concat(aItem.display).concat('</a></ttd>'));
                                    } else if (aItem.name == 'Accept Transaction') {
                                        bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat('<a onclick="'.concat(aItem.method).concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnOther btn btn-success" data-bs-toggle="modal">').concat(aItem.display).concat('</a></ttd>'));
                                        
                                    }else if (aItem.name == 'Void Transaction') {
                                        bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat('<a onclick="'.concat(aItem.method).concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnOther btnDanger btn " data-bs-toggle="modal">').concat(aItem.display).concat('</a></ttd>'));
                                    }
                                    else {
                                        bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat('<a onclick="'.concat(aItem.method).concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnOther btn btn-info" data-bs-toggle="modal">').concat(aItem.display).concat('</a></ttd>'));
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
                                    }else if(aItem.ref == 'transactionPrice'){
                                        var a = parseInt(item['inventoryPrice']);
                                        var b = parseInt(item['transactionQuantity']);
                                        a *= b;
                                        bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat(a).concat('</td>'));
                                    }else if(aItem.ref == 'transactionDelivery'){
                                        if (item[aItem.ref] == '0') {
                                            bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat('No Delivery').concat('</td>'));
                                        }else{
                                            bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat(item[aItem.ref]).concat('</td>'));
                                        }
                                    }else if(aItem.ref == 'transactionDeliveryAddress'){
                                        if (item[aItem.ref] == null) {
                                            bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat('No Address').concat('</td>'));
                                        }else{
                                            bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat(item[aItem.ref]).concat('</td>'));
                                        }
                                    }
                                    else {
                                        bodyHtml = bodyHtml.concat('<td class="'.concat(colorClass).concat('">').concat(item[aItem.ref]).concat('</td>'));
                                    }
                                }
                                if (aItem.type == 'button') {
                                    if (aItem.name == 'Options') {
                                        bodyHtml = bodyHtml.concat('<td class="aksepDenay ').concat(colorClass).concat('">').concat('<a onclick="'.concat('acceptFree').concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class=" btnAccept btn" data-bs-toggle="modal">Accept</a> &nbsp;'))
                                            .concat('<a onclick="'.concat('denyTicket').concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnDeny btn" data-bs-toggle="modal">Deny</a></ttd>'));
                                    } else if (aItem.name == 'Edit Transaction') {
                                        bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat('<a onclick="'.concat(aItem.method).concat('(').concat(index).concat(',false)"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnOther btn btn-primary" data-bs-toggle="modal">').concat(aItem.display).concat('</a></ttd>'));
                                    } else if (aItem.name == 'Accept Transaction') {
                                        bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat('<a onclick="'.concat(aItem.method).concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnOther btn btn-success" data-bs-toggle="modal">').concat(aItem.display).concat('</a></ttd>'));
                                        
                                    }else if (aItem.name == 'Void Transaction') {
                                        bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat('<a onclick="'.concat(aItem.method).concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnOther btnDanger btn " data-bs-toggle="modal">').concat(aItem.display).concat('</a></ttd>'));
                                    }
                                    else {
                                        bodyHtml = bodyHtml.concat('<td class="').concat(colorClass).concat('">').concat('<a onclick="'.concat(aItem.method).concat('(').concat(item[aItem.args]).concat(')"').concat(' href="').concat(aItem.other).concat('" role="button" class="btnOther btn btn-info" data-bs-toggle="modal">').concat(aItem.display).concat('</a></ttd>'));
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

function searchItem(){
    searchInput = document.getElementById('searchText').value.toString();
    searchInput2 = document.getElementById('searchField').value;
    if(searchInput == ''){
        refreshTable();
    }else{
        if (searchInput2 == '0') {
            searchInput2 = 'customerName';
            searchField = 'Customer Name'
            searchQuery();
        }else if (searchInput2 == '1') {
            searchInput2 = 'brand';
            searchField = 'Item Name'
            searchQuery();
        }else if (searchInput2 == '2') {
            searchInput2 = 'type';
            searchField = 'Item Type'
            searchQuery();
        }else if (searchInput2 == '3') {
            searchInput2 = 'quantity';
            searchField = 'Quantity'
            searchQuery();
        }else if (searchInput2 == '7') {
            searchInput2 = 'SIN';
            searchField = 'Sales Invoice Number'
            searchQuery();
        }else{
            refreshTable();
        }
    }
    console.log(searchInput2);
    console.log(searchInput);
}

function searchQuery() {
    let xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        window.location.origin +
            "/transactionList?searchQuery=" +
            encodeURIComponent(searchInput) +
            "&searchTarget=" +
            encodeURIComponent(searchInput2)+"&page=1",
        true // Ensure the request is asynchronous
    );

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    // Parse the response and update the table
                    batchData = JSON.parse(xhr.responseText);
                    console.log("Search Results:", batchData);

                    formatTable();
                } catch (error) {
                    console.error("Error parsing response:", error);
                }
            } else if (xhr.status === 404) {
                console.log("No results found for the search query.");
                batchData = []; // Clear the table if no results are found
                formatTable();
            } else {
                console.error("Failed to fetch search results. Status:", xhr.status);
            }
        }
    };

    xhr.onerror = function () {
        console.error("An error occurred during the request.");
    };

    xhr.send();
}


function checkDetails(batch) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", window.location.origin + "/transactionBatch?batch=".concat(batch));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            //console.log(xhr.responseText);
            if (xhr.status == 200) {
                var trueData = JSON.parse(xhr.responseText);
                console.log(trueData);
                var tableData = trueData;
                var inHtml = "";
                tableData.forEach((item, index, arr) => {
                    inHtml = inHtml.concat('<tr>');
                    inHtml = inHtml.concat('<td>').concat(item.transactionQuantity).concat('</td>');
                    inHtml = inHtml.concat('<td>').concat(item.inventoryBrand).concat('</td>');
                    inHtml = inHtml.concat('<td>').concat(item.inventoryPrice202).concat('</td>');
                    inHtml = inHtml.concat('</tr>');
                })
                document.getElementById('modalCheck').innerHTML = inHtml;
            } else if (xhr.status == 500) {
                console.log("WALA NA ERROR KASI");
            }
        }
    };
    //console.log('html = ' + "http://192.168.1.4:1337/admin/batch?=".concat(batch));
    xhr.send();
}

function showImage(transactionId) {
    console.log("Transaction ID:", transactionId); // Debugging
    let xhr = new XMLHttpRequest();
    xhr.open("GET", window.location.origin + "/transactionProof/" + transactionId, true);

    xhr.responseType = "blob"; // Set response type to blob for handling binary data (image)
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // Create a URL for the image blob and display it
                let imageUrl = URL.createObjectURL(xhr.response);
                let imgElement = document.getElementById("proofImage");
                imgElement.src = imageUrl;

                // Show the modal containing the image
                let modal = new bootstrap.Modal(document.getElementById("showImage"));
                modal.show();
            } else if (xhr.status === 404) {
                console.error("Proof of payment not found.");
            } else {
                console.error("Error fetching transaction proof:", xhr.status, xhr.responseText);
            }
        }
    };

    xhr.send();
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