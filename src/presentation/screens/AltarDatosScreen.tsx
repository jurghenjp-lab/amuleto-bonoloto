/**
 * AltarDatosScreen - Formulario de configuración del usuario
 * Requisitos: 9.1, 9.2, 9.3, 9.4
 */

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SignoZodiacal } from '../../types';

interface AltarDatosScreenProps {
  onGuardar?: (config: {
    signoZodiacal: SignoZodiacal;
    colorFavorito: string;
    equipoFutbol: string;
  }) => void;
}

const SIGNOS: SignoZodiacal[] = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

const COLORES = [
  'Rojo', 'Naranja', 'Amarillo', 'Verde', 'Azul', 'Añil',
  'Violeta', 'Rosa', 'Blanco', 'Negro'
];

export const AltarDatosScreen: React.FC<AltarDatosScreenProps> = ({ onGuardar }) => {
  const [signoZodiacal, setSignoZodiacal] = useState<SignoZodiacal>('Aries');
  const [colorFavorito, setColorFavorito] = useState('Rojo');
  const [equipoFutbol, setEquipoFutbol] = useState('');

  const handleGuardar = () => {
    if (onGuardar && equipoFutbol.trim()) {
      onGuardar({
        signoZodiacal,
        colorFavorito,
        equipoFutbol: equipoFutbol.trim(),
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.titulo}>El Altar de Datos</Text>
      <Text style={styles.subtitulo}>Configura tu amuleto personal</Text>

      {/* Signo Zodiacal - Requisito 9.1 */}
      <View style={styles.seccion}>
        <Text style={styles.label}>Signo Zodiacal</Text>
        <View style={styles.signosContainer}>
          {SIGNOS.map((signo) => (
            <TouchableOpacity
              key={signo}
              style={[
                styles.signoBoton,
                signoZodiacal === signo && styles.signoSeleccionado,
              ]}
              onPress={() => setSignoZodiacal(signo)}
            >
              <Text
                style={[
                  styles.signoTexto,
                  signoZodiacal === signo && styles.textoSeleccionado,
                ]}
              >
                {signo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Color Favorito - Requisito 9.1 */}
      <View style={styles.seccion}>
        <Text style={styles.label}>Color Favorito</Text>
        <View style={styles.coloresContainer}>
          {COLORES.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorBoton,
                colorFavorito === color && styles.colorSeleccionado,
              ]}
              onPress={() => setColorFavorito(color)}
            >
              <Text
                style={[
                  styles.colorTexto,
                  colorFavorito === color && styles.textoSeleccionado,
                ]}
              >
                {color}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Equipo de Fútbol - Requisito 9.1 */}
      <View style={styles.seccion}>
        <Text style={styles.label}>Equipo de Fútbol</Text>
        <TextInput
          style={styles.input}
          value={equipoFutbol}
          onChangeText={setEquipoFutbol}
          placeholder="Escribe tu equipo favorito"
          placeholderTextColor="#666"
        />
      </View>

      {/* Botón Guardar - Requisito 9.3 */}
      <TouchableOpacity
        style={[styles.guardarBoton, !equipoFutbol.trim() && styles.guardarBotonDeshabilitado]}
        onPress={handleGuardar}
        disabled={!equipoFutbol.trim()}
      >
        <Text style={styles.guardarTexto}>Guardar Configuración</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Requisito 9.2, 9.4: Estética de misticismo moderno con paleta definida
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitulo: {
    color: '#D4AF37',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.8,
  },
  seccion: {
    marginBottom: 25,
  },
  label: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  signosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  signoBoton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#1a1f2e',
    borderWidth: 1,
    borderColor: '#3a3f4e',
  },
  signoSeleccionado: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  signoTexto: {
    color: '#ffffff',
    fontSize: 12,
  },
  coloresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorBoton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#1a1f2e',
    borderWidth: 1,
    borderColor: '#3a3f4e',
  },
  colorSeleccionado: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  colorTexto: {
    color: '#ffffff',
    fontSize: 12,
  },
  textoSeleccionado: {
    color: '#0B0E14',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1a1f2e',
    borderWidth: 1,
    borderColor: '#3a3f4e',
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
  },
  guardarBoton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  guardarBotonDeshabilitado: {
    backgroundColor: '#3a3f4e',
    opacity: 0.5,
  },
  guardarTexto: {
    color: '#0B0E14',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
