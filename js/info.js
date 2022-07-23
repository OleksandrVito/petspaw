const id = document.querySelector('.id-block');
const swiperWrapper = document.querySelector('.swiper-wrapper');
const nameCat = document.querySelector('.about-name');
const backBtn = document.querySelector('.back-btn');
const leftInfoBlock =document.querySelector('.left-info-block');
const rightInfoBlock =document.querySelector('.right-info-block');
let slidesArr=[];


backBtn.addEventListener('click', (()=> history.back()));

const allBreeds = JSON.parse(sessionStorage.getItem('allBreeds'));
const allTemperament = JSON.parse(sessionStorage.getItem('allTemperament'));
const allOrigin = JSON.parse(sessionStorage.getItem('allOrigin'));
const allWeight = JSON.parse(sessionStorage.getItem('allWeight'));
const allLifeSpan = JSON.parse(sessionStorage.getItem('allLifeSpan'));


nameCat.innerHTML = allBreeds[sessionStorage.id];
id.innerHTML=sessionStorage.id;
leftInfoBlock.innerHTML = `<span>Temperament:</span></br>${allTemperament[sessionStorage.id]}`;
rightInfoBlock.innerHTML = `<span>Origin:</span> ${allOrigin[sessionStorage.id]}</br>
<span>Weight:</span> ${allWeight[sessionStorage.id]} kgs </br>
<span>Life span:</span> ${allLifeSpan[sessionStorage.id]} years`;

//Запит
url = `https://api.thecatapi.com/v1/images/search?breed_id=${sessionStorage.id}&limit=20`; 

let myHeaders = new Headers();
myHeaders.append('x-api-key', '9074a928-bd98-41a4-b064-316f1f3a0ad3');

let fetchData = {
    method: 'GET',
    body: null,
    headers: myHeaders
};

fetch(url,fetchData)
.then((response) => {
            return response.json();
})
.then((data)=> {
    getSlyder(data);
    swiper.virtual = {
      enabled: true,
      slides: slidesArr,
  };
document.querySelector('.swiper').classList.add('style');
});


function getSlyder(data) {
  swiperWrapper.innerHTML='';

  for (let i = 0; i < data.length; i++) {

      let container = document.createElement('div');
      container.classList.add('swiper-slide'); 
      swiperWrapper.appendChild(container);   
      
      if (data[i].url) {
          container.style.background = `url(${data[i].url}) center/cover no-repeat`;  
      } 
      slidesArr.push(container);    
  }
}
   
let swiper = new Swiper('.swiper', {
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});



   

