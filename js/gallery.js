const backBtn = document.querySelector('.back-btn');
backBtn.addEventListener('click', (()=> history.back()));

const inputOpen = document.querySelector('.file');
inputOpen.setAttribute('accept', '.png,.jpg');

const openBtn = document.querySelector('.open-button');
openBtn.addEventListener('click', (()=>inputOpen.click()));


const imageContainer =document.querySelector('.image-container');
const imagePreview =document.querySelector('.photo-preview');

const textUnderPhoto =document.querySelector('.text-under-photo');
const uploadBlock =document.querySelector('.upload-block');
let uploadBtn;

const closePopup = document.querySelector('.close-button');
const photoBlock = document.querySelector('.photo-block');

inputOpen.addEventListener('change', changeHandler);

function changeHandler(event) {
    let file = event.target.files;
    imagePreview.style.background = 'none';
    if (!event.target.files.length) {
        return;
    }
    if (!file[0].type.match('image')) {
      return; 
    }
    const reader = new FileReader();
    reader.onload = ev =>{    
        uploadBlock.classList.remove('success'); 
        closePopup.addEventListener('click', clear); 
        closePopup.addEventListener('click', getPhoto); 
        imagePreview.style.background = `url(${ev.target.result}) top/cover no-repeat`;  
        imagePreview.style.zIndex = 3;   
        imageContainer.classList.add('active');
        textUnderPhoto.innerHTML=`Image File Name: ${file[0].name}`;
        uploadBlock.classList.add('active');
        uploadBtn = document.createElement('button');
        uploadBlock.innerHTML='';
        uploadBtn.innerHTML='UPLOAD PHOTO';
        uploadBlock.appendChild(uploadBtn);
        uploadBtn.classList.add('upload-button');
        uploadBtn.addEventListener('mousedown',(()=>{
            uploadBtn.classList.add('active');
            uploadBtn.innerHTML='UPLOADING';
        }));
        uploadBtn.addEventListener('click',(()=>{
            let formData = new FormData();
            formData.append('file',inputOpen.files[0]);
            formData.append('sub_id','my-user-1103');
            uploadFile (formData);
            }));
    };
    reader.readAsDataURL(file[0]);
}


function clear() {
    imagePreview.style.background = 'none';
    imagePreview.style.zIndex = 1;  
    imageContainer.classList.remove('active');
    textUnderPhoto.innerHTML='No file selected';
    uploadBlock.classList.remove('active');
    uploadBlock.classList.remove('error');
    uploadBlock.classList.remove('success');
    uploadBtn.classList.remove('active');
    uploadBtn.innerHTML='UPLOAD PHOTO';
    inputOpen.value='';
    file=[];
}

let myHeaders = new Headers();
myHeaders.append('x-api-key', '9074a928-bd98-41a4-b064-316f1f3a0ad3');

function uploadFile (formData) {
   
    let url= `https://api.thecatapi.com/v1/images/upload`;

    let dataFetch = {
        method: 'POST',
        body:formData,
        headers: myHeaders
    };
        
    fetch(url, dataFetch)
    .then((response) => {
        if (response.ok) {
            return response.json()
            .then(()=> {
                clear();
                uploadBlock.classList.add('success');
                uploadBlock.innerHTML='Thanks for the Upload - Cat found!';
             });
        } else{
            uploadBtn.classList.remove('active');
            uploadBlock.classList.remove('active');
            uploadBlock.classList.add('error');
            uploadBlock.innerHTML='No Cat found - try a different one';
        } 
    });                     
}

function getPhoto() {
   let url= 'https://api.thecatapi.com/v1/images?limit=100&sub_id=my-user-1103';

    let dataFetch = {
        method: 'GET',
        body: null,
        headers: myHeaders
    };
    
    fetch(url, dataFetch)
    .then((response) => {
        return response.json();
    })                    
    .then((data)=> {
       createBlok(data);
    });
}

getPhoto();

function createBlok(data) {  
 
    photoBlock.innerHTML='';
    for (let i = 0; i < data.length; i++) {
       
        let container = document.createElement('div');
        let delIconIconBloc = document.createElement('div');
        let delIcon = document.createElement('div');
        delIcon.style.background = `url(../icon/close-20.png) 9.5px 9.5px no-repeat`; 
        delIcon.style.backgroundColor = `white`;  
      
        delIcon.id=data[i].id;
                     
        delIcon.classList.add('vote-icon');
        delIconIconBloc.classList.add('vote-icon-block');
        container.classList.add('photo');
       
        delIconIconBloc.appendChild(delIcon);
        container.appendChild(delIconIconBloc);
        
        if (i===0||(i+3)%10===0||(i)%10===0) {
            container.classList.add('high');
        } 
        if ((i + 2) % 5 ===0) {
            container.classList.add('big');
        }
        
        photoBlock.appendChild(container);

        container.style.background = `url(${data[i].url}) top/cover no-repeat`; 
             
        delIcon.addEventListener('click', deletePhoto);       
    }
}

function deletePhoto() {
  let url= `https://api.thecatapi.com/v1/images/${this.id}`;

    let fetchData = {
        method: 'DELETE',
        headers: myHeaders
    };
    fetch(url, fetchData) 
    .then((data)=> {
       getPhoto();
    });  
}
