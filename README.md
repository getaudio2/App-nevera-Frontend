# 🧊 Mi Nevera — Frontend


## ¿Qué es Mi Nevera?

**Mi Nevera** es una aplicación pensada para familias que quieren tener control de lo que tienen en la nevera, evitar desperdicios y sacar ideas de qué cocinar con lo que tienen a mano.

La app permite gestionar el inventario de la nevera y la lista de la compra, mover productos entre ambas, y pedir sugerencias de recetas a una IA según los ingredientes disponibles. Todo en tiempo real: si alguien de la familia añade o elimina un ingrediente desde su móvil, el resto ve el cambio al instante.

---

## Stack técnico

| Tecnología | Uso |
|---|---|
| **React + Vite** | Framework y bundler |
| **Tailwind CSS** | Estilos utilitarios |
| **WebSockets** | Sincronización en tiempo real |
| **Capacitor** | Compilación a APK Android |
| **Groq API** | Sugerencias de recetas por IA |

---

## Funcionalidades

### 🧊 Nevera
- Añadir, editar y eliminar ingredientes (nombre, cantidad, fecha de caducidad)
- Selección múltiple de ingredientes para filtrar recetas
- Mover ingredientes a la lista de la compra con un toque
- Interfaz de inventario estilo RPG: grid de slots, emojis por ingrediente, indicadores visuales de caducidad

### 🛒 Lista de la compra
- Añadir y eliminar productos
- Marcar productos como comprados (tachado visual)
- Mover productos comprados directamente a la nevera

### 🍳 Recetas con IA
- Sugerencias generadas por IA (Groq) basadas en los ingredientes seleccionados o en todos los disponibles
- Cada receta incluye: nombre, tiempo, dificultad, descripción e ingredientes que faltan
- Badge visual indicando si se puede cocinar ya o qué falta comprar

### ⚡ Tiempo real
- Sincronización instantánea entre dispositivos vía WebSocket
- Reconexión automática ante caídas de conexión

---

## Arquitectura

```
src/
├── components/
│   ├── Nevera.jsx       # Gestión del inventario de la nevera
│   ├── Compra.jsx       # Lista de la compra
│   └── Recetas.jsx      # Sugerencias de recetas por IA
├── hooks/
│   └── useWebSocket.js  # Hook de WebSocket con reconexión automática
└── api/
    └── index.js         # Llamadas al backend centralizadas
```

El estado global está levantado en `App.jsx` y se pasa por props. Las llamadas a la API están centralizadas en `api/index.js`.

---

## Variables de entorno

Crea un fichero `.env` en la raíz del proyecto:

```env
VITE_API_URL=https://tu-backend.up.railway.app
VITE_WS_URL=wss://tu-backend.up.railway.app
```

---

## Instalación y desarrollo

```bash
npm install
npm run dev
```

### Build web
```bash
npm run build
```

### Build Android (APK)
```bash
npm run build
npx cap sync android
npx cap open android   # Abre Android Studio para compilar el APK
```

> Requiere Android Studio instalado y configurado.

---

## Repo del backend

👉 [mi-nevera-backend](https://github.com/tu-usuario/mi-nevera-backend)
