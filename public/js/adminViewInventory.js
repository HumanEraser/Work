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
            ref: "inventoryBrand",
            visible: true

        },
        {
            name: "Price per Piece (202)",
            type: "text",
            ref: "inventoryPrice202",
            visible: true
        },
        {
            name: "Price per Piece (304)",
            type: "text",
            ref: "inventoryPrice304",
            visible: true
        },
        {
            name: "Quantity (202)",
            type: "text",
            ref: "inventoryQuantity202",
            visible: true
        },
        {
            name: "Quantity (304)",
            type: "text",
            ref: "inventoryQuantity304",
            visible: true
        },
        {
            name: "Edit Item",
            type: "button",
            method: "editModal",
            args: "inventoryId",
            other: "#editModal",
            display: "Edit",
            visible: true
        },
        {
            name: "Delete Item",
            type: "button",
            method: "deleteModal",
            args: "inventoryId",
            other: "#deleteModal",
            display: "Delete",
            visible: true
        },
    ];
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
                            } else {
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
        });
        document.getElementById('tableHead').innerHTML = headHtml;
        document.getElementById('tableBody').innerHTML = bodyHtml;
        document.getElementById('searchField').innerHTML = searchHtml;
        if (dontChange) document.getElementById('searchField').value = savedSelection;
    }
}

function saveAdd() {
    var inProduct = document.getElementById('inProductId').value;
    var inPrice = document.getElementById('inPPI').value;
    var inPrice2 = document.getElementById('inPPI2').value;
    var quanti202 = document.getElementById('inQuanti202').value;
    var quanti304 = document.getElementById('inQuanti304').value;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin + "/inventory");
    xhr.setRequestHeader("Accept", "/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(xhr);
            if (xhr.status == 200) {
                $('#addModal').modal('hide');
                refreshTable();
            } else {

            }
        }
    };
    data = {
        details: {
            brand: inProduct,
            price202: inPrice,
            price304: inPrice2,
            quantity202: quanti202,
            quantity304: quanti304
        }
    };
    console.log(data);
    xhr.send(JSON.stringify(data));
}

function showAddModal() {
    $('#addModal').modal('show');
}

function cancelAdd() {
    document.getElementById('inProductId').value = '';
    document.getElementById('inPPI').value = '';
    document.getElementById('inPPI2').value = '';
    document.getElementById('inQuanti').value = '';
    $('#addModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

function editModal(inventoryId) {
    selectedBatch = inventoryId;
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
    let xhr = new XMLHttpRequest();
    xhr.open("GET", window.location.origin + "/inventory/" + encodeURIComponent(inventoryId));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                editBatch = JSON.parse(xhr.responseText);
                console.log(editBatch);
                document.getElementById('inProductIdNew').value = editBatch.inventoryBrand;
                document.getElementById('inPPINew').value = editBatch.inventoryPrice202;
                document.getElementById('inPPI2New').value = editBatch.inventoryPrice304;
                document.getElementById('inQuanti202New').value = editBatch.inventoryQuantity202;
                document.getElementById('inQuanti304New').value = editBatch.inventoryQuantity304;
            } else if (xhr.status == 404) {
                console.log("Inventory item not found");
                reject("Item not found");
            } else {
                console.log("Error fetching inventory item");
                reject("Error fetching item");
            }
        }
    };
    xhr.send();
}

function saveEdit() {
    var inProduct = document.getElementById('inProductIdNew').value;
    var inPrice = document.getElementById('inPPINew').value;
    var inPrice2 = document.getElementById('inPPI2New').value;
    var quanti202 = document.getElementById('inQuanti202New').value;
    var quanti304 = document.getElementById('inQuanti304New').value;

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", window.location.origin + "/inventory");
    xhr.setRequestHeader("Accept", "/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(xhr);
            if (xhr.status == 200) {
                $('#editModal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                refreshTable();
            } else {

            }
        }
    };
    data = {
        details: {
            brand: inProduct,
            price202: inPrice,
            price304: inPrice2,
            quantity202: quanti202,
            quantity304: quanti304,
            id: selectedBatch
        }
    };
    console.log(data);
    xhr.send(JSON.stringify(data));
}

function cancelEdit() {
    $('#editModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
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