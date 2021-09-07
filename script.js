"use strict"
window.onload = function(){

  //Определяем время суток и загружаем первую картинку
  const picture = document.querySelector("div.editor > img");
  let picture_Url_Array = [];
  let pathPicURL = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images';
  let dateNow = new Date();
  let getTime = `${dateNow.getHours()}.${dateNow.getMinutes()}`;
  if(6.00 <= getTime && getTime <= 11.59){
    pathPicURL = `${pathPicURL}/morning`;
  } else if(12.00 <= getTime && getTime <= 17.59){
    pathPicURL = `${pathPicURL}/day`;
  } else if(18.00 <= getTime && getTime <= 23.59){
    pathPicURL = `${pathPicURL}/evening`;
  } else if(0 <= getTime && getTime <= 5.59){
    pathPicURL = `${pathPicURL}/night`;
  } 
  
  let flag = true;
  function viewBgImage(src) {  
    const img = new Image();
    img.src = src;
    if(flag){
      for(let i = 1; i <= 20; i++){
        if(i < 10){
          picture_Url_Array.push(`${pathPicURL}/0${i}.jpg?raw=true`);
        }else{
          picture_Url_Array.push(`${pathPicURL}/${i}.jpg?raw=true`);
        }
      }
      flag = false;
    }
    img.onload = () => {  
      let activePic = picture_Url_Array.indexOf(picture.src);
      if(picture_Url_Array.indexOf(picture.src) == picture_Url_Array.length-1){
        picture.src = picture_Url_Array[0];
      } else {
        picture.src = picture_Url_Array[activePic + 1];
      }    
    }; 
    return img;
  }

  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext("2d");
  function drawImage() {
    const output = document.querySelectorAll(`output[name = result]`);
    output.forEach(element => console.log(element.value));
    const img = new Image();  
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = picture.src;
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      console.log(canvas.width, picture.width);
      ctx.filter = `blur(${output[0].value * Math.sqrt((canvas.width * canvas.height)/(picture.width * picture.height))}px) invert(${output[1].value}%) sepia(${output[2].value}%) saturate(${output[3].value}%) hue-rotate(${output[4].value}deg)`;
      ctx.drawImage(img, 0, 0);
    }; 
  }
  drawImage();

  //Filter Blur
  const blur = document.querySelector('input[name = blur]');
  blur.addEventListener('mousedown', change);
  blur.addEventListener('mouseup', change2);
    //Filter Invert
  const invert = document.querySelector('input[name = invert]');
  invert.addEventListener('mousedown', change);
  invert.addEventListener('mouseup', change2);
    //Filter Sepia
  const sepia = document.querySelector('input[name = sepia]');
  sepia.addEventListener('mousedown', change);
  sepia.addEventListener('mouseup', change2);
  //Filter Saturate
  const saturate = document.querySelector('input[name = saturate]');
  saturate.addEventListener('mousedown', change);
  saturate.addEventListener('mouseup', change2);
  //Filter hue_rotate
  const hue_rotate = document.querySelector('input[name = hue]');
  hue_rotate.addEventListener('mousedown', change);
  hue_rotate.addEventListener('mouseup', change2);
  let interval;
  function change(e){
    interval = setInterval(() => {
      const output = document.querySelector(`input[name = ${e.target.name}] + output[name = result]`);
      output.innerHTML = e.target.value;
      if(e.target.name == "blur"){
        picture.style.setProperty(`--${e.target.name}`, e.target.value + "px");
      } else if(e.target.name == "invert" || e.target.name == "sepia" || e.target.name == "saturate"){
        picture.style.setProperty(`--${e.target.name}`, e.target.value + "%");
      } else if(e.target.name == "hue"){
        picture.style.setProperty(`--${e.target.name}`, e.target.value + "deg");
      }
      drawImage();
    },10)
    return interval
  }
  function change2 (e) {
    clearInterval(interval);
  }

  // Функция вкл/выкл полноэкранного режима
  const fullscreen = document.querySelector("button.fullscreen");
  const getFullscreen = (e) => {
    if(document.fullscreenElement){
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }
  fullscreen.addEventListener("click", getFullscreen);

  //Загрузка изображения
  picture_Url_Array.push(picture.src);
  const loader = document.querySelector("label.btn-load > input[type='file']");
  loader.addEventListener("change", onFileSelected);
  function onFileSelected(e) {
    activeBTN();
    document.querySelector("label.btn-load").classList.toggle("btn-active");
    let selectedFile = e.target.files[0];
    let reader = new FileReader();
    picture.title = selectedFile.name;
    reader.onload = function(e) {
      if(!picture_Url_Array.includes(e.target.result)){
        picture_Url_Array.push(e.target.result);
      }
      picture.src = e.target.result;
      console.log(picture_Url_Array)
    };
    reader.readAsDataURL(selectedFile);
  }

  //next picture
  const nextPicture = document.querySelector("button.btn-next");
  nextPicture.addEventListener("click", nextPic);
  function nextPic(){  
    viewBgImage(`${pathPicURL}/01.jpg`);
    activeBTN();
    nextPicture.classList.toggle("btn-active");
      setTimeout(() => drawImage(), 80);// поскольку 1-й вызов записывает адреса в массив, viewBgImage(`${pathPicURL}/01.jpg`); отрабатывает дольше этой функции и картинка не менялась сразу
  }  

  // Reset Function
  const reset = document.querySelector(`button.btn-reset`);
  reset.addEventListener("click", resetFunc);
  function resetFunc(e){
    picture.style.setProperty(`--${blur.name}`, `${blur.value = 0}` + "px");
    picture.style.setProperty(`--${invert.name}`, `${invert.value = 0}` + "%");
    picture.style.setProperty(`--${sepia.name}`, `${sepia.value = 0}` + "%");
    picture.style.setProperty(`--${saturate.name}`, `${saturate.value = 100}` + "%");
    picture.style.setProperty(`--${hue_rotate.name}`, `${hue_rotate.value = 0}` + "deg");
    ctx.filter = `blur(0px) invert(0%) sepia(0%) saturate(100%) hue-rotate(0deg)`;
    drawImage();
    const output = document.querySelectorAll(`output[name = result]`);
    output.forEach(item => item.innerHTML = 0);
    output[3].innerHTML = 100;
    activeBTN();
    e.target.classList.toggle("btn-active");
  }

  //Function active btn
  function activeBTN(){
    let btn = document.querySelectorAll(".btn");
    for (let i = 0; i < btn.length; i++){
      if(btn[i].classList.contains("btn-active")){
        btn[i].classList.remove("btn-active");
        break;
      }
    }
  }

      // Функция скачивания изображения после изменения
  const savePicture = document.querySelector("button.btn-save");
  savePicture.addEventListener("click", savePic);
  function savePic(e){
    activeBTN();
    savePicture.classList.toggle("btn-active");
    let link = document.createElement('a');
    link.download = 'download.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
  }
}