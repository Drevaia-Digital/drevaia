async function loadLibrary() {

  let books = [];

  /* ============================
     1. Detectar idioma UNA sola vez
  ============================ */

  const path = window.location.pathname;

  let lang = "es";
  if (path.startsWith("/en/")) lang = "en";
  else if (path.startsWith("/fr/")) lang = "fr";
  else if (path.startsWith("/pt/")) lang = "pt";

  /* ============================
     2. Seleccionar JSON correcto
  ============================ */

  let dataFile = "library.json";
  if (lang === "en") dataFile = "library-en.json";
  else if (lang === "fr") dataFile = "library-fr.json";
  else if (lang === "pt") dataFile = "library-pt.json";

  try {
    const res = await fetch(`/data/${dataFile}`);
    books = await res.json();
  } catch (e) {
    console.warn("Biblioteca no disponible.");
    return;
  }

  const grid = document.getElementById("libraryGrid");
  const search = document.getElementById("search");

  if (!grid || !search) return;

  /* ============================
     3. Prefijo interno por idioma
  ============================ */

  const prefix =
    lang === "en" ? "/en" :
    lang === "fr" ? "/fr" :
    lang === "pt" ? "/pt" :
    "";

  /* ============================
     4. Renderizar tarjetas
  ============================ */

  function render(items) {

    grid.innerHTML = "";

    if (!items.length) {
      grid.innerHTML = `
        <div class="no-results">
          No todo se encuentra buscando.<br>
          A veces basta con quedarse un momento.<br><br>
          Respira. La lectura correcta sabe llegar.
        </div>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();

    items.forEach(item => {

      const collectionLink =
        item[`collection_${lang}`] || item.collection_es;

      const productLink =
        item.payhip || collectionLink;

      const readingLink =
        `${prefix}/library/${item.slug}`;

      const card = document.createElement("article");
      card.className = "card";

      card.innerHTML = `
        <h2>${item.title}</h2>

        <p class="emotion">
          ${item.emotion}
        </p>

        <p class="excerpt">
          ${item.excerpt}
        </p>

        <a class="cta" href="${readingLink}">
          Abrir lectura →
        </a>

        <a class="cta secondary"
           href="${collectionLink}"
           target="_blank"
           rel="noopener">
          Entrar al refugio completo →
        </a>

        <a class="cta mini"
           href="${productLink}"
           target="_blank"
           rel="noopener">
          Abrir el libro →
        </a>

        <p class="bookline">
          Parte del libro <strong>${item.ebook}</strong>
        </p>
      `;

      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
  }

  /* ============================
     5. Render inicial
  ============================ */

  render(books);

  /* ============================
     6. Buscador emocional
  ============================ */

  search.addEventListener("input", e => {

    const q = e.target.value.toLowerCase().trim();

    grid.classList.add("is-filtering");

    const filtered = books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.emotion.toLowerCase().includes(q) ||
      b.excerpt.toLowerCase().includes(q) ||
      (b.search && b.search.toLowerCase().includes(q))
    );

    requestAnimationFrame(() => {
      render(filtered);
      grid.classList.remove("is-filtering");
    });

  });

}

loadLibrary();
