const domain = "https://aalborgkfumfodbold.r-dalsgaard.dk/";
const baseEndPoint = "wp-json/wp/v2/posts?categories=57&per_page=40";
const acfStandard = "&acf_format=standard";
const medlemssideHoldEl = document.querySelector(".holdSektion")
const yearSelectorEl = document.querySelector("#yearSelector");

fetch(domain + baseEndPoint + acfStandard)
.then(res => res.json())
.then(data => fetchTeams(data))
.catch(err => console.log(err))

function fetchTeams(data){
    data.forEach(team => {
        team.acf.hold.forEach(teamId => {
            fetch(domain + `wp-json/wp/v2/posts/${teamId.ID}?acf_format=standard`)
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                renderTeam(data);
            })
            .catch(err => console.log(err))
        })
    })
}

function renderTeam(data){
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
