import { useState, useEffect } from 'react';
import { getIngredientesNevera, getIngredientesCompra } from './api/index.js';
import { useWebSocket } from './hooks/useWebSocket.js';
import Nevera from './components/Nevera.jsx';
import Compra from './components/Compra.jsx';
import Recetas from './components/Recetas.jsx';

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
            console.log('nevera:move datos:', datos);
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
            <Nevera ingredientes={ingredientesNevera} />
            <Compra ingredientes={ingredientesCompra} />
            <Recetas />
        </div>
    );
};

export default App;