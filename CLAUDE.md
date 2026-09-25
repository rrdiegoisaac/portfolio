# Contexto para Claude: portafolio de Diego Riquelme

## Quién soy y cómo trabajar conmigo

- Data Analyst con 2 años de experiencia en telecomunicaciones: SQL Server, Python y Power BI. Ingeniero comercial de formación. No soy desarrollador frontend.
- **Respóndeme en español.**
- **No me expliques conceptos de React o frontend** mientras construyes. Haz los cambios y dame un resumen corto de qué cambió y qué debo revisar o decidir.
- **Commits:** solo a mi nombre. **Nunca agregues `Co-Authored-By: Claude`** ni otra atribución a Claude en commits o PRs. Usa conventional commits en español (`feat(...)`, `fix(...)`, `docs:`), un commit por cambio lógico.
- Antes de algo destructivo o que se publique (push forzado, borrar archivos que no creaste tú), pregúntame.

## Qué es este proyecto

Portafolio personal con React + Vite:
- **Inicio:** Hero, Sobre mí, Habilidades, Proyectos (4 tarjetas) y Contacto.
- **Una página por proyecto** (`/proyectos/:slug`): una nota interactiva al estilo The Pudding u Our World in Data, con texto narrativo, gráficos, fragmentos de código y fuentes citadas.

El repo es **privado**. Los repos de cada proyecto (el análisis en Python) son **públicos** en github.com/rrdiegoisaac.

Estado de los proyectos:
| Proyecto | Nota | Repo del análisis |
|---|---|---|
| Terremotos en Chile (`terremotos-chile`) | Completa | github.com/rrdiegoisaac/terremotos-chile (público) |
| Portal Inmobiliario | Pendiente | `analisis-datos-inmobiliarios` (privado por ahora) |
| Delitos en Chile | Pendiente | `analisis-delictual-chile` (privado por ahora) |
| Segmentación de clientes | Pendiente | `customer-analysis` (privado por ahora) |

## Convenciones de código

- **Estilos:** CSS plano, un `.css` junto a cada `.jsx`, con clases con prefijo del componente (ej. `.hero__title`). Nada de Tailwind ni otros frameworks.
- **Componentes:** en `src/components/`, cada uno con su `Nombre.jsx` y `Nombre.css`.
- **Colores:** siempre desde las variables de `src/index.css` (`--text`, `--muted`, `--accent`, `--chart-1..3`, `--seq-1..4`, etc.), con variantes para modo claro y oscuro.
- **Gráficos:** Recharts. La configuración común está en `src/components/chartTheme.js`; cada gráfico va dentro de `ChartFigure`, con título, subtítulo y nota de fuente.
  - Las leyendas llevan `itemSorter={null}` para respetar el orden de las series.
  - Máximo 3 colores categóricos.
  - En celular, las grillas usan `minmax(0, 1fr)` para que las tablas anchas no desborden la página.
- **Notas de proyecto:**
  - Se registran en el objeto `articles` de `ProjectPage.jsx` y se cargan por separado con `lazy`.
  - El índice flotante (`IndiceNota`) se arma solo con los `h2` y `h3` de la nota.
  - Los datos vienen de JSON en `src/data/<proyecto>/`.
- **Antes de dar algo por terminado:** `npm run lint` y `npm run build` sin errores.

## Reglas para el contenido de las notas

- Voz de analista, no de experto de otra disciplina: describir lo que muestran los datos. Las afirmaciones técnicas o causales, solo con fuente verificada.
- Toda cifra del texto se verifica contra los datos. Siempre que se pueda, se lee del JSON en vez de escribirla a mano.
- Términos estadísticos explicados en simple (mediana, p95, etc.).
- Fuentes numeradas con el componente `Cita`, y sección "Fuentes" al final con enlaces verificados (DOI cuando exista).
- Dejar explícitos los sesgos y las limitaciones de los datos; es parte del valor de la nota.

## Detalles técnicos a tener en cuenta

- El proyecto está en una carpeta de **OneDrive**. `vite.config.js` usa `resolve.preserveSymlinks: true` porque OneDrive convierte `node_modules` en "reparse points" y sin esa opción Vite falla con "failed to resolve import". Si en otro PC está fuera de OneDrive, la opción no molesta.
- Para actualizar los datos de terremotos: en el repo `terremotos-chile`, correr `python analisis/exportar.py` y copiar `export/*.json` a `src/data/terremotos/`.

## Pendientes

- Subir la base de terremotos a Kaggle y poner su URL en `dataset` en `src/data/projects.js` (el botón aparece solo).
- Agregar LinkedIn y correo en `src/components/Contact.jsx` (hoy solo aparece GitHub).
- Hacer las notas de los otros 3 proyectos.
- Cuando se quiera publicar el sitio: Vercel (funciona con repos privados) y un `vercel.json` para que funcionen las rutas de React Router.
