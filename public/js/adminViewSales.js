function showAddModal() {
    $('#addModal').modal('show');
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
                if (isAdding) {
                    swal({
                        title: "Added Successfully",
                        icon: "success"
                    });
                } else {
                    swal({
                        title: "Edited Successfully",
                        icon: "success"
                    });
                }
                $('#addModal').modal('hide');
                //refreshTable();
            } else {
                swal({
                    title: "Server Error.",
                    text: "Please try again.",
                    icon: "error"
                });
            }
        }
    };
    data = {
        details: {
            itemId: inProduct,
            quantity: inQuantity,
            discount: inDiscount,
            price: inPPI,
            shippingFee: ""
        }
    };
    console.log(data)
    batch = JSON.stringify(data);
    xhr.send(batch);



}

function refreshTable() {}

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