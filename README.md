# MiGranja | Landing Page

Landing page informativa de **Mi Granja**, una solucion digital propuesta por SmartFarm para centralizar y organizar la informacion de animales y lotes de una unidad ganadera.

## Informacion del proyecto

SmartFarm es una startup academica integrada por estudiantes de Ingenieri­a de Software e Ingenieri­a de Sistemas de Informacion de la Universidad Peruana de Ciencias Aplicadas (UPC). Su propuesta, MiGranja, busca facilitar la gestion ganadera mediante una plataforma sencilla y accesible que permite registrar y consultar informacion del ganado de manera eficiente.

La landing page presenta la propuesta de valor, los servicios, los planes y la informacion institucional de SmartFarm.

## Autores

- Albino Florencio Caceres Pizarro | U201923820
- Arian Andre Casas Milla | U202521438
- Santiago Luis Nahui Arroyo | U202320691
- Mathias Joshua Rodrigo Oscanoa Ingaruca | U202126131
- Scarlet Josefina Rivera Aguilar | U20241F577
- Jose Gabriel Rudas Chavarri­a | U202410062

## Segmentos objetivo

### 1. Productores y propietarios ganaderos

Personas responsables de supervisar animales y lotes, consultar historiales y tomar decisiones sobre la operacion ganadera. Requieren informacion organizada y accesible para conocer el estado de su ganado.

### 2. Administradores y encargados de granjas

Usuarios responsables de las actividades operativas y del registro de informacion. Necesitan registrar y consultar alimentacion, vacunacion, ubicacion y movimientos de los animales de manera practica.

## CaracterÃ­sticas principales

- Registro y consulta de animales mediante un codigo individual.
- Creacion, organizacion y consulta de lotes.
- Registro de alimentacion y vacunacion, de forma individual o por lote.
- Registro de ubicacion y movimientos entre corrales y potreros.
- Consulta del historial integral de animales y lotes.
- Recordatorios de actividades y reportes basicos.
- Gestion de la informacion desde dispositivos existentes, sin depender de sensores o GPS.

## Secciones de la landing page

- **Inicio:** propuesta de valor de MiGranja y accesos principales.
- **Servicios:** gestion de animales, lotes, alimentacion, vacunacion, ubicacion y movimientos.
- **Planes:** Basico, Pro y Premium, de acuerdo con el mock-up del proyecto.
- **Quienes somos:** descripcion de SmartFarm, mision, vision y valores.
- **Contactanos:** formulario de consulta que prepara un mensaje mediante el cliente de correo del usuario.

## Tecnologi­as utilizadas

- HTML5
- CSS3
- JavaScript (ES6)
- Google Fonts
- Font Awesome (CDN)

No se utilizan frameworks CSS ni frameworks de JavaScript.

## Estructura del proyecto

```text
migranja-landing-page/
|-- .gitignore
|-- README.md
`-- public/
    |-- index.html
    |-- favicon.ico
    `-- assets/
        |-- images/
        |   |-- about-cattle.jpg
        |   |-- brand-symbol.svg
        |   |-- feeding-cattle.jpg
        |   `-- hero-farm.jpg
        |-- scripts/
        |   `-- main.js
        `-- styles/
            `-- styles.css
```

## EjecuciÃ³n local

1. Abrir la carpeta del proyecto en WebStorm.
2. Abrir `public/index.html` en el navegador o ejecutarlo mediante el servidor de desarrollo integrado de WebStorm.
3. Verificar que se carguen los estilos, scripts e imÃ¡genes desde `public/assets/`.

No se requiere instalar dependencias ni ejecutar un proceso de compilaciÃ³n.

## GitFlow sugerido

Ramas principales:

- `main`: versiÃ³n estable del proyecto.
- `develop`: integraciÃ³n del trabajo del equipo.
- `feature/*`: ramas de funcionalidad creadas siempre a partir de `develop`.

Ejemplos de ramas de trabajo:

- `feature/landing-page-layout`
- `feature/services-and-plans`
- `feature/about-and-contact`
- `feature/responsive-design`

Para crear una nueva rama de funcionalidad:

```bash
git switch develop
git pull origin develop
git switch -c feature/nombre-de-la-funcionalidad
```

Al terminar, realizar commit, publicar la rama y abrir un Pull Request hacia `develop`.

## Consideraciones antes de publicar

- Verificar que los precios de los planes coincidan con la versiÃ³n aprobada por el equipo.
- Reemplazar info@migranja.com si se establece un correo institucional diferente.
- Los enlaces de redes sociales son referencias visuales y deberÃ¡n actualizarse con las cuentas oficiales cuando estÃ©n disponibles.
- El formulario utiliza `mailto:`; por lo que no almacena ni envÃ­a datos a un servidor.
## Guía de contribución y buenas prácticas

1. Todas las ramas de trabajo deben crearse a partir de develop.
2. Seguir la convención de Conventional Commits (feat, fix, docs, style, refactor, perf).
3. Verificar visualmente en navegadores modernos (Chrome, Firefox, Edge) antes de solicitar revisión.
4. No incluir archivos innecesarios ni dependencias locales en el repositorio.
