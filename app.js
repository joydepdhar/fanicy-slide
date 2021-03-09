const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work create your own api key gfrom 
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

const showSpinner = (show) => {
  const spinner = document.getElementById('loadingSpinner');
  if (show == true) {
    spinner.classList.remove('d-none');
  }
  else {
    spinner.classList.add('d-none')
  }
}

// show Picture
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery with title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
    showSpinner(false);
  })
}

const getImages = (query) => {
  showSpinner(true);
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err));
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  }
  //removing unselected array
  else {
    sliders.splice(item,1);
  }  
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }


  const container = sliders.length;
  console.log(container);
  document.getElementById('sliderQuantity').innerHTML = `<h1 class="text-primary text-center">Showing slider of ${container} images</h1>`; 
  // create slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;
  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide photograph area
  imagesArea.style.display = 'none';
  const duration = document.getElementById('duration').value || 1000;
  if (duration > 0) {
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item);
    })
    changeSlide(0)
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }
  else {
    alert("Time duration can't be negative!");
    document.getElementById('sliderPreview').innerHTML = `
      <h1 class="text-danger">Please enter a valid time duaration</h1>
      `;
    document.getElementById('sliderQuantity').classList.add('d-none');
  }

}
const changeItem = index => {
  changeSlide(slideIndex += index);
}
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}
document.getElementById('search').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    document.getElementById('search-btn').click();
  }
})
searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})
