const domain = "https://aalborgkfumfodbold.r-dalsgaard.dk/";
const endPoint = "wp-json/wp/v2/posts";

fetch(domain + endPoint)
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.log(err))

// fetch(domain + endPoint + "?taxonomy=argang&tag_ID=7")
// .then(res => res.json())
// .then(data => console.log(data))
// .catch(err => console.log(err))