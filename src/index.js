// import './style.css';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';
// ----------------------------------------------
const ref = {
  selector: document.querySelector('.breed-select'),
  divCatInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};
const { selector, divCatInfo, loader, error } = ref;
// ----------------------------------------------
loader.classList.replace('loader', 'is-hidden');
error.classList.add('is-hidden');
divCatInfo.classList.add('off');
// ----------------------------------------------
let arrBreedsId = [];//tablica obiektów >>{ text: "xxx", value: "xxx" } >>arrBreedsId[0] = { text: " ", value: " ", placeholder: true }

arrBreedsId.unshift({ text: " ", value: " ", placeholder: true });
//  console.log(arrBreedsId);

fetchBreeds()
  .then(data => {
    data.forEach(element => {
      arrBreedsId.push({ text: element.name, value: element.id });
      // console.log('aga: ', arrBreedsId)
    });
    new SlimSelect({
      select: selector,
      data: arrBreedsId,
      settings: {
        placeholderText: 'Choose the breed'
      }
    });
  })
  .catch(onFetchError);

selector.addEventListener('change', onSelectBreed);

function onSelectBreed(event) {
  loader.classList.replace('is-hidden', 'loader');
  selector.classList.add('is-hidden');
  // divCatInfo.classList.add('is-hidden');

  const breedId = event.currentTarget.value;
  console.log('event.currentTarget.value: ', event.currentTarget.value)
  // console.log('typeof: ', typeof(breedId))//string
// console.log('breedId: ', breedId)//lihu (skróty)
   if (event.currentTarget.value != " ") {
     fetchCatByBreed(breedId)
     .then(data => {
       loader.classList.replace('loader', 'is-hidden');
       selector.classList.remove('is-hidden');
       divCatInfo.classList.remove('is-hidden');       
       const { url, breeds } = data[0];
      //  console.log('data[0]: ', data[0]);
      //  console.log('url: ', url);
      //  console.log('breeds: ', breeds);
      //  console.log('breeds[0].name: ', breeds[0].name);
      //  console.log('breeds[0].description: ', breeds[0].description);
      //  console.log('breeds[0].temperament: ', breeds[0].temperament);
       divCatInfo.innerHTML = `<div class="box-img"><img src="${url}" alt="${breeds[0].name}" width="400"/></div><div class="box"><h1>${breeds[0].name}</h1><p>${breeds[0].description}</p><p><b>Temperament:</b> ${breeds[0].temperament}</p></div>`;
       divCatInfo.classList.remove('off'); 
      //  console.log('OK-teraz ma byc KOT!')
     }
     )
     .catch(onFetchError);
  
  }
  else{
    console.log('Pusty selector!')
    loader.classList.replace('loader', 'is-hidden');
  }
}

function onFetchError(err) {
  console.log(err)
  selector.classList.remove('is-hidden');
  loader.classList.replace('loader', 'is-hidden');
  Notiflix.Notify.failure(
    'Oops! Something went wrong! Try reloading the page or select another cat breed!'
  );
}
