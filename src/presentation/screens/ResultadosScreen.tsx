/**
 * ResultadosScreen - Pantalla de resultados oficiales de Bonoloto
 * Requisitos: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { ResultadoSorteo } from '../../types';

interface ResultadosScreenProps {
  resultado?: ResultadoSorteo;
  error?: string;
}

export const ResultadosScreen: React.FC<ResultadosScreenProps> = ({ resultado, error }) => {
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Resultados Oficiales</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTexto}>⚠️ {error}</Text>
        </View>
      </View>
    );
  }

  if (!resultado) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Resultados Oficiales</Text>
        <Text style={styles.cargando}>Cargando resultados...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.titulo}>Resultados Oficiales</Text>
      <Text style={styles.fecha}>
        {resultado.fecha.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Text>

      {/* Combinación Ganadora - Requisito 5.2 */}
      <View style={styles.seccion}>
        <Text style={styles.label}>Combinación Ganadora</Text>
        <View style={styles.numerosContainer}>
          {resultado.combinacionGanadora.map((num) => (
            <View key={num} style={styles.numeroChip}>
              <Text style={styles.numeroTexto}>{num}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Complementario y Reintegro - Requisito 5.3, 5.4 */}
      <View style={styles.seccion}>
        <View style={styles.extraContainer}>
          <View style={styles.extraItem}>
            <Text style={styles.extraLabel}>Complementario</Text>
            <View style={[styles.numeroChip, styles.numeroComplementario]}>
              <Text style={styles.numeroTexto}>{resultado.complementario}</Text>
            </View>
          </View>
          <View style={styles.extraItem}>
            <Text style={styles.extraLabel}>Reintegro</Text>
            <View style={[styles.numeroChip, styles.numeroReintegro]}>
              <Text style={styles.numeroTexto}>{resultado.reintegro}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Distribución de Premios - Requisito 5.5 */}
      <View style={styles.seccion}>
        <Text style={styles.label}>Distribución de Premios</Text>
        
        <View style={styles.premioRow}>
          <Text style={styles.premioCategoria}>1ª Categoría (6 aciertos)</Text>
          <Text style={styles.premioAcertantes}>{resultado.premios.categoria1.acertantes} acertantes</Text>
          <Text style={styles.premioCantidad}>{resultado.premios.categoria1.premio.toFixed(2)} €</Text>
        </View>

        <View style={styles.premioRow}>
          <Text style={styles.premioCategoria}>2ª Categoría (5 + C)</Text>
          <Text style={styles.premioAcertantes}>{resultado.premios.categoria2.acertantes} acertantes</Text>
          <Text style={styles.premioCantidad}>{resultado.premios.categoria2.premio.toFixed(2)} €</Text>
        </View>

        <View style={styles.premioRow}>
          <Text style={styles.premioCategoria}>3ª Categoría (5 aciertos)</Text>
          <Text style={styles.premioAcertantes}>{resultado.premios.categoria3.acertantes} acertantes</Text>
          <Text style={styles.premioCantidad}>{resultado.premios.categoria3.premio.toFixed(2)} €</Text>
        </View>

        <View style={styles.premioRow}>
          <Text style={styles.premioCategoria}>4ª Categoría (4 aciertos)</Text>
          <Text style={styles.premioAcertantes}>{resultado.premios.categoria4.acertantes} acertantes</Text>
          <Text style={styles.premioCantidad}>{resultado.premios.categoria4.premio.toFixed(2)} €</Text>
        </View>

        <View style={styles.premioRow}>
          <Text style={styles.premioCategoria}>5ª Categoría (3 aciertos)</Text>
          <Text style={styles.premioAcertantes}>{resultado.premios.categoria5.acertantes} acertantes</Text>
          <Text style={styles.premioCantidad}>{resultado.premios.categoria5.premio.toFixed(2)} €</Text>
        </View>

        <View style={styles.premioRow}>
          <Text style={styles.premioCategoria}>Reintegro</Text>
          <Text style={styles.premioAcertantes}>{resultado.premios.reintegro.acertantes} acertantes</Text>
          <Text style={styles.premioCantidad}>{resultado.premios.reintegro.premio.toFixed(2)} €</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E14',
  },
  contentContainer: {
    padding: 20,
  },
  titulo: {
    color: '#D4AF37',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  fecha: {
    color: '#D4AF37',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.8,
    textTransform: 'capitalize',
  },
  cargando: {
    color: '#D4AF37',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  errorContainer: {
    backgroundColor: '#3a1f1f',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#8B0000',
  },
  errorTexto: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
  seccion: {
    marginBottom: 30,
  },
  label: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  numerosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  numeroChip: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numeroComplementario: {
    backgroundColor: '#8B7355',
  },
  numeroReintegro: {
    backgroundColor: '#5a4f3f',
  },
  numeroTexto: {
    color: '#0B0E14',
    fontSize: 20,
    fontWeight: 'bold',
  },
  extraContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  extraItem: {
    alignItems: 'center',
  },
  extraLabel: {
    color: '#D4AF37',
    fontSize: 14,
    marginBottom: 10,
  },
  premioRow: {
    backgroundColor: '#1a1f2e',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  premioCategoria: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  premioAcertantes: {
    color: '#ffffff',
    fontSize: 12,
    marginBottom: 5,
  },
  premioCantidad: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
