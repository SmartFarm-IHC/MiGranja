# MiGranja – Landing Page

Landing page informativa de **Mi Granja**, una solución digital propuesta por SmartFarm para centralizar y organizar la información de animales y lotes de una unidad ganadera.

## Información del proyecto

SmartFarm es una startup académica integrada por estudiantes de Ingeniería de Software e Ingeniería de Sistemas de Información de la Universidad Peruana de Ciencias Aplicadas (UPC). Su propuesta, MiGranja, busca facilitar la gestión ganadera mediante una plataforma sencilla y accesible que permite registrar y consultar información del ganado de manera eficiente.

La landing page presenta la propuesta de valor, los servicios, los planes y la información institucional de SmartFarm.

## Autores

- Albino Florencio Cáceres Pizarro — U201923820
- Arian Andre Casas Milla — U202521438
- Santiago Luis Ñahui Arroyo — U202320691
- Mathias Joshua Rodrigo Oscanoa Ingaruca — U202126131
- Scarlet Josefina Rivera Aguilar — U20241F577
- José Gabriel Rudas Chavarría — U202410062

## Segmentos objetivo

### 1. Productores y propietarios ganaderos

Personas responsables de supervisar animales y lotes, consultar historiales y tomar decisiones sobre la operación ganadera. Requieren información organizada y accesible para conocer el estado de su ganado.

### 2. Administradores y encargados de granjas

Usuarios responsables de las actividades operativas y del registro de información. Necesitan registrar y consultar alimentación, vacunación, ubicación y movimientos de los animales de manera práctica.

## Características principales

- Registro y consulta de animales mediante un código individual.
- Creación, organización y consulta de lotes.
- Registro de alimentación y vacunación, de forma individual o por lote.
- Registro de ubicación y movimientos entre corrales y potreros.
- Consulta del historial integral de animales y lotes.
- Recordatorios de actividades y reportes básicos.
- Gestión de la información desde dispositivos existentes, sin depender de sensores o GPS.

## Secciones de la landing page

- **Inicio:** propuesta de valor de MiGranja y accesos principales.
- **Servicios:** gestión de animales, lotes, alimentación, vacunación, ubicación y movimientos.
- **Planes:** Básico, Pro y Premium, de acuerdo con el mock-up del proyecto.
- **Quiénes somos:** descripción de SmartFarm, misión, visión y valores.
- **Contáctanos:** formulario de consulta que prepara un mensaje mediante el cliente de correo del usuario.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (ES6)
- Google Fonts
- Font Awesome (CDN)

No se utilizan frameworks CSS ni frameworks de JavaScript.

## Estructura del proyecto

```text
migranja-landing-page/
├── .gitignore
├── README.md
└── public/
    ├── index.html
    ├── favicon.ico
    └── assets/
        ├── images/
        │   ├── about-cattle.jpg
        │   ├── brand-symbol.svg
        │   ├── feeding-cattle.jpg
        │   └── hero-farm.jpg
        ├── scripts/
        │   └── main.js
        └── styles/
            └── styles.css
```

## Ejecución local

1. Abrir la carpeta del proyecto en WebStorm.
2. Abrir `public/index.html` en el navegador o ejecutarlo mediante el servidor de desarrollo integrado de WebStorm.
3. Verificar que se carguen los estilos, scripts e imágenes desde `public/assets/`.

No se requiere instalar dependencias ni ejecutar un proceso de compilación.

## GitFlow sugerido

Ramas principales:

- `main`: versión estable del proyecto.
- `develop`: integración del trabajo del equipo.
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

- Verificar que los precios de los planes coincidan con la versión aprobada por el equipo.
- Reemplazar info@migranja.com si se establece un correo institucional diferente.
- Los enlaces de redes sociales son referencias visuales y deben cambiarse por las cuentas oficiales cuando estén disponibles.
- El formulario utiliza `mailto:`; no almacena ni envía datos a un servidor.
