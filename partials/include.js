/* =========================================
   DREVAIA — CONTACT CARD AUTO (Multilang)
========================================= */

async function loadContactAuto() {

  const slot = document.getElementById("contact-slot");
  if (!slot) return;

  // Detect language by folder
  const path = window.location.pathname;

  let lang = "es";
  if (path.startsWith("/en/")) lang = "en";
  if (path.startsWith("/fr/")) lang = "fr";
  if (path.startsWith("/pt/")) lang = "pt";

  const data = {
    es: {
      intro: "Gracias por estar. Si deseas seguir caminando juntos, aquí me encuentras.",
      title: "Conecta conmigo",
      libraryLabel: "Tienda en Payhip",
      library: "https://payhip.com/DrevaiaDigital",
      aboutLabel: "Biografía",
      about: "/biografia.html"
    },

    en: {
      intro: "Thank you for being here. If you feel called to keep walking together, you can find me here.",
      title: "Connect with me",
      libraryLabel: "English Library (Payhip)",
      library: "https://payhip.com/DrevaiaDigital/collection/english-library",
      aboutLabel: "About the Author",
      about: "/en/about.html"
    },

    fr: {
      intro: "Merci d’être ici. Si tu souhaites continuer ce chemin ensemble, tu peux me retrouver ici.",
      title: "Me retrouver",
      libraryLabel: "Bibliothèque Française (Payhip)",
      library: "https://payhip.com/DrevaiaDigital/collection/french-library",
      aboutLabel: "À propos",
      about: "/fr/a-propos.html"
    },

    pt: {
      intro: "Obrigada por estar aqui. Se quiser continuar caminhando comigo, você me encontra aqui.",
      title: "Conecte-se comigo",
      libraryLabel: "Biblioteca Portuguesa (Payhip)",
      library: "https://payhip.com/DrevaiaDigital/collection/portuguese-library",
      aboutLabel: "Sobre a autora",
      about: "/pt/sobre.html"
    }
  };

  const config = data[lang];

  // Load template
  const res = await fetch("/partials/contact.html");
  let html = await res.text();

  // Build buttons
  const buttonsHTML = `
    <a class="drevaia-btn" href="${config.library}" target="_blank" rel="noopener noreferrer">
      🛒 ${config.libraryLabel}
    </a>

    <a class="drevaia-btn" href="${config.about}">
      📖 ${config.aboutLabel}
    </a>

    <a class="drevaia-btn" href="https://hotmart.com/es/club/99175292" target="_blank" rel="noopener noreferrer">
      🔥 Hotmart Club
    </a>

    <a class="drevaia-btn" href="https://instagram.com/drevaia.digital" target="_blank" rel="noopener noreferrer">
      📷 Instagram
    </a>

    <a class="drevaia-btn" href="https://tiktok.com/@drevaia.digital" target="_blank" rel="noopener noreferrer">
      🎥 TikTok
    </a>

    <a class="drevaia-btn" href="https://youtube.com/@Drevaia" target="_blank" rel="noopener noreferrer">
      ▶️ YouTube
    </a>

    <a class="drevaia-btn" href="https://facebook.com/profile.php?id=61578074633618" target="_blank" rel="noopener noreferrer">
      📘 Facebook
    </a>

    <a class="drevaia-btn" href="mailto:noa@drevaia.com">
      📧 noa@drevaia.com
    </a>
  `;

  // Inject safely
  html = html.replace("{{intro}}", config.intro);
  html = html.replace("{{title}}", config.title);
  html = html.replace("{{buttons}}", buttonsHTML);

  slot.innerHTML = html;
}


/* =========================================
   🌍 DREVAIA WORLDWIDE AUTO BLOCK
========================================= */

function loadWorldwide() {

  const slot = document.getElementById("worldwide-slot");
  if (!slot) return;

  fetch("/partials/worldwide.html")
    .then(res => res.text())
    .then(html => {
      slot.innerHTML = html;
    })
    .catch(() => {
      console.warn("Worldwide block could not load.");
    });
}


/* =========================================
   ✅ AUTO INIT (Runs once per page)
========================================= */

window.addEventListener("DOMContentLoaded", () => {
  loadWorldwide();
  loadContactAuto();
});

