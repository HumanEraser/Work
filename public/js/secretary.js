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
            buttons += '<button class="itemBtns btn btn-primary" onclick="openItem('+index+')" id="itemNum'+index+'">' + item.inventoryBrand + '</button>';
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
}