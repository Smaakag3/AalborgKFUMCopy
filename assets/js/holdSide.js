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
        const newTeamTitle = document.createElement("h1");
        newTeamTitle.textContent = teamInfo.acf.hold_navn;

        const newTeamYear = document.createElement("h2");

        if(teamInfo.acf.aargang){
            newTeamYear.textContent = teamInfo.acf.aargang.name;
        } else if(teamInfo.acf.alder) {
            newTeamYear.textContent = teamInfo.acf.alder.name;
        }

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
        teamSection.classList.add("holdSektion");
        teamSection.append(newTeamIntroBox, newTeamPicture, newTrainingTimes, newPriceSection);

        const trainerSection = document.createElement("section");
        trainerSection.classList.add("traenerSektion");
        
        teamInfo.acf.traenere.forEach(trainer => {
            fetch(domain + `wp-json/wp/v2/posts/${trainer.ID}?acf_format=standard`)
            .then(res => res.json())
            .then(data => renderTrainer(data))
            .catch(err => console.log(err))
        })

        function renderTrainer(data){
            const trainerArticle = document.createElement("article");
            trainerArticle.classList.add("traener");

            const newTrainerPicture = document.createElement("img");
            newTrainerPicture.src = data.acf.billede_af_personen.sizes.thumbnail;
            newTrainerPicture.alt = "Billede af personen";

            const newTrainerPosition = document.createElement("p");
            newTrainerPosition.textContent = data.acf.stillingsbetegnelse;

            const newTrainerName = document.createElement("p");
            newTrainerName.textContent = data.acf.fulde_navn;

            const newTrainerMail = document.createElement("p");
            newTrainerMail.textContent = data.acf.mail;

            const newTrainerNumber = document.createElement("p");
            newTrainerNumber.textContent = data.acf.telefonnummer;

            trainerArticle.append(newTrainerPicture, newTrainerPosition, newTrainerName, newTrainerMail, newTrainerNumber);
            trainerSection.append(trainerArticle);
        }



        holdSideEl.append(teamSection, trainerSection);

    })
}