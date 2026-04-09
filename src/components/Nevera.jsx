import { useState } from 'react';
import { addIngredienteNevera, editarIngredienteNevera, moverIngredienteACompra, eliminarIngredienteNevera } from '../api/index.js';

const Nevera = ({ ingredientes }) => {
    const [editandoId, setEditandoId] = useState(null);
    const [formEditar, setFormEditar] = useState({ nombre: '', cantidad: '', caduca: '' });
    const [form, setForm] = useState({ nombre: '', cantidad: '', caduca: '' });

    const handleAdd = async () => {
        if (form.nombre.trim() === '') return;
        try {
        await addIngredienteNevera(form);
        setForm({ nombre: '', cantidad: '', caduca: '' });
        } catch (error) {
        console.error('Error al añadir ingrediente:', error);
        }
    };

    const handleEditar = async (id, data) => {
        try {
        await editarIngredienteNevera(id, data);
        } catch (error) {
        console.error('Error al editar ingrediente:', error);
        }
    };

    const handleMoverACompra = async (id) => {
      try {
        await moverIngredienteACompra(id);
      } catch (error) {
        console.error('Error al mover ingrediente a compra:', error);
      }
    };

    const handleEliminar = async (id) => {
      try {
        await eliminarIngredienteNevera(id);
      } catch (error) {
        console.error('Error al eliminar ingrediente:', error);
      }
    }

    return (
        <div className='bg-white/70 backdrop-blur-sm border border-amber-100 rounded-xl shadow-md p-4 mb-6'>
            <h2 className='text-lg font-semibold text-sky-900 mb-4'>🥦 Nevera</h2>
            
            {/* Formulario */}
            <div className='flex flex-col gap-2 mb-4'>
                <input
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Nombre"
                    className='border border-amber-100 rounded-lg px-3 py-2 bg-white/50 text-sm'
                />
                <input
                    value={form.cantidad}
                    onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                    placeholder="Cantidad"
                    className='border border-amber-100 rounded-lg px-3 py-2 bg-white/50 text-sm'
                />
                <input
                    value={form.caduca}
                    onChange={(e) => setForm({ ...form, caduca: e.target.value })}
                    placeholder="Caduca (YYYY-MM-DD)"
                    className='border border-amber-100 rounded-lg px-3 py-2 bg-white/50 text-sm'
                />
                <button 
                    onClick={handleAdd}
                    className='bg-sky-400 text-white rounded-lg px-4 py-2 text-sm font-medium'
                >
                    + Añadir
                </button>
            </div>

            {/* Lista */}
            <ul className='flex flex-col gap-2'>
                {ingredientes.map((ing) => (
                    <li key={ing.id} className='flex justify-between items-center bg-white/50 rounded-lg px-3 py-2'>
                        {editandoId === ing.id ? (
                            // modo edición — solo inputs y botones guardar/cancelar
                            // modo edición — layout vertical
                            <div className='flex flex-col gap-2 w-full'>
                                <input
                                    value={formEditar.nombre}
                                    onChange={(e) => setFormEditar({ ...formEditar, nombre: e.target.value })}
                                    placeholder="Nombre"
                                    className='border border-amber-100 rounded-lg px-2 py-1 bg-white/50 text-xs w-full'
                                />
                                <input
                                    value={formEditar.cantidad}
                                    onChange={(e) => setFormEditar({ ...formEditar, cantidad: e.target.value })}
                                    placeholder="Cantidad"
                                    className='border border-amber-100 rounded-lg px-2 py-1 bg-white/50 text-xs w-full'
                                />
                                <input
                                    value={formEditar.caduca}
                                    onChange={(e) => setFormEditar({ ...formEditar, caduca: e.target.value })}
                                    placeholder="Caduca (YYYY-MM-DD)"
                                    className='border border-amber-100 rounded-lg px-2 py-1 bg-white/50 text-xs w-full'
                                />
                                <div className='flex gap-2 justify-end'>
                                    <button onClick={() => { handleEditar(ing.id, formEditar); setEditandoId(null); }} className='text-xs text-green-600'>💾 Guardar</button>
                                    <button onClick={() => setEditandoId(null)} className='text-xs text-red-400'>✗ Cancelar</button>
                                </div>
                            </div>
                        ) : (
                            // modo normal — texto y botones
                            <>
                                <span className='text-sm text-sky-900'>
                                    {ing.nombre} · {ing.cantidad} · {ing.caduca ? new Date(ing.caduca).toLocaleDateString('es-ES') : '—'}
                                </span>
                                <div className='flex gap-2'>
                                    <button onClick={() => { setEditandoId(ing.id); setFormEditar({ nombre: ing.nombre, cantidad: ing.cantidad, caduca: ing.caduca ? new Date(ing.caduca).toISOString().split('T')[0] : '' }); }} className='text-xs text-blue-600'>✏️</button>
                                    <button onClick={() => handleMoverACompra(ing.id)} className='text-xs text-amber-600'>🛒</button>
                                    <button onClick={() => handleEliminar(ing.id)} className='text-xs text-red-400'>🗑</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Nevera;