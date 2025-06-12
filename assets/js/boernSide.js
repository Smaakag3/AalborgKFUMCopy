// Domænet til vores WordPress som vi skal bruge til vores fetch request
const domain = "https://aalborgkfumfodbold.r-dalsgaard.dk/";

// En variabel med vores end point til vores WP indlæg (posts), samt et query parameter som giver mere information i voers respons. Blandt andet får vi mere information om billeder osv. 
// &per_page=40 gør at vi går returneret 40 posts, og det sidste query parameter (&categories=55) spørger vi specifikt efter posts hvor kategorien har ID'et 55, som i dette tilfælde er børnehold.
const baseEndPoint = "wp-json/wp/v2/posts?acf_format=standard&per_page=40&categories=29";

// En række query selectors hvor vi udpeger specifikke elementer i vores HTML fil. Her leder vi efter en element med klassen 'holdSektion', en selector med ID'et 'genderSelector', en selector med ID'et 'yearSelector' og et element med ID'et 'removeFilter'.
const holdEl = document.querySelector(".holdSektion");
const genderSelectorEl = document.querySelector("#genderSelector");
const yearSelectorEl = document.querySelector("#yearSelector");
const removeFilterEl = document.querySelector("#removeFilter");
const holdAnsvarligEl = document.querySelector(".holdAnsvarlig");

// En fetch request hvor vi specifikt søger efter post med ID'et 228, som i dette tilfælde er børneafdelingen. Dette skal bruges for at tilføje formanden for denne afdeling til siden
fetch(domain + "wp-json/wp/v2/posts/232")
.then(res => res.json())
.then(data => renderResponsable(data))
.catch(err => console.log(err))

// En funktion som modtager data fra tiligere fetch request. Den tidligere fetch request modtog data fra "børneafdelingen U5-U12" indlæget, men vi er kun interesseret i at finde formanden for afdelingen.
function renderResponsable(data){
    // Vi laver et forEach loop da det vi leder efter er inde i et Array. Heri ønsker vi at finde og bruge ID'et som formanden har fået tildelt
    data.acf.ansvarlig.forEach(holdAnsvarlig => {
        // Vi laver endnu en fetch request med formandens ID til at finde deres indlæg fra WordPress
        fetch(domain + "wp-json/wp/v2/posts/" + holdAnsvarlig + "?acf_format=standard")
        .then(res => res.json())
        // Vi laver en funktion med det data vi har fået som har til formål at generere indhold på vores side 
        .then(data => responseable(data))
        .catch(err => console.log(err))
    })

    // Funktionen som skal generere indhold om formandens indformation på siden
    function responseable(data){
        console.log(data);
        holdAnsvarligEl.innerHTML += `
        <img src="${data.acf.billede_af_personen.sizes.large}" loading="lazy" alt="Billede af afdelingsansvarlig">
        <h2>${data.acf.stillingsbetegnelse}</h2>
        <h3>${data.acf.fulde_navn}</h3>
        <div class="mailSektion">
        <img src="./assets/pictures/envelope.svg" alt="E-mail ikon" class="kontaktIkon">
        <p>${data.acf.mail}</p>
        </div>
        <div class="telefonSektion">
        <img src="./assets/pictures/phone.svg" alt="Telefon ikon" class="kontaktIkon">
        <p>${data.acf.telefonnummer}</p>
        </div>
        `   
    }

}

// En funktion som har til opgave at hente vores data gennem fetch, samt at tage valuen fra vores selectors på vores HTML side og tilføje det til vores query parameter.
function fetchData(){

    // En ny variabel som har samme værdi som vores anden variabel, baseEndPoint
    let endPoint = baseEndPoint;

    // Gemmer brugerens valgte køn (value) fra selectoren fra HTML siden, hvilket matcher ID'erne for køn på vores WordPress 
    const userSelectedGender = genderSelectorEl.value;

    // Det samme som kommentaren overfor, gemmer på en specifik value som skulle kunne bruges til at efterspørgere specifikke posts fra vores WordPress.
    const userSelectedYear = yearSelectorEl.value;

    // Hvis brugeren har valgt et køn, så gør følgende:
    if(userSelectedGender) {
        // tilføj valuen (ID'et) i et query parameter i endpointet.
        endPoint += `&kon=${userSelectedGender}`;
    }

    // Hvis brugeren har valgt en specifikt årgang, så gør følgende:
    if(userSelectedYear) {
        // tilføj valuen (ID'et) i et query parameter i endpointet.
        endPoint += `&aargang=${userSelectedYear}`;
    }

    // Vores fetch request som henter data fra vores domæne og endpoint
    fetch(domain + endPoint)
    .then(res => res.json())
    .then(data => {
    console.log(data);
    renderData(data);
})
.catch(err => console.log(err))
}

// Kalder på vores funktion
fetchData()

// Lytter efter til ændringer i vores selectores, og henter data igen efter brugerens valg
genderSelectorEl.addEventListener("change", fetchData);
yearSelectorEl.addEventListener("change", fetchData);

// Lytter efter et klik som nultiller valuen og henter data igen.
removeFilterEl.addEventListener("click", () => {
    genderSelectorEl.value = "";
    yearSelectorEl.value = "";
    fetchData();
});

// En funktion som generere indhold. Heriblandt en artikel med holdnavn, billede og kontingentpris. 
function renderData(data){
    
    holdEl.innerHTML = "";
    
    data.forEach(team => {
        holdEl.innerHTML += `
        <article class="holdCard">
        <a href="/holdSide.html?slug=${team.slug}">
        <img src="${team.acf.holdbillede.sizes.large}" loading="lazy" alt="Billede af ${team.acf.hold_navn}">
        <h2>${team.acf.hold_navn}</h2>
        <div class="holdAlderOgPris">
        <p>${team.acf.aargang.name}</p>
        <p>${team.acf.kontigentsats},- pr. 1/2 år</p>
        </div>
        </a>
        </article>
        `
    })
}