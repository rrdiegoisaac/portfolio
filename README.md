# Portafolio de Diego Riquelme

Portafolio personal de Data Analyst: una página de inicio (presentación, habilidades, proyectos y contacto) y una nota interactiva por proyecto, con gráficos y explicación de los hallazgos.

Hecho con **React + Vite**, **React Router** (páginas por proyecto) y **Recharts** (gráficos). Estilos en CSS plano, un archivo por componente.

## Cómo correrlo en otro computador

Requisitos: [Node.js](https://nodejs.org) 20 o superior (se desarrolló con Node 24).

```bash
git clone https://github.com/rrdiegoisaac/<repo-del-portafolio>.git
cd <repo-del-portafolio>
npm install        # instala las dependencias (crea node_modules/)
npm run dev        # abre el sitio en http://localhost:5173
```

Otros comandos:

| Comando | Qué hace |
|---|---|
| `npm run lint` | Revisa el código con ESLint |
| `npm run build` | Genera la versión final en `dist/` |
| `npm run preview` | Sirve la versión de `dist/` para revisarla |

## Estructura

```
src/
  main.jsx               Punto de entrada: monta la app con React Router
  App.jsx                Rutas: inicio, /proyectos/:slug y página 404
  index.css              Estilos globales y paleta de colores (modo claro y oscuro)
  data/
    projects.js          Datos de las tarjetas y páginas de proyectos
    terremotos/          Resultados del análisis de terremotos (JSON)
  components/            Un .jsx y su .css por componente
    Home.jsx …           Secciones del inicio (Hero, About, Skills, Projects, Contact)
    ProjectPage.jsx      Página de cada proyecto; carga su nota por separado
    TerremotosNota.jsx   Nota del proyecto de terremotos
    IndiceNota.jsx       Índice flotante de las notas
    chartTheme.js …      Piezas compartidas de los gráficos
```

## Actualizar los datos de la nota de terremotos

El análisis vive en otro repositorio: [terremotos-chile](https://github.com/rrdiegoisaac/terremotos-chile). Después de correr `python analisis/exportar.py` allá, copiar los archivos de `terremotos-chile/export/*.json` a `src/data/terremotos/`.

## Agregar la nota de otro proyecto

1. Crear el componente de la nota en `src/components/`, por ejemplo `InmobiliarioNota.jsx`.
2. Registrarlo en el objeto `articles` de `ProjectPage.jsx`, con el `slug` del proyecto.
3. Completar `repo` y `dataset` del proyecto en `src/data/projects.js`.

## Nota

El proyecto está en una carpeta de OneDrive. Por eso `vite.config.js` tiene la opción `resolve.preserveSymlinks: true`; sin ella, Vite no compila cuando OneDrive procesa `node_modules`.
