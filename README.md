# Appmovil

Aplicación Expo para autenticación, dashboard de usuarios y uso de almacenamiento seguro con cache offline.

## Requisitos previos

Antes de iniciar, asegúrate de tener instalado:

- Node.js 20+
- npm o yarn
- Expo CLI
- Android Studio + emulador Android, o iOS Simulator
- Git

## 1. Clonar e instalar dependencias

```bash
git clone <url-del-repositorio>
cd Appmovil
npm install
```

Si prefieres usar Expo CLI globalmente:

```bash
npm install -g expo-cli
```

## 2. Configurar variables de entorno

Copia el archivo de ejemplo y completa los valores reales:

```bash
copy .env.example .env
```

El archivo `.env` debe incluir al menos:

```env
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=tu-android-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=tu-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=tu-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

## 3. Ejecutar la app

### Web

```bash
npm run web
```

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

### Expo dev server

```bash
npx expo start
```

## 4. Librerías principales instaladas

- expo
- expo-router
- expo-location
- expo-secure-store
- expo-auth-session
- expo-web-browser
- firebase
- @react-native-async-storage/async-storage
- react-native
- react
- typescript

## 5. Flujo principal de la app

La aplicación usa:

- login con email/password mediante ReqRes para la prueba
- almacenamiento seguro del token en `expo-secure-store`
- sesión persistente al reiniciar la app
- listado de usuarios desde la API `randomuser.me`
- búsqueda por nombre o email
- caché local con `AsyncStorage`
- geolocalización para ordenar usuarios por cercanía

## 6. Buenas prácticas

- No subas el archivo `.env` al repositorio.
- Mantén los valores de Google y Firebase en variables de entorno.
- Revisa permisos de ubicación en Android/iOS si usas geolocalización.
- Si cambian dependencias, vuelve a instalar con:

```bash
npm install
```

## 7. Comandos útiles

```bash
npx expo start
npx expo install expo-location expo-secure-store
npx tsc --noEmit
npm run android
npm run web
```

## 8. Estructura del proyecto

```text
Appmovil/
├── src/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── screens/
│   └── lib/
├── assets/
├── .env.example
├── .env
├── app.json
├── package.json
├── README.md
└── tsconfig.json
```

## 9. Problemas comunes

- La app no inicia: revisa que Node y dependencias estén instaladas correctamente.
- Error de variables de entorno: verifica que `.env` exista y tenga los nombres correctos.
- Google/Firebase no funciona: confirma que el proyecto esté activo y los Client IDs estén bien configurados.
- Permisos de ubicación: acepta los permisos al ejecutar en el emulador o dispositivo físico.

## 10. Licencia

Este proyecto está bajo licencia del repositorio original.
