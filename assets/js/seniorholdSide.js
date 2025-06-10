const domain = "https://aalborgkfumfodbold.r-dalsgaard.dk/";
const baseEndPoint = "wp-json/wp/v2/posts?acf_format=standard&per_page=40&categories=55";
const holdEl = document.querySelector(".holdSektion");
const genderSelectorEl = document.querySelector("#genderSelector");
const yearSelectorEl = document.querySelector("#yearSelector");
const removeFilterEl = document.querySelector("#removeFilter");
const holdAnsvarligEl = document.querySelector(".holdAnsvarlig");

fetch(domain + "wp-json/wp/v2/posts/228")
.then(res => res.json())
.then(data => renderResponsable(data))
.catch(err => console.log(err))

function renderResponsable(data){
    data.acf.ansvarlig.forEach(holdAnsvarlig => {
        fetch(domain + "wp-json/wp/v2/posts/" + holdAnsvarlig + "?acf_format=standard")
        .then(res => res.json())
        .then(data => responseable(data))
        .catch(err => console.log(err))
    })

    function responseable(data){
        console.log(data);
        holdAnsvarligEl.innerHTML += `
        <img src="${data.acf.billede_af_personen.sizes.large}" alt="Billede af afdelingsansvarlig">
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

function fetchData(){
    let endPoint = baseEndPoint;

    const userSelectedGender = genderSelectorEl.value;
    const userSelectedYear = yearSelectorEl.value;

    if(userSelectedGender) {
        endPoint += `&kon=${userSelectedGender}`;
    }
    if(userSelectedYear) {
        endPoint += `&alder=${userSelectedYear}`;
    }

    fetch(domain + endPoint)
    .then(res => res.json())
    .then(data => {
    console.log(data);
    renderData(data);
})
.catch(err => console.log(err))
}

fetchData()

genderSelectorEl.addEventListener("change", fetchData);
yearSelectorEl.addEventListener("change", fetchData);

removeFilterEl.addEventListener("click", () => {
    genderSelectorEl.value = "";
    yearSelectorEl.value = "";
    fetchData();
});

function renderData(data){
    
    holdEl.innerHTML = "";
    
    data.forEach(team => {
        holdEl.innerHTML += `
        <article class="holdCard">
        <a href="holdSide.html?slug=${team.slug}">
        <img src="${team.acf.holdbillede.sizes.large}" alt="Billede af ${team.acf.hold_navn}">
        <h2>${team.acf.hold_navn}</h2>
        <div class="holdAlderOgPris">
        <p>${team.acf.alder.name}</p>
        <p>${team.acf.kontigentsats},- pr. 1/2 år</p>
        </div>
        </a>
        </article>
        `
    })
}