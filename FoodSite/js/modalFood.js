function addOrder(){
    var count = document.getElementById('orderCount').value;
    if(count >= 0){
        count++;
        document.getElementById('orderCount').value = count;
    }
}

function minOrder(){
    var count = document.getElementById('orderCount').value;
    if(count == 0){
        
    }
    else{
        count--;
        document.getElementById('orderCount').value = count;
    }
}

function resetOrderForm(){
    document.getElementById('option1').checked = false;
    document.getElementById('option2').checked = false;
    document.getElementById('orderCount').value = 0;
}

function showModalForm(){
    $('#settingModal').modal('show');
}




jsonobject.passFieldList[2].name
jsonobject[0].foodItems[1]['itemName'.concat(k.toString())]

if(jsonobject[0].foodItems[1].variation.length >= 2){
    yes
}else{
    no
}
for(let i=0; i <= jsonobject.merchantName.length; i++){
    for(let k=0 ; k <= jsonobject.merchantName.length; k++){
        if(jsonobject[i].foodItems[k].variation.length >= 2){
            yes
        }else{
            no
        }
    }
}