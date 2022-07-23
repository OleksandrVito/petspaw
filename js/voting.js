const backBtn = document.querySelector('.back-btn');
backBtn.addEventListener('click', (()=> history.back()));
const searchBtn = document.querySelector('.search-btn');
const search = document.querySelector('.search');
const container = document.querySelector('.container-voting');
const likeVotingBtn = document.querySelector('.like-voting-button');
const favouritesVotingBtn = document.querySelector('.favourites-voting-button');
const dislikesVotingBtn = document.querySelector('.dislikes-voting-button');
const outputBigBlock = document.querySelector('.output-big-block');

let breedCat;
let idCat;

let url ='https://api.thecatapi.com/v1/votes';

let allBreeds={};
let myHeaders = new Headers();
myHeaders.append('x-api-key', '9074a928-bd98-41a4-b064-316f1f3a0ad3');


url='https://api.thecatapi.com/v1/breeds';
let fetchData = {
    method: 'GET',
    body: null,
    headers: myHeaders
};

fetch(url, fetchData)
.then((response) => {
            return response.json();
})                    
.then((data)=> {
    allBreeds = {};
    for (let i = 0; i < data.length; i++) {
        allBreeds[data[i].id]=data[i].name;
     }
    sessionStorage.setItem('allBreeds', JSON.stringify(allBreeds));
});


//Завантажуємо результати пошуку
searchBtn.addEventListener('click', (()=>{
    if (allBreeds) {
        let keys = Object.keys(allBreeds);
        for (let i = 0; i < keys.length; i++) {
            if (search.value.toLowerCase() === allBreeds[keys[i]].toLowerCase()) {
                breedCat=keys[i];
                retutnCat();
            } else {
                if (i===keys.length-1) {
                    search.value='';
                } 
            }  
        }               
    } 
})); 


function retutnCat() {
    url = `https://api.thecatapi.com/v1/images/search?breed_ids=${breedCat}`;
    fetch(url, fetchData)
                .then((response) => {
                    return response.json();
                })  
                .then((data)=>{
                idCat=data[0].id;
                container.style.background = `url(${data[0].url}) center/cover no-repeat`;  
            });
                search.value='' ;
}

function retutnRandomCat() {
    
    url = `https://api.thecatapi.com/v1/images/search`;
    fetch(url, fetchData)
                .then((response) => {
                    return response.json();
                })  
                .then((dat)=>{
                    idCat=dat[0].id;                       
                container.style.background = `url(${dat[0].url}) center/cover no-repeat`;  
            }) ;                    
}

myHeaders.append('content-type', 'application/json');

retutnRandomCat();

likeVotingBtn.addEventListener('click', (()=>{
    let iconUrl = '../icon/like-color-30.png';
    let date = new Date();
    let time=`${date.getHours()}:${date.getMinutes()}`;

    getVote(1, 'Likes',iconUrl,time); 
  
}));
favouritesVotingBtn.addEventListener('click', (()=>{
    let iconUrl = '../icon/fav-30.png';
    let date = new Date();
    let time=`${date.getHours()}:${date.getMinutes()}`;

    getVote(2, 'Favourites',iconUrl,time);
    
}));

dislikesVotingBtn.addEventListener('click', (()=>{
    let iconUrl = '../icon/dislike-color-30.png';
    let date = new Date();
    let time=`${date.getHours()}:${date.getMinutes()}`;

    getVote(3, 'Dislikes',iconUrl,time);
}));



function createVote(value) {
    url= 'https://api.thecatapi.com/v1/votes';

   let dataFetch = {
        method: 'POST',
        body: JSON.stringify ({
            "image_id": `${idCat}`,
            "sub_id": "my-user-1103",
            "value": value,
          }),
        headers: myHeaders
    };
        
    fetch(url, dataFetch)
    .then((response) => {
        return response.json();
    });                    
}

function deleteVote(idVote) {
    url= `https://api.thecatapi.com/v1/votes/${idVote}`;

    let fetchData = {
        method: 'DELETE',
        headers: myHeaders
    };
    
    fetch(url, fetchData)
    .then((response) => {
        return response.json();
    });                    
}

function getVote(value,category,iconUrl,time) {
    url= 'https://api.thecatapi.com/v1/votes?sub_id=my-user-1103';
   
    let fetchData = {
        method: 'GET',
        headers: myHeaders
    };
    
    fetch(url, fetchData)
    .then((response) => {
        return response.json();
    })                    
    .then((data)=> {
        if (data!=0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].image_id===idCat) {
                    deleteVote(data[i].id); 
                    let category; 
                        if (data[i].value===1) {
                            category='Likes';
                        }
                        if (data[i].value===2) {
                            category='Favourites';
                        }
                        if (data[i].value===3) {
                            category='Dislikes';
                        }
                    let outputBlock = document.createElement('div');
                    outputBlock.classList.add('output-block');
                    outputBlock.innerHTML = `<p>Image ID: <span>${idCat}</span> was removed from ${category}</p>`;
                    outputBlock.style.backgroundColor = `#f8f8f7`;
                    let timeBlock = document.createElement('div');
                    timeBlock.classList.add('time');
                    timeBlock.innerHTML = time;
                    outputBlock.appendChild(timeBlock);
                    outputBigBlock.insertBefore(outputBlock,outputBigBlock.children[0]);
                   
        
                } else if (i===data.length-1){
                    createVote(value); 
                    let outputBlock = document.createElement('div');
                    outputBlock.classList.add('output-block');
                    outputBlock.innerHTML = `<p>Image ID: <span>${idCat}</span> was added to ${category}</p>`;
                    outputBlock.style.background = `url(${iconUrl}) 600px 20px/ 20px 20px no-repeat`;
                    outputBlock.style.backgroundColor = `#f8f8f7`;
                    let timeBlock = document.createElement('div');
                    timeBlock.classList.add('time');
                    timeBlock.innerHTML = time;
                    outputBlock.appendChild(timeBlock);
                    outputBigBlock.insertBefore(outputBlock,outputBigBlock.children[0]);
                }
               }
        } else if (data==0){
            createVote(value);
            let outputBlock = document.createElement('div');
            outputBlock.classList.add('output-block');
            outputBlock.innerHTML = `<p>Image ID: <span>${idCat}</span> was added to ${category}</p>`;
            outputBlock.style.background = `url(${iconUrl}) 600px 20px/ 20px 20px no-repeat`;
            outputBlock.style.backgroundColor = `#f8f8f7`;
            let timeBlock = document.createElement('div');
            timeBlock.classList.add('time');
            timeBlock.innerHTML = time;
            outputBlock.appendChild(timeBlock);
            outputBigBlock.insertBefore(outputBlock,outputBigBlock.children[0]);
        }
       
    })
    .then (()=> retutnRandomCat());
}
