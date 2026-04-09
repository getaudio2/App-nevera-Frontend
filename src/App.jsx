import { useState, useEffect } from 'react';
import { getIngredientesNevera, getIngredientesCompra } from './api/index.js';
import { useWebSocket } from './hooks/useWebSocket.js';
import Nevera from './components/Nevera.jsx';
import Compra from './components/Compra.jsx';
import Recetas from './components/Recetas.jsx';

const App = () => {
    const [ingredientesNevera, setIngredientesNevera] = useState([]);
    const [ingredientesCompra, setIngredientesCompra] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);

    const toggleSeleccionado = (nombre) => {
        setSeleccionados(prev =>
            prev.includes(nombre)
                ? prev.filter(n => n !== nombre)
                : [...prev, nombre]
        );
    };

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
        <div className='bg-sky-200 min-h-screen'>
            <div className='max-w-md mx-auto px-4 py-8'>
                <h1 className='text-2xl font-bold text-sky-900 mb-6'>🧊 Mi Nevera</h1>
                <Nevera 
                    ingredientes={ingredientesNevera} 
                    seleccionados={seleccionados}
                    onToggle={toggleSeleccionado}
                    onSeleccionarTodos={() => setSeleccionados(ingredientesNevera.map(i => i.nombre))}
                    onDeseleccionarTodos={() => setSeleccionados([])}
                />
                <Recetas 
                    seleccionados={seleccionados}
                />

                <Compra ingredientes={ingredientesCompra} />
            </div>
        </div>
    );
};

export default App;