import { useState } from "react";
import { addIngredienteCompra, editarIngredienteCompra, moverIngredienteANevera, eliminarIngredienteCompra, marcarIngredienteComprado } from '../api/index.js';

const Compra = ({ ingredientes }) => {
    const [form, setForm] = useState({ nombre: '', cantidad: '' });

    const handleAdd = async () => {
        if (form.nombre.trim() === '') return;
        try {
        await addIngredienteCompra(form);
        setForm({ nombre: '', cantidad: '' });
        } catch (error) {
        console.error('Error al añadir ingrediente:', error);
        }
    }

    const handleEditar = async (id, data) => {
        try {
        await editarIngredienteCompra(id, data);
        } catch (error) {
        console.error('Error al editar ingrediente:', error);
        }
    }

    const handleMoverANevera = async (id) => {
      try {
        await moverIngredienteANevera(id);
      } catch (error) {
        console.error('Error al mover ingrediente a nevera:', error);
      }
    }

    const handleMarcarComprado = async (id, comprado) => {
      try {
        await marcarIngredienteComprado(id, comprado);
      } catch (error) {
        console.error('Error al marcar ingrediente como comprado:', error);
      }
    }

    const handleEliminar = async (id) => {
      try {
        await eliminarIngredienteCompra(id);
        } catch (error) {
        console.error('Error al eliminar ingrediente:', error);
        }
    }

    return (
        <div className='bg-white/70 backdrop-blur-sm border border-amber-100 rounded-xl shadow-md p-4 mb-6'>
          <h2 className='text-lg font-semibold text-sky-900 mb-4'>🛒 Lista de Compra</h2>
            <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre"
            />
            <input
                value={form.cantidad}
                onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                placeholder="Cantidad"
            />
            <button onClick={handleAdd}>Añadir</button>
            <ul className='flex flex-col gap-2'>
                {ingredientes.map((item) => (
                    <li key={item.id} className='flex justify-between items-center bg-white/50 rounded-lg px-3 py-2'>
                      <span className={`text-sm text-sky-900 ${item.comprado ? 'line-through opacity-50' : ''}`}>{item.nombre}</span>
                      <div className='flex gap-2'>
                        <button onClick={() => handleEditar(item.id, { ...item, nombre: item.nombre + ' (editado)' })} className='text-xs text-blue-600'>✏️</button>
                        <button onClick={() => handleMoverANevera(item.id)} className='text-xs text-sky-600'>📦</button>
                        <button onClick={() => handleMarcarComprado(item.id, !item.comprado)} className={`text-xs ${item.comprado ? 'text-gray-400' : 'text-green-600'}`}>{item.comprado ? '↩' : '✓'}</button>
                        <button onClick={() => handleEliminar(item.id)} className='text-xs text-red-400'>🗑</button>
                      </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Compra;