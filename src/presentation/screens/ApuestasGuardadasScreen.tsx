/**
 * ApuestasGuardadasScreen - Lista de apuestas guardadas
 * Requisitos: 6.3, 6.4
 */

import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Apuesta } from '../../types';

interface ApuestasGuardadasScreenProps {
  apuestas?: Apuesta[];
  onEliminar?: (id: string) => void;
}

export const ApuestasGuardadasScreen: React.FC<ApuestasGuardadasScreenProps> = ({
  apuestas = [],
  onEliminar,
}) => {
  if (apuestas.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Apuestas Guardadas</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTexto}>No tienes apuestas guardadas</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.titulo}>Apuestas Guardadas</Text>

      {apuestas.map((apuesta) => (
        <View key={apuesta.id} style={styles.apuestaCard}>
          {/* Números - Requisito 6.3 */}
          <View style={styles.numerosContainer}>
            {apuesta.numeros.map((num) => (
              <View key={num} style={styles.numeroChip}>
                <Text style={styles.numeroTexto}>{num}</Text>
              </View>
            ))}
          </View>

          {/* Motor y Fecha - Requisito 6.3 */}
          <View style={styles.infoContainer}>
            <Text style={styles.motorTexto}>Motor: {apuesta.motor}</Text>
            <Text style={styles.fechaTexto}>
              {apuesta.fechaGeneracion.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>

          {/* Botón Eliminar - Requisito 6.4 */}
          {onEliminar && apuesta.id && (
            <TouchableOpacity
              style={styles.eliminarBoton}
              onPress={() => onEliminar(apuesta.id!)}
            >
              <Text style={styles.eliminarTexto}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
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
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyTexto: {
    color: '#D4AF37',
    fontSize: 16,
    opacity: 0.6,
  },
  apuestaCard: {
    backgroundColor: '#1a1f2e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#3a3f4e',
  },
  numerosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 15,
  },
  numeroChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numeroTexto: {
    color: '#0B0E14',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  motorTexto: {
    color: '#D4AF37',
    fontSize: 14,
  },
  fechaTexto: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.7,
  },
  eliminarBoton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eliminarTexto: {
    fontSize: 20,
  },
});
