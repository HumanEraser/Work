function showAddModal(){
    $('#addModal').modal('show');
}

function cancelAdd(){
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

function saveAdd(){
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
}

function refreshTable(){

}

function goSales(){
    window.location.href = "adminViewSales.html";
}

function goRecords(){
    window.location.href = "adminView.html";
}

function goInventory(){
    window.location.href = "adminView.html";
}

function goDashboard(){
    window.location.href = "adminView.html";
}