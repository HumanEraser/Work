function init(){

}
function refreshTable() {

}

function showAddModal() {
    $('#addModal').modal('show');
}

function saveAdd() {
    var inTime = document.getElementById('inTime').value;
    var inProduct = document.getElementById('inProduct').value;
    var inVariant = document.getElementById('inVariant').value;
    var inQuantity = document.getElementById('inQuantity').value;
    var inPPI = document.getElementById('inPPI').value;
    var inTP = document.getElementById('inTP').value;
    var inPPM = document.getElementById('inPPM').value;
    var inDiscount = document.getElementById('inDiscount').value;
    var inSF = document.getElementById('inSF').value;

    console.log(inTime);
    console.log(inProduct);
    console.log(inVariant);
    console.log(inQuantity);
    console.log(inPPI);
    console.log(inTP);
    console.log(inPPM);
    console.log(inDiscount);
    console.log(inSF);

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
            }
        }
    };
    data = {
        details: {
            itemId: "inProduct",
            quantity: "inQuantity",
            price: "inPPI",
            discount: "inDiscount",
            shippingFee: "a",
            status: "a",
            payment: "a"
        }
    };
    console.log(data);
    batch = JSON.stringify(data);
    xhr.send(batch);



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