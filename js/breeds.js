
const search = document.querySelector('.search');
const searchBtn = document.querySelector('.search-btn');
const photoBlock = document.querySelector('.photo-block');
const backBtn = document.querySelector('.back-btn');
backBtn.addEventListener('click', (()=> history.back()));

const select = document.querySelector('.select-breeds');
const lim = document.querySelector('.select-limit');

let allTemperament = {};
let allOrigin = {};
let allWeight = {};
let allLifeSpan = {};

let allInfo;
let results;
let url;
let currentBreed;

let myHeaders = new Headers();
myHeaders.append('x-api-key', '9074a928-bd98-41a4-b064-316f1f3a0ad3');
let fetchData = {
    method: 'GET',
    body: null,
    headers: myHeaders
};


//Добавляємо опції
function addOptions() {
    url='https://api.thecatapi.com/v1/breeds';
    sendRequest(url)
    .then((data) => {
        for (let i = 0; i < data.length; i++) {
            let option = document.createElement('option');
            option.value = data[i].id;
            option.innerHTML =data[i].name;
            select.appendChild(option);
        }     
        let allBreeds = {};
        for (let i = 0; i < data.length; i++) {
            allBreeds[data[i].id]=data[i].name;
            allTemperament[data[i].id]=data[i].temperament;
            allOrigin[data[i].id]=data[i].origin;
            allWeight[data[i].id]=data[i].weight.imperial;
            allLifeSpan[data[i].id]=data[i].life_span;
         }
         
         sessionStorage.setItem('allBreeds', JSON.stringify(allBreeds));
         sessionStorage.setItem('allTemperament', JSON.stringify(allTemperament));
         sessionStorage.setItem('allOrigin', JSON.stringify(allOrigin));
         sessionStorage.setItem('allWeight', JSON.stringify(allWeight));
         sessionStorage.setItem('allLifeSpan', JSON.stringify(allLifeSpan));
    });
   
    url='';
}
if (select) {
    addOptions();
}

//Запит
function sendRequest() {   
    return fetch(url,fetchData)
        .then((response) => {
                    return response.json();
    });                    
}    


//Завантажуємо згідно з вибраниими оппціями
if(select) {
    select.addEventListener('change', (()=> {
        if (select.value) {
            url = `https://api.thecatapi.com/v1/images/search?breed_id=${select.value}&limit=${lim.value}`;  
        } else {
               url = `https://api.thecatapi.com/v1/breeds?attach_breed=1&limit=1000`;
        }
            sendRequest(url).then((data)=>{
            data.push(select.value);
            sessionStorage.setItem('content', JSON.stringify(data));
            getPhoto(data);
        });
            
    }));
}

if (!select || !select.value && !sessionStorage.getItem('content')) {
    url = `https://api.thecatapi.com/v1/breeds?attach_breed=1&limit=1000`;
     sendRequest(url).then((data)=>{
     sessionStorage.setItem('content', JSON.stringify(data));
     getPhoto(data);
    });
} else {
    data = JSON.parse(sessionStorage.getItem('content'));
getPhoto(data);
}


//Завантажуємо згідно вибраного ліміту 
if (lim) {
    lim.addEventListener('change', (()=> {
        if (select.value) {
            url = `https://api.thecatapi.com/v1/images/search?breed_id=${select.value}&limit=${lim.value}`;  
        } else {
               url = `https://api.thecatapi.com/v1/breeds?attach_breed=1&limit=1000`;
        }
    sendRequest(url).then((data)=>{
        data.push(select.value);
        sessionStorage.setItem('content', JSON.stringify(data));
        getPhoto(data);
    });
}));
}

//Завантажуємо після сортування
const sort = document.querySelector('.sort');
if (sort) {
    sort.addEventListener('click', (()=> {
        if (url) {
            sendRequest(url)
            .then((data) => data.sort((a,b)=>{
                if (a.name<b.name) {
                    return 1;
                }
                if (a.name>b.name) {
                    return -1;
                }
                return 0;
            })).then((data)=>{  
                data.push(select.value);
                sessionStorage.setItem('content', JSON.stringify(data));
                getPhoto(data);
            });
        }
    }));
}


const sortRev = document.querySelector('.sort-rev');
if (sortRev) {
    sortRev.addEventListener('click', (()=> {
        if (url) {
            sendRequest(url)
            .then((data) => data.sort((a,b)=>{
            if (a.name<b.name) {
                return -1;
            }
            if (a.name>b.name) {
                return 1;
            }
            return 0;
        })).then((data)=> {
            data.push(select.value);
            sessionStorage.setItem('content', JSON.stringify(data));
            getPhoto(data);
        });
        }
    }));
}

//Завантажуємо результати пошуку
searchBtn.addEventListener('click', (()=>{
    if (allBreeds) {
        let keys = Object.keys(allBreeds);
        for (let i = 0; i < keys.length; i++) {
            if (search.value.toLowerCase() === allBreeds[keys[i]].toLowerCase()) {
                url = `https://api.thecatapi.com/v1/images/search?breed_id=${keys[i]}&limit=${lim.value}`;
                sendRequest(url).then((data)=>{
                data.push(keys[i]);
                sessionStorage.setItem('content', JSON.stringify(data));
                getPhoto(data);
            });
                search.value='';
            } else {
                if (i===keys.length-1) {
                    search.value='';
                } 
            }  
        }               
    } 
})); 

//Функція побудови <div> елементів з фото 
function getPhoto(data) {  
    allBreeds = JSON.parse(sessionStorage.getItem('allBreeds')); 
    photoBlock.innerHTML='';
    for (let i = 0; i < data.length-1; i++) {
        let container = document.createElement('div');
        let nameBlock = document.createElement('div');
        let name = document.createElement('a');

        name.setAttribute('href', './info.html');   
       
        if (data[i].name) {
            name.innerHTML=data[i].name;
            name.setAttribute('id', `${data[i].id}`);
            container.id=data[i].id;
        } else {
            name.innerHTML=allBreeds[data[data.length-1]];
            container.id=data[data.length-1];
            name.setAttribute('id', `${data[data.length-1]}`);
        }
             
        name.classList.add('name');
        nameBlock.classList.add('name-block');
        container.classList.add('photo');
       
        nameBlock.appendChild(name);
        container.appendChild(nameBlock);
        
        if (i===0||(i+3)%10===0||(i)%10===0) {
            container.classList.add('high');
        } 
        if ((i + 2) % 5 ===0) {
            container.classList.add('big');
        }
        
        photoBlock.appendChild(container);
        
        if (data[i].url) {
            container.style.background = `url(${data[i].url}) top/cover no-repeat`;  
                 
        } else {
            if (data[i].image) {
                container.style.background = `url(${data[i].image.url}) top/cover no-repeat`; 
              
            } else {container.style.background = 'lightgrey';}
            
        }
        name.addEventListener('click', getInfo);
    }
}


function getInfo() {
    if (this.breeds) {
        sessionStorage.setItem('id', this.breeds[0].id);   
    } else {
        sessionStorage.setItem('id', this.id);  
    }
   
}








