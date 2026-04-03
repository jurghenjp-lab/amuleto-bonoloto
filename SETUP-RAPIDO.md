# Estado del Proyecto - Amuleto Bonoloto

## Lo que funciona
- 262/262 tests pasando
- Node.js 24 instalado
- JDK 17 (Adoptium) instalado en `C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot`
- Android Studio instalado
- ANDROID_HOME = `C:\Users\USER\AppData\Local\Android\Sdk`
- JAVA_HOME = `C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot`
- Android SDK 34 instalado
- Gradlew generado en `android/gradle/wrapper/`
- Metro arranca con `npx react-native start`
- Emulador: Medium_Phone_API_36.0

## Pendiente
- Subir a GitHub

## El problema actual
Resuelto: Build de Android funcionando, app visible en emulador.

## Para arrancar la app (cuando vuelvas)
1. Abre una cmd y arranca Metro:
```
cd C:\dev-lab\proyectos\amuleto
npx react-native start
```
2. Abre otra cmd y ejecuta:
```
npx react-native run-android
```
3. Asegúrate de que el emulador está corriendo en Android Studio

## Para subir a GitHub
```
git init
git add .
git commit -m "primer commit"
git remote add origin <url-de-tu-repo>
git push -u origin main
```

## Variables de entorno configuradas
- ANDROID_HOME = `C:\Users\USER\AppData\Local\Android\Sdk`
- JAVA_HOME = `C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot`
- Path añadido:
  - `C:\Users\USER\AppData\Local\Android\Sdk\platform-tools`
  - `C:\Users\USER\AppData\Local\Android\Sdk\emulator`
  - `C:\Gradle\gradle-8.0.1\bin` (o la ruta donde instalaste Gradle)
