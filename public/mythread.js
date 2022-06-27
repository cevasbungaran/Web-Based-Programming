const api_url =
    "myhomepageget/";

let slice = 1
let val = ""


async function getthread(url, slice, val) {

    let searchtag = val;
    let name = localStorage.getItem('username')
    const response = await fetch(api_url + name + '/' + searchtag, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    let data = await response.json();
    let dat_len = data.length
    let pag = dat_len / 5
    pagination(pag, data)

    if (response) {
        hideloader();
    }

    show(data, slice);
}

function search() {
    let val = document.getElementById('search').value

    getthread(api_url, 1, val)
}

getthread(api_url, slice, val);

function pagination(length, data) {
    let tab = ``;
    let val = document.getElementById('search').value
    for (let i = 1; i < length; i++) {
        tab += `<button id="page" onClick="getthread('${api_url}','${i}','${val}')"> ${i}</button>`

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
                <td>${r.creat.substring(0,10)}</td>          
                </tr>`;
    }

    document.getElementById("threadArray").innerHTML = tab;
}

// const paginate = (array, pageSize, pageNumber) => {
//     return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
// }