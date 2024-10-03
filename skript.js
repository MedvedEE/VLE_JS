//-------------------------1. osa Ostukorv ------------------------suurendaArtikkel

"use strict";
//toote pealt vajaliku info kogumine ja lisamine ostukorvi
let korv = [];
const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');
lisaKorviNupud.forEach(lisaKorviNupp => {
    lisaKorviNupp.addEventListener('click', () => {
        const toodeInfo = lisaKorviNupp.parentNode;
        const toode = {
            nimi: toodeInfo.querySelector(".toode_nimi").innerText,
            hind: toodeInfo.querySelector(".toode_hind").innerText,
            kogus: 1
        };
        const onKorvis = (korv.filter(korvArtikkel => (korvArtikkel.nimi === toode.nimi)).length > 0);
        if (!onKorvis) {
            lisaArtikkel(toode); // selle funktsiooni loome allpool
            korv.push(toode);
            nupuOhjamine(lisaKorviNupp, toode); // selle funktsiooni loome allpool
            arvutaKorviSumma(); // uuenda summa

        }
    });
});
document.querySelectorAll('input[name="tarneviis"]').forEach(tarneviis => { // Uuenda ostukorvi maksuvus, kui uuendatakse tarneviisi
    tarneviis.addEventListener('change', () => {
        arvutaKorviSumma(); 
    });
});

//funktsioon toote lisamiseks
function lisaArtikkel(toode) {
    korviSisu.insertAdjacentHTML('beforeend', `
    <div class="korv_artikkel">
      <h3 class="korv_artikkel_nimi">${toode.nimi}</h3>
      <h3 class="korv_artikkel_hind">${toode.hind}</h3>    
      <div class="korv_artikkel_buttons">  
      <button class="btn-small" data-action="vahenda_artikkel">&minus;</button>
      <h3 class="korv_artikkel_kogus">${toode.kogus}</h3>
      <button class="btn btn-small" data-action="suurenda_artikkel">&plus;</button>
      <button class="btn btn-small" data-action="eemalda_artikkel">&times;</button>
      </div>
    </div>
  `);

    lisaKorviJalus(); // selle funktsiooni lisame allpool
}

//funktsioon nupu sündmusekuulutaja jaoks
function nupuOhjamine(lisaKorviNupp, toode) {
    lisaKorviNupp.innerText = 'Ostukorvis';
    lisaKorviNupp.disabled = true;

    const korvArtiklidD = korviSisu.querySelectorAll('.korv_artikkel');
    korvArtiklidD.forEach(korvArtikkelD => {
        if (korvArtikkelD.querySelector('.korv_artikkel_nimi').innerText === toode.nimi) {
            korvArtikkelD.querySelector('[data-action="suurenda_artikkel"]').addEventListener('click', () => suurendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="vahenda_artikkel"]').addEventListener('click', () => vahendaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
            korvArtikkelD.querySelector('[data-action="eemalda_artikkel"]').addEventListener('click', () => eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
        }
    });
}

//toodete arvu suurendamine
function suurendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = ++korvArtikkel.kogus;
        }
    });
    arvutaKorviSumma(); // uuenda summa

}

//Ülesanne 5.1: lisa funktsioon toodete hulga vähendamiseks.
//toodete arvu vähendamine
function vahendaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            if (korvArtikkel.kogus > 1) {
                korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = --korvArtikkel.kogus;
            } else {
                eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp);
            }
        }
    });
    arvutaKorviSumma(); // uuenda summa
}

//toodete eemaldamine ostukorvist
function eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korvArtikkelD.remove();
    korv = korv.filter(korvArtikkel => korvArtikkel.nimi !== toode.nimi);
    lisaKorviNupp.innerText = 'Lisa ostukorvi';
    lisaKorviNupp.disabled = false;
    if (korv.length < 1) {
        document.querySelector('.korv-jalus').remove();
    }
    arvutaKorviSumma(); // uuenda summa
}

//ostukorvi jaluse ehk alumiste nuppude lisamine
function lisaKorviJalus() {
    if (document.querySelector('.korv-jalus') === null) {
        korviSisu.insertAdjacentHTML('afterend', `
      <div class="korv-jalus">
        <button class="btn" data-action="tyhjenda_korv">Tühjenda ostukorv</button>
        <button class="btn" data-action="kassa">Maksma</button>
      </div>
    `);
        document.querySelector('[data-action="tyhjenda_korv"]').addEventListener('click', () => tuhjendaKorv());
        document.querySelector('[data-action="kassa"]').addEventListener('click', () => kassa());
    }
}

// ostukorvi tühjendamine
function tuhjendaKorv() {
    korviSisu.querySelectorAll('.korv_artikkel').forEach(korvArtikkelD => {
        korvArtikkelD.remove();
    });

    document.querySelector('.korv-jalus').remove();

    lisaKorviNupud.forEach(lisaOstukorviNupp => {
        lisaKorviNupp.innerText = 'Lisa ostukorvi';
        lisaKorviNupp.disabled = false;
    });
    arvutaKorviSumma(); // uuenda summa
}


//Ülesanne 5.2: lisa funktsioon, mis arvutab ostukorvi summa kokku.

function arvutaKorviSumma() {
    let kokkuSumma = 0;

    korv.forEach(korvArtikkel => {
        kokkuSumma += parseFloat(korvArtikkel.hind) * korvArtikkel.kogus;
    });

    const valitudTarne = document.querySelector('input[name="tarneviis"]:checked');
    if (valitudTarne) {
        kokkuSumma += parseFloat(valitudTarne.value);
    }

    const summaElem = document.querySelector('.korv-summa');
    if (kokkuSumma > 0) {
        if (!summaElem) {
            korviSisu.insertAdjacentHTML('afterend', `<div class="korv-summa">Kokku: ${kokkuSumma.toFixed(2)} €</div>`);
        } else {
            summaElem.innerText = `Kokku: ${kokkuSumma.toFixed(2)} €`;
        }
    } else if (summaElem) {
        summaElem.remove();
    }
}

//-------------------------2. osa Taimer ------------------------

//taimer
function alustaTaimer(kestvus, kuva) {
    let start = Date.now(),
        vahe,
        minutid,
        sekundid;

    function taimer() {
        let vahe = kestvus - Math.floor((Date.now() - start) / 1000);

        let minutid = Math.floor(vahe / 60);
        let sekundid = Math.floor(vahe % 60);

        if (minutid < 10) {
            minutid = "0" + minutid;
        }
        if (sekundid < 10) {
            sekundid = "0" + sekundid;
        }

        kuva.textContent = minutid + ":" + sekundid;

        if (vahe < 0) {
            clearInterval(vahe);
            document.getElementById("time").innerHTML = "alusta uuesti";
        };
    };
    taimer();
    setInterval(taimer, 1000);

};
function kasSisaldabNumbreid(tekst) {
    for (let i = 0; i < tekst.length; i++) {
        if (!isNaN(tekst[i]) && tekst[i] !== " ") { // KOntrollib, kas tähemärk on number, kuid mitte tühik
            return true;
        }
    }
    return false;
}

function kassa(){
    let taimeriAeg = 60 * 2,
        kuva = document.getElementById("time");
    alustaTaimer(taimeriAeg, kuva);
}
document.querySelector('[data-action="kassa"]').addEventListener('click', () => kassa());

//-------------------------3. osa Tarne vorm ------------------------

const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const telefon = document.getElementById("telefon");
const kinnitus = document.getElementById("kinnitus");
const raadionupud = document.getElementsByName("tarneviis"); 
const postiindeks = document.getElementById("postiindeks"); // minu kood: postiindeksi element
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = [];

    if (eesnimi.value.trim() === "") {
        errors.push("Sisesta eesnimi");
    } else if (kasSisaldabNumbreid(eesnimi.value)) {
        errors.push("Eesnimi ei tohi sisaldada numbreid");
    }

    if (perenimi.value.trim() === "") {
        errors.push("Sisesta perenimi");
    } else if (kasSisaldabNumbreid(perenimi.value)) {
        errors.push("Perenimi ei tohi sisaldada numbreid");
    }
    // minu kood: postiindeksi kontroll
    if (postiindeks.value.trim() === "") {
        errors.push("Sisesta postiindeks");
    } else if (postiindeks.value.length < 5 || isNaN(postiindeks.value) || postiindeks.value.includes(" ")) {
        errors.push("Postiindeks peab olema vähemalt 5 numbrit pikk ja sisaldama ainult numbreid");
    }
    if (telefon.value.trim() === "") {
        errors.push("Sisesta telefoninumber");
    } else if (telefon.value.length < 6 || isNaN(telefon.value) || telefon.value.includes(" ")) {
        errors.push("Telefoninumber peab olema vähemalt 6 numbrit pikk ja sisaldama ainult numbreid");
    }
    

    let raadionuppValitud = false;
    raadionupud.forEach(raadionupp => {
        if (raadionupp.checked) {
            raadionuppValitud = true;
        }
    });

    if (!raadionuppValitud) {
        errors.push("Palun vali tarneviis");
    }

    if (!kinnitus.checked) {
        errors.push("Palun nõustu tingimustega");
    }

    if (errors.length > 0) {
        errorMessage.innerHTML = errors.join(', ');
    } else {
        errorMessage.innerHTML = "";
    }
});

/* Ülesanne 5.3: täienda vormi sisendi kontrolli:
- eesnime ja perenime väljal ei tohi olla numbreid;
- telefoni väli ei tohi olla lühem kui 6 sümbolit ning peab sisaldama ainult numbreid;
- üks raadionuppudest peab olema valitud;
- lisa oma valikul üks lisaväli ning sellele kontroll. Märgi see nii HTML kui JavaScripti
  koodis "minu kood" kommentaariga. */



