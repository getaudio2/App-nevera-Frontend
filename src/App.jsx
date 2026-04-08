import { useState, useEffect } from 'react';
import { getIngredientesNevera, getIngredientesCompra } from './api/index.js';
import { useWebSocket } from './hooks/useWebSocket.js';

const App = () => {
    const [ingredientesNevera, setIngredientesNevera] = useState([]);
    const [ingredientesCompra, setIngredientesCompra] = useState([]);

    useEffect(() => {
        getIngredientesNevera().then((data) => setIngredientesNevera(data));
        getIngredientesCompra().then((data) => setIngredientesCompra(data));
    }, []);

    useWebSocket((mensaje) => {
        console.log('Mensaje recibido:', mensaje);
    });

    return (
        <div>
        <h1>Mi Nevera</h1>
        <ul>
            {ingredientesNevera.map((ingrediente, index) => (
            <li key={ingrediente.id}>{ingrediente.nombre}</li>
            ))}
        </ul>

        <h1>Lista de la Compra</h1>
        <ul>
            {ingredientesCompra.map((item, index) => (
            <li key={item.id}>{item.nombre}</li>
            ))}
        </ul>
        </div>
    );
};

export default App;