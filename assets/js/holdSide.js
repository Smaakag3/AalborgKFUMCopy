// To variabler som indeholder domænet til vores WordPress og vores end point med ACF standard format.
const domain = "https://aalborgkfumfodbold.r-dalsgaard.dk/"
const endPoint = "wp-json/wp/v2/posts?acf_format=standard"

// En variabel som returnerer query-parameteren fra den side man befinder sig på.
const paramsString = window.location.search;
// En variabel som oversætter query-parameteren til et objekt som indeholder en key og en værdi.
const searchParam = new URLSearchParams(paramsString);
// En variabel som gemmer værdien af key'en 'slug' i objektet. Denne værdi skal bruges til at generere nyt indhold fra WordPress på aktuelle side.
const slug = searchParam.get("slug");

// En query selector som udpeger et element med ID'et 'holdSideMain'.
const holdSideEl = document.querySelector("#holdSideMain");
const traenerEl = document.querySelector("#traenerSektion");

// En fetch request som bruger slug'en fra den tidligere variabel. Slug'en tilhører det specifikke hold som man har klikket på, dermed henter fetchen data omkring det specifikke hold fra WordPress.
fetch(domain + endPoint + "&slug=" + slug)
.then(res => res.json())
// En funktion som tager data'en og har til formål at indsætte data'en ind på siden
.then(data => renderTeam(data))
.catch(err => console.log(err))

// Funktionen som skal indsætte data'en ind på siden
function renderTeam(data){
    // Siden vi får tilsendt et Array, bliver vi nød til at loope igennem det med et forEach loop.
    data.forEach(teamInfo => {

        // En ny h1 bliver lavet og bliver tildelt holdets navn
        const newTeamTitle = document.createElement("h1");
        newTeamTitle.textContent = teamInfo.acf.hold_navn;

        // En ny h2 bliver lavet.
        const newTeamYear = document.createElement("h2");

        // En if-else-if statement som kigger efter key'en i ACF'en. Hvis key'en er 'aargang', så brug navnet på årgangen i h2'eren. Hvis key'en er 'alder', så brug navnet på alderen i h2'eren 
        if(teamInfo.acf.aargang){
            newTeamYear.textContent = teamInfo.acf.aargang.name;
        } else if(teamInfo.acf.alder) {
            newTeamYear.textContent = teamInfo.acf.alder.name;
        }

        // En ny p bliver lavet som indeholder en beskrivelse af holdet.
        const newTeamDescription = document.createElement("p");
        newTeamDescription.textContent = teamInfo.acf.beskrivelse;

        // En ny artikel bliver lavet
        const newTeamIntroBox = document.createElement("article");

        // Holdets navn, årgang/alder for holdet og beskrivelsen bliver tilføjet artiklen som child elementer, og artiklen får klassen 'holdIntroBox'.
        newTeamIntroBox.append(newTeamTitle, newTeamYear, newTeamDescription); 
        newTeamIntroBox.classList.add("holdIntroBox");

        // Et nyt billede bliver lavet hvor kilden findes i ACF, og billedet får alt 'Holdbillede' samt klassen 'holdBillede'.
        const newTeamPicture = document.createElement("img");
        newTeamPicture.src = teamInfo.acf.holdbillede.sizes.large;
        newTeamPicture.alt = "Holdbillede";
        newTeamPicture.classList.add("holdBillede");

        // En ny artikel bliver lavet med klassen 'Traeningstider'.
        const newTrainingTimes = document.createElement("article");
        newTrainingTimes.classList.add("TraeningsTider");

        // En ny h4 bliver lavet som indeholder "Træningstider" og bliver tilføjet til den tidligere artikel som et child element.
        const newTrainingTitle = document.createElement("h4");
        newTrainingTitle.textContent = "Træningstider";
        newTrainingTimes.append(newTrainingTitle);

        // De forskellige hold kan have varierende antal træningsdage og træningstider, derfor bruger vi et forEach loop til at loope igennem de Arrays vi har fået tilsendt. Variablen dayNumber indeholder index + 1, hvilket betyder at der vil blive plusset 1 til dayNumber ved hvert loop.  Dette bruges til at indsætte træningstiderne ind dynamisk da der altid vil blive plusset en til sidst på 'traeningstid-start-dag' i vores forEach loop. Til sidst vil hver dag sammen med træningstiderne bliver indsat i artiklen 'newTrainingTimes' som child elementer.
        teamInfo.acf.traeningsdage.forEach((dag, index) => {
            const newTeamTrainingDays = document.createElement("p");
            
            const dayNumber = index + 1;
            const traingingStart = teamInfo.acf[`traeningstid-start-dag${dayNumber}`];
            const trainingEnd = teamInfo.acf[`traeningstid-slut-dag${dayNumber}`];
            
            newTeamTrainingDays.textContent = dag.name + ": " + traingingStart + " - " + trainingEnd;

            newTrainingTimes.append(newTeamTrainingDays);
        })

        // En ny artikel bliver lavet og får klassen 'Kontingent'.
        const newPriceSection = document.createElement("article");
        newPriceSection.classList.add("Kontigent");

        // En ny p bliver lavet og får indholdet 'kontigentsats' fra vores ACF.
        const newPrice = document.createElement("p");
        newPrice.textContent = "Kontingent: " + teamInfo.acf.kontigentsats + ",- pr. 1/2år";

        // Et nyt link bliver lavet og får tekst indholdet 'Tilmeld'. Linket fører til Aalborg KFUM Fodbolds eksterne tilmeldingsside. Linket får target="_black" så en ny fane bliver åbnet og brugeren ikke efterlader vores side. Linket får klassen 'tilmeldKnap'
        const newPriceButton = document.createElement("a");
        newPriceButton.textContent = "Tilmeld";
        newPriceButton.href = "https://koservice.dbu.dk/ClubSignup?id=41&clubid=5";
        newPriceButton.target = "_blank"
        newPriceButton.classList.add("tilmeldKnap");
        newPriceButton.classList.add("skygge");

        // Kontingenten og tilmeld knappen bliver tilføjet til artiklen 'newPriceSection' som child elementer.
        newPriceSection.append(newPrice, newPriceButton)
        
        // En ny sektion bliver lavet og får klassen 'introSektion'. De tidligere genererede elementer bliver tilføjet til sektionen som child elementer.
        const teamSection = document.createElement("section");
        teamSection.classList.add("introSektion");
        teamSection.append(newTeamIntroBox, newTrainingTimes, newPriceSection, newTeamPicture);

        // En ny sektion bliver lavet og får klassen 'traenerSektion'.
        const trainerSection = document.createElement("section");
        trainerSection.classList.add("traenerSektion");

        // Tilføjet headeren til sektionen.
        // trainerSection.append(trainerHeader);
        
        // Da hvert hold kan have et forskelligt antal trænere, laver vi et forEach loop over Array'et 'traenere' fra ACF feltet. Hver træner har et objekt som blandt andet indeholder et ID som matcher deres indlæg fra vores WordPress. Dette ID bliver brugt i en fetch request som henter detaljeret information omkring den pågældende træner.
        teamInfo.acf.traenere.forEach(trainer => {
            fetch(domain + `wp-json/wp/v2/posts/${trainer.ID}?acf_format=standard`)
            .then(res => res.json())
            // Det data vi får fra fetchen bliver videresendt til funktionen 'renderTrainer'.
            .then(data => renderTrainer(data))
            .catch(err => console.log(err))
        })

        // Funktionen renderTrainer som har til formål at indsætte information omkring træneren ind på siden.
        function renderTrainer(data){

            // En ny artikel bliver lavet og får klassen 'traener'.
            const trainerArticle = document.createElement("article");
            trainerArticle.classList.add("traener");

            // Et nyt billede bliver lavet og får kilden fra ACF feltet som indeholder et billede af træneren. Billedet får alt'en 'Billede af personen'.
            const newTrainerPicture = document.createElement("img");
            newTrainerPicture.src = data.acf.billede_af_personen.sizes.thumbnail;
            newTrainerPicture.alt = "Billede af personen";

            // En ny p bliver lavet og får tekstindholdet fra ACF feltet stillingsbetegnelse.
            const newTrainerPosition = document.createElement("p");
            newTrainerPosition.textContent = data.acf.stillingsbetegnelse;

            // En ny p bliver lavet hvor tekstindholdet er navnet på træneren.
            const newTrainerName = document.createElement("p");
            newTrainerName.textContent = data.acf.fulde_navn;

            // En ny p bliver lavet og får trænerens mail som tekstindhold.
            const newTrainerMail = document.createElement("p");
            newTrainerMail.textContent = data.acf.mail;

            // Et nyt billede bliver lavet hvor kilden fører til en SVG som befinder sig i en mappe i filmappen. Billedet for alt'en 'E-mail ikon' og klassen 'kontaktIkon'.
            const newMailIcon = document.createElement("img");
            newMailIcon.src = "./assets/pictures/envelope.svg";
            newMailIcon.alt = "E-mail ikon"
            newMailIcon.classList.add("kontaktIkon");

            // Et nyt div element bliver lavet og får klassen 'mailSektion'.
            const newMailArticle = document.createElement("div");
            newMailArticle.classList.add("mailSektion");

            // Mail-ikonet og trænerens e-mail bliver tilføjet til div elementet som child elementer.
            newMailArticle.append(newMailIcon ,newTrainerMail);

            // En ny p bliver lavet som indeholder trænerens telefonnummer.
            const newTrainerNumber = document.createElement("p");
            newTrainerNumber.textContent = data.acf.telefonnummer;

            // Et nyt billede bliver lavet hvor kilden fører til en SVG som befinder sig i en mappe i filmappen. Billedet for alt'en 'Telefon ikon' og klassen 'kontaktIkon'.
            const newPhoneIcon = document.createElement("img");
            newPhoneIcon.src = "./assets/pictures/phone.svg";
            newPhoneIcon.alt = "Telefon ikon";
            newPhoneIcon.classList.add("kontaktIkon");

            // Et nyt div element bliver lavet og får klassen 'telefonSektion'.
            const newPhoneArticle = document.createElement("div");
            newPhoneArticle.classList.add("telefonSektion");

            // Telefon-ikonet og trænerens telefonnummer bliver tilføjet til div elementet som child elementer.
            newPhoneArticle.append(newPhoneIcon, newTrainerNumber);

            // Trænerens billede, stillingsbetegnelse, navn samt e-mail og telefonnummer bliver tilføjet til træner-artiklen som child elementer. Derefter bliver artiklen tilføjet på træner-sektionen som et child element.
            trainerArticle.append(newTrainerPicture, newTrainerPosition, newTrainerName, newMailArticle, newPhoneArticle);
            trainerSection.append(trainerArticle);
        }


        // Sektionen som indholder information om holdet og trænerne bliver tilføjet på siden som child elementer.
        holdSideEl.append(teamSection);
        traenerEl.append(trainerSection);
    })
}