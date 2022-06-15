const api_url =
    "http://localhost:8082/myhomepageget/";

var slice = 1
var val = ""


async function getapi(url, slice, val) {

    var searchtag = val;
    var name = localStorage.getItem('user')
    const response = await fetch(api_url + name + '/' + searchtag, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    var data = await response.json();
    var dat_len = data.length
    var pag = dat_len / 5
    pagination(pag + 1, data)

    if (response) {
        hideloader();
    }

    show(data, slice);
}

function search() {
    var val = document.getElementById('search').value

    getapi(api_url, 1, val)
}

getapi(api_url, slice, val);

function pagination(length, data) {
    let tab = ``;
    var val = document.getElementById('search').value
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
        `<tr>
            <th>Title</th>
            <th>Category</th>
            <th>Created By</th>
            <th>Created Date</th>
        </tr>`;

    for (let r of data) {
        tab += `<tr> 
                <td>${r.title} </td>
                <td>${r.category}</td>
                <td>${r.usrname}</td> 
                <td>${r.creat}</td>          
                </tr>`;
    }

    document.getElementById("threadArray").innerHTML = tab;
}

// const paginate = (array, pageSize, pageNumber) => {
//     return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
// }