# Appmovil

Aplicacion movil creada con Expo SDK 57, React Native y TypeScript.

Repositorio GitHub: `git@github.com:santymm95/technical_test.git`

## Objetivo

Crear una aplicacion movil para consultar y gestionar usuarios desde una interfaz sencilla, segura y adaptable. La aplicacion integra funcionalidades nativas del dispositivo para enriquecer la informacion de cada usuario y facilitar su uso diario.

## Mision

Ofrecer una experiencia movil practica para consultar usuarios, personalizar sus fotos de perfil, conocer la ubicacion actual y organizar actividades, manteniendo la sesion y la informacion local de forma segura.

## Funciones principales

- Inicio de sesion mediante API o modo de prueba.
- Persistencia de la sesion entre reinicios usando `expo-secure-store`.
- Consulta de usuarios desde la API de Random User.
- Busqueda por nombre o correo electronico.
- Carga progresiva, actualizacion manual y uso de datos en cache sin conexion.
- Cambio de foto mediante camara o galeria.
- Consulta de permisos nativos y manejo de rechazo, cancelacion y errores.
- Geolocalizacion del dispositivo con ciudad, pais y coordenadas.
- Ordenamiento de usuarios por distancia.
- Consulta del clima segun la ubicacion actual.
- Calendario para crear, editar y eliminar eventos.
- Modo claro y modo oscuro persistentes.
- Navegacion entre secciones mediante botones o gestos horizontales.

## Gestiones de la aplicacion

- Gestion de usuarios: consultar, buscar, actualizar fotos y revisar distancia.
- Gestion de perfil: cambiar la imagen de perfil y aplicar los cambios.
- Gestion de ubicacion: solicitar permisos, obtener coordenadas y resolver ciudad y pais.
- Gestion de eventos: crear eventos en una fecha, editarlos y eliminarlos.
- Gestion de sesion: iniciar sesion, recuperar el token y cerrar sesion.
- Gestion de preferencias: conservar el modo claro u oscuro seleccionado.
- Gestion de errores: mostrar mensajes cuando fallan las APIs, los permisos, la red o el almacenamiento.

## Mejoras futuras

- Conectar el cambio de foto con almacenamiento remoto para sincronizarla entre dispositivos.
- Agregar validacion de formularios y recuperacion de contrasena.
- Incorporar filtros por ciudad, estado y distancia.
- Permitir multiples eventos, recordatorios y notificaciones del calendario.
- Agregar pruebas automatizadas para autenticacion, permisos y persistencia.
- Mejorar la accesibilidad con etiquetas, contraste y soporte para lectores de pantalla.
- Incorporar paginacion controlada y reintentos para las consultas de red.
- Añadir analiticas y monitoreo de errores en produccion.

## Descargar el proyecto

Requiere una clave SSH configurada en GitHub:

```bash
git clone git@github.com:santymm95/technical_test.git
cd technical_test
```

## Requisitos

- Node.js LTS, que incluye `npm` y `npx`.
- Android Studio y un SDK de Android para usar el emulador o compilar una app nativa.
- Expo Go instalado en el dispositivo fisico si se usara Expo Go.
- El ordenador y el dispositivo fisico deben estar en la misma red Wi-Fi para conectar con Expo Go.

## Instalacion de Expo y dependencias

1. Instala Node.js LTS desde https://nodejs.org/. Node.js incluye `npm` y `npx`.
2. Comprueba que esten disponibles:

```bash
node --version
npm --version
npx --version
```

Expo ya esta incluido localmente en el proyecto mediante la dependencia `expo` de la version SDK 57. No es necesario instalar Expo de forma global. Desde la carpeta del proyecto ejecuta:

```bash
npm install
```

Este comando instala Expo, React Native y todas las librerias indicadas en `package.json`.

Para comprobar que las librerias son compatibles con Expo SDK 57:

```bash
npx expo install --check
```

Si Expo indica paquetes desincronizados, sincroniza automaticamente sus versiones compatibles con:

```bash
npx expo install --fix
```

Despues de instalar o sincronizar dependencias, inicia el servidor con:

```bash
npx expo start
```

## Ejecutar con Expo Go

El comando `npx expo start` abre el servidor de desarrollo de Expo y muestra un codigo QR y los accesos disponibles.

Luego:

- Escanea el codigo QR desde Expo Go en un dispositivo Android o iOS.
- Pulsa `a` en la terminal para abrir el proyecto en un emulador Android conectado.
- Pulsa `w` para abrir la version web.

La camara y la geolocalizacion deben probarse en un dispositivo fisico para obtener el comportamiento nativo completo.

## Ejecutar en emulador Android

Inicia un emulador desde Android Studio y ejecuta:

```bash
npx expo run:android
```

Este comando compila e instala la aplicacion nativa. Para probar la ubicacion en el emulador, activa la ubicacion del dispositivo y establece una ubicacion desde los controles del emulador.

## Ejecutar en dispositivo fisico

Conecta el dispositivo por USB con la depuracion USB habilitada, o usa un dispositivo disponible por ADB, y ejecuta:

```bash
npx expo run:android
```

Tambien puedes usar Expo Go con `npx expo start` y escanear el codigo QR. La primera vez que se use cada funcionalidad, el sistema solicitara los permisos correspondientes.

## Funcionalidades nativas implementadas

### Camara y galeria

Se utiliza `expo-image-picker` para:

- Solicitar permiso de camara al pulsar **Tomar foto**.
- Solicitar permiso de fotos al pulsar **Elegir foto de la galeria**.
- Abrir la camara o el selector de imagen solo despues de obtener el permiso.
- Manejar permiso rechazado, cancelacion, camara no disponible y errores al guardar la foto.

### Geolocalizacion

Se utiliza `expo-location` para:

- Solicitar permiso de ubicacion en primer plano.
- Obtener las coordenadas actuales.
- Mostrar ciudad y pais mediante geocodificacion inversa.
- Ordenar usuarios por distancia y consultar el clima de la ubicacion.

### Sesion segura

El token de sesion se transforma con SHA-256 y se guarda usando `expo-secure-store`, no en texto plano. La sesion se recupera al reiniciar la aplicacion y se elimina al cerrar sesion.

## Permisos

Si un permiso ya fue aceptado, Android no mostrara nuevamente el dialogo. Para probarlo otra vez, ve a **Ajustes > Aplicaciones > Appmovil > Permisos** y cambia el permiso de camara, fotos o ubicacion.

Los permisos configurados son:

- Camara.
- Fotos o almacenamiento de imagenes.
- Ubicacion precisa y aproximada.

## Comandos utiles

```bash
npx tsc --noEmit
npx expo config --type public
npx expo export --platform android
npm run lint
```
