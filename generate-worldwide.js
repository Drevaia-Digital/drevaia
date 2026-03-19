const fs = require("fs");

/* ============================
   CONFIG GLOBAL DREVAIA
============================ */

const langs = ["en", "fr", "pt"];

const baseUrl = "https://drevaia.com";

/* ============================
   1. Leer biblioteca español
============================ */

const esPosts = JSON.parse(
  fs.readFileSync("./data/library-es.json", "utf8")
);

/* ============================
   2. Traducción base (placeholder)
   (Luego se conecta con IA real)
============================ */

function autoTranslate(text, lang) {
  return `[${lang.toUpperCase()} VERSION]\n\n` + text;
}

/* ============================
   3. Slug internacional simple
============================ */

function slugifyInternational(slug, lang) {
  return slug + "-" + lang;
}

/* ============================
   4. Generar JSON por idioma
============================ */

langs.forEach(lang => {
  const translated = esPosts.map(post => ({
    title: autoTranslate(post.title, lang),
    slug: slugifyInternational(post.slug, lang),
    emotion: autoTranslate(post.emotion, lang),
    excerpt: autoTranslate(post.excerpt, lang),
    content: autoTranslate(post.content, lang),
    ebook: autoTranslate(post.ebook, lang),
    payhip:
      lang === "en"
        ? "https://payhip.com/DrevaiaDigital/collection/english-library"
        : lang === "fr"
        ? "https://payhip.com/DrevaiaDigital/collection/french-library"
        : "https://payhip.com/DrevaiaDigital/collection/portuguese-library",
    date: post.date
  }));

  fs.writeFileSync(
    `./data/library-${lang}.json`,
    JSON.stringify(translated, null, 2)
  );

  console.log("✅ Generado:", `library-${lang}.json`);
});

/* ============================
   5. Generar sitemap.xml ULTRA
============================ */

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n`;

/* HOME */
sitemap += `
<url>
  <loc>${baseUrl}/</loc>
  <changefreq>weekly</changefreq>
  <priority>1.00</priority>
</url>\n`;

/* Idiomas home */
["en", "fr", "pt"].forEach(l => {
  sitemap += `
<url>
  <loc>${baseUrl}/${l}/</loc>
  <changefreq>weekly</changefreq>
  <priority>0.90</priority>
</url>\n`;
});

/* Biblioteca */
sitemap += `
<url>
  <loc>${baseUrl}/library/</loc>
  <changefreq>weekly</changefreq>
  <priority>0.95</priority>
</url>\n`;

/* Posts ES */
esPosts.forEach(post => {
  sitemap += `
<url>
  <loc>${baseUrl}/library/${post.slug}</loc>
  <changefreq>monthly</changefreq>
  <priority>0.85</priority>
</url>\n`;
});

/* Posts traducidos */
langs.forEach(lang => {
  esPosts.forEach(post => {
    sitemap += `
<url>
  <loc>${baseUrl}/${lang}/library/${slugifyInternational(
      post.slug,
      lang
    )}</loc>
  <changefreq>monthly</changefreq>
  <priority>0.80</priority>
</url>\n`;
  });
});

sitemap += `\n</urlset>`;

/* Guardar sitemap */
fs.writeFileSync("./sitemap.xml", sitemap);

console.log("🌍 Sitemap mundial generado con éxito.");
console.log("🚀 Drevaia Ultra Global lista.");
