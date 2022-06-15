//api yang digunakan
const api_url =
    "http://localhost:8082/homepageget/";
//variable pagination
let slice = 1
//variable search
let val = ""

// function untuk dapetin thread
async function getapi(url, slice, val) {
    let searchtag = val;
    const response = await fetch(api_url + searchtag, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    let data = await response.json();
    //buat dapetin panjang pagination
    let dat_len = data.length
    let pag = dat_len / 5
    //buat button pagination
    pagination(pag + 1, data)

    if (response) {
        hideloader();
    }

    show(data, slice);
}

function search() {
    let val = document.getElementById('search').value

    getapi(api_url, 1, val)
}

getapi(api_url, slice, val);

function pagination(length, data) {
    let tab = ``;
    let val = document.getElementById('search').value
    //buat button pagination sesuai value yg diketik di search
    for (let i = 1; i < length; i++) {
        tab += `<button onClick="getapi('${api_url}','${i}','${val}')"> ${i}</button>`

    }

    document.getElementById("pagination").innerHTML = tab;
}


function hideloader() {
    document.getElementById('loading').style.display = 'none';
}
function show(data, i) {
    data = data.slice(5 * (i - 1), 5 * (i))
    let tab =
        ``;

    for (let r of data) {
        tab += `<div id="content"> 
            
    <div id="category">${r.category}</div>
    <div id="title">${r.title} </div>
    <div id="name">${r.usrname}</div> 
    <div id="date">${r.creat}</div> 
    <div id="comment"></div> 
    <div>
    <br>Your Comment:</br>    
    <input type="text" id="urcom" name="comment">
    </div>    
    </div>`;
    }

    document.getElementById("threadArray").innerHTML = tab;
}