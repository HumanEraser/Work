//import { unclipArea } from "chart.js/helpers";

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
var batchLength;
var deliCbox = false;

function init() {
    adminFieldList = [{
        name: "Order List",
        type: "button",
        method: "checkDetails",
        args: "batchId",
        other: "#myModal",
        display: "Show Orders",
        visible: true
    }];
    trueFieldList = adminFieldList;
    showConfirmed = '0';
    document.getElementById('searchText').value = '';
    savedSelection = 0;
    refreshTable();
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
        var headData;
        var nextData;
        var trueData;

        var headHtml = '';
        var bodyHtml = '';
        var setHtml = '';
        var searchHtml = '';
        var dontChange = false;
        var buttons = '';

        /*  savedSelection = document.getElementById('searchField').value; */

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
            console.log(item);
            buttons += '<button class="btn btn-primary itemBtns text-center " onclick="openItem('+index+')" id="itemNum'+index+'">' + item.name + '</button>';
        });
        document.getElementById('itemList').innerHTML = buttons;
        /*      document.getElementById('tableHead').innerHTML = headHtml;
                document.getElementById('tableBody').innerHTML = bodyHtml;
                document.getElementById('searchField').innerHTML = searchHtml;
                if (dontChange) document.getElementById('searchField').value = savedSelection; */
    }
}

function openItem(item){
    selectedBatch = item;
    $('#addModal').modal('show');
    addItem();
}

function addItem(){
    document.getElementById('itemName').innerHTML = document.getElementById('itemNum'+selectedBatch).innerHTML;
    var price202 = '';
    var price304 = '';
    var quantity202 = 0;
    var quantity304 = 0;
    var tableBody = '';
    batchLength = batchData[selectedBatch].details.length;
    for(var i = 0; i < batchData[selectedBatch].details.length; i++){
        if(batchData[selectedBatch].details[i].type == '202'){
            price202 = batchData[selectedBatch].details[i].price;
            quantity202 = batchData[selectedBatch].details[i].quantity;
        } else if(batchData[selectedBatch].details[i].type == '304'){
            price304 = batchData[selectedBatch].details[i].price;
            quantity304 = batchData[selectedBatch].details[i].quantity;
        }
    }
    if(quantity202 > 0){
        tableBody += '<tr><td>202</td><td>'+ quantity202 + '</td><td>'+ price202 +'</td><td><input type="radio" id="202id" name="fav_language" value="202"></td></tr>';
    }
    if(quantity304 > 0){
        tableBody += '<tr><td>304</td><td>'+ quantity304 + '</td><td>'+ price304 +'</td><td><input type="radio" id="304id" name="fav_language" value="304"></td></tr>';
    }
    document.getElementById('tableBody').innerHTML = tableBody;
    console.log(batchData[selectedBatch].name);
}

function saveAdd() {
    var quantity = document.getElementById('orderCount').value;
    var type = '';
    var price = '';
    if(batchLength > 1){
        if(document.getElementById('202id').checked){
            type = '202';
            price = batchData[selectedBatch].details[0].price;
        } else if(document.getElementById('304id').checked){
            type = '304';
            price = batchData[selectedBatch].details[1].price;
        }
    }else{
        type = batchData[selectedBatch].details[0].type;
        price = batchData[selectedBatch].details[0].price;
    }
    if (quantity == 0) {
        alert('Please enter a quantity');
        return;
    } else {
        var details = {
            itemId: batchData[selectedBatch].itemId,
            itemName: batchData[selectedBatch].name,
            quantity: quantity,
            type: type,
            price: price
        };
        console.log(details);
        let xhr = new XMLHttpRequest();
        xhr.open("POST", window.location.origin + "/saveOrder");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    alert('Order added');
                    $('#addModal').modal('hide');
                    location.reload();
                } else if (xhr.status == 404) {
                    console.log("Order not found");
                } else {
                    console.log("Error: " + xhr.status);
                }
            }
        };
        xhr.send(JSON.stringify({ details: details }));
    }
}

function removeItem(batch){
    var details = {
        index: batch
    };
    let xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin + "/delete");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                alert('Item removed');
                location.reload();
            } else if (xhr.status == 404) {
                console.log("Item not found");
            } else {
                console.log("Error: " + xhr.status);
            }
        }
    };
    xhr.send(JSON.stringify({ details: details }));
}

function toCheckOut(){
    $('#checkOutModal').modal('show');
}

function checkOutBtn(){
    var csName = '';
    var pImg = '';
    var delfee = '';
    var deladd = '';
    var discount = '';
    var SIN = '';

    if(document.getElementById('proofImage').value == ''){
        alert('Please upload a proof of payment');
        return;
    }else{
        csName = document.getElementById('customerName').value;
        delfee = document.getElementById('sf').value;
        deladd = document.getElementById('address').value;
        discount = document.getElementById('discount').value;
        SIN = document.getElementById('SIN').value;
        var details = {
            customername: csName,
            deliveryFee: delfee,
            deliveryAddress: deladd,
            discount: discount,
            salesInvoiceNumber: SIN,
        };
        let xhr = new XMLHttpRequest();
        let photo = document.getElementById("proofImage").files[0];
        let formData = new FormData();
        if (photo != null) {
            formData.append("file", photo);
            formData.append("details", JSON.stringify(details));
            xhr.open("POST", window.location.origin + "/checkOut");
            //xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status == 200) {
                        alert('Transaction Complete');
                        location.reload();
                    } else if (xhr.status == 404) {
                        console.log("Order not found");
                    } else {
                        console.log("Error: " + xhr.status);
                    }
                }
            };
            xhr.send(formData); 
        }else{
            alert('Please upload a proof of payment');
            return;
        }
    }
}

function openDeliveryThing(){
    if(document.getElementById('deliver').checked){
        document.getElementById('ifDeliver').style.display = 'block';
    }else{
        document.getElementById('ifDeliver').style.display = 'none';
    }
}

function searchInvent(){
    let xhr = new XMLHttpRequest();
    xhr.open("GET", window.location.origin + "/inventoryList?searchQuery=" + encodeURIComponent(document.getElementById('searchText').value) + 
    "&searchTarget=" + encodeURIComponent('brand'));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                batchData = JSON.parse(xhr.responseText);
                formatTable();
            } else if (xhr.status == 404) {
                console.log("GAGFSADFDS");
            }
        }
    };
    xhr.send();
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

function cancelOut(){
    $('#checkOutModal').modal('hide');
    document.getElementById('customerName').value = '';
    document.getElementById('address').value = '';
    document.getElementById('sf').value = '';
    document.getElementById('SIN').value = '';
    document.getElementById('proofImage').value = '';
    document.getElementById('deliver').checked = false;
    document.getElementById('ifDeliver').style.display = 'none';
    document.getElementById('customerName').value = '';
}