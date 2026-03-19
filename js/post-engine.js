async function loadPost() {

  /* ============================
     1. Detectar idioma actual
  ============================ */

  const path = window.location.pathname;

  let lang = "es";

  if (path.startsWith("/en/")) lang = "en";
  if (path.startsWith("/fr/")) lang = "fr";
  if (path.startsWith("/pt/")) lang = "pt";

  /* ============================
     2. Detectar slug limpio
  ============================ */

  const parts = path.split("/");
  let slug = parts[parts.length - 1];

  if (!slug) slug = parts[parts.length - 2];

  slug = slug.replace("/", "");

  /* ============================
     3. Cargar JSON correcto
  ============================ */

  const res = await fetch(`/data/library-${lang}.json`);
  const posts = await res.json();

  const post = posts.find(p => p.slug === slug);

  if (!post) {
    document.body.innerHTML = "<h2>Lectura no encontrada.</h2>";
    return;
  }

  /* ============================
     4. Insertar contenido
  ============================ */

  document.getElementById("postTitle").innerHTML =
  post.title.replace(":", ":<span></span>");
  document.getElementById("postEmotion").textContent = post.emotion;
  document.getElementById("postContent").textContent = post.content;

  document.getElementById("payhipLink").href = post.payhip;
  document.getElementById("postBook").textContent =
    "Del libro: " + post.ebook;

  /* ============================
     5. SEO Mundial Nivel Dios
  ============================ */

  const canonicalUrl =
    `https://drevaia.com/${lang === "es" ? "" : lang + "/"}library/${post.slug}`;

  document.title = post.title + " | Drevaia Digital";

  document.getElementById("canonicalLink").href = canonicalUrl;

  document.getElementById("metaDesc").content =
    post.excerpt || post.emotion;

  document.getElementById("ogTitle").content = post.title;
  document.getElementById("ogDesc").content = post.excerpt;

  /* hreflang global */

  document.getElementById("hrefES").href =
    "https://drevaia.com/library/" + post.slug;

  document.getElementById("hrefEN").href =
    "https://drevaia.com/en/library/" + post.slug;

  document.getElementById("hrefFR").href =
    "https://drevaia.com/fr/library/" + post.slug;

  document.getElementById("hrefPT").href =
    "https://drevaia.com/pt/library/" + post.slug;

}

loadPost();
