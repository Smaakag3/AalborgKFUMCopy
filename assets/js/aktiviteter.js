const domain = "https://aalborgkfumfodbold.r-dalsgaard.dk/";
const baseEndPoint = "wp-json/wp/v2/posts?acf_format=standard&per_page=40&categories=29,58,55";
const kalenderEl = document.querySelector(".aktivitetsKalender");
const holdSelectorEl = document.querySelector("#holdSelector");
const activitySelectorEl = document.querySelector("#activitySelector");

const knapper = document.querySelectorAll(".aabenAktiviteter");
knapper.forEach(function(knap) {
    knap.addEventListener("click",function() {
        knap.classList.toggle("active");
        const aktivitetsIndhold = knap.nextElementSibling;
        if(aktivitetsIndhold.style.display === "block"){
            aktivitetsIndhold.style.display = "none";
        }
        else {
            aktivitetsIndhold.style.display = "block"
         }
  });
});





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



