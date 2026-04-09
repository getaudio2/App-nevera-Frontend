import { useState } from "react";
import { getRecetas } from '../api/index.js';

const Recetas = ({ seleccionados }) => {
    const [recetas, setRecetas] = useState([]);
    const [loading, setLoading] = useState(false);
    const haySeleccionados = seleccionados.length > 0;

    const handleGetRecetas = async () => {
        setLoading(true);
        try {
            const data = await getRecetas(haySeleccionados ? seleccionados : []);
            setRecetas(data);
        } catch (error) {
            console.error('Error al obtener recetas:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-white/70 backdrop-blur-sm border border-amber-100 rounded-xl shadow-md p-4 mb-6'>
            <h2 className='text-lg font-semibold text-sky-900 mb-4'>🍳 Recetas</h2>
            
            <button 
                onClick={handleGetRecetas} 
                disabled={loading}
                className='w-full bg-sky-400 text-white rounded-lg px-4 py-2 text-sm font-medium mb-4 disabled:opacity-50'
            >
                {loading ? 'Buscando...' : haySeleccionados 
                    ? `✨ Sugerir con seleccionados (${seleccionados.length})` 
                    : '✨ Sugerir con todos los ingredientes'}
            </button>

            {recetas.length > 0 && (
                <div className='flex flex-col gap-3'>
                    {recetas.map((receta, index) => (
                        <div key={index} className='bg-white/50 border border-amber-100 rounded-xl p-4'>
                            <div className='flex justify-between items-start mb-2'>
                                <h3 className='font-semibold text-sky-900 text-sm flex-1'>{receta.name}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ml-2 ${
                                    receta.missing.length === 0 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {receta.missing.length === 0 ? '✓ Listo' : `Faltan ${receta.missing.length}`}
                                </span>
                            </div>
                            <p className='text-xs text-sky-700 mb-2'>{receta.time} · {receta.difficulty}</p>
                            <p className='text-xs text-sky-800 mb-3'>{receta.description}</p>
                            
                            {receta.missing.length > 0 && (
                                <div className='bg-amber-50 border border-amber-100 rounded-lg px-3 py-2'>
                                    <p className='text-xs text-amber-700'>
                                        🛒 Te faltan: {receta.missing.join(', ')}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Recetas;