import { useState } from "react";
import { getRecetas } from '../api/index.js';

const Recetas = () => {
    const [recetas, setRecetas] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGetRecetas = async () => {
        setLoading(true);
        try {
            const data = await getRecetas();
            setRecetas(data);
        } catch (error) {
            console.error('Error al obtener recetas:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2>Recetas</h2>
            <button onClick={handleGetRecetas} disabled={loading}>
                {loading ? 'Buscando...' : 'Sugerir recetas'}
            </button>

            {loading && <p>Cargando recetas...</p>}

            {recetas.map((receta, index) => (
                <div key={index}>
                    <h3>{receta.name}</h3>
                    <p>{receta.time} · {receta.difficulty}</p>
                    <p>{receta.description}</p>
                    {receta.missing.length > 0 && (
                        <p>Te faltan: {receta.missing.join(', ')}</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Recetas;