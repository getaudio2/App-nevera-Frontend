import { useState, useRef } from "react";
import { addIngredienteCompra, moverIngredienteANevera, eliminarIngredienteCompra, marcarIngredienteComprado } from '../api/index.js';

const Compra = ({ ingredientes }) => {
    const [form, setForm] = useState({ nombre: '', cantidad: '' });
    const dialogRef = useRef(null);

    const handleAdd = async () => {
        if (form.nombre.trim() === '') return;
        try {
        await addIngredienteCompra(form);
        setForm({ nombre: '', cantidad: '' });
        dialogRef.current.close();
        } catch (error) {
        console.error('Error al añadir ingrediente:', error);
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
          <h1 className='text-2xl font-bold text-sky-900 mb-6'>🛒 Lista de Compra</h1>
            <dialog 
                ref={dialogRef}
                className='rounded-xl p-6 shadow-xl backdrop:bg-black/50 w-80'
            >
                <h3 className='text-sky-900 font-semibold mb-4'>Añadir a la compra</h3>
                <div className='flex flex-col gap-3'>
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
                    <div className='flex gap-2 justify-end mt-2'>
                        <button 
                            onClick={() => dialogRef.current.close()}
                            className='px-4 py-2 text-sm text-sky-900 border border-amber-100 rounded-lg'
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleAdd}
                            className='px-4 py-2 text-sm bg-sky-400 text-white rounded-lg font-medium'
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </dialog>
            <div className='flex items-center justify-between mb-4'>
                <button 
                  onClick={() => dialogRef.current.showModal()}
                  className='bg-sky-400 text-white rounded-lg px-4 py-2 text-sm font-medium'
                  >
                    + Añadir
                </button>
            </div>
            <ul className='flex flex-col gap-2'>
                {ingredientes.map((item) => (
                    <li key={item.id} className='flex justify-between items-center bg-white/50 rounded-lg px-3 py-2'>
                      <span className={`text-sm text-sky-900 ${item.comprado ? 'line-through opacity-50' : ''}`}>{item.nombre} · {item.cantidad}</span>
                      <div className='flex gap-2'>
                        <button onClick={() => handleMoverANevera(item.id)} className='text-xs text-sky-600'>📦</button>
                        <button onClick={() => handleMarcarComprado(item.id, !item.comprado)} className={`text-s ${item.comprado ? 'text-gray-400' : 'text-green-600'}`}>{item.comprado ? '↩' : '✓'}</button>
                        <button onClick={() => handleEliminar(item.id)} className='text-xs text-red-400'>🗑</button>
                      </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Compra;