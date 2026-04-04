# TESTING Y REPARACIONES - AMULETO BONOLOTO

## 🎯 GUÍA DE TESTING EN DISPOSITIVO REAL

### 📱 CHECKLIST DE TESTING INICIAL

#### 🔧 Configuración del Dispositivo
- [ ] Android 7.0+ instalado
- [ ] Conexión a internet estable
- [ ] GPS y sensores activados
- [ ] Almacenamiento disponible
- [ ] Modo desarrollador activado

#### 🎮 Testing de Funcionalidades Principales

##### 📱 Pantalla Principal - Orbe Mágico
- [ ] **Visualización**: Orbe flotando con animaciones
- [ ] **Interacción**: Click en el orbe genera números
- [ ] **Animaciones**: Rayos energéticos girando
- [ ] **Feedback**: Efectos visuales al tocar
- [ ] **Resultados**: 8 predicciones generadas
- [ ] **Guardado**: Apuestas se guardan en localStorage

##### 📏 Mesa Buffon
- [ ] **Visualización**: Mesa con aguja visible
- [ ] **Acelerómetro**: Agita móvil para lanzar
- [ ] **Manual**: Botón de lanzamiento manual
- [ ] **Animaciones**: Aguja girando y cayendo
- [ ] **Resultados**: 8 predicciones generadas
- [ ] **Guardado**: Identificadas como "Mesa Buffon"

##### 📏 Experimento Buffon
- [ ] **Visualización**: 5 líneas paralelas + 5 agujas
- [ ] **Acelerómetro**: Agita móvil para experimento
- [ ] **Manual**: Botón de experimento manual
- [ ] **Animaciones**: Agujas cayendo con física
- [ ] **Resultados**: 8 predicciones generadas
- [ ] **Guardado**: Identificadas como "Experimento Buffon"

##### 🎲 Juego de Dados
- [ ] **Visualización**: Dados 🎲 flotando
- [ ] **Acelerómetro**: Agita móvil para tirar
- [ ] **Manual**: Botón de tirada manual
- [ ] **Animaciones**: Dados rotando (720°)
- [ ] **Resultados**: Dados con ⚀⚁⚂⚃⚄⚅
- [ ] **Guardado**: Identificadas como "Dados de Buffon"

##### 🔮 Altar Esotérico
- [ ] **Visualización**: Cristales flotando + runas
- [ ] **Formulario**: 6 campos mágicos funcionales
- [ ] **Símbolos**: 8 símbolos interactivos
- [ ] **Validación**: Todos los campos requeridos
- [ ] **Consagración**: Efectos visuales al guardar
- [ ] **Algoritmo**: Generación personalizada funcionando

### 🐛 BUGS COMUNES Y SOLUCIONES

#### 📱 Problemas de Acelerómetro
```
PROBLEMA: El acelerómetro no responde
SOLUCIÓN: 
1. Verificar permisos de sensores
2. Activar sensores en configuración
3. Reiniciar la app
4. Probar en modo avión
```

#### 🎲 Problemas de Animaciones
```
PROBLEMA: Las animaciones no funcionan
SOLUCIÓN:
1. Verificar CSS animations support
2. Revisar hardware acceleration
3. Probar en diferentes navegadores
4. Reducir complejidad de animaciones
```

#### 💾 Problemas de Guardado
```
PROBLEMA: Las apuestas no se guardan
SOLUCIÓN:
1. Verificar localStorage disponible
2. Limpiar caché del navegador
3. Revisar cuota de almacenamiento
4. Implementar fallback a cookies
```

#### 📱 Problemas de Responsive
```
PROBLEMA: La UI no se adapta al tamaño
SOLUCIÓN:
1. Revisar media queries CSS
2. Probar en diferentes tamaños
3. Ajustar viewport meta tag
4. Optimizar para móviles
```

### 📊 HERRAMIENTAS DE TESTING

#### 🔧 Chrome DevTools
```javascript
// Console para debugging
console.log('Estado del acelerómetro:', accelerometerActive);
console.log('Apuestas guardadas:', localStorage.getItem('apuestasGuardadas'));
console.log('Datos del altar:', localStorage.getItem('datosAltar'));

// Network para testing offline
// Application para localStorage
// Sensors para acelerómetro
```

#### 📱 Android Debug Bridge
```bash
# Conectar dispositivo
adb devices

# Ver logs de la app
adb logcat | grep "amuleto"

# Inspeccionar webapp
chrome://inspect

# Simular sensores
adb shell am start -a android.intent.action.VIEW -d "file:///path/to/app.html"
```

#### 🌊 Browser Testing
- **Chrome**: Última versión
- **Firefox**: Última versión
- **Safari**: iOS testing
- **Edge**: Windows testing

### 📈 MÉTRICAS DE RENDIMIENTO

#### ⚡ Performance Targets
- **Load time**: < 3 segundos
- **Animation FPS**: > 30 FPS
- **Memory usage**: < 100MB
- **Battery impact**: Mínimo
- **Data usage**: < 1MB por sesión

#### 📊 Google Lighthouse
```javascript
// Performance score: > 90
// Accessibility score: > 95
// Best practices: > 90
// SEO score: > 85
```

### 🔧 REPARACIONES COMUNES

#### 🎨 CSS Fixes
```css
/* Fix para animaciones en móviles */
.orbe-principal {
  will-change: transform;
  backface-visibility: hidden;
  -webkit-transform: translateZ(0);
}

/* Fix para touch events */
.dado, .orbe-principal {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Fix para viewport en móviles */
@viewport {
  width: device-width;
  zoom: 1.0;
}
```

#### 📱 JavaScript Fixes
```javascript
// Fix para acelerómetro
if (window.DeviceMotionEvent) {
  window.addEventListener('devicemotion', handleMotion, { passive: true });
} else {
  // Fallback para desktop
  enableManualMode();
}

// Fix para localStorage
function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage error:', e);
    // Fallback a memoria
    window.tempStorage = window.tempStorage || {};
    window.tempStorage[key] = value;
  }
}

// Fix para animaciones
function requestAnimationFrame(callback) {
  return window.requestAnimationFrame(callback) || 
         window.webkitRequestAnimationFrame(callback) ||
         window.mozRequestAnimationFrame(callback) ||
         function(callback) { return setTimeout(callback, 1000/60); };
}
```

### 📋 REGISTRO DE BUGS

#### 🐛 Template de Reporte
```
FECHA: [DD/MM/YYYY]
DISPOSITIVO: [Modelo y versión Android]
NAVEGADOR: [Versión del navegador]
DESCRIPCIÓN: [Descripción detallada del problema]
PASOS PARA REPRODUCIR:
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]
RESULTADO ESPERADO: [Lo que debería pasar]
RESULTADO ACTUAL: [Lo que pasa realmente]
SEVERIDAD: [Alta/Media/Baja]
SCREENSHOTS: [Adjuntar capturas]
```

#### 📊 Sistema de Tracking
```javascript
// Error tracking
window.addEventListener('error', function(e) {
  logError({
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });
});

// Performance tracking
window.addEventListener('load', function() {
  const loadTime = performance.now();
  logPerformance({
    loadTime: loadTime,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });
});
```

### 🔄 CICLO DE TESTING

#### 📅 Testing Diario
- [ ] Funcionalidades principales
- [ ] Acelerómetro en diferentes dispositivos
- [ ] Guardado y carga de datos
- [ ] Animaciones y efectos visuales
- [ ] Performance general

#### 📅 Testing Semanal
- [ ] Compatibilidad cross-browser
- [ ] Testing en diferentes tamaños de pantalla
- [ ] Testing offline
- [ ] Testing de memoria y batería
- [ ] Testing de usabilidad

#### 📅 Testing Mensual
- [ ] Testing completo de características
- [ ] Testing de rendimiento bajo carga
- [ ] Testing de seguridad
- [ ] Testing de accesibilidad
- [ ] Testing de SEO

### 🚀 OPTIMIZACIONES

#### ⚡ Performance
```javascript
// Lazy loading de imágenes
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      imageObserver.unobserve(img);
    }
  });
});

// Code splitting
const loadModule = async (moduleName) => {
  const module = await import(`./modules/${moduleName}.js`);
  return module.default;
};

// Service Worker para caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('amuleto-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/styles.css',
        '/script.js',
        '/manifest.json'
      ]);
    })
  );
});
```

#### 📱 Optimización Móvil
```css
/* Optimización para móviles */
@media (max-width: 768px) {
  .orbe-principal {
    width: 150px;
    height: 150px;
  }
  
  .altar-container {
    padding: 20px;
    margin: 10px 0;
  }
  
  .dados-container {
    transform: scale(0.8);
  }
}

/* Reducir motion para usuarios con preferencias */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🎯 CHECKLIST DE LANZAMIENTO

### ✅ Pre-Lanzamiento
- [ ] Testing en 5+ dispositivos diferentes
- [ ] Testing en 3+ navegadores
- [ ] Performance > 90 en Lighthouse
- [ ] Sin errores críticos en console
- [ ] Todas las funcionalidades trabajando
- [ ] Backup de datos funcionando
- [ ] Offline mode funcionando
- [ ] Responsive design completo
- [ ] Accesibilidad verificada
- [ ] Seguridad validada

### ✅ Post-Lanzamiento
- [ ] Monitorizar errores en producción
- [ ] Recopilar feedback de usuarios
- [ ] Analizar métricas de uso
- [ ] Optimizar según datos reales
- [ ] Planificar siguientes mejoras

---

## 🚀 ¡TODO PREPARADO PARA TESTING!

Todo está configurado para:
- ✅ Testing inmediato en dispositivos reales
- ✅ Sistema completo de reporte de bugs
- ✅ Herramientas de debugging integradas
- ✅ Métricas de rendimiento automatizadas
- ✅ Ciclo de testing estructurado

**¡Preparado para testing y reparaciones!** 📱🔧✨
