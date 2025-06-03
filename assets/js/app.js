const domain = "https://aalborgkfumfodbold.r-dalsgaard.dk/"
const endPoint = "wp-json/wp/v2/posts?acf_format=standard"
const holdEl = document.querySelector(".holdSektion")

fetch(domain + endPoint)
.then(res => res.json())
.then(data => {
    console.log(data);
    renderData(data);
})
.catch(err => console.log(err))

function renderData(data){
    data.forEach(team => {
        
        holdEl.innerHTML += `
        <article>
        <a href="holdSide.html?slug=${team.slug}">
        <h2>${team.acf.hold_navn}</h2>
        <h3>${team.acf.aargang.name}</h3>
        </a>
        </article>
        `

    })
}