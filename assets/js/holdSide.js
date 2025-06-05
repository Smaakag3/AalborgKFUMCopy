const domain = "https://aalborgkfumfodbold.r-dalsgaard.dk/"
const endPoint = "wp-json/wp/v2/posts?acf_format=standard"

const paramsString = window.location.search;
const searchParam = new URLSearchParams(paramsString);
const slug = searchParam.get("slug");

const holdSideEl = document.querySelector("#holdSideMain");

fetch(domain + endPoint + "&slug=" + slug)
.then(res => res.json())
.then(data => renderTeam(data))
.catch(err => console.log(err))

function renderTeam(data){
    data.forEach(teamInfo => {
        console.log(teamInfo);

        const newTeamTitle = document.createElement("h1");
        newTeamTitle.textContent = teamInfo.acf.hold_navn;

        const newTeamYear = document.createElement("h2");
        newTeamYear.textContent = teamInfo.acf.aargang.name;

        const newTeamDescription = document.createElement("p");
        newTeamDescription.textContent = teamInfo.acf.beskrivelse;

        const newTeamIntroBox = document.createElement("article");
        newTeamIntroBox.append(newTeamTitle, newTeamYear, newTeamDescription);
        newTeamIntroBox.classList.add("holdIntroBox");

        const newTeamPicture = document.createElement("img");
        newTeamPicture.src = teamInfo.acf.holdbillede.sizes.large;
        newTeamPicture.alt = "Holdbillede";
        newTeamPicture.classList.add("holdBillede");

        const newTrainingTimes = document.createElement("article");
        newTrainingTimes.classList.add("TraeningsTider");

        const newTrainingTitle = document.createElement("h4");
        newTrainingTitle.textContent = "Træningstider";
        newTrainingTimes.append(newTrainingTitle);

        teamInfo.acf.traeningsdage.forEach((dag, index) => {
            const newTeamTrainingDays = document.createElement("p");
            
            const dayNumber = index + 1;
            const traingingStart = teamInfo.acf[`traeningstid-start-dag${dayNumber}`];
            const trainingEnd = teamInfo.acf[`traeningstid-slut-dag${dayNumber}`];
            
            newTeamTrainingDays.textContent = dag.name + ": " + traingingStart + " - " + trainingEnd;

            newTrainingTimes.append(newTeamTrainingDays);
        })

        const newPriceSection = document.createElement("article");
        newPriceSection.classList.add("Kontigent");

        const newPrice = document.createElement("p");
        newPrice.textContent = "Kontingent: " + teamInfo.acf.kontigentsats + ",- pr. 1/2år";

        const newPriceButton = document.createElement("a");
        newPriceButton.textContent = "Tilmeld";
        newPriceButton.href = "https://koservice.dbu.dk/ClubSignup?id=41&clubid=5";
        newPriceButton.target = "_blank"
        newPriceButton.classList.add("tilmeldKnap");

        newPriceSection.append(newPrice, newPriceButton)
        
        const teamSection = document.createElement("section");
        teamSection.append(newTeamIntroBox, newTeamPicture, newTrainingTimes, newPriceSection);

        holdSideEl.append(teamSection);

    })
}