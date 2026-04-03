# 🎱 Amuleto Bonoloto

Aplicación móvil multiplataforma que genera apuestas para la lotería Bonoloto española mediante tres motores algorítmicos: análisis estadístico histórico, simulación de la Aguja de Buffon, y personalización basada en datos del usuario.

## ✨ Características

- **Motor Histórico**: Análisis estadístico de resultados pasados (números calientes y fríos)
- **Motor Buffon**: Simulación matemática basada en el experimento de la Aguja de Buffon
- **Motor Amuleto**: Generación personalizada usando signo zodiacal, color favorito y equipo de fútbol
- **Interfaz intuitiva**: Diseño místico moderno con paleta dorada (#D4AF37) sobre fondo oscuro (#0B0E14)
- **Almacenamiento local**: Guarda tus apuestas favoritas con SQLite
- **Resultados oficiales**: Consulta los últimos sorteos de Bonoloto
- **Aviso legal**: Cumplimiento normativo con disclaimer y términos de uso

## 🚀 INSTALACIÓN Y EJECUCIÓN

### Opción 1: Versión Web (Recomendada - Funciona 100%)
1. **Abre el archivo** `web-version.html` en tu navegador
2. **Listo** - Sin instalación, sin configuración, sin problemas

### Opción 2: Versión Móvil (React Native)
#### Requisitos Previos
- **Node.js** >= 18
- **Android Studio** con SDK configurado
- **Variables de entorno configuradas** (ver sección de solución de problemas)

#### Pasos de instalación
```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd amuleto-bonoloto

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (CRÍTICO)
# En Windows (PowerShell):
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot", "User")
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\USER\AppData\Local\Android\Sdk", "User")

# 4. Iniciar Metro Bundler
npm start

# 5. Ejecutar en Android (en otra terminal)
npm run android
```

## 🎯 ESTRUCTURA DE LA APLICACIÓN

### Pantallas Principales
1. **🎱 El Orbe** - Pantalla principal para generar apuestas
2. **📏 Mesa de Buffon** - Simulación de agujas matemáticas
3. **⭐ Altar de Datos** - Configuración personal del Motor Amuleto
4. **📊 Resultados** - Últimos sorteos oficiales
5. **💾 Apuestas Guardadas** - Historial y favoritas

### Motores de Generación
- **Motor Histórico**: Usa análisis estadístico de sorteos pasados
- **Motor Buffon**: Simulación matemática pura
- **Motor Amuleto**: Personalizado según datos del usuario (zodiaco, color, equipo)

## 🛠️ SOLUCIÓN DE PROBLEMAS (Nuestra Aventura)

### 📋 Diagnóstico de Problemas Comunes

#### ❌ Problema: Java Exception - `No encontr class "com.amuletobonoloto.MainApplication"`
**Causa**: Mezcla de archivos Java y Kotlin en el proyecto Android
**Solución**: Usar solo archivos Kotlin existentes, eliminar archivos Java duplicados

#### ❌ Problema: Variables de entorno vacías
**Síntomas**: 
```
JAVA_HOME: (vacío)
ANDROID_HOME: (vacío)
```
**Solución**: 
```powershell
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot", "User")
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\USER\AppData\Local\Android\Sdk", "User")
```

#### ❌ Problema: App se cierra inmediatamente (crash al inicio)
**Causa**: Permisos faltantes para el acelerómetro y sensores
**Solución**: Añadir permisos en AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

#### ❌ Problema: Gradle build falla con PackageList error
**Causa**: Configuración incorrecta de React Native 0.73 con Gradle
**Solución**: Modificar settings.gradle para evitar conflictos

### 🏆 Cronología de Nuestra Caza de Errores

1. **14:30** - "No sé qué hacer, la app no funciona"
2. **14:45** - Detectado: Variables de entorno configuradas incorrectamente
3. **15:00** - Encontrado: Java Exception por clase MainApplication faltante
4. **15:15** - Solucionado: Permisos de acelerómetro añadidos
5. **15:30** - Creado: Versión web completa como alternativa
6. **15:45** - **¡ÉXITO!** - Versión web funcionando 100%

### 📊 Lecciones Aprendidas

- **Variables de entorno son CRÍTICAS** en React Native
- **La versión web es un excelente plan B**
- **Los permisos de Android pueden causar crashes silenciosos**
- **Kotlin vs Java requiere consistencia**
- **Nunca te rindas con los builds de React Native**

## 🌐 VERSIÓN WEB COMPLETA

### Características de la Versión Web
- ✅ **100% funcional** - Todas las características del móvil
- ✅ **Base de datos local** con localStorage
- ✅ **Animaciones y efectos** místicos
- ✅ **Diseño responsive** para cualquier dispositivo
- ✅ **Sin instalación** - Abrir y usar

### Archivos Principales
- `web-version.html` - Aplicación web completa
- `src/` - Código React Native original
- `android/` - Código nativo Android

## 📱 COMPATIBILIDAD

### Versiones Soportadas
- **React Native**: 0.73.2
- **Node.js**: >= 18
- **Android**: API 21+
- **Navegadores**: Chrome, Firefox, Safari, Edge

### Dispositivos Probados
- ✅ **Windows** - Versión web
- ✅ **Android** - APK (cuando compila correctamente)
- ✅ **Móvil físico** - Con permisos configurados

## 🔄 DESARROLLO FUTURO

### Próximas Mejoras
- [ ] **Modo oscuro/claro** automático
- [ ] **Notificaciones** de nuevos sorteos
- [ ] **Estadísticas personales** de aciertos
- [ ] **Compartir apuestas** por WhatsApp
- [ ] **Más motores** de generación
- [ ] **Integración con API** de resultados oficiales

### Ideas para el APK
- [ ] **Optimización** de build para Android
- [ ] **Firma digital** para distribución
- [ ] **Publicación en Google Play**
- [ ] **Versión iOS** (requiere macOS)

## 🤝 CONTRIBUCIÓN

### ¿Cómo Contribuir?
1. **Reporta errores** en Issues
2. **Suger mejoras** en Discussions
3. **Haz fork** y crea Pull Requests
4. **Prueba la versión web** y reporta bugs

### Estilo de Código
- **TypeScript** para tipado fuerte
- **Componentes funcionales** de React
- **Estilos consistentes** con la paleta mística
- **Comentarios descriptivos** en código complejo

## 📄 LICENCIA

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## ⚠️ AVISO LEGAL

Esta aplicación genera números aleatorios con fines de entretenimiento. No garantiza premios ni resultados. El juego puede crear adicción. Juega con responsabilidad. Solo para mayores de 18 años.

## 📞 SOPORTE

### ¿Necesitas Ayuda?
- **Issues de GitHub**: Reporta problemas técnicos
- **Discussions**: Sugerencias y preguntas generales
- **Email**: [tu-email-de-soporte]

### Tiempos de Respuesta
- **Issues críticos**: 24 horas
- **Preguntas generales**: 48 horas
- **Sugerencias**: 1 semana

---

## 🎉 ¡GRACIAS POR LEER!

**Este README documenta no solo cómo usar la app, sino nuestra increíble aventura resolviendo problemas.**

**De "no funciona" a "100% funcional" - ¡Eso es desarrollo de software!**

**Desarrollado con ❤️ y mucha persistencia para los amantes de la Bonoloto**

---

*Última actualización: 3 de abril de 2026*  
*Versión: 1.0.0 - Web funcional completa*

## 📋 Requisitos Previos

### Generales
- **Node.js** >= 18 ([Descargar aquí](https://nodejs.org/))
- **npm** o **yarn** (viene con Node.js)

### Para Android
- **Android Studio** ([Descargar aquí](https://developer.android.com/studio))
- **Android SDK** (se instala con Android Studio)
- **Java Development Kit (JDK)** 11 o superior
- Emulador Android configurado o dispositivo físico con USB debugging habilitado

### Para iOS (solo macOS)
- **Xcode** 12 o superior ([Descargar desde App Store](https://apps.apple.com/app/xcode/id497799835))
- **CocoaPods** (gestor de dependencias para iOS)
- **Xcode Command Line Tools**

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd amuleto-bonoloto
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configuración específica para iOS (solo macOS)
```bash
cd ios
pod install
cd ..
```

## 🏃 Ejecutar la Aplicación

### Iniciar Metro Bundler (servidor de desarrollo)
En una terminal:
```bash
npm start
```

### Ejecutar en Android
En otra terminal (con Metro corriendo):
```bash
npm run android
```

**Nota**: Asegúrate de tener un emulador Android corriendo o un dispositivo físico conectado.

### Ejecutar en iOS (solo macOS)
```bash
npm run ios
```

**Nota**: La primera vez puede tardar varios minutos mientras se compila.

## 🧪 Testing

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests en modo watch
```bash
npm run test:watch
```

### Tests incluidos
- **Tests unitarios**: Verifican funcionalidad específica de cada componente
- **Property-based tests**: Validan propiedades universales con fast-check (100+ iteraciones)
- **Tests de integración**: Verifican interacción entre componentes

## 📁 Estructura del Proyecto

```
amuleto-bonoloto/
├── src/
│   ├── types/              # Tipos TypeScript compartidos
│   ├── domain/             # Lógica de negocio
│   │   ├── engines/        # Motores de generación (Histórico, Buffon, Amuleto)
│   │   ├── validators/     # Validadores de apuestas
│   │   └── interfaces/     # Interfaces de dominio
│   ├── infrastructure/     # Servicios externos
│   │   ├── api/           # Cliente API Bonoloto
│   │   ├── database/      # SQLite (apuestas, configuración, caché)
│   │   └── sensors/       # Servicio de acelerómetro
│   ├── application/        # Coordinación de lógica
│   │   └── coordinators/  # Coordinador de motores
│   ├── presentation/       # UI Components
│   │   ├── screens/       # Pantallas (Orbe, Mesa Buffon, Altar, etc.)
│   │   └── components/    # Componentes reutilizables
│   └── navigation/         # Configuración de navegación
├── android/                # Código nativo Android
├── ios/                    # Código nativo iOS
├── .kiro/                  # Especificaciones y diseño
│   └── specs/
│       └── amuleto-bonoloto/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
└── docs/                   # Documentación adicional
```

## 🎨 Arquitectura

La aplicación sigue una **arquitectura en capas** con separación clara de responsabilidades:

1. **Capa de Presentación**: Componentes React Native
2. **Capa de Aplicación**: Coordinadores y orquestación
3. **Capa de Dominio**: Lógica de negocio (motores, validadores)
4. **Capa de Infraestructura**: Servicios externos (API, base de datos, sensores)

### Patrones de Diseño
- **Strategy Pattern**: Para los motores de generación intercambiables
- **Repository Pattern**: Para abstracción de persistencia
- **Service Layer**: Para comunicación con API externa

## 🔧 Scripts Disponibles

```bash
npm start          # Inicia Metro bundler
npm run android    # Ejecuta en Android
npm run ios        # Ejecuta en iOS (solo macOS)
npm test           # Ejecuta tests
npm run test:watch # Ejecuta tests en modo watch
npm run lint       # Ejecuta ESLint
```

## 📱 Uso de la Aplicación

### 1. Pantalla Principal - El Orbe
- Toca el orbe dorado brillante
- Selecciona el número de columnas (1-8)
- Elige el motor para cada columna
- Genera tus apuestas

### 2. Configurar Motor Amuleto
- Ve al "Altar de Datos"
- Ingresa tu signo zodiacal
- Selecciona tu color favorito
- Escribe tu equipo de fútbol favorito
- Guarda la configuración

### 3. Ver Resultados Oficiales
- Consulta los últimos sorteos de Bonoloto
- Visualiza la combinación ganadora
- Revisa la distribución de premios

### 4. Apuestas Guardadas
- Guarda tus combinaciones favoritas
- Revisa el historial de apuestas generadas
- Elimina apuestas antiguas

## ⚠️ Aviso Legal

Esta aplicación genera números aleatorios con fines de entretenimiento. No garantiza premios ni resultados. El juego puede crear adicción. Juega con responsabilidad. Solo para mayores de 18 años.

## 🛠️ Tecnologías Utilizadas

- **React Native** 0.73.2 - Framework multiplataforma
- **TypeScript** 5.0.4 - Tipado estático
- **React Navigation** - Navegación entre pantallas
- **SQLite** - Base de datos local
- **Jest** - Framework de testing
- **fast-check** - Property-based testing
- **React Native Sensors** - Acceso al acelerómetro
- **React Native Reanimated** - Animaciones fluidas

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## � Build Fixes (Resueltos)

Durante la configuración inicial del proyecto React Native 0.73, se encontraron y resolvieron los siguientes problemas:

### Problemas Resueltos
1. **Plugin Gradle incompatible**: El `android/build.gradle` usaba la sintaxis antigua `apply plugin: "com.facebook.react.rootproject"`. Se actualizó a la nueva sintaxis `plugins { id("com.facebook.react") }` para React Native 0.73.

2. **Versión de Build Tools**: El `buildToolsVersion` estaba configurado en "34.0.0", pero el SDK instalado tenía "33.0.1". Se cambió a "33.0.1" para compatibilidad.

3. **JDK incorrecto**: El `JAVA_HOME` apuntaba a JDK 11, pero React Native 0.73 requiere JDK 17. Se configuró `JAVA_HOME` al JDK 17 de Adoptium.

4. **Keystore de debug faltante**: El archivo `android/app/debug.keystore` no existía. Se generó usando `keytool` con las credenciales estándar de debug.

5. **Política de ejecución de PowerShell**: En Windows, la ejecución de scripts estaba deshabilitada. Se cambió la política a `RemoteSigned` para el usuario actual.

### Comandos utilizados para las correcciones
- `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- `keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"`
- `cd android; .\gradlew clean`

Después de estos cambios, el build de Android funciona correctamente y la app se instala en el emulador.

## �📞 Soporte

Si encuentras algún problema o tienes preguntas:
- Abre un issue en GitHub
- Revisa la documentación en `/docs`
- Consulta las especificaciones en `.kiro/specs/amuleto-bonoloto/`

## 🎯 Roadmap

- [ ] Modo oscuro/claro
- [ ] Notificaciones de sorteos
- [ ] Estadísticas personales
- [ ] Compartir apuestas
- [ ] Más motores de generación
- [ ] Integración con redes sociales

---

**Desarrollado con ❤️ para los amantes de la Bonoloto**
"# amuleto" 
"# amuleto" 
"# amuletov2" 
