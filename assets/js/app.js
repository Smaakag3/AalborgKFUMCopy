const domain = "https://aalborgkfumfodbold.r-dalsgaard.dk/"
const endPoint = "wp-json/wp/v2/posts?acf_format=standard"
const mainEl = document.querySelector("main")

fetch(domain + endPoint)
.then(res => res.json())
.then(data => {
    console.log(data);
    renderData(data);
})
.catch(err => console.log(err))

function renderData(data){
    data.forEach(hold => {
        mainEl.innerHTML += `
        <h1>${hold.acf.hold_navn}</h1>
        <h2>${hold.acf.aargang}</h2>
        <p>${hold.acf.beskrivelse}</p>
        `
    })
}