var batchData;
var currentDate;
var theDate;
var initMonths = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
var monthSales = []
var trueMonthSales = [];
var priceJanuary = 0;
var priceFeburary = 0;
var priceMarch = 0;
var priceApril = 0;
var priceMay = 0;
var priceJune = 0;
var priceJuly = 0;
var priceAugust = 0;
var priceSeptember = 0;
var priceOctober = 0;
var priceNovember = 0;
var priceDecember = 0;
function init() {
    const date = new Date();
    currentDate = date.getFullYear();
    getSalesData();
}

function getSalesData() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", window.location.origin + "/transactionList?page=" + encodeURIComponent(1));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                batchData = JSON.parse(xhr.responseText);
                console.log(batchData);
                formatDate();
            } else if (xhr.status == 404) {
                console.log("GAGFSADFDS");
            }
        }
    };
    xhr.send();
}

function formatDate() {
    theDate = [];
    batchData.forEach(function (item, index, arr) {
        if (new Date(item.transactionDate).getFullYear() == currentDate) {
            if (new Date(item.transactionDate).getMonth().toString() == "0") {
                priceJanuary += parseFloat(item.transactionPrice);
            }else if(new Date(item.transactionDate).getMonth().toString() == "1"){
                priceFeburary += parseFloat(item.transactionPrice);
            }else if(new Date(item.transactionDate).getMonth().toString() == "2"){
                priceMarch += parseFloat(item.transactionPrice);
            }else if(new Date(item.transactionDate).getMonth().toString() == "3"){
                priceApril += parseFloat(item.transactionPrice);
            }else if(new Date(item.transactionDate).getMonth().toString() == "4"){
                priceMay += parseFloat(item.transactionPrice);
            }else if(new Date(item.transactionDate).getMonth().toString() == "5"){
                priceJune += parseFloat(item.transactionPrice);
            }else if(new Date(item.transactionDate).getMonth().toString() == "6"){
                priceJuly += parseFloat(item.transactionPrice);
            }else if(new Date(item.transactionDate).getMonth().toString() == "7"){
                priceAugust += parseFloat(item.transactionPrice);
            }else if(new Date(item.transactionDate).getMonth().toString() == "8"){
                priceSeptember += parseFloat(item.transactionPrice);
            }else if(new Date(item.transactionDate).getMonth().toString() == "9"){
                priceOctober += parseFloat(item.transactionPrice);
            }else if(new Date(item.transactionDate).getMonth().toString() == "10"){
                priceNovember += parseFloat(item.transactionPrice);
            }else if(new Date(item.transactionDate).getMonth().toString() == "11"){
                priceDecember += parseFloat(item.transactionPrice);
            }
        }
    });
    console.log(priceJanuary);
    setChart();
}

function setChart(){
    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: "Current Year " + currentDate,
                data: [priceJanuary, priceFeburary, priceMarch, priceApril, priceMay, priceJune, priceJuly, priceAugust, priceSeptember, priceOctober, priceNovember, priceDecember],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function goSales() {
    window.location.replace("/sales");
}

function goInventory() {
    window.location.replace("/inventory");
}

function goDashboard() {
    window.location.replace("/admin");
}