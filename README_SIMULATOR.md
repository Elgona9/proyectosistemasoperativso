# Simulador de Algoritmos de Planificación de CPU

Este proyecto implementa un simulador interactivo de algoritmos de planificación de CPU a corto plazo para sistemas operativos multiprogramados.

## 🎯 Características

- **4 Algoritmos de Planificación Implementados:**
  - FCFS (First Come, First Served)
  - SJF (Shortest Job First)
  - SRTF (Shortest Remaining Time First)
  - RR (Round Robin) con quantum configurable

- **Métricas Calculadas:**
  - Tiempo de Finalización
  - Tiempo de Retorno
  - Tiempo de Espera
  - Tiempo de Respuesta
  - Penalidad (relación tiempo de retorno/tiempo de ráfaga)

- **Visualización:**
  - Diagrama de Gantt interactivo con códigos de color
  - Tabla de resultados con promedios
  - Interfaz responsiva y moderna

## 🚀 Cómo Usar

1. Abre el archivo `index.html` en tu navegador web
2. Selecciona el algoritmo de planificación que deseas simular
3. Configura los procesos:
   - Nombre del proceso
   - Tiempo de llegada (Arrival Time)
   - Tiempo de ráfaga (Burst Time)
4. Agrega más procesos usando el botón "Agregar Proceso"
5. Si seleccionas Round Robin, especifica el valor del Quantum
6. Haz clic en "Calcular" para ver los resultados

## 📋 Algoritmos

### FCFS (First Come, First Served)
- **Tipo:** No apropiativo
- **Descripción:** Los procesos se ejecutan en el orden en que llegan
- **Ventajas:** Simple de implementar
- **Desventajas:** Puede causar el efecto convoy

### SJF (Shortest Job First)
- **Tipo:** No apropiativo
- **Descripción:** Se ejecuta primero el proceso con menor tiempo de ráfaga
- **Ventajas:** Minimiza el tiempo de espera promedio
- **Desventajas:** Puede causar inanición en procesos largos

### SRTF (Shortest Remaining Time First)
- **Tipo:** Apropiativo
- **Descripción:** Versión apropiativa de SJF, cambia al proceso con menor tiempo restante
- **Ventajas:** Óptimo para minimizar tiempo de espera
- **Desventajas:** Requiere conocer el tiempo de ejecución y causa más cambios de contexto

### RR (Round Robin)
- **Tipo:** Apropiativo
- **Descripción:** Cada proceso recibe un quantum de tiempo, luego pasa al final de la cola
- **Ventajas:** Justo, no hay inanición
- **Desventajas:** El rendimiento depende del tamaño del quantum

## 📊 Métricas Explicadas

- **Tiempo de Finalización:** Momento en que el proceso termina su ejecución
- **Tiempo de Retorno:** Tiempo desde que llega hasta que termina (Finalización - Llegada)
- **Tiempo de Espera:** Tiempo que el proceso espera en la cola (Retorno - Ráfaga)
- **Tiempo de Respuesta:** Tiempo desde que llega hasta que obtiene CPU por primera vez
- **Penalidad:** Relación entre tiempo de retorno y tiempo de ráfaga (Retorno / Ráfaga)

## 💻 Tecnologías Utilizadas

- HTML5
- CSS3 (con diseño responsivo)
- JavaScript Vanilla (sin dependencias externas)

## 🎨 Características de la Interfaz

- Diseño moderno con gradiente de fondo
- Colores distintos para cada proceso en el diagrama de Gantt
- Tabla de resultados con filas alternadas para mejor legibilidad
- Efectos hover y transiciones suaves
- Compatible con dispositivos móviles

## 📝 Ejemplo de Uso

```
Proceso: P1, Llegada: 0, Ráfaga: 5
Proceso: P2, Llegada: 1, Ráfaga: 3
Proceso: P3, Llegada: 2, Ráfaga: 2
Algoritmo: SRTF
```

Este ejemplo mostrará cómo SRTF prioriza procesos con menor tiempo restante, apropiando el CPU cuando llega un proceso más corto.

## 🔧 Estructura del Proyecto

```
.
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos y diseño
├── scheduler.js        # Lógica de los algoritmos
└── README_SIMULATOR.md # Este archivo
```

## 🤝 Contribuciones

Este proyecto fue desarrollado como parte de un curso de Sistemas Operativos para demostrar el funcionamiento de algoritmos de planificación de CPU.

## 📄 Licencia

Este proyecto es de uso educativo.
