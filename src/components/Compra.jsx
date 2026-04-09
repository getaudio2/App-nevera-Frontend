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

    const handleMarcarComprado = async (id) => {
      try {
        await marcarIngredienteComprado(id);
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
        <div>
            <h2>Lista de Compra</h2>
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
            <ul>
                {ingredientes.map((item) => (
                    <li key={item.id} style={item.comprado ? { textDecoration: 'line-through' } : {}}>
                        {item.nombre} - {item.cantidad}
                        <button onClick={() => handleEditar(item.id, { ...item, nombre: item.nombre + ' (editado)' })}>Editar</button>
                        <button onClick={() => handleMoverANevera(item.id)}>Mover a Nevera</button>
                        <button onClick={() => handleMarcarComprado(item.id)}>Marcar como Comprado</button>
                        <button onClick={() => handleEliminar(item.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Compra;