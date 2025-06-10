const domain = "https://aalborgkfumfodbold.r-dalsgaard.dk/";
const baseEndPoint = "wp-json/wp/v2/posts?acf_format=standard&per_page=40&categories=29";
const holdEl = document.querySelector(".holdSektion");
const genderSelectorEl = document.querySelector("#genderSelector");
const yearSelectorEl = document.querySelector("#yearSelector");
const removeFilterEl = document.querySelector("#removeFilter");

function fetchData(){
    let endPoint = baseEndPoint;

    const userSelectedGender = genderSelectorEl.value;
    const userSelectedYear = yearSelectorEl.value;

    if(userSelectedGender) {
        endPoint += `&kon=${userSelectedGender}`;
    }
    if(userSelectedYear) {
        endPoint += `&aargang=${userSelectedYear}`;
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
        <article>
        <a href="holdSide.html?slug=${team.slug}">
        <img src="${team.acf.holdbillede.sizes.large}" alt="Billede af ${team.acf.hold_navn}">
        <h2>${team.acf.hold_navn}</h2>
        <p>${team.acf.kontigentsats},- pr. 1/2 år</p>
        </a>
        </article>
        `
    })
}