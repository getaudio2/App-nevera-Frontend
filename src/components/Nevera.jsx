import { useState } from 'react';
import { addIngredienteNevera, editarIngredienteNevera, moverIngredienteACompra, eliminarIngredienteNevera } from '../api/index.js';

const Nevera = ({ ingredientes }) => {
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
        <div>
            <h2>Nevera</h2>
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
            <input
                value={form.caduca}
                onChange={(e) => setForm({ ...form, caduca: e.target.value })}
                placeholder="Caduca (YYYY-MM-DD)"
            />
            <button onClick={handleAdd}>Añadir</button>
            <ul>
                {ingredientes.map((ing) => (
                    <li key={ing.id}>
                        {ing.nombre} - {ing.cantidad} - {ing.caduca}
                        <button onClick={() => handleEditar(ing.id, { ...ing, nombre: ing.nombre + ' (editado)' })}>Editar</button>
                        <button onClick={() => handleMoverACompra(ing.id)}>Mover a Compra</button>
                        <button onClick={() => handleEliminar(ing.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Nevera;