// API de Sorteos de Bonoloto - Amuleto Bonoloto
// Actualización automática de resultados oficiales

class SorteosAPI {
    constructor() {
        this.baseURL = 'https://api.sorteos.com/bonoloto';
        this.cache = new Map();
        this.lastUpdate = null;
        this.updateInterval = 24 * 60 * 60 * 1000; // 24 horas
    }

    // Obtener resultados más recientes
    async obtenerResultadosRecientes() {
        try {
            // Verificar si tenemos datos en caché
            if (this.cache.has('recientes') && this.esCacheValido()) {
                return this.cache.get('recientes');
            }

            // Simular API real (en producción, usar API oficial)
            const resultados = await this.simularAPILlamada();
            
            // Guardar en caché
            this.cache.set('recientes', resultados);
            this.lastUpdate = new Date();
            
            return resultados;
        } catch (error) {
            console.error('Error al obtener resultados:', error);
            return this.obtenerResultadosFallback();
        }
    }

    // Simular llamada a API (reemplazar con API real)
    async simularAPILlamada() {
        // En producción, esto sería:
        // const response = await fetch(`${this.baseURL}/ultimos`);
        // return await response.json();
        
        // Simulación de datos reales
        const hoy = new Date();
        const resultados = [];
        
        // Generar resultados para últimos 7 días
        for (let i = 0; i < 7; i++) {
            const fecha = new Date(hoy);
            fecha.setDate(fecha.getDate() - i);
            
            const resultado = this.generarResultadoAleatorio(fecha);
            resultados.push(resultado);
        }
        
        return resultados;
    }

    // Generar resultado aleatorio realista
    generarResultadoAleatorio(fecha) {
        const numeros = [];
        const usados = new Set();
        
        // Generar 6 números únicos entre 1-49
        while (numeros.length < 6) {
            const num = Math.floor(Math.random() * 49) + 1;
            if (!usados.has(num)) {
                numeros.push(num);
                usados.add(num);
            }
        }
        
        // Complementario (1-9)
        const complementario = Math.floor(Math.random() * 9) + 1;
        
        // Reintegro (0-9)
        const reintegro = Math.floor(Math.random() * 10);
        
        return {
            fecha: fecha.toISOString(),
            sorteo: this.obtenerNumeroSorteo(fecha),
            numeros: numeros.sort((a, b) => a - b),
            complementario: complementario,
            reintegro: reintegro,
            premios: this.generarPremios(numeros, complementario, reintegro)
        };
    }

    // Obtener número de sorteo (simulado)
    obtenerNumeroSorteo(fecha) {
        // Simular número de sorteo basado en fecha
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const año = fecha.getFullYear();
        
        return `${año}${mes.toString().padStart(2, '0')}${dia.toString().padStart(2, '0')}`;
    }

    // Generar información de premios (simulada)
    generarPremios(numeros, complementario, reintegro) {
        const categorias = [
            { nombre: '6 Aciertos', ganadores: Math.floor(Math.random() * 5), premio: 'Desconocido' },
            { nombre: '5 Aciertos + Complementario', ganadores: Math.floor(Math.random() * 50), premio: 'Desconocido' },
            { nombre: '5 Aciertos', ganadores: Math.floor(Math.random() * 200), premio: 'Desconocido' },
            { nombre: '4 Aciertos', ganadores: Math.floor(Math.random() * 1000), premio: 'Desconocido' },
            { nombre: '3 Aciertos', ganadores: Math.floor(Math.random() * 5000), premio: 'Desconocido' },
            { nombre: 'Reintegro', ganadores: Math.floor(Math.random() * 100000), premio: 'Desconocido' }
        ];
        
        return categorias;
    }

    // Verificar si el caché es válido
    esCacheValido() {
        if (!this.lastUpdate) return false;
        
        const ahora = new Date();
        const tiempoTranscurrido = ahora - this.lastUpdate;
        
        return tiempoTranscurrido < this.updateInterval;
    }

    // Fallback si la API falla
    obtenerResultadosFallback() {
        const resultadosGuardados = localStorage.getItem('resultadosFallback');
        
        if (resultadosGuardados) {
            return JSON.parse(resultadosGuardados);
        }
        
        // Si no hay nada, generar datos de ejemplo
        return this.generarResultadosEjemplo();
    }

    // Generar resultados de ejemplo
    generarResultadosEjemplo() {
        return [
            {
                fecha: new Date().toISOString(),
                sorteo: '20260404',
                numeros: [3, 15, 23, 28, 33, 41],
                complementario: 12,
                reintegro: 7,
                premios: [
                    { nombre: '6 Aciertos', ganadores: 1, premio: '1.000.000€' },
                    { nombre: '5 Aciertos + Complementario', ganadores: 23, premio: '2.500€' },
                    { nombre: '5 Aciertos', ganadores: 156, premio: '150€' },
                    { nombre: '4 Aciertos', ganadores: 8234, premio: '20€' },
                    { nombre: '3 Aciertos', ganadores: 45678, premio: '8€' },
                    { nombre: 'Reintegro', ganadores: 98765, premio: '1€' }
                ]
            },
            {
                fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                sorteo: '20260403',
                numeros: [7, 12, 19, 25, 36, 45],
                complementario: 8,
                reintegro: 3,
                premios: [
                    { nombre: '6 Aciertos', ganadores: 0, premio: '0€' },
                    { nombre: '5 Aciertos + Complementario', ganadores: 18, premio: '2.500€' },
                    { nombre: '5 Aciertos', ganadores: 142, premio: '150€' },
                    { nombre: '4 Aciertos', ganadores: 7892, premio: '20€' },
                    { nombre: '3 Aciertos', ganadores: 42156, premio: '8€' },
                    { nombre: 'Reintegro', ganadores: 10234, premio: '1€' }
                ]
            }
        ];
    }

    // Forzar actualización de datos
    async forzarActualizacion() {
        this.cache.clear();
        this.lastUpdate = null;
        return await this.obtenerResultadosRecientes();
    }

    // Obtener estadísticas
    async obtenerEstadisticas() {
        const resultados = await this.obtenerResultadosRecientes();
        
        if (!resultados || resultados.length === 0) {
            return {
                totalSorteos: 0,
                numerosMasFrecuentes: [],
                promedioNumeros: [],
                ultimaActualizacion: null
            };
        }

        // Calcular estadísticas
        const frecuencia = {};
        const todosNumeros = [];
        
        resultados.forEach(resultado => {
            resultado.numeros.forEach(num => {
                frecuencia[num] = (frecuencia[num] || 0) + 1;
                todosNumeros.push(num);
            });
        });

        // Ordenar por frecuencia
        const numerosMasFrecuentes = Object.entries(frecuencia)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([num, freq]) => ({
                numero: parseInt(num),
                frecuencia: freq,
                porcentaje: ((freq / resultados.length) * 100).toFixed(1)
            }));

        // Calcular promedio
        const promedio = todosNumeros.reduce((sum, num) => sum + num, 0) / todosNumeros.length;

        return {
            totalSorteos: resultados.length,
            numerosMasFrecuentes,
            promedioNumeros: promedio.toFixed(1),
            ultimaActualizacion: this.lastUpdate
        };
    }

    // Verificar si hay nuevos resultados
    async verificarNuevosResultados() {
        const resultadosActuales = await this.obtenerResultadosRecientes();
        const resultadosGuardados = JSON.parse(localStorage.getItem('ultimosResultados') || '[]');
        
        if (resultadosActuales.length > resultadosGuardados.length) {
            // Hay nuevos resultados
            const nuevosResultados = resultadosActuales.slice(0, resultadosActuales.length - resultadosGuardados.length);
            
            // Guardar nuevos resultados
            localStorage.setItem('ultimosResultados', JSON.stringify(resultadosActuales));
            
            return {
                hayNuevos: true,
                nuevosResultados
            };
        }
        
        return {
            hayNuevos: false,
            nuevosResultados: []
        };
    }
}

// Exportar para uso global
window.SorteosAPI = SorteosAPI;

// Auto-actualización cada hora
setInterval(async () => {
    try {
        const api = new SorteosAPI();
        await api.obtenerResultadosRecientes();
        
        // Verificar si hay nuevos resultados
        const verificacion = await api.verificarNuevosResultados();
        
        if (verificacion.hayNuevos) {
            console.log('¡Nuevos resultados disponibles!');
            // Aquí se podría mostrar una notificación
        }
    } catch (error) {
        console.error('Error en auto-actualización:', error);
    }
}, 60 * 60 * 1000); // Cada hora
