menu = document.getElementById("menu");
app = document.getElementById("app");
footer = document.getElementById("footer");
const ddMenu = document.querySelector("#ddMenu");
const html = document.documentElement;
const header = document.querySelector("h1");

const menuItems = ["Dashboard", "News", "About"]; // Array of menu items

const toggleTheme = () => {
  const html = document.documentElement;
  html.classList.toggle("dark");
  renderThemeToggle();
};

const setView = (v) => {
  header.innerText = v;
  toggleMenu(true);

  if (v === "Dashboard") {
    renderDashboard();
  } else if (v === "News") {
    renderNews();
  } else if (v === "About") {
    renderAbout();
  }
};

const toggleMenu = (hide) => {
  if (!hide) {
    ddMenu.classList.toggle("hidden");
    document.querySelectorAll("svg").forEach((el) => {
      el.classList.toggle("hidden");
    });
  } else {
    ddMenu.classList.add("hidden");
    document.querySelectorAll("svg")[0].classList.remove("hidden");
    document.querySelectorAll("svg")[1].classList.add("hidden");
  }
};

const addRow = (container, content) => {
  const row = `<div class='grid grid-cols-5 gap-2'>${content}</div>`;
  container.insertAdjacentHTML("beforeend", row);
};

const renderMenu = () => {
  const menuContainer = document.querySelector(".justify-start");
  const ddMenuContainer = document.getElementById("ddMenu");

  const menuHTML = menuItems
    .map((item) => `<button onclick="setView('${item}')">${item}</button>`)
    .join("");
  menuContainer.innerHTML = menuHTML;

  const ddMenuHTML = menuItems
    .map(
      (item) =>
        `<button class="block py-1 px-2" onclick="setView('${item}')">${item}</button>`
    )
    .join("");
  ddMenuContainer.innerHTML = ddMenuHTML;
};

const renderDashboard = () => {
  const currencies = ["BTC", "ETH", "LTC", "XRP", "ADA"];
  const graphData = {
    BTC: [39000, 40000, 41000, 39500, 42000, 41500, 43000],
    ETH: [2800, 2900, 3000, 2950, 3100, 3050, 3200],
    LTC: [150, 155, 160, 158, 165, 162, 170],
    XRP: [0.8, 0.85, 0.9, 0.88, 0.92, 0.91, 0.95],
    ADA: [1.2, 1.25, 1.3, 1.28, 1.35, 1.32, 1.4],
  };

  app.innerHTML = `
    <div class="p-4 flex flex-col items-center">
      <select id="currencySelect" class="mb-4 p-2 border rounded w-full max-w-xs sm:max-w-sm md:max-w-md">
        ${currencies
          .map((currency) => `<option value="${currency}">${currency}</option>`)
          .join("")}
      </select>
      <div id="graph" class="w-full h-[400px] bg-gray-100 rounded"></div>
    </div>
  `;

  const currencySelect = document.getElementById("currencySelect");
  const graph = document.getElementById("graph");

  const drawGraph = (currency) => {
    const data = graphData[currency];
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;

    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * graph.clientWidth;
        const y =
          graph.clientHeight -
          ((value - minValue) / range) * graph.clientHeight;
        return `${x},${y}`;
      })
      .join(" ");

    graph.innerHTML = `
      <svg width="100%" height="100%">
        <polyline
          fill="none"
          stroke="#4CAF50"
          stroke-width="2"
          points="${points}"
        />
      </svg>
    `;
  };

  currencySelect.addEventListener("change", (e) => {
    drawGraph(e.target.value);
  });

  // Initial graph draw
  drawGraph(currencies[0]);
};

const renderNews = async () => {
  const appDiv = document.getElementById("app");
  appDiv.innerHTML =
    '<div style="text-align: center;"><h6 style="font-weight: bold; margin-top: 30px; text-decoration: underline;">Bitcoin News</h6></div>';
  const bitCoinUrls = [
    "https://news.bitcoin.com/venezuelans-sent-over-460-million-in-remittances-using-crypto-in-2023/",
    "https://news.bitcoin.com/gold-could-surge-to-40000-per-ounce-strategist-says/",
    "https://news.bitcoin.com/2024-republican-platform-defends-bitcoin-mining-and-the-right-to-self-custody-crypto/",
  ];

  const imageUrl = [
    "https://static.news.bitcoin.com/wp-content/uploads/2024/07/1c3266bc-e1db-4137-9720-b178f3b93c53.jpg",
    "https://static.news.bitcoin.com/wp-content/uploads/2024/07/gold-prediction.jpg",
    "https://static.news.bitcoin.com/wp-content/uploads/2024/07/trumprepubbbers.jpg",
  ];

  try {
    for (let i = 0; i < bitCoinUrls.length; i++) {
      const response = await fetch(bitCoinUrls[i]);
      const htmlContent = await response.text();

      // Parse the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");

      // Extract desired content from parsed document
      const title = doc.querySelector("title").textContent;
      const url = bitCoinUrls[i];
      // Build HTML structure for each article
      const articleHTML = `
            <div class="article article-${i}" style=" margin-bottom: 30px; padding: 10px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9; width: 100%; box-sizing: border-box;">
              <div style="position: relative; width: 100%; height: 400px; overflow: hidden; border-radius: 8px;">
                <img src="${imageUrl[i]}" alt="Article Image" style="width: 100%; height: auto; object-fit: cotain; max-height: 100%; max-width: 100%;">
                <div style="position: absolute; bottom: 0; left: 0; right: 0; background-color: rgba(0, 0, 0, 0.7); color: white; padding: 10px;">
                  <h2 style="margin: 0; font-size: 24px;">${title}</h2>
                  <a href="${url}" target="_blank" style="display: inline-block; padding: 8px 12px; background-color: blue; color: white; text-decoration: none; border-radius: 5px;">Read more</a>
                </div>
              </div>
            </div>
          `;
      // Append each article HTML to appDiv
      appDiv.innerHTML += articleHTML;
    }
  } catch (error) {
    console.error("Error fetching or rendering news:", error);
    appDiv.innerHTML = "<p>Failed to fetch news content.</p>";
  }
};

const renderAbout = () => {
  const h1 =
    'class="text-4xl font-extrabold mb-6 text-center text-blue-700" id="aboutUsCellHeader"';
  const h2 =
    'class="text-2xl font-semibold mb-4 text-blue-600" id="aboutUsCellHeader"';
  const h3 = 'class="text-xl mb-4"';
  const divStyle =
    'class="p-6 bg-white shadow-lg rounded-lg mb-6" id="aboutUsCell"';

  const aboutUs = `
    <div ${divStyle}>
      <h3 ${h3}>Welcome to our Dashboard, your number one source for tracking and analyzing cryptocurrency trends. 
      We're dedicated to providing you the very best of insights and tools, with an emphasis on reliability, accuracy, and user-friendly interface.</h3>
    </div>
  `;

  const ourStory = `
    <div ${divStyle}>
      <h3 ${h3}>This dashboard is a project developed as part of our coursework by a dedicated team of students:</h3>
      <ul class="list-disc list-inside ml-6">
        <li ${h2}>Khalel Mnsor </li>
        <li ${h2}>Ahmad Ataba </li>
        <li ${h2}>Basel Hadad </li>
        <li ${h2}>Ibraheem Jramneh </li>
      </ul>
      <h3 ${h3}>We are passionate about technology and finance, and we created this platform to simplify cryptocurrency tracking and analysis.
      Our diverse backgrounds and collaborative efforts have resulted in a product that meets the needs of both beginners and experienced traders.</h3>
    </div>
  `;

  const ourMission = `
    <div ${divStyle}>
      <p class="text-lg">
        Our mission is to empower individuals to make informed decisions in the world of cryptocurrency through reliable data and insightful analysis.
        We strive to create a platform that not only tracks trends but also educates and guides our users in their financial journey.
      </p>
    </div>
  `;

  app.innerHTML = `
    <div class="space-y-8 max-w-4xl mx-auto">
      <h1 ${h1}>About Us</h1>
      ${aboutUs}
      <h1 ${h1}>Our Story</h1>
      ${ourStory}
      <h1 ${h1}>Our Mission</h1>
      ${ourMission}
    </div>
  `;
};

const renderThemeToggle = () => {
  const themeToggleContainer = document.querySelector("#menu > div:last-child");
  if (!themeToggleContainer) {
    console.error("No element found for theme toggle container");
    return;
  }
  const themeHTML = `
      <button class="${
        html.classList.contains("dark") ? "hidden" : "block"
      }" onclick="toggleTheme()">
          Dark
      </button>
      <button class="${
        html.classList.contains("dark") ? "block" : "hidden"
      }" onclick="toggleTheme()">
          Light
      </button>
    `;

  themeToggleContainer.innerHTML = themeHTML;
};

const init = () => {
  setView("Dashboard");
  renderDashboard();
  renderMenu();
  renderThemeToggle();
};

init();
