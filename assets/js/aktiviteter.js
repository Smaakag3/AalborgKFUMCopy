const domain = "https://aalborgkfumfodbold.r-dalsgaard.dk/";
const baseEndPoint = "wp-json/wp/v2/posts?acf_format=standard&per_page=40&categories=29,58,55";
const kalenderEl = document.querySelector(".aktivitetsKalender");
const holdSelectorEl = document.querySelector("#holdSelector");
const activitySelectorEl = document.querySelector("#activitySelector");

const knapper = document.querySelectorAll(".aabenAktiviteter");
// Denne linje vælger alle dokumenter med class aabenAktiviteter og gemmer dem som node*, samt holder const kanpper alle de valgte elementer i en konnstant variabel med navnet knapper
knapper.forEach(function(knappe) 
// forEach looper igennem hvert elemenet i knepper (node)
//(function(knap) definerer en function, der kører for hvert element i knapper men den aktuelle element i loopet bliver gemt/holdt i variablet med navnet knap
 {
    // Tilføjer click event listener til hver knappe, hvilket betyder at når der trykkes på knappen udføres funktionen 
    knappe.addEventListener("click",function() {
        knappe.classList.toggle("active");
//Det næste element (efter knappen i dom) findes. Det definerer om der er indhold der skal vises eller skjules 
        const aktivitetsIndhold = knappe.nextElementSibling;
        // Der tjekkes om aktivitetIndhold er synligt (display =block)
// Hvis ja så skjules det (display =none)

        if(aktivitetsIndhold.style.display === "block"){
            aktivitetsIndhold.style.display = "none";
        }
        //Hvis nej så vise det (Display = block)
        else {
            aktivitetsIndhold.style.display = "block"
         }
         // her under findes <i> element inde i knappen (som er ikon fra font awesome )
         const ikon = knappe.querySelector("i");
         //Der tjekkes om Knappen har klassen active
// Hvis ja (if) så ændres der til ikon der peger ned af 
//Hvis nej, skifter ikon til pil op af 

         if (knappe.classList.contains("active")){
            ikon.classList.remove("fa-chevron-down");
            ikon.classList.add("fa-chevron-up");
         } else{
            // Hvis det samme her bare omvendt 
            ikon.classList.remove("fa-chevron-up");
            ikon.classList.add("fa-chevron-down");
         }
  });
});


