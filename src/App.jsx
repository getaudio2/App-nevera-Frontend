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
        const { evento, datos } = mensaje;

        if (evento === 'nevera:create') {
            setIngredientesNevera((prev) => [...prev, datos]);
        }
        if (evento === 'nevera:update') {
            setIngredientesNevera((prev) => prev.map((ing) => (ing.id === datos.id ? datos : ing)));
        }
        if (evento === 'nevera:move') {
            setIngredientesNevera((prev) => prev.filter((ing) => ing.id !== datos.id));
            setIngredientesCompra((prev) => [...prev, datos]);
        }
        if (evento === 'nevera:delete') {
            setIngredientesNevera((prev) => prev.filter((ing) => ing.id !== datos.id));
        }
        if (evento === 'compra:create') {
            setIngredientesCompra((prev) => [...prev, datos]);
        }
        if (evento === 'compra:update') {
            setIngredientesCompra((prev) => prev.map((item) => (item.id === datos.id ? datos : item)));
        }
        if (evento === 'compra:move') {
            setIngredientesCompra((prev) => prev.filter((item) => item.id !== datos.id));
            setIngredientesNevera((prev) => [...prev, datos]);
        }
        if (evento === 'compra:delete') {
            setIngredientesCompra((prev) => prev.filter((item) => item.id !== datos.id));
        }
    });

    return (
        <div>
        <h1>Mi Nevera</h1>
        <ul>
            {ingredientesNevera.map((ingrediente) => (
            <li key={ingrediente.id}>{ingrediente.nombre}</li>
            ))}
        </ul>

        <h1>Lista de la Compra</h1>
        <ul>
            {ingredientesCompra.map((item) => (
            <li key={item.id}>{item.nombre}</li>
            ))}
        </ul>
        </div>
    );
};

export default App;