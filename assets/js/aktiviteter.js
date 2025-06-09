const domain = "https://aalborgkfumfodbold.r-dalsgaard.dk/";
const baseEndPoint = "wp-json/wp/v2/posts?acf_format=standard&per_page=40&categories=58";
const kalenderEl = document.querySelector(".aktivitetsKalender");
const holdSelectorEl = document.querySelector("#holdSelector");
const activitySelectorEl = document.querySelector("#activitySelector");


function fetchData(){
    let endPoint = baseEndPoint;

    const userSelectedTeam = holdSelectorEl.value;
    const userSelectedActivity = activitySelectorEl.value;

    if(userSelectedTeam) {
        endPoint += `&kon=${userSelectedTeam}`;
    }
    if(userSelectedActivity) {
        endPoint += `&aargang=${userSelectedActivity}`;
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

holdSelectorEl.addEventListener("change", fetchData);
activitySelectorEl.addEventListener("change", fetchData);


function renderData(data){
    
    kalenderEl.innerHTML = "";
    
    data.forEach(team => {
        console.log('team:', team)
        kalenderEl.innerHTML += `
        <article>
        <a href="holdSide.html?slug=${team.slug}">
        <h2>${team.acf.hold_navn}</h2>
        <p>${team.acf.traeningsdage}</p>
        <p>${team.acf.id}</p>
        </a>
        </article>
        `
    })
}