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
var searchInput = '';
var searchInput2;
var searchField = '';
var currentIndex;
var detailsCurrentIndex

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
        },
        {
            name: "Supplier",
            type: "text",
            ref: "inventoryQuantity202",
            visible: true
        },
        {
            name: "Edit Item",
            type: "button",
            method: "editModal",
            args: "itemId",
            other: "#editModal",
            display: "Edit",
            visible: true
        },
        {
            name: "Delete Item",
            type: "button",
            method: "deleteModal",
            args: "itemId",
            other: "#deleteModal",
            display: "Delete",
            visible: true
        },
    ];
    searchInput = '';
    searchInput2 = '';
    searchField = '';
    refreshTable();
    prioBatch = true;
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
                        if (aItem.name == searchField) {
                            searchHtml = searchHtml.concat('<option value="').concat(aIndex.toString()).concat('" Selected>'.concat(aItem.name).concat('</option>'));
                        } else {
                            searchHtml = searchHtml.concat('<option value="').concat(aIndex.toString()).concat('">'.concat(aItem.name).concat('</option>'));
                        }
                        if (savedSelection == aIndex) dontChange = true;
                    }
                });
            }
            for (var i = 0; i < batchData[index].details.length; i++) {
                if (!prioBatch) {
                    if (parseInt(batchData[index].details[i].quantity) <= 5) {
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
                        bodyHtml = bodyHtml.concat('<td class="ext-center"id="supplier').concat(index).concat('">').concat(batchData[index].details[i].supplierName).concat('</td>');

                        bodyHtml = bodyHtml.concat('<td class="text-center"><button onclick="editModal(').concat(batchData[index].itemId +','+ i + ',' + index).concat(')" class="btn btn-primary">Edit</button></td>');
                        bodyHtml = bodyHtml.concat('<td class="text-center"><button onclick="deleteModal(').concat(batchData[index].itemId +','+ i + ',' + index).concat(')" class="btn btn-danger">Delete</button></td></tr>');
                        document.getElementById('tableHead').innerHTML = headHtml;
                        document.getElementById('tableBody').innerHTML = bodyHtml;
                        document.getElementById('searchField').innerHTML = searchHtml;
                    }
                } else {
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
                    if (parseInt(batchData[index].details[i].quantity) <= 100) {
                        bodyHtml = bodyHtml.concat('<td class="text-center" name="critikal" id="quantity').concat(index).concat('">').concat(batchData[index].details[i].quantity).concat('</td>');
                    } else {
                        bodyHtml = bodyHtml.concat('<td class="text-center" id="quantity').concat(index).concat('">').concat(batchData[index].details[i].quantity).concat('</td>');
                    }
                    console.log(i);
                    bodyHtml = bodyHtml.concat('<td class="ext-center"id="supplier').concat(index).concat('">').concat(batchData[index].details[i].supplierName).concat('</td>');
                    bodyHtml = bodyHtml.concat('<td class="text-center"><button onclick="editModal(').concat(batchData[index].itemId +','+ i + ',' + index).concat(')" class="btn btn-primary">Edit</button></td>');
                    bodyHtml = bodyHtml.concat('<td class="text-center"><button onclick="deleteModal(').concat(batchData[index].itemId +','+ i + ',' + index).concat(')" class="btn btn-danger">Delete</button></td></tr>');
                    document.getElementById('tableHead').innerHTML = headHtml;
                    document.getElementById('tableBody').innerHTML = bodyHtml;
                    document.getElementById('searchField').innerHTML = searchHtml;
                }

            }
        });

        if (dontChange) document.getElementById('searchField').value = savedSelection;
    }
}

function saveAdd() {
    var inProduct = document.getElementById('inProductId').value;
    var inType = '';
    var inPrice = inPrice = document.getElementById('inPPI').value;;
    var inQuantity = inQuantity = document.getElementById('inQuantity').value;;
    var inSupply = inSupply = document.getElementById('inSupply').value;;
    if (document.getElementById('inProductType202').checked) {
        inType = '202';
    } else if (document.getElementById('inProductType304').checked) {
        inType = '304';
    } else {
        alert("Please select a type.");
    }
    if (inProduct == '') {
        alert("Please enter a product name.");
    } else if (inType == '') {
        alert("Please select a type.");
    } else if (inPrice == '') {
        alert("Please enter a price.");
    } else if (inQuantity == '') {
        alert("Please enter a quantity.");
    } else if (inSupply == '') {
        alert("Please enter a supplier name.");
    } else {
        inProduct = document.getElementById('inProductId').value;
        inPrice = document.getElementById('inPPI').value;
        inQuantity = document.getElementById('inQuantity').value;
        inSupply = document.getElementById('inSupply').value;
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
                    swal("Item Added Successfully", "Your Item is now in the inventory", "success")
                    refreshTable();
                } else {

                }
            }
        };
        data = {
            details: {
                brand: inProduct,
                price: inPrice,
                quantity: inQuantity,
                type: inType,
                supplierName: inSupply,
            }
        };
        console.log(data);
        xhr.send(JSON.stringify(data));
    }
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

function editModal(inventoryId, index, detailsIndex) {
    selectedBatch = inventoryId;
    currentIndex = index;
    detailsCurrentIndex = detailsIndex;
    console.log(selectedBatch);
    console.log(currentIndex);
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
    document.getElementById('inProductIdEdit').value = batchData[detailsIndex].name;
    document.getElementById('inPPIEdit').value = batchData[detailsIndex].details[currentIndex].price;
    document.getElementById('inQuantityEdit').value = batchData[detailsIndex].details[currentIndex].quantity;
    document.getElementById('inSupplyEdit').value = batchData[detailsIndex].details[currentIndex].supplierName;
    if(batchData[detailsIndex].details[currentIndex].type == '202') {
        document.getElementById('inProductType202Edit').checked = true;
    }else if(batchData[detailsIndex].details[currentIndex].type == '304') {   
        document.getElementById('inProductType304Edit').checked = true;
    }
}

function critical() {
    if (prioBatch) {
        prioBatch = false;
        var crit = document.getElementsByName('critikal');
        for (var i = 0; i < crit.length; i++) {
            crit[i].classList.add('lowQuanty');
        }
        document.getElementById('SLQ').innerHTML = 'Show All';
        refreshTable();
    } else {
        prioBatch = true;
        var crit = document.getElementsByName('critikal');
        for (var i = 0; i < crit.length; i++) {
            crit[i].classList.remove('lowQuanty');
        }
        document.getElementById('SLQ').innerHTML = 'Show Low Quantity';
        refreshTable();
    }
}

function saveEdit() {
    var inProduct = document.getElementById('inProductIdEdit').value;
    var inType = '';
    var inPrice = document.getElementById('inPPIEdit').value;
    var inQuantity = document.getElementById('inQuantityEdit').value;
    var inSupply = document.getElementById('inSupplyEdit').value;

    if (document.getElementById('inProductType202Edit').checked) {
        inType = '202';
    } else if (document.getElementById('inProductType304Edit').checked) {
        inType = '304';
    }
    if (inProduct == '') {
        alert("Please enter a product name.");
    } else if (inType == '') {
        alert("Please select a type.");
    } else if (inPrice == '') {
        alert("Please enter a price.");
    } else if (inQuantity == '') {
        alert("Please enter a quantity.");
    } else if (inSupply == '') {
        alert("Please enter a supplier name.");
    } else {
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
                Price: inPrice,
                Type: inType,
                quantity: inQuantity,
                supply: inSupply,
                id: selectedBatch
            }
        };
        console.log(data);
        xhr.send(JSON.stringify(data));
    }
}

function cancelEdit() {
    document.getElementById('inProductIdEdit').value = '';
    document.getElementById('inPPIEdit').value = '';
    document.getElementById('inQuantityEdit').value = '';
    document.getElementById('inSupplyEdit').value = '';
    document.getElementById('inProductType202Edit').checked = false;
    document.getElementById('inProductType304Edit').checked = false;


    $('#editModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

function deleteModal(inventoryId) {
    selectedBatch = inventoryId;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

function confirmDelete() {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", window.location.origin + "/inventory");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                // Close the modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                modal.hide();

                // Refresh the table or perform any other UI updates
                refreshTable();
                swal({
                    title: "You deleted the item.",
                    text: "I will close in 2 seconds.",
                    timer: 2000
                });
            } else {
                alert("Failed to delete the item. Please try again.");
            }
        }
    };

    // Send the selectedBatch ID to the server
    data = {
        details: {
            id: selectedBatch
        }
    };
    xhr.send(JSON.stringify(data));
}

function searchItem() {
    searchInput = document.getElementById('searchText').value;
    searchInput2 = document.getElementById('searchField').value;
    if (searchInput == '') {
        refreshTable();
    } else {
        if (searchInput2 == '0') {
            searchInput2 = 'brand';
            searchField = 'Item Name';
            searchQuery();
        } else if (searchInput2 == '1') {
            searchInput2 = 'type';
            searchField = 'Type';
            searchQuery();
        } else if (searchInput2 == '2') {
            searchInput2 = 'price';
            searchField = 'Price';
            searchQuery();
        } else if (searchInput2 == '3') {
            searchInput2 = 'quantity';
            searchField = 'Quantity';
            searchQuery();
        } else if (searchInput2 == '4') {
            searchInput2 = 'supplier';
            searchField = 'Supplier';
            searchQuery();
        } else {
            refreshTable();
        }
    }
}

function searchQuery() {
    let xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        window.location.origin +
        "/inventoryList?searchQuery=" +
        encodeURIComponent(searchInput) +
        "&searchTarget=" +
        encodeURIComponent(searchInput2),
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

function goSalesReport() {
    window.location.replace("/salesReport");
}

function logout() {
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