function saveAdd() {
    var inProduct = document.getElementById('inProductId').value;
    var inVariant = document.getElementById('inVariant').value;
    var inCategory = document.getElementById('inCategory').value;
    var inPPI = document.getElementById('inPPI').value;
    var inUM = document.getElementById('inUM').value;

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
                //refreshTable();
            } else {

            }
        }
    };
    data = {
        details: {
            brand: inProduct,
            category: inCategory,
            price: inPPI,
            unit: inUM
        }
    };
    console.log(data);
    xhr.send(data);

}



function showAddModal() {
    $('#addModal').modal('show');
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