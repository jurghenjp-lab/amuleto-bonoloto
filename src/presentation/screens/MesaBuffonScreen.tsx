/**
 * MesaBuffonScreen - Visualización de la simulación de Buffon
 * Requisitos: 8.1, 8.2, 8.3, 8.4
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface MesaBuffonScreenProps {
  numeros?: number[];
  numAgujas?: number;
}

export const MesaBuffonScreen: React.FC<MesaBuffonScreenProps> = ({ numeros, numAgujas }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>La Mesa de Buffon</Text>
      
      {/* Rejilla 7x7 - Requisito 8.1, 8.2 */}
      <View style={styles.rejilla}>
        {Array.from({ length: 49 }).map((_, index) => {
          const numero = index + 1;
          const seleccionado = numeros?.includes(numero);
          
          return (
            <View
              key={index}
              style={[
                styles.espacio,
                seleccionado && styles.espacioSeleccionado,
              ]}
            >
              <Text style={[styles.numeroTexto, seleccionado && styles.numeroSeleccionado]}>
                {numero}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Información de agujas - Requisito 8.3 */}
      {numAgujas && (
        <Text style={styles.info}>Agujas lanzadas: {numAgujas}</Text>
      )}

      {/* Números generados - Requisito 8.4 */}
      {numeros && numeros.length > 0 && (
        <View style={styles.resultadoContainer}>
          <Text style={styles.resultadoTitulo}>Números seleccionados:</Text>
          <View style={styles.numerosContainer}>
            {numeros.map((num) => (
              <View key={num} style={styles.numeroChip}>
                <Text style={styles.numeroChipTexto}>{num}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

// Requisito 8.1: Texturas visuales de madera y metal
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E14',
    padding: 20,
    alignItems: 'center',
  },
  titulo: {
    color: '#D4AF37',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rejilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 350,
    height: 350,
    backgroundColor: '#3a2f1f',
    borderRadius: 10,
    padding: 5,
    borderWidth: 3,
    borderColor: '#8B7355',
  },
  espacio: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5a4f3f',
    backgroundColor: '#2a1f1f',
  },
  espacioSeleccionado: {
    backgroundColor: '#D4AF37',
    borderColor: '#FFD700',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  numeroTexto: {
    color: '#8B7355',
    fontSize: 10,
    fontWeight: 'bold',
  },
  numeroSeleccionado: {
    color: '#0B0E14',
    fontSize: 12,
  },
  info: {
    color: '#D4AF37',
    fontSize: 14,
    marginTop: 15,
  },
  resultadoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultadoTitulo: {
    color: '#D4AF37',
    fontSize: 16,
    marginBottom: 10,
  },
  numerosContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  numeroChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numeroChipTexto: {
    color: '#0B0E14',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
