const backBtn = document.querySelector('.back-btn');
backBtn.addEventListener('click', (()=> history.back()))
const photoBlock = document.querySelector('.photo-block');
const outputBigBlock = document.querySelector('.output-big-block');

let myHeaders = new Headers();
myHeaders.append('x-api-key', '9074a928-bd98-41a4-b064-316f1f3a0ad3');


function createVote() {
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
       getPhoto(data);
    });
}

createVote() ;

function getPhoto(data) {  
 
    photoBlock.innerHTML='';
    if (!data.length) {
        photoBlock.innerHTML=`<div class="output-block no-item"><p>No item found</p></div>`;
        photoBlock.style.borderRadius='10px';
    }

    let chek = true;
    for (let i = 0; i < data.length; i++) {
        if (data[i].value===1) {
            chek=false;
        let container = document.createElement('div');
        let voteIconBloc = document.createElement('div');
        let voteIcon = document.createElement('div');
        voteIcon.style.background = `url(../icon/like-color-20.png) 10px 10px no-repeat`; 
        voteIcon.style.backgroundColor = `white`;  
      
        voteIcon.id=data[i].id;
                     
        voteIcon.classList.add('vote-icon');
        voteIconBloc.classList.add('vote-icon-block');
        container.classList.add('photo');
       
        voteIconBloc.appendChild(voteIcon);
        container.appendChild(voteIconBloc);
        
        if (i===0||(i+3)%10===0||(i)%10===0) {
            container.classList.add('high');
        } 
        if ((i + 2) % 5 ===0) {
            container.classList.add('big');
        }
        
        photoBlock.appendChild(container);

        //отримуємо URl картинки
        url= `https://api.thecatapi.com/v1/images/${data[i].image_id}`;

        let fetchData = {
            method: 'GET',
            headers: myHeaders
        };
        
        fetch(url, fetchData)
        .then((response) => {
            return response.json();
        })                    
        .then((data)=> {
        container.style.background = `url(${data.url}) top/cover no-repeat`; 
        });     
        voteIcon.addEventListener('click', deletePhoto);     
        } else if (i === data.length-1 && chek===true) {
            photoBlock.innerHTML=`<div class="output-block no-item"><p>No item found</p></div>`;
            photoBlock.style.borderRadius='10px';
        }  
       
    }
}

function deletePhoto() {
    url= `https://api.thecatapi.com/v1/votes/${this.id}`;

    let fetchData = {
        method: 'DELETE',
        headers: myHeaders
    };
    
    fetch(url, fetchData)
    .then((response) => {
        return response.json();
    })                    
    .then((data)=> {
       createVote();
       let outputBlock = document.createElement('div');
       outputBlock.classList.add('output-block');
       outputBlock.innerHTML = `<p>Image ID: <span>${this.id}</span> was removed from Likes</p>`;
       outputBlock.style.backgroundColor = `#f8f8f7`;
       let timeBlock = document.createElement('div');
       timeBlock.classList.add('time');
       let date = new Date();
       let time=`${date.getHours()}:${date.getMinutes()}`;
       timeBlock.innerHTML = time;
       outputBlock.appendChild(timeBlock);
       outputBigBlock.insertBefore(outputBlock, outputBigBlock.children[0]);
      
    });
}

