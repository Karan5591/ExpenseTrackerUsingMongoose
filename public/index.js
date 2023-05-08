


//=================================Login Page=====================================

const Login=document.getElementById("Sign-in-button")
if(Login)
{
Login.addEventListener('click', async function ()
{
    
    axios.post("http://localhost:3000/loginUser", 
       
     {
        email:document.getElementsByName("email")[0].value,
        password:document.getElementsByName("password")[0].value
    }
).then(response=>{
    location.replace("/ExpensePage.html")
    

})
.catch(err=>{
    alert(err.response.data);
});
})
}

//====================================Register User=====================================

const register=document.getElementById("RegisterButton")
if(register)
{
register.addEventListener('click', async function ()
{
    
    axios.post("http://localhost:3000/RegisterUser", 
       
     {
        name:document.getElementsByName("name")[0].value,
        email:document.getElementsByName("email")[0].value,
        password:document.getElementsByName("password")[0].value
    }
).then(response=>{
    console.log(response);
    alert(`${response.data}.. Login Now?`);
    location.replace("login.html");
});
})
}
//======================LOADING PAGE CONTENT===============================

document.addEventListener('DOMContentLoaded', async function(){

    let prevBtnNum=1;
    let nextBtnNum=prevBtnNum+1;
    let tableSize=localStorage.getItem("size");
    const prevBtnData=document.getElementById("prevButton")
    if(prevBtnData)
    {
        prevBtnData .innerText=prevBtnNum;
    }
    
    const nextBtnData=document.getElementById("nextButton")
    if(nextBtnData)
    {
        nextBtnData.innerText=nextBtnNum;
    }
    


await axios.get(`http://localhost:3000/getAll?page=0&size=${tableSize}`)
   
.then (response=>{
    

    const checkpremium =response.data[0].user_id.ispremium;
    console.log(checkpremium);
    if(checkpremium=='True')
    {
        document.getElementById('rzp-button1').style.visibility='hidden';
        document.getElementById('premium-message').style.display='block';
    }
    loadHTMLTable( response.data);
    

})
});
const dataAmount=document.getElementById("Data-Amount")
if(dataAmount)
{
dataAmount.addEventListener('change', function(event) 
{
    localStorage.setItem("size", document.getElementById("Data-Amount").value);
    location.reload();
})
}
const prevButton=document.getElementById("prevButton")
if(prevButton)
{
    prevButton.onclick= async function (e)
{
    let tableSize= document.getElementById("Data-Amount").value;

   let updatePBText= (document.getElementById("prevButton").innerText)-1;
   let updateNBText= (document.getElementById("nextButton").innerText)-1;
   if(updatePBText<1)
   {
    updatePBText+=1;
    updateNBText=parseInt(updatePBText)+ parseInt(1);
   }    
    await axios.get(`http://localhost:3000/getAll?page=${updatePBText}&size=${tableSize}`)
    .then (response=>{const data= response.data[0].expenses;
        loadHTMLTable(data);
    document.getElementById("prevButton").innerText=updatePBText;
    document.getElementById("nextButton").innerText=updateNBText
})

}}
const nextButton=document.getElementById("nextButton")
if(nextButton)
{
    nextButton.onclick= async function (e)
{
    let tableSize= document.getElementById("Data-Amount").value;

    const updatePBText= parseInt(document.getElementById("prevButton").innerText)+parseInt(1);
   const updateNBText= parseInt(document.getElementById("nextButton").innerText)+ parseInt(1);
    await axios.get(`http://localhost:3000/getAll?page=${updatePBText}&size=${tableSize}`)
    .then (response=>{const data= response.data[0].expenses;
    loadHTMLTable(data);
    document.getElementById("prevButton").innerText=updatePBText;
    document.getElementById("nextButton").innerText=updateNBText
})

}
}

function loadHTMLTable(data)
{
let count=0;
const table=document.querySelector('table tbody')

if(data.length===0)
{
    table.innerHTML="<tr><td class='no-data' colspan='6'>No Data</td></tr>"
}
else
{
let tableHTML="";
       
    for(let key in data)
    {

    
    let {_id, amount, category, description}=data[key]
    console.log(_id);
    count++;
    tableHTML+= "<tr>";
   // tableHTML+=`<td>${count}</td>`;
    tableHTML+=`<td>${amount}</td>`;
    tableHTML+=`<td>${description}</td>`;
    tableHTML+=`<td>${category}</td>`
    
    tableHTML+=`<td><button class="delete-row-btn" data-id=${_id}>Delete</button></td>`;
    tableHTML+=`<td><button class="edit-row-btn" id="EditBtn" data-id=${_id}>Edit</button></td>`;
    tableHTML+="</tr>";
    
};
table.innerHTML=tableHTML;
}
}

//=========================================Add New Data===================================================================================

const addData=document.getElementById("add-data-button")
if(addData)
{
addData.onclick= async function(e)
{
    if(document.getElementById("add-data-button").innerText=='Add Data')
    {
        await axios.post('http://localhost:3000/AddExpenseData',
        {
           amount: document.getElementsByName('amount')[0].value,
        description: document.getElementsByName('description')[0].value,
        category: document.getElementsByName('category')[0].value
        }).then(response=>{
            alert("Data Added");
            location.replace("ExpensePage.html");
    })
    }
    
}}
//=================================================================Delete Data==================================================



const Tbody=document.querySelector('table tbody')
if(Tbody)
{

Tbody.addEventListener('click', function(event) {
if (event.target.className === "delete-row-btn") {
   
    deleteRowById(event.target.dataset.id);
    
}
if (event.target.className === "edit-row-btn") {
    handleEditRow(event.target.dataset.id);
}
})
}
async function deleteRowById(id) {
   
    await axios.delete('http://localhost:3000/DeleteExpense/'+id, {
        })
    .then(data => {
            alert("Data Deleted Successfully")
            location.reload();
        }
    );
}

//====================================================Edit Data===================================================================

const updateBtn = document.getElementById('add-data-button');

function handleEditRow(id) {
    let amtValue=0;
   var table= document.getElementById("table");
   for(var i=1;i<table.rows.length; i++)
   {
    table.rows[i].onclick=function(e)
    {
        amtValue=this.cells[0].innerHTML;
        document.getElementById("amount").value=this.cells[0].innerHTML;
        document.getElementById("description").value=this.cells[1].innerHTML;
        document.getElementById("category").value=this.cells[2].innerHTML;
        document.getElementById("add-data-button").innerText="Update";
    }
   }


updateBtn.addEventListener("click", async function() {
    let newValue=0
    if(updateBtn.innerText=='Update')
    {

    
    const amountInput= document.querySelector('#amount');
    const descriptionInput= document.querySelector('#description');
    const categoryInput= document.querySelector('#category');
    const amount=amountInput.value;
    const description=descriptionInput.value;
    const category=categoryInput.value;

        if(amtValue>amount)
        {
            newValue=amount-amtValue;
        }
        else if(amtValue<amount)
        {
            newValue=amount-amtValue;
        }

    await axios('http://localhost:3000/update', {
        
        method: 'PATCH',
        data: ({
            productid: id,
             amount: amount,
            description: description,
            category: category,
            nwValue:newValue
        
        })
    })
    .then(data => {
        alert("Data updated")
        location.reload();    
        
    })
}
})
}

//===============================================================RazorPay Interface====================================

const rzpButton=document.getElementById("rzp-button1")
if(rzpButton)
{
rzpButton.onclick= async function(e)
{
const response= await axios.get('http://localhost:3000/Pmembership') 

console.log(response) // we get order id here
var options={
    
  "key": response.data[1],
  "order_id": response.data[0],

  "handler": async function (response){
   await axios.post("http://localhost:3000/updatetxnstatus",{
   body: {
    order_id: options.order_id,
    payment_id: response.razorpay_payment_id,
    
  }
}) 
  .then(data=>alert("Payment Successful"))
}
}

const rzp1= new Razorpay(options);
rzp1.open();
e.preventDefault();
rzp1.on('payment.failed', function(response){

    axios.post("http://localhost:3000/updatetxnstatus",{
        body: {
    
    payment_id: '0'
    }
    })

    console.log(response)
alert("Payment not Processed.");
});
}
}

//==================================================LeaderBoard===========================

const Lboard=document.getElementById('Leaderboard')
if(Lboard)
{
    Lboard.onclick= async function(e)
{
    if(Lboard.innerText=="Show Expense Data")
    {
        document.getElementById('showExpenseData').style.display='block';
    document.getElementById('LeaderBoardShow').style.display='none';
    Lboard.innerText="See Leaderboard"
    location.reload();
    }
    else
    {
  
   await axios.get('http://localhost:3000/LeaderBoard')
    .then(response=>{const data=response.data;
    showLeaderboard(data)});

    document.getElementById('showExpenseData').style.display='none';
    document.getElementById('LeaderBoardShow').style.display='block';
    Lboard.innerText="Show Expense Data"
}
}}
function showLeaderboard(data)
{
    const list=document.getElementById('thelist')
    data.forEach(function({name, TotalExpense})
    {
        list.innerHTML+=`<li>Name: ${name} &nbsp;&nbsp;&nbsp; Expense Amount: ${TotalExpense} </li>`
    })
 }      


//================================================Download the Expenses.

const dExpense=document.getElementById("downloadExpenses")
if(dExpense)
{
    dExpenseonclick= async function(e)
{
   
        await axios.get('http://localhost:3000/downloadFile')
    .then((resolve)=>{
        if(resolve.status===200)
        {
            var a=document.createElement("a");
            a.href=resolve.data.getURL;
            a.download='expense.csv';
            a.click();

        }
        else{
            alert(resolve.message);
        }
})
    
   
}}

