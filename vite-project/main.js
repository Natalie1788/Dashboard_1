import axios from 'axios';

document.addEventListener("DOMContentLoaded", () => { 
  getWeatherData();
  getAndDisplayStockholmTime();
  getExchangeRates();

  
      //Edit the title of the dashboard --------------------------------------------------------------------------//
      let editTitle = document.getElementById("edit-title");
      
     editTitle.addEventListener("click", () => {
     
      editTitle.setAttribute('contentEditable', true);
          editTitle.classList.add('editing');
  
          editTitle.addEventListener('blur', function () {
            disableEditing();
            saveTitleToLocalStorage(editTitle.textContent);
          });
      });
      
        function disableEditing() {
         
          editTitle.contentEditable = false;
          editTitle.classList.remove('editing');
        }
  
        function saveTitleToLocalStorage(title) {
          localStorage.setItem('customTitle', title);
        }

        window.addEventListener('load', function () {
          const savedTitle = localStorage.getItem('customTitle');
        
          if (savedTitle) {
            editTitle.textContent = savedTitle;
          }
        });


  //Change the background -------------------------------------------------------------------------------------//

  const bgBtn = document.querySelector(".bg-btn");
  // API key
  const apiKey = 'bcHkSd5kZDFq2S3mbb8dYIRCb14rGXapmtF2WqANODFX82CMdY3rO4Hv';
  
  // URL for images
  const apiUrl = 'https://api.pexels.com/v1/curated';
  
  // Changes are made with button click
  bgBtn.addEventListener('click', getImage);

async function getImage() {
 
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': apiKey,
      },
    });
    

    // Get an image 
    const photos = response.data.photos;
    const randomIndex = Math.floor(Math.random() * photos.length);
    const randomPhotoUrl = photos[randomIndex].src.original;

    document.body.style.backgroundImage = `url(${randomPhotoUrl})`;
  } catch (error) {
    console.error('Error fetching bgimages:', error);
  }
}

//Menu links creating -------------------------------------------------------------------------------//

const addLinkBtn = document.querySelector(".add-link-btn");
const linkList = document.querySelector(".links-list");

function addLink() { 
  
  const newLinkItem = document.createElement('li');
  newLinkItem.classList.add("links-list-item");

  // Проверяем, существует ли уже ссылка внутри элемента
  const existingLinkTitle = newLinkItem.querySelector('.link-title');

  // Если существует, используем её, иначе создаем новую
  const linkTitle = existingLinkTitle || document.createElement('a');
 
  linkTitle.classList.add('link-title');
  linkTitle.textContent = 'New link';
 
  linkTitle.style.display = "none";

  
  const linkInput = document.createElement("input");
  linkInput.classList.add("link-input");
  linkInput.type = "text";
  linkInput.placeholder = "Skriv in en ny länk";

  linkInput.addEventListener("keypress", async (event) => {
    if (event.key === 'Enter') {
      linkInput.blur();
      linkInput.style.display = "none";

      /*try {
        const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(linkInput.value)}`);
        console.log(response)
        const htmlString = response.data.contents;
        const titleMatch = htmlString.match(/<title>(.*?)<\/title>/i);

        if (titleMatch && titleMatch[1]) {
          linkTitle.href = linkInput.value;
          linkTitle.textContent = titleMatch[1];
          linkTitle.style.display = "block";
        } else {
          throw new Error('Title not found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // В случае ошибки, устанавливаем название сайта равным введенному URL
        linkTitle.href = linkInput.value;
        linkTitle.textContent = linkInput.value;
        linkTitle.style.display = "block";
      }
    }
  });*/
  try {
    const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(linkInput.value)}`);
    const htmlString = response.data.contents;
    const titleMatch = htmlString.match(/<title>(.*?)<\/title>/i);

    if (titleMatch && titleMatch[1]) {
      const title = titleMatch[1];
      const faviconUrl = getFaviconUrl(linkInput.value);
      setLinkProperties(linkTitle, linkInput.value, title, faviconUrl);
    } else {
      throw new Error('Title not found');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    // В случае ошибки, устанавливаем название сайта и фавикон равными введенному URL
    const faviconUrl = getFaviconUrl(linkInput.value);
    setLinkProperties(linkTitle, linkInput.value, linkInput.value, faviconUrl);
  }
  saveLinksToLocalStorage();
}
});


  const deleteButton = document.createElement('button');
  deleteButton.classList.add("delete-link")
  deleteButton.textContent = 'x';
  deleteButton.addEventListener('click', function () {
    linkList.removeChild(newLinkItem);
    saveLinksToLocalStorage();
  });

  /*linkTitle.addEventListener("dblclick", () => {
    linkTitle.setAttribute('contentEditable', true);
    linkTitle.classList.add('editing');
    linkTitle.addEventListener('blur', function () {
      disableEditTitle();
      saveLinksToLocalStorage();
    });*/


  newLinkItem.appendChild(deleteButton);
  newLinkItem.appendChild(linkInput);
  linkList.appendChild(newLinkItem);
  newLinkItem.appendChild(linkTitle);
  saveLinksToLocalStorage();

}

function deleteLink(newLinkItem) {  
  linkList.removeChild(newLinkItem);
  saveLinksToLocalStorage();
}

function getFaviconUrl(url) {
  const domain = new URL(url).hostname;
  return `https://www.google.com/s2/favicons?domain=${domain}`;
}

function setLinkProperties(linkItem, href, text, faviconUrl) {
  linkItem.href = href;
  linkItem.textContent = text;
  linkItem.style.display = "block";

  if (faviconUrl) {
    const favicon = document.createElement("img");
    favicon.src = faviconUrl;
    favicon.alt = "Favicon";
    favicon.classList.add("favicon");
    linkItem.appendChild(favicon);
  }
  saveLinksToLocalStorage();
}


addLinkBtn.addEventListener("click", addLink)


 // edit link text
 /*function enableEditTitle(linkTitle) {
  linkTitle.setAttribute('contentEditable', true);
  linkTitle.classList.add('editing');
  linkTitle.addEventListener('blur', function () {
    disableEditTitle(linkTitle);
    saveLinksToLocalStorage();
  });
}

function disableEditTitle(linkTitle) {
  linkTitle.contentEditable = false;
  linkTitle.classList.remove('editing');
}

if (linkTitle.textContent !== "") {
  linkTitle.addEventListener("dblclick", () => {
    enableEditTitle(linkTitle);
  });
}*/

    // function to save links to LS
    function saveLinksToLocalStorage() {
      const links = [];
      const linkItems = linkList.children;
    
      for (let i = 0; i < linkItems.length; i++) {
        const linkItem = linkItems[i];
        const linkTitle = linkItem.querySelector('.link-title');
        const faviconImg = linkItem.querySelector('.favicon');
      
        if (linkTitle) {
          const linkData = { href: linkTitle.href, text: linkTitle.textContent, favicon: faviconImg ? faviconImg.src : null};
          links.push(linkData);
        }
      }
      console.log("Saving links to Local Storage:", links);
      localStorage.setItem('links', JSON.stringify(links));
    }

    function loadLinksFromLocalStorage() {
     
        const linksData = localStorage.getItem('links');
        console.log(linksData)
        if (linksData) {
          const links = JSON.parse(linksData);
          links.forEach(linkData => {
            addLink(linkData.href, linkData.text, linkData.favicon);
           
          });
          console.log("Loading links to Local Storage:", links);
        }
     
    }
    loadLinksFromLocalStorage();

    // links number 2
    /*const addLinkBtn = document.querySelector(".add-link-btn");
const linkList = document.querySelector(".links-list");

function addLink(url) {
  // Создаем элемент списка
  const newLinkItem = document.createElement("li");
  newLinkItem.classList.add("links-list-item");

  // Создаем input для ввода ссылки
  const linkInput = document.createElement("input");
  linkInput.type = "text";
  linkInput.placeholder = "Введите ссылку";
  linkInput.value = url; // Если передана ссылка, устанавливаем ее в input
  linkInput.addEventListener("input", handleInput);

  // Создаем ссылку
  const linkTitle = document.createElement("a");
  linkTitle.classList.add("link-title");
  linkTitle.textContent = 'New title';
  linkTitle.href = url;

  // Получаем favicon и добавляем его к элементу
  getFavicon(linkTitle.href, (faviconUrl) => {
    if (faviconUrl) {
      const favicon = document.createElement("img");
      favicon.src = faviconUrl;
      favicon.alt = "Favicon";
      favicon.classList.add("favicon");
      linkTitle.appendChild(favicon);
    }
  });

  newLinkItem.appendChild(linkInput);
  newLinkItem.appendChild(linkTitle);
  linkList.appendChild(newLinkItem);
}

function handleInput(event) {
  const input = event.target;
  const li = input.closest(".links-list-item");
  const linkTitle = li.querySelector(".link-title");

  // Обновляем ссылку и favicon при вводе
  linkTitle.href = input.value;
  getFavicon(linkTitle.href, (faviconUrl) => {
    const existingFavicon = linkTitle.querySelector(".favicon");
    if (existingFavicon) {
      linkTitle.removeChild(existingFavicon);
    }

    if (faviconUrl) {
      const favicon = document.createElement("img");
      favicon.src = faviconUrl;
      favicon.alt = "Favicon";
      favicon.classList.add("favicon");
      linkTitle.appendChild(favicon);
    }
  });

  saveLinksToLocalStorage();
}

function getFavicon(url, callback) {
  const domain = new URL(url).hostname;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}`;
  callback(faviconUrl);
}

function saveLinksToLocalStorage() {
  const links = [];
  const linkItems = linkList.children;

  for (let i = 0; i < linkItems.length; i++) {
    const linkItem = linkItems[i];
    const linkInput = linkItem.querySelector("input");
    const linkTitle = linkItem.querySelector(".link-title");

    if (linkInput && linkTitle) {
      const linkData = { title: linkTitle.textContent, url: linkTitle.href };
      links.push(linkData);
    }
  }

  localStorage.setItem("links", JSON.stringify(links));
}

function loadLinksFromLocalStorage() {
  const linksData = localStorage.getItem("links");
  if (linksData) {
    const links = JSON.parse(linksData);
    links.forEach((linkData) => {
      addLink(linkData.url);
    });
  }
}*/






    
   
 
// weather info--------------------------------------------------------------------------------------------------------//

const apiKey1 = '44b63fb69d06b1de9ed7dfbbf674d58d';
//const city = 'Stockholm';
const numberOfDays = 5;
const apiUrl1 = "https://api.openweathermap.org/data/2.5/weather";



async function getWeatherData() {
  
  try {
   const response =  await axios.get("https://api.openweathermap.org/data/2.5/forecast?q=Stockholm&cnt=25&appid=44b63fb69d06b1de9ed7dfbbf674d58d")
    //const response = await axios.get(`${apiUrl1}?q=${city}&cnt=${numberOfDays}&appid=${apiKey1}`);
   
    const data = response.data;
    
    displayWeatherData(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function displayWeatherData(data) {
  //const weatherItems = data.list.slice(0, 8);
  const forecastData = data.list;
  const weatherItems = [forecastData[0], forecastData[8], forecastData[16], forecastData[24]];


 weatherItems.forEach(item => {
  const weatherItem = document.createElement('div');
  weatherItem.classList.add("weather-block");
  
  const date = new Date(item.dt * 1000);
  const temperatureKelvin = item.main.temp;
  const temperatureCelsius = temperatureKelvin - 273.15;
  const description = item.weather[0].description;
  const iconCode = item.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

  weatherItem.innerHTML = `
    
    <p class="weather-text">${date.toDateString()}</p>
    <div class="weather-flex">
    <img class="weather-img" src="${iconUrl}" alt="Weather Icon">
    <p> ${temperatureCelsius.toFixed(2)} °C</p>
    <p> ${description}</p>
    </div>
  `;
  const weatherContainer = document.querySelector('.weather-info');
  weatherContainer.appendChild(weatherItem);
})
 
}


// get Stockholm date and time----------------------------------------------------------------------------------------------//

async function getAndDisplayStockholmTime() {
  try {
    const response = await axios.get('https://worldtimeapi.org/api/timezone/Europe/Stockholm');
    const { datetime } = response.data;

    const dateText = document.querySelector(".date-text");
    const timeText = document.querySelector(".time-text");
    //dateAndTime.innerHTML = datetime;
    //console.log('Current time in Stockholm:', datetime);

// Создаем объект Date из строки времени
const stockholmTime = new Date(datetime);

    // Извлекаем компоненты даты и времени
    const year = stockholmTime.getFullYear();
    //const month = stockholmTime.toLocaleString('default', { month: 'long' });
    //const month = stockholmTime.getMonth() + 1; // добавляем 1, так как месяцы начинаются с 0
    const month = (stockholmTime.getMonth() + 1).toString().padStart(2, '0'); // добавляем ведущий ноль, если необходимо
    const day = stockholmTime.getDate();
    //const hours = stockholmTime.getHours();
    const hours = stockholmTime.getHours().toString().padStart(2, '0');
    //const minutes = stockholmTime.getMinutes();
    const minutes = stockholmTime.getMinutes().toString().padStart(2, '0');

    // Форматируем вывод
    const formattedDate = `${year} - ${month} - ${day}, `;
    const formattedTime = `${hours}:${minutes}`;
    dateText.innerHTML = formattedDate;
    timeText.innerHTML = formattedTime;
    

  } catch (error) {
    console.error('Error fetching Stockholm time:', error.message);
  }

  // Устанавливаем интервал обновления времени (в миллисекундах)
const updateInterval = 1000 * 60; // 1 минута
setInterval(getAndDisplayStockholmTime, updateInterval);
}


  
 


/*const apiKey1 = '44b63fb69d06b1de9ed7dfbbf674d58d';
        const city = 'Stockholm';
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey1}`;
        console.log('Before axios.get');
        axios.get(url)
            .then(response => {
                console.log('After axios.get');
                const forecastData = response.data.list;
                // Visa väder för idag, imorgon och lördag
                const todayWeather = forecastData[0];
                const tomorrowWeather = forecastData[8];
                const saturdayWeather = forecastData[16];
                displayWeather(todayWeather, 'Today');
                displayWeather(tomorrowWeather, 'Tomorrow');
                displayWeather(saturdayWeather, 'Saturday');
                
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            });
        function displayWeather(weatherData, day) {
            const temperatureKelvin = weatherData.main.temp;
            const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(2);
            const weatherDescription = weatherData.weather[0].description;
            const weatherIcon = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
            const weatherInfoElement = document.getElementById('weatherInfo');
            const html = `
                <div>
                    <h3>${day}</h3>
                    <p>Temperature: ${temperatureCelsius} °C</p>
                    <p>Description: ${weatherDescription}</p>
                    <img src="${weatherIcon}" alt="${weatherDescription}">
                </div>
            `;
            weatherInfoElement.innerHTML += html;
        }*/

//currency exchange ------------------------------------------------------------------------------------------------------------//
/*const appId = '65aad516711a45c89113dbe6fbe8f16f';
  const baseUrl = 'https://open.er-api.com/v6/latest/';*/

async function getExchangeRates() {
  try {
    const response = await axios.get("https://openexchangerates.org/api/latest.json?app_id=65aad516711a45c89113dbe6fbe8f16f");
    //const response = await axios.get(`${baseUrl}SEK?apikey=${appId}`);
    console.log(response)
    const rates = response.data.rates;
    console.log(rates)

    document.getElementById('euro-rate').innerText = `€: ${rates.EUR.toFixed(2)}`;
    document.getElementById('usd-rate').innerText = `$: ${rates.USD.toFixed(2)}`;
    document.getElementById('gbp-rate').innerText = `£: ${rates.GBP.toFixed(2)}`;
  } catch (error) {
    console.error('Error:', error.message);
  }
}



// Saving notes ----------------------------------------------------------------------------------------------------------//

// Сохраняем текст при каждом изменении в textarea
function saveNote() { 
  const noteTextArea = document.querySelector('.notes-area');
noteTextArea.addEventListener('input', () => {
  // localStorage.setItem() здесь, сохраняет текущий текст в localStorage
  localStorage.setItem('userNote', noteTextArea.value);
  console.log(localStorage.item);
}); 
}

// При загрузке страницы, проверяем, есть ли сохраненный текст в local storage
function checkSavedNotes() {
  const noteTextArea = document.querySelector('.notes-area');
  const savedNote = localStorage.getItem('userNote');
  if (savedNote) {
    noteTextArea.value = savedNote;
  }
};
saveNote();
checkSavedNotes();
})


