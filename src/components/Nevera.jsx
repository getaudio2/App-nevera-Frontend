import { useState, useRef } from 'react';
import { addIngredienteNevera, editarIngredienteNevera, moverIngredienteACompra, eliminarIngredienteNevera } from '../api/index.js';

// Lista fija de ingredientes disponibles
export const CATALOGO = [
  { nombre: 'Pollo', emoji: '🍗', categoria: 'Carnes', en: 'chicken' },
  { nombre: 'Ternera', emoji: '🥩', categoria: 'Carnes', en: 'beef' },
  { nombre: 'Cerdo', emoji: '🐷', categoria: 'Carnes', en: 'pork' },
  { nombre: 'Salmón', emoji: '🐟', categoria: 'Carnes', en: 'salmon' },
  { nombre: 'Atún', emoji: '🐠', categoria: 'Carnes', en: 'tuna' },
  { nombre: 'Tomate', emoji: '🍅', categoria: 'Verduras', en: 'tomato' },
  { nombre: 'Lechuga', emoji: '🥬', categoria: 'Verduras', en: 'lettuce' },
  { nombre: 'Cebolla', emoji: '🧅', categoria: 'Verduras', en: 'onion' },
  { nombre: 'Ajo', emoji: '🧄', categoria: 'Verduras', en: 'garlic' },
  { nombre: 'Zanahoria', emoji: '🥕', categoria: 'Verduras', en: 'carrot' },
  { nombre: 'Pimiento', emoji: '🫑', categoria: 'Verduras', en: 'bell pepper' },
  { nombre: 'Brócoli', emoji: '🥦', categoria: 'Verduras', en: 'broccoli' },
  { nombre: 'Espinacas', emoji: '🌿', categoria: 'Verduras', en: 'spinach' },
  { nombre: 'Patata', emoji: '🥔', categoria: 'Verduras', en: 'potato' },
  { nombre: 'Manzana', emoji: '🍎', categoria: 'Frutas', en: 'apple' },
  { nombre: 'Plátano', emoji: '🍌', categoria: 'Frutas', en: 'banana' },
  { nombre: 'Naranja', emoji: '🍊', categoria: 'Frutas', en: 'orange' },
  { nombre: 'Limón', emoji: '🍋', categoria: 'Frutas', en: 'lemon' },
  { nombre: 'Fresas', emoji: '🍓', categoria: 'Frutas', en: 'strawberries' },
  { nombre: 'Leche', emoji: '🥛', categoria: 'Lácteos', en: 'milk' },
  { nombre: 'Queso', emoji: '🧀', categoria: 'Lácteos', en: 'cheese' },
  { nombre: 'Yogur', emoji: '🫙', categoria: 'Lácteos', en: 'yogurt' },
  { nombre: 'Mantequilla', emoji: '🧈', categoria: 'Lácteos', en: 'butter' },
  { nombre: 'Huevos', emoji: '🥚', categoria: 'Lácteos', en: 'eggs' },
  { nombre: 'Arroz', emoji: '🍚', categoria: 'Otros', en: 'rice' },
  { nombre: 'Pasta', emoji: '🍝', categoria: 'Otros', en: 'pasta' },
  { nombre: 'Lentejas', emoji: '🫘', categoria: 'Otros', en: 'lentils' },
  { nombre: 'Garbanzos', emoji: '🟡', categoria: 'Otros', en: 'chickpeas' },
  { nombre: 'Pan', emoji: '🍞', categoria: 'Otros', en: 'bread' },
  { nombre: 'Aceite', emoji: '🫒', categoria: 'Otros', en: 'olive oil' },
];

const CATEGORIAS = ['Todo', 'Carnes', 'Verduras', 'Frutas', 'Lácteos', 'Otros'];

// Devuelve el color del indicador de caducidad
function getExpiryColor(caduca) {
  if (caduca === 'hoy') return '#ef4444';
  if (caduca === 'pronto') return '#f97316';
  if (caduca === 'ok') return '#22c55e';
  return '#6b7280'; // sin fecha / null
}

const Nevera = ({ ingredientes, seleccionados, onToggle, onSeleccionarTodos, onDeseleccionarTodos }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState('Todo');
  const [form, setForm] = useState({ nombre: '', caduca: 'ok' });
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [slotActivo, setSlotActivo] = useState(null); // id del slot con menú abierto
  const pressTimer = useRef(null);

  const handlePressStart = (id) => {
    pressTimer.current = setTimeout(() => setSlotActivo(id), 500);
  };

  const handlePressEnd = () => {
    clearTimeout(pressTimer.current);
  };

  const handleAdd = async () => {
    if (!form.nombre) return;
    setLoadingAdd(true);
    const item = CATALOGO.find(c => c.nombre === form.nombre);
    try {
      await addIngredienteNevera({
        nombre: item.nombre,
        nombre_en: item.en,
        cantidad: '',
        caduca: form.caduca,
        emoji: item.emoji,
        categoria: item.categoria,
      });
      setForm({ nombre: '', caduca: '' });
      setModalAbierto(false);
    } catch (error) {
      console.error('Error al añadir ingrediente:', error);
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleMoverACompra = async (id) => {
    try {
      await moverIngredienteACompra(id);
      setSlotActivo(null);
    } catch (error) {
      console.error('Error al mover ingrediente a compra:', error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarIngredienteNevera(id);
      setSlotActivo(null);
    } catch (error) {
      console.error('Error al eliminar ingrediente:', error);
    }
  };

  const ingredientesFiltrados = categoriaActiva === 'Todo'
    ? ingredientes
    : ingredientes.filter(ing => ing.categoria === categoriaActiva);

  return (
    <div style={{
      background: '#ffffff',
      border: '2px solid #194960',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '24px',
      fontFamily: "'Georgia', serif",
      boxShadow: '0 0 30px rgba(201,168,76,0.15), inset 0 0 60px rgba(0,0,0,0.3)',
    }}>

      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ color: 'black', fontSize: '22px', fontWeight: 'bold', margin: 0, letterSpacing: '1px', textShadow: '0 0 10px rgba(201,168,76,0.5)' }}>
          ❄️ Mi Nevera
        </h1>
        <button
          onClick={() => setModalAbierto(true)}
          style={{
            background: 'linear-gradient(135deg, #56e2e5, #32bfc2)',
            color: '#1a1a2e',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'Georgia, serif',
          }}
        >
          + Añadir
        </button>
      </div>

      {/* Filtros de categoría */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            style={{
              padding: '4px 12px',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: categoriaActiva === cat ? '#c9a84c' : '#3a3a5c',
              background: categoriaActiva === cat ? 'rgba(201,168,76,0.2)' : 'transparent',
              color: categoriaActiva === cat ? '#c9a84c' : '#8888aa',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'Georgia, serif',
              transition: 'all 0.15s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de slots */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        marginBottom: '16px',
      }}>
        {ingredientesFiltrados.map(ing => {
          const seleccionado = seleccionados.includes(ing.nombre);
          const expiryColor = getExpiryColor(ing.caduca);
          const menuAbierto = slotActivo === ing.id;

          return (
            <div
              key={ing.id}
              style={{ position: 'relative' }}
            >
              {/* Slot principal */}
              <div
                onMouseDown={() => handlePressStart(ing.id)}
                onMouseUp={handlePressEnd}
                onTouchStart={() => handlePressStart(ing.id)}
                onTouchEnd={handlePressEnd}
                onClick={() => onToggle(ing.nombre)}
                style={{
                  background: seleccionado
                    ? 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.1))'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                  border: `2px solid ${seleccionado ? '#c9a84c' : '#3a3a5c'}`,
                  borderRadius: '10px',
                  padding: '10px 6px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s',
                  boxShadow: seleccionado ? '0 0 12px rgba(201,168,76,0.3)' : 'none',
                }}
              >
                {/* Punto de caducidad */}
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: expiryColor,
                  boxShadow: `0 0 6px ${expiryColor}`,
                }} />

                {/* Emoji */}
                <div style={{ fontSize: '28px', lineHeight: 1, marginBottom: '4px' }}>
                  {ing.emoji || '🥄'}
                </div>

                {/* Nombre */}
                <div style={{
                  color: seleccionado ? '#c9a84c' : '#ccccdd',
                  fontSize: '10px',
                  lineHeight: '1.2',
                  fontFamily: 'Georgia, serif',
                }}>
                  {ing.nombre}
                </div>
              </div>

              {/* Menú contextual */}
              {menuAbierto && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 9 }}
                    onClick={() => setSlotActivo(null)}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    right: 0,
                    background: '#1e1e3a',
                    border: '1px solid #c9a84c',
                    borderRadius: '8px',
                    padding: '6px',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    minWidth: '120px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  }}>
                    <button
                      onClick={() => handleMoverACompra(ing.id)}
                      style={{ background: 'none', border: 'none', color: '#f0c050', fontSize: '12px', cursor: 'pointer', textAlign: 'left', padding: '4px 8px', borderRadius: '4px' }}
                    >
                      🛒 Mover a compra
                    </button>
                    <button
                      onClick={() => handleEliminar(ing.id)}
                      style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '12px', cursor: 'pointer', textAlign: 'left', padding: '4px 8px', borderRadius: '4px' }}
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Slots vacíos de relleno para mantener el grid */}
        {ingredientesFiltrados.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6666aa', padding: '24px', fontSize: '13px' }}>
            La nevera está vacía
          </div>
        )}
      </div>

      {/* Barra de seleccionados */}
      {seleccionados.length > 0 && (
        <div style={{
          background: 'rgba(201,168,76,0.1)',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: '10px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          <span style={{ color: '#c9a84c', fontSize: '12px', fontWeight: 'bold' }}>Para la receta:</span>
          {seleccionados.map(nombre => {
            const item = CATALOGO.find(c => c.nombre === nombre);
            return (
              <span key={nombre} style={{
                background: 'rgba(201,168,76,0.2)',
                color: '#e8d5a3',
                borderRadius: '20px',
                padding: '2px 10px',
                fontSize: '12px',
              }}>
                {item?.emoji} {nombre}
              </span>
            );
          })}
        </div>
      )}

      {/* Modal de añadir */}
      {modalAbierto && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setModalAbierto(false)}
          />
          <div style={{
            position: 'relative', zIndex: 10,
            background: 'linear-gradient(160deg, #1a1a2e, #16213e)',
            border: '2px solid #c9a84c',
            borderRadius: '16px',
            padding: '24px',
            width: '300px',
            boxShadow: '0 0 40px rgba(201,168,76,0.2)',
            fontFamily: 'Georgia, serif',
          }}>
            <h3 style={{ color: '#c9a84c', margin: '0 0 16px', fontSize: '16px' }}>Añadir ingrediente</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Selector de ingrediente */}
              <select
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                style={{
                  background: '#0f0f2a',
                  border: '1px solid #3a3a5c',
                  borderRadius: '8px',
                  padding: '10px',
                  color: form.nombre ? '#e8d5a3' : '#6666aa',
                  fontSize: '14px',
                  fontFamily: 'Georgia, serif',
                }}
              >
                <option value=''>Elige un ingrediente...</option>
                {CATEGORIAS.filter(c => c !== 'Todo').map(cat => (
                  <optgroup key={cat} label={cat}>
                    {CATALOGO.filter(c => c.categoria === cat).map(item => (
                      <option key={item.nombre} value={item.nombre}>
                        {item.emoji} {item.nombre}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {/* Fecha de caducidad */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { valor: 'ok', emoji: '🟢', label: 'Más de 3 días', default: true },
                  { valor: 'pronto', emoji: '🟠', label: 'Menos de 3 días' },
                  { valor: 'hoy', emoji: '🔴', label: 'Hoy' },
                ].map(op => (
                  <button
                    key={op.valor}
                    onClick={() => setForm({ ...form, caduca: op.valor })}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: `2px solid ${form.caduca === op.valor ? '#c9a84c' : '#3a3a5c'}`,
                      background: form.caduca === op.valor ? 'rgba(201,168,76,0.2)' : 'transparent',
                      color: '#e8d5a3',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontFamily: 'Georgia, serif',
                    }}
                  >
                    {op.emoji}<br/>{op.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button
                  onClick={() => setModalAbierto(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #3a3a5c',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: '#8888aa',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdd}
                  disabled={loadingAdd || !form.nombre}
                  style={{
                    background: form.nombre ? 'linear-gradient(135deg, #c9a84c, #a07830)' : '#3a3a5c',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: form.nombre ? '#1a1a2e' : '#6666aa',
                    fontWeight: 'bold',
                    cursor: form.nombre ? 'pointer' : 'not-allowed',
                    fontSize: '13px',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  {loadingAdd ? 'Añadiendo...' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nevera;
