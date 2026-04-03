# Configuración del Proyecto - Amuleto Bonoloto

## Resumen de la Tarea 1

Esta tarea ha configurado la estructura completa del proyecto React Native con TypeScript, incluyendo:

### ✅ Estructura del Proyecto

```
amuleto-bonoloto/
├── src/
│   ├── types/              # Definiciones de tipos TypeScript
│   ├── domain/             # Lógica de negocio
│   │   ├── interfaces/     # Interfaces y contratos
│   │   ├── engines/        # Motores de generación
│   │   └── validators/     # Validadores
│   ├── application/        # Capa de aplicación
│   │   └── coordinators/   # Coordinadores
│   ├── infrastructure/     # Servicios externos
│   │   ├── api/           # Cliente API
│   │   ├── database/      # SQLite
│   │   └── sensors/       # Acelerómetro
│   └── presentation/       # UI
│       ├── screens/       # Pantallas
│       └── components/    # Componentes
├── android/               # Configuración Android
├── ios/                   # Configuración iOS
└── __tests__/            # Tests
```

### ✅ Dependencias Instaladas

#### Dependencias de Producción
- **react-native**: 0.73.2 - Framework principal
- **react-native-sqlite-storage**: ^6.0.1 - Base de datos local
- **react-native-sensors**: ^7.3.6 - Acceso al acelerómetro
- **react-native-reanimated**: ^3.6.1 - Animaciones de alto rendimiento
- **react-native-gesture-handler**: ^2.14.1 - Gestos táctiles
- **@react-navigation/native**: ^6.1.9 - Navegación
- **@react-navigation/stack**: ^6.3.20 - Stack navigator

#### Dependencias de Desarrollo
- **typescript**: 5.0.4 - Tipado estático
- **jest**: ^29.2.1 - Framework de testing
- **fast-check**: ^3.15.0 - Property-based testing
- **@types/jest**: ^29.2.1 - Tipos para Jest
- **@types/react**: ^18.2.6 - Tipos para React
- **eslint**: ^8.19.0 - Linter
- **prettier**: ^2.8.8 - Formateador de código

### ✅ Configuración de Testing

#### Jest
- Configurado en `jest.config.js`
- Soporte para TypeScript
- Mocks para módulos nativos (SQLite, Sensors, Reanimated)
- Cobertura de código habilitada
- Alias de paths configurados (`@/` → `src/`)

#### Fast-check (Property-Based Testing)
- Instalado y configurado
- Test de verificación en `src/__tests__/setup.test.ts`
- Listo para escribir propiedades en tareas futuras

### ✅ Configuración de TypeScript

- **tsconfig.json**: Configuración estricta con paths aliases
- **Strict mode**: Habilitado para máxima seguridad de tipos
- **Module resolution**: Node
- **Target**: ESNext para características modernas

### ✅ Configuración de Babel

- Preset: `metro-react-native-babel-preset`
- Plugin: `react-native-reanimated/plugin`
- Plugin: `module-resolver` para aliases de paths

### ✅ Configuración de Android

- **Namespace**: com.amuletobonoloto
- **Min SDK**: 23 (Android 6.0)
- **Target SDK**: 34 (Android 14)
- **Hermes**: Habilitado (motor JS optimizado)
- **Permisos**: Internet, Vibrate
- **Lenguaje**: Kotlin

### ✅ Configuración de iOS

- **Platform**: iOS 13.4+
- **Hermes**: Habilitado
- **Permisos**: NSMotionUsageDescription (acelerómetro)
- **CocoaPods**: Configurado en Podfile

### ✅ Scripts Disponibles

```bash
# Desarrollo
npm start              # Iniciar Metro bundler
npm run android        # Ejecutar en Android
npm run ios            # Ejecutar en iOS

# Testing
npm test               # Ejecutar todos los tests
npm run test:watch     # Tests en modo watch

# Calidad de código
npm run lint           # Ejecutar ESLint
```

## Próximos Pasos

### Tarea 2: Implementar modelos de datos e interfaces core
- Definir interfaces TypeScript para Apuesta, ResultadoSorteo, etc.
- Crear interfaz IGeneradorApuestas

### Tarea 3: Implementar Validador de Apuestas
- Crear clase ValidadorApuestas
- Escribir property-based tests
- Escribir unit tests

## Verificación de la Configuración

Para verificar que todo está correctamente configurado:

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar tests de configuración
npm test -- setup.test.ts

# 3. Verificar TypeScript
npx tsc --noEmit

# 4. Verificar linter
npm run lint
```

## Notas Importantes

1. **SQLite**: La base de datos se inicializará automáticamente en el primer uso
2. **Acelerómetro**: Requiere permisos en tiempo de ejecución en Android 6.0+
3. **Animaciones**: Reanimated requiere configuración adicional en el plugin de Babel
4. **Testing**: Los mocks están configurados para permitir testing sin dispositivo físico

## Arquitectura Implementada

El proyecto sigue una **arquitectura en capas** con separación clara de responsabilidades:

1. **Presentación**: UI components y screens
2. **Aplicación**: Coordinadores y lógica de orquestación
3. **Dominio**: Lógica de negocio (motores, validadores)
4. **Infraestructura**: Servicios externos (API, DB, sensores)

Esta estructura facilita:
- Testing independiente de cada capa
- Reemplazo de implementaciones
- Escalabilidad del proyecto
- Mantenibilidad a largo plazo

## Recursos

- [React Native Docs](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/)
- [fast-check Documentation](https://fast-check.dev/)
- [React Navigation](https://reactnavigation.org/)
