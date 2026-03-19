const fs = require("fs");
const path = require("path");

/* =========================================
   DREVAIA ULTRA SITEMAP GENERATOR 🌍
   Biblioteca + Blog + Multilenguaje
========================================= */

const DOMAIN = "https://drevaia.com";
const TODAY = new Date().toISOString().split("T")[0];

/* =========================================
   CONFIG — Carpetas a incluir
========================================= */

const LIBRARY_JSON = path.join(__dirname, "data/library.json");

const BLOG_FOLDERS = [
  "blog/es",
  "blog/en",
  "blog/fr",
  "blog/pt"
];

/* =========================================
   Helper: crear bloque URL
========================================= */

function urlBlock(loc, lastmod = TODAY, priority = "0.80", freq = "monthly") {
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/* =========================================
   1. BASE PAGES (Global)
========================================= */

let urls = "";

// Home
urls += urlBlock(`${DOMAIN}/`, TODAY, "1.00", "weekly");

// Multilenguaje home
urls += urlBlock(`${DOMAIN}/en/`, TODAY, "0.90", "weekly");
urls += urlBlock(`${DOMAIN}/fr/`, TODAY, "0.90", "weekly");
urls += urlBlock(`${DOMAIN}/pt/`, TODAY, "0.90", "weekly");

// Biblioteca index
urls += urlBlock(`${DOMAIN}/library/`, TODAY, "0.95", "weekly");

// Legal
urls += urlBlock(`${DOMAIN}/legal/`, TODAY, "0.40", "yearly");

/* =========================================
   2. BIBLIOTECA DINÁMICA (JSON)
========================================= */

if (fs.existsSync(LIBRARY_JSON)) {
  const posts = JSON.parse(fs.readFileSync(LIBRARY_JSON, "utf8"));

  posts.forEach(post => {
    urls += urlBlock(
      `${DOMAIN}/library/${post.slug}`,
      post.date || TODAY,
      "0.85",
      "monthly"
    );
  });

  console.log("✅ Biblioteca:", posts.length, "lecturas añadidas.");
} else {
  console.log("⚠️ No se encontró library.json");
}

/* =========================================
   3. BLOG POSTS AUTOMÁTICOS (HTML scan)
========================================= */

BLOG_FOLDERS.forEach(folder => {
  const fullPath = path.join(__dirname, folder);

  if (!fs.existsSync(fullPath)) return;

  const files = fs.readdirSync(fullPath);

  files.forEach(file => {
    if (!file.endsWith(".html")) return;

    const slug = file.replace(".html", "");
    const url = `${DOMAIN}/${folder}/${slug}.html`;

    urls += urlBlock(url, TODAY, "0.70", "monthly");
  });

  console.log("✅ Blog folder incluido:", folder);
});

/* =========================================
   FINAL XML OUTPUT
========================================= */

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, "sitemap.xml"), sitemap.trim());

console.log("🌍 Sitemap mundial ULTRA generado con éxito.");
