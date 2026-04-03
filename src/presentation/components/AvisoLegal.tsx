/**
 * AvisoLegal - Componente de aviso legal y disclaimer
 * Requisitos: 10.1, 10.2, 10.3, 10.4
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';

interface AvisoLegalProps {
  onAceptar?: () => void;
}

export const AvisoLegal: React.FC<AvisoLegalProps> = ({ onAceptar }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [aceptado, setAceptado] = useState(false);

  useEffect(() => {
    // Verificar si ya fue aceptado previamente - Requisito 10.4
    // En producción, esto se cargaría desde AsyncStorage
    const yaAceptado = false; // Placeholder
    if (!yaAceptado) {
      setMostrarModal(true);
    } else {
      setAceptado(true);
    }
  }, []);

  const handleAceptar = () => {
    setAceptado(true);
    setMostrarModal(false);
    // Guardar estado de aceptación - Requisito 10.4
    // En producción: AsyncStorage.setItem('avisoLegalAceptado', 'true')
    if (onAceptar) {
      onAceptar();
    }
  };

  return (
    <>
      {/* Disclaimer en pie de página - Requisito 10.1 */}
      <View style={styles.footer}>
        <Text style={styles.disclaimerTexto}>
          ⚠️ Esta aplicación genera números aleatorios con fines de entretenimiento.
          No garantiza premios ni resultados.
        </Text>
        <TouchableOpacity onPress={() => setMostrarModal(true)}>
          <Text style={styles.verMasTexto}>Ver aviso legal completo</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de aviso legal completo - Requisito 10.2 */}
      <Modal
        visible={mostrarModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          if (aceptado) {
            setMostrarModal(false);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalTitulo}>Aviso Legal</Text>

              <Text style={styles.modalTexto}>
                Esta aplicación, "Amuleto Bonoloto", es una herramienta de entretenimiento
                que genera combinaciones de números para la lotería Bonoloto mediante
                algoritmos matemáticos y datos personalizados.
              </Text>

              <Text style={styles.modalSubtitulo}>Descargo de Responsabilidad</Text>
              <Text style={styles.modalTexto}>
                • Los números generados son aleatorios y no tienen mayor probabilidad
                de resultar premiados que cualquier otra combinación.{'\n\n'}
                • Esta aplicación NO garantiza premios, ganancias ni resultados favorables.{'\n\n'}
                • El juego puede crear adicción. Juega con responsabilidad.{'\n\n'}
                • Esta aplicación no está afiliada con SELAE ni con Loterías y Apuestas del Estado.
              </Text>

              <Text style={styles.modalSubtitulo}>Uso de Datos</Text>
              <Text style={styles.modalTexto}>
                Los datos personales (signo zodiacal, color favorito, equipo de fútbol)
                se almacenan únicamente en tu dispositivo y no se transmiten a servidores externos.
              </Text>

              <Text style={styles.modalSubtitulo}>Mayores de Edad</Text>
              <Text style={styles.modalTexto}>
                El uso de esta aplicación para participar en juegos de azar está
                restringido a personas mayores de 18 años.
              </Text>
            </ScrollView>

            {/* Botón de aceptación - Requisito 10.3 */}
            <TouchableOpacity
              style={styles.aceptarBoton}
              onPress={handleAceptar}
            >
              <Text style={styles.aceptarTexto}>
                {aceptado ? 'Cerrar' : 'Acepto los términos y condiciones'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#1a1f2e',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#3a3f4e',
  },
  disclaimerTexto: {
    color: '#D4AF37',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
  },
  verMasTexto: {
    color: '#D4AF37',
    fontSize: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#0B0E14',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D4AF37',
    overflow: 'hidden',
  },
  modalContent: {
    padding: 20,
  },
  modalTitulo: {
    color: '#D4AF37',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSubtitulo: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  modalTexto: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  aceptarBoton: {
    backgroundColor: '#D4AF37',
    padding: 15,
    alignItems: 'center',
  },
  aceptarTexto: {
    color: '#0B0E14',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
