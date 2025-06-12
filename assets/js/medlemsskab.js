// Nogle variabler med vores domæne, endpoint og standard ACF format.
const domain = "https://aalborgkfumfodbold.r-dalsgaard.dk/";
// baseEndPoint indeholder kategorien 57 (ID 57), fordi afdelinger har ID'et 57 på vores WordPress, hvilket er hvad vi ønsker at hente data fra.
const baseEndPoint = "wp-json/wp/v2/posts?categories=57&per_page=40";
const acfStandard = "&acf_format=standard";

// Nogle query selectors som udpeger bestamte elementer på vores side
const medlemssideHoldEl = document.querySelector(".holdSektion")
const yearSelectorEl = document.querySelector("#yearSelector");

// En fetch request som bruger vores domæne, endpoint og standard ACF format. Dette hente data fra vores WordPress
fetch(domain + baseEndPoint + acfStandard)
.then(res => res.json())
// Det data vi modtager bliver brugt i en funktion som hedder 'fetchTeam'
.then(data => {
    // Det data vi får tilsendt bliver brugt i en funktion som hedder 'fetchTeams' som for til formål at hente alle hold på tværs af alle afdelingerne
    fetchTeams(data);
    console.log(data);
})
.catch(err => console.log(err))

// Vores fetchTeams funktion som looper igennem dataen i en forEach loop, og sender en fetch request med holdets ID. dette giver os data for alle hold.
function fetchTeams(data){
    data.forEach(team => {
        team.acf.hold.forEach(teamId => {
            fetch(domain + `wp-json/wp/v2/posts/${teamId.ID}?acf_format=standard`)
            .then(res => res.json())
            // Alt data bliver brugt i en funktion 'renderTeam' som skal generere indhold på vores side.
            .then(data => renderTeam(data))
            .catch(err => console.log(err))
        })
    })
}

// Vores renderTeam funktion som laver en artikel med et link til holdet og tilsætter et billede, navn, alder/årgang og kontingent af holdet.
function renderTeam(data){
    // Tekstfeltet som indeholder årgang/alder kigger efter om 'aargang' eller 'alder' eksisterer, herefter bliver teksten tilføjet i et tekstfelt. || betyder at den vælger det felt som har en værdi.
    medlemssideHoldEl.innerHTML += `
    <article class="holdCard">
        <a href="holdSide.html?slug=${data.slug}">
        <img src="${data.acf.holdbillede.sizes.large}" alt="Billede af ${data.acf.hold_navn}">
        <h2>${data.acf.hold_navn}</h2>
        <div class="holdAlderOgPris">
        <p>${data.acf.aargang?.name || data.acf.alder?.name}</p>
        <p>${data.acf.kontigentsats},- pr. 1/2 år</p>
        </div>
        </a>
        </article>
    `
}
