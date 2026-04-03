/**
 * OrbeScreen - Pantalla principal con el círculo brillante
 * Requisitos: 7.1, 7.2, 7.3, 7.4
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

interface OrbeScreenProps {
  onGenerarApuestas?: (numeroColumnas: number, motores: string[]) => void;
}

export const OrbeScreen: React.FC<OrbeScreenProps> = ({ onGenerarApuestas }) => {
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [numeroColumnas, setNumeroColumnas] = useState(1);
  const [motoresSeleccionados, setMotoresSeleccionados] = useState<string[]>(['Motor Histórico']);

  const motoresDisponibles = ['Motor Histórico', 'Motor Buffon', 'Motor Amuleto'];

  const handleOrbePress = () => {
    setMostrarSelector(true);
  };

  const handleGenerar = () => {
    if (onGenerarApuestas) {
      onGenerarApuestas(numeroColumnas, motoresSeleccionados);
    }
    setMostrarSelector(false);
  };

  const handleSeleccionarColumnas = (num: number) => {
    setNumeroColumnas(num);
    // Ajustar array de motores al nuevo número de columnas
    const nuevosMotores = Array(num).fill('Motor Histórico');
    setMotoresSeleccionados(nuevosMotores);
  };

  const handleSeleccionarMotor = (indice: number, motor: string) => {
    const nuevosMotores = [...motoresSeleccionados];
    nuevosMotores[indice] = motor;
    setMotoresSeleccionados(nuevosMotores);
  };

  return (
    <View style={styles.container}>
      {/* El Orbe - Requisito 7.1 */}
      <TouchableOpacity
        style={styles.orbe}
        onPress={handleOrbePress}
        testID="orbe-button"
      >
        <View style={styles.orbeInterior}>
          <Text style={styles.orbeTexto}>✨</Text>
        </View>
      </TouchableOpacity>

      {/* Selector de columnas - Requisito 7.2, 7.4 */}
      {mostrarSelector && (
        <View style={styles.selectorContainer} testID="selector-container">
          <Text style={styles.titulo}>Selecciona número de columnas</Text>

          {/* Selector de número de columnas (1-8) - Requisito 7.2 */}
          <View style={styles.columnasContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.columnaBoton,
                  numeroColumnas === num && styles.columnaBotonSeleccionado,
                ]}
                onPress={() => handleSeleccionarColumnas(num)}
                testID={`columna-${num}`}
              >
                <Text
                  style={[
                    styles.columnaTexto,
                    numeroColumnas === num && styles.columnaTextoSeleccionado,
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Selector de motor por columna - Requisito 7.4 */}
          <Text style={styles.subtitulo}>Selecciona motor para cada columna</Text>
          {motoresSeleccionados.map((motorSeleccionado, indice) => (
            <View key={indice} style={styles.motorRow}>
              <Text style={styles.motorLabel}>Columna {indice + 1}:</Text>
              <View style={styles.motoresContainer}>
                {motoresDisponibles.map((motor) => (
                  <TouchableOpacity
                    key={motor}
                    style={[
                      styles.motorBoton,
                      motorSeleccionado === motor && styles.motorBotonSeleccionado,
                    ]}
                    onPress={() => handleSeleccionarMotor(indice, motor)}
                    testID={`motor-${indice}-${motor}`}
                  >
                    <Text
                      style={[
                        styles.motorTexto,
                        motorSeleccionado === motor && styles.motorTextoSeleccionado,
                      ]}
                    >
                      {motor.replace('Motor ', '')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.generarBoton}
            onPress={handleGenerar}
            testID="generar-button"
          >
            <Text style={styles.generarTexto}>Generar Apuestas</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Requisito 7.3: Paleta de colores (fondo #0B0E14, acentos #D4AF37)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E14',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  orbe: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  orbeInterior: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#1a1f2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbeTexto: {
    fontSize: 60,
  },
  selectorContainer: {
    marginTop: 30,
    width: '100%',
    backgroundColor: '#1a1f2e',
    borderRadius: 10,
    padding: 20,
  },
  titulo: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitulo: {
    color: '#D4AF37',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  columnasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  columnaBoton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2a2f3e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3a3f4e',
  },
  columnaBotonSeleccionado: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  columnaTexto: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  columnaTextoSeleccionado: {
    color: '#0B0E14',
  },
  motorRow: {
    marginBottom: 15,
  },
  motorLabel: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 5,
  },
  motoresContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  motorBoton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#2a2f3e',
    borderWidth: 1,
    borderColor: '#3a3f4e',
  },
  motorBotonSeleccionado: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  motorTexto: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
  },
  motorTextoSeleccionado: {
    color: '#0B0E14',
    fontWeight: 'bold',
  },
  generarBoton: {
    marginTop: 20,
    backgroundColor: '#D4AF37',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  generarTexto: {
    color: '#0B0E14',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
