
import axios from 'axios';
document.addEventListener("DOMContentLoaded", () => { 

/*    editTitle.addEventListener("click", () => {
editTitle.classList.add("active");
let inputElement = document.createElement('input');
        inputElement.value = editTitle.innerText;
        editTitle.innerHTML = '';
        editTitle.appendChild(inputElement);

        inputElement.addEventListener('blur', () => {
            editTitle.classList.remove('active');
            editTitle.textContent = inputElement.value;
        });

        inputElement.focus();
    });*/

    //Edit the title of the dashboard
    let editTitle = document.getElementById("edit-title");
    
   editTitle.addEventListener("click", () => {
   
    editTitle.setAttribute('contentEditable', true);
        editTitle.classList.add('editing');

        editTitle.addEventListener('blur', function () {
          disableEditing();
        });
    });
    
      function disableEditing() {
       
        editTitle.contentEditable = false;
        editTitle.classList.remove('editing');
      }

//Change the background

const bgBtn = document.querySelector(".bg-btn");
const apiKey = 'bcHkSd5kZDFq2S3mbb8dYIRCb14rGXapmtF2WqANODFX82CMdY3rO4Hv';

// Задайте URL Pexels API для случайных фотографий
const apiUrl = 'https://api.pexels.com/v1/curated';

// Функция для изменения фона страницы
async function changeBackground() {
  try {
    // Используйте Axios для выполнения GET-запроса к Pexels API
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': apiKey,
      },
    });

    // Получение случайной фотографии из ответа
    const photos = response.data.photos;
    const randomIndex = Math.floor(Math.random() * photos.length);
    const randomPhotoUrl = photos[randomIndex].src.original;

    // Изменение фона страницы
    document.body.style.backgroundImage = `url(${randomPhotoUrl})`;
  } catch (error) {
    console.error('Ошибка запроса к Pexels API:', error);
  }
}

// Добавление обработчика события клика на кнопку
bgBtn.addEventListener('click', changeBackground);

// Вызов функции changeBackground() в начале для отображения случайного фона при загрузке страницы
changeBackground();


 })
