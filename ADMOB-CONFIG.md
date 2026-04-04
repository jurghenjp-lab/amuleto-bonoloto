# CONFIGURACIÓN ADMOB - AMULETO BONOLOTO

## 🎯 UNIDADES DE ANUNCIO PREPARADAS

### 📱 BANNERS (320x50)
```javascript
// Banner Principal - Menú
const BANNER_HOME = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXXXXXXXX'

// Banner Resultados
const BANNER_RESULTADOS = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXXXXXXXX'

// Banner Guardadas
const BANNER_GUARDADAS = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXXXXXXXX'
```

### 🎲 INTERSTITIAL
```javascript
// Interstitial Cambio de Pantalla
const INTERSTITIAL_NAVIGATION = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXXXXXXXX'

// Interstitial Resultados Especiales
const INTERSTITIAL_SPECIAL = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXXXXXXXX'
```

### 💰 REWARDED
```javascript
// Rewarded Predicciones Premium
const REWARDED_PREMIUM = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXXXXXXXX'

// Rewarded Análisis Avanzado
const REWARDED_ANALYSIS = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXXXXXXXX'
```

## 🚀 IMPLEMENTACIÓN REACT NATIVE

### 📦 Instalación
```bash
npm install react-native-admob
npm install @react-native-firebase/app
npm install @react-native-firebase/admob
```

### 🔧 Configuración Android
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<application>
    <meta-data
        android:name="com.google.android.gms.ads.APPLICATION_ID"
        android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXXXXXXXX"/>
</application>
```

### 🔧 Configuración iOS
```xml
<!-- ios/YourApp/Info.plist -->
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXXXXXXXX</string>
```

## 🎯 COMPONENTES DE ANUNCIOS

### 📱 Banner Component
```javascript
import { AdBanner } from './components/AdBanner';

const BannerHome = () => (
  <AdBanner 
    adUnitId={BANNER_HOME}
    size="BANNER"
    onAdLoaded={() => console.log('Banner cargado')}
    onAdFailed={() => console.log('Banner fallido')}
  />
);
```

### 🎲 Interstitial Component
```javascript
import { AdInterstitial } from './components/AdInterstitial';

const NavigationAd = () => (
  <AdInterstitial 
    adUnitId={INTERSTITIAL_NAVIGATION}
    onAdLoaded={() => console.log('Interstitial cargado')}
    onAdClosed={() => console.log('Interstitial cerrado')}
  />
);
```

### 💰 Rewarded Component
```javascript
import { AdRewarded } from './components/AdRewarded';

const PremiumPredictions = () => (
  <AdRewarded 
    adUnitId={REWARDED_PREMIUM}
    onAdLoaded={() => console.log('Rewarded cargado')}
    onUserEarnedReward={(reward) => {
      console.log('Usuario ganó:', reward);
      // Desbloquear predicciones premium
    }}
  />
);
```

## 🎯 ESTRATEGIA DE ANUNCIOS

### 📱 Banner Strategy
- **Menú Principal**: Siempre visible
- **Resultados**: Después de generar apuestas
- **Guardadas**: En lista de apuestas guardadas

### 🎲 Interstitial Strategy
- **Cambio de pantalla**: Cada 3-4 cambios
- **Resultados especiales**: Después de predicciones múltiples
- **Acciones importantes**: Guardar apuestas

### 💰 Rewarded Strategy
- **Predicciones Premium**: 8 apuestas extra
- **Análisis Avanzado**: Estadísticas detalladas
- **Funciones Especiales**: Motores algorítmicos avanzados

## 🔧 CONFIGURACIÓN DE PRUEBAS

### 📱 Dispositivos de Prueba
```javascript
// Para testing
const testDevices = [
  'EMULATOR', // Emulador
  'YOUR_DEVICE_ID', // Tu dispositivo real
];

// Configuración de prueba
AdMob.setRequestConfiguration({
  testDeviceIDs: testDevices,
});
```

### ⚠️ Modo Debug
```javascript
// Activar modo de prueba
if (__DEV__) {
  AdMob.setTestDeviceID(['EMULATOR']);
}
```

## 📊 MÉTRICAS Y ANALÍTICA

### 📈 Seguimiento
```javascript
// Eventos de anuncios
import analytics from '@react-native-firebase/analytics';

analytics().logAdImpression({
  ad_unit_id: BANNER_HOME,
  ad_format: 'banner',
  currency: 'EUR',
  value: 0.01,
});

analytics().logAdClick({
  ad_unit_id: BANNER_HOME,
  ad_format: 'banner',
  currency: 'EUR',
  value: 0.05,
});
```

### 📊 Reporte
```javascript
// Reporte de ingresos
const reportAdRevenue = (adUnitId, revenue) => {
  analytics().logAdImpression({
    ad_unit_id: adUnitId,
    ad_format: 'banner',
    currency: 'EUR',
    value: revenue,
  });
};
```

## 🚀 OPTIMIZACIÓN

### ⚡ Rendimiento
- **Carga asíncrona**: No bloquear UI
- **Cache de anuncios**: Pre-cargar interstitials
- **Frequency capping**: Limitar anuncios por sesión
- **Ad refresh**: Cada 30-60 segundos para banners

### 🎯 UX
- **Timing estratégico**: No interrumpir acciones importantes
- **Loading states**: Mostrar indicadores de carga
- **Error handling**: Manejar fallos de anuncios
- **Premium option**: Opción para remover anuncios

## 📋 CHECKLIST PUBLICACIÓN

### ✅ Pre-Lanzamiento
- [ ] Configurar IDs de AdMob
- [ ] Implementar componentes de anuncios
- [ ] Testing en dispositivos reales
- [ ] Verificar política de AdMob
- [ ] Configurar Analytics

### ✅ Post-Lanzamiento
- [ ] Monitorear rendimiento
- [ ] Optimizar eCPM
- [ ] A/B testing de estrategias
- [ ] Actualizar según feedback

## 🔥 PRO TIPS

### 💡 Mejores Prácticas
1. **No saturar**: Máximo 3 anuncios por sesión
2. **Contexto relevante**: Anuncios relacionados con lotería
3. **Timing perfecto**: Después de acciones exitosas
4. **Premium value**: Ofrecer valor real sin anuncios

### 🚀 Monetización Inteligente
1. **Fase 1**: Banners + Interstitials básicos
2. **Fase 2**: Rewarded para funciones premium
3. **Fase 3**: Anuncios nativos y personalizados
4. **Fase 4**: Partnerships con loterías

---

## 🎯 LISTO PARA TESTING

Todo está preparado para:
- ✅ Testing inmediato en dispositivo
- ✅ Debug de anuncios
- ✅ Optimización de rendimiento
- ✅ Publicación en Google Play

**¡Preparado para empezar a monetizar!** 🚀💰📱
