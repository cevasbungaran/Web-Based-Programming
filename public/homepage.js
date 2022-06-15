 ///list of api yang digunakan/////////////
 const api_url = 
 "http://localhost:8082/homepageget/";
const api_post = 
 "http://localhost:8082/threadpost/";   
const api_category = 
 "http://localhost:8082/threadcategory/";      
const api_comment = 
 "http://localhost:8082/threadcomment/";      
const api_subComment = 
 "http://localhost:8082/subcomment/";        
///////////////////////////

//variabel default///////////////     
//pagination
var slice=1
//find
var val=""
//////////////////

//function untuk post thread
async function postthread() {
    var val=document.getElementById("yourthread").value
    var selval=document.getElementById("category").value

    const response = await fetch(api_post,{
    method: 'POST',
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    body:JSON.stringify({title: val, name:localStorage.getItem('user'), category:selval})
    }).then(
        window.location.reload('/homepage')
    );

// Storing data in form of JSON
}
////////////////

//function untuk submit comment
async function submitComment(idThread) {
    var val=document.getElementById(`urcom+${idThread}`).value
    var vals=document.getElementById('search').value
    var i=(parseInt(idThread/5, 10))+1;
    console.log(i) 
    const response = await fetch(api_subComment,{
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body:JSON.stringify({content: val, name:localStorage.getItem('user'),idThread:idThread})
    }).then(
        getapi(api_url,i,vals) 
    );        
}
////////////////////

///function untuk dapet semua category thread di db
async function getcategory() {
    // Storing response
    var searchtag = val;
    const response = await fetch(api_category,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    });

    var data = await response.json();
    let tab=``;
    for (let i = 0; i < data.length; i++) {
        tab+=`<option value='${data[i].id}'>${data[i].name}</option>`
    }

    document.getElementById("category").innerHTML = tab;
}
/////////////////////


// function untuk dapetin thread
async function getapi(url,slice,val) {
    var searchtag = val;
    const response = await fetch(api_url+searchtag,{
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    });
    var data = await response.json();
    //buat pagination
    //dapetin panjang data
    var dat_len=data.length
    var pag= dat_len/5
    //buat button pagination
    pagination(pag+1,data)
    ////

    if (response) {
        hideloader();
    }
    show(data,slice);
}

///////////manggil method search sekali keyup di input box   
function search(){
    var val=document.getElementById('search').value

    getapi(api_url,1,val)
}
///////////



//function untuk ngatur pagination
function pagination(length,data){
    let tab=``;
    var val=document.getElementById('search').value
    for (let i = 1; i < length; i++) {
        tab+=`<button onClick="getapi('${api_url}','${i}','${val}')"> ${i}</button>`
    
    }

    document.getElementById("pagination").innerHTML = tab;
}
///////////



// Nunggu data muncul 
function hideloader() {
    document.getElementById('loading').style.display = 'none';
}

//show data dari db
async function show(data,i) {
    //ngeslice array data
    data=data.slice(5*(i-1),5*(i))
    //
    let tab = 
    ``;

    // comment
    for (let r of data) {
        //id thread
        var id = r.id;
        //get comment comment
        const response = await fetch(api_comment+id,{
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        });
        var com = await response.json();
        ////////////

        tab += `<div id="content"> 
            
            <div id="category">${r.category}</div>
            <div id="title">${r.title} </div>
            <div id="name">${r.usrname}</div> 
            <div id="date">${r.creat}</div> 
            <br>
            <div id="commentus">`

        for(let s of com) {
            tab+=`<div id="comContent">${s.content}</div>
            <div id="dated">${s.created_date}</div>
            `
        }

        //dapetin spesifik thread yang di komen di r.id
        tab+=    `</div>
            <br>Your Comment:</br>    
            <input type="text" id="urcom+${r.id}" name="comment">
            <button onClick="submitComment(${r.id})"> Submit</button>
            </div>    
            </div>`;
    }
    //

    document.getElementById("threadArray").innerHTML = tab;   
}
/////////
getapi(api_url,slice,val);
//manggil function get category
getcategory()
////