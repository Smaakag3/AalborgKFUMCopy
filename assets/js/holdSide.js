const domain = "https://aalborgkfumfodbold.r-dalsgaard.dk/"
const endPoint = "wp-json/wp/v2/posts?acf_format=standard"

const paramsString = window.location.search;
const searchParam = new URLSearchParams(paramsString);
const slug = searchParam.get("slug");

fetch(domain + endPoint + "&slug=" + slug)
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.log(err))