# Guía de Instalación - Amuleto Bonoloto

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

### 1. Node.js y npm
```bash
# Verificar instalación
node --version  # Debe ser >= 18
npm --version   # Debe ser >= 9
```

**Instalación:**
- Descargar desde: https://nodejs.org/
- Recomendado: Versión LTS (Long Term Support)

### 2. React Native CLI
```bash
npm install -g react-native-cli
```

### 3. Para Android

#### Windows/Linux/macOS:
- **Java Development Kit (JDK)**: JDK 11 o superior
- **Android Studio**: Última versión
- **Android SDK**: API Level 34 (Android 14)
- **Android SDK Build-Tools**: 34.0.0

**Configurar variables de entorno:**
```bash
# Windows (PowerShell)
$env:ANDROID_HOME = "C:\Users\TU_USUARIO\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"

# Linux/macOS (bash/zsh)
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
```

### 4. Para iOS (solo macOS)

- **Xcode**: Versión 14 o superior
- **CocoaPods**: Gestor de dependencias
```bash
sudo gem install cocoapods
```

## Instalación del Proyecto

### Paso 1: Instalar Dependencias

```bash
# En el directorio raíz del proyecto
npm install
```

Este comando instalará todas las dependencias listadas en `package.json`:
- React Native y sus dependencias
- TypeScript y tipos
- SQLite para almacenamiento local
- Sensores para acelerómetro
- Reanimated para animaciones
- React Navigation para navegación
- Jest y fast-check para testing

### Paso 2: Configurar iOS (solo macOS)

```bash
cd ios
pod install
cd ..
```

Este comando instalará las dependencias nativas de iOS usando CocoaPods.

### Paso 3: Verificar Instalación

```bash
# Verificar TypeScript
npx tsc --noEmit

# Ejecutar tests
npm test

# Verificar linter
npm run lint
```

## Ejecución del Proyecto

### Android

#### Opción 1: Usando Android Studio
1. Abrir Android Studio
2. Abrir un emulador Android (AVD)
3. En el terminal del proyecto:
```bash
npm run android
```

#### Opción 2: Usando dispositivo físico
1. Habilitar "Depuración USB" en el dispositivo
2. Conectar el dispositivo por USB
3. Verificar conexión: `adb devices`
4. Ejecutar: `npm run android`

### iOS (solo macOS)

#### Opción 1: Usando simulador
```bash
npm run ios
```

#### Opción 2: Especificar dispositivo
```bash
# iPhone 14 Pro
npm run ios -- --simulator="iPhone 14 Pro"

# iPad Air
npm run ios -- --simulator="iPad Air"
```

#### Opción 3: Dispositivo físico
1. Abrir `ios/AmuletoBonoLoto.xcworkspace` en Xcode
2. Seleccionar tu dispositivo
3. Configurar equipo de desarrollo (Signing & Capabilities)
4. Ejecutar desde Xcode

## Desarrollo

### Iniciar Metro Bundler

El Metro bundler es el servidor de desarrollo que compila el código JavaScript:

```bash
npm start
```

Opciones útiles:
```bash
# Limpiar caché
npm start -- --reset-cache

# Puerto específico
npm start -- --port 8082
```

### Hot Reload

React Native soporta recarga en caliente:
- **Fast Refresh**: Automático al guardar archivos
- **Reload manual**: Presionar `R` dos veces en el emulador
- **Dev Menu**: 
  - Android: `Ctrl + M` (Windows/Linux) o `Cmd + M` (macOS)
  - iOS: `Cmd + D`

## Testing

### Ejecutar Todos los Tests

```bash
npm test
```

### Modo Watch (desarrollo)

```bash
npm run test:watch
```

### Tests Específicos

```bash
# Un archivo específico
npm test -- setup.test.ts

# Tests que coincidan con un patrón
npm test -- --testNamePattern="Validador"

# Con cobertura
npm test -- --coverage
```

### Property-Based Testing

Los tests de propiedades usan `fast-check` y se ejecutan con el mismo comando:

```bash
npm test
```

Ejemplo de test de propiedad:
```typescript
import * as fc from 'fast-check';

it('should validate bet properties', () => {
  fc.assert(
    fc.property(
      fc.uniqueArray(fc.integer(1, 49), {minLength: 6, maxLength: 6}),
      (numbers) => {
        // Propiedad a verificar
        return numbers.length === 6;
      }
    )
  );
});
```

## Solución de Problemas

### Error: "Unable to resolve module"

```bash
# Limpiar caché de Metro
npm start -- --reset-cache

# Limpiar node_modules
rm -rf node_modules
npm install
```

### Error: "SDK location not found" (Android)

Crear archivo `android/local.properties`:
```properties
sdk.dir=C:\\Users\\TU_USUARIO\\AppData\\Local\\Android\\Sdk
```

### Error: "Command PhaseScriptExecution failed" (iOS)

```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Error: Tests fallan con módulos nativos

Los mocks ya están configurados en `jest.setup.js`. Si necesitas agregar más:

```javascript
// jest.setup.js
jest.mock('nombre-del-modulo', () => ({
  // Mock implementation
}));
```

### Error: "ENOSPC: System limit for number of file watchers reached"

Linux solamente:
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Estructura de Archivos Generados

Después de la instalación, verás:

```
node_modules/          # Dependencias (no versionar)
ios/Pods/             # Dependencias iOS (no versionar)
android/build/        # Build Android (no versionar)
android/app/build/    # Build app Android (no versionar)
```

Estos directorios están en `.gitignore` y no deben versionarse.

## Comandos Útiles

```bash
# Limpiar builds
npm run clean  # Si está configurado

# Android
cd android && ./gradlew clean && cd ..

# iOS
cd ios && xcodebuild clean && cd ..

# Reinstalar todo
rm -rf node_modules ios/Pods
npm install
cd ios && pod install && cd ..

# Ver logs
# Android
adb logcat

# iOS
xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "AmuletoBonoLoto"'
```

## Recursos Adicionales

- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)
- [Android Studio Setup](https://developer.android.com/studio)
- [Xcode Setup](https://developer.apple.com/xcode/)
- [Troubleshooting](https://reactnative.dev/docs/troubleshooting)

## Próximos Pasos

Una vez completada la instalación:

1. ✅ Verificar que los tests pasan: `npm test`
2. ✅ Ejecutar la app en un emulador: `npm run android` o `npm run ios`
3. ✅ Revisar la documentación en `docs/SETUP.md`
4. ➡️ Continuar con **Tarea 2**: Implementar modelos de datos e interfaces core
