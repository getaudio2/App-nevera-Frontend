import { useState, useEffect } from "react";
import { getRecetas, moverIngredienteACompra, getFavoritas, addFavorita, deleteFavorita } from '../api/index.js';

const TarjetaReceta = ({ receta, favoritas, onToggleFavorita, onCocinar }) => {
    const esFavorita = favoritas.find(f => f.name === receta.name);
    return (
        <div className='bg-white/50 border border-amber-100 rounded-xl p-4'>
            <div className='flex justify-between items-start mb-2'>
                <h3 className='font-semibold text-sky-900 text-sm flex-1'>{receta.name}</h3>
                <div className='flex gap-2 items-center ml-2'>
                    <button onClick={() => onToggleFavorita(receta)} className='text-lg'>
                        {esFavorita ? '⭐' : '☆'}
                    </button>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        (receta.missing || []).length === 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                    }`}>
                        {(receta.missing || []).length === 0 ? '✓ Listo' : `Faltan ${(receta.missing || []).length}`}
                    </span>
                </div>
            </div>
            <div style={{ width: '100%', height: '160px', overflow: 'hidden', borderRadius: '8px', marginBottom: '12px', background: '#0f0f2a' }}>
                <img src={receta.image} alt={receta.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            {receta.time && <p className='text-xs text-sky-700 mb-2'>⏱ {receta.time}</p>}
            {(receta.steps || []).length > 0 && (
                <ol className='flex flex-col gap-1 mb-3'>
                    {(receta.steps || []).map((paso, i) => (
                        <li key={i} className='text-xs text-sky-800'><span className='font-semibold'>{i + 1}.</span> {paso}</li>
                    ))}
                </ol>
            )}
            {(receta.missing || []).length > 0 && (
                <div className='bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-2'>
                    <p className='text-xs text-amber-700'>✔️ Tienes: {(receta.have || []).join(', ')}</p>
                    <p className='text-xs text-amber-700'>🛒 Te faltan: {(receta.missing || []).join(', ')}</p>
                </div>
            )}
            <button onClick={() => onCocinar(receta)} className='w-full bg-green-500 text-white rounded-lg px-3 py-2 text-xs font-medium'>
                🍳 ¡A cocinar!
            </button>
        </div>
    );
};

const Recetas = ({ seleccionados, ingredientesNevera }) => {
    // Al cargar el componente, recuperar recetas recientes
    const [recetas, setRecetas] = useState(() => {
        const guardadas = localStorage.getItem('recetas_recientes');
        return guardadas ? JSON.parse(guardadas) : [];
    });
    const [loading, setLoading] = useState(false);
    const haySeleccionados = seleccionados.length > 0;

    const [modalCocinar, setModalCocinar] = useState(null); // Receta seleccionada para cocinar
    const [ingredientesModal, setIngredientesModal] = useState([]); // lista fija para mostrar
    const [usados, setUsados] = useState([]) // Nombres de ingredientes que se van a usar para cocinar la receta seleccionada

    const [vista, setVista] = useState('sugerir'); // 'sugerir' | 'favoritas'
    const [favoritas, setFavoritas] = useState([]);

    useEffect(() => {
        getFavoritas().then(data => setFavoritas(data));
    }, []);

    const handleToggleFavorita = async (receta) => {
        const yaEsFavorita = favoritas.find(f => f.name === receta.name);
        if (yaEsFavorita) {
            await deleteFavorita(yaEsFavorita.id);
            setFavoritas(prev => prev.filter(f => f.id !== yaEsFavorita.id));
        } else {
            const nueva = await addFavorita(receta);
            setFavoritas(prev => [...prev, nueva]);
        }
    };

    const handleAbrirCocinar = (receta) => {
        setModalCocinar(receta);

        // Mapear nombres de Spoonacular a nombres del catálogo
        const nombresNevera = receta.have.map(nombre => {
            const encontrado = ingredientesNevera.find(ing =>
                nombre.toLowerCase().includes(ing.nombre.toLowerCase()) ||
                ing.nombre.toLowerCase().includes(nombre.toLowerCase())
            );
            return encontrado ? encontrado.nombre : nombre; // si encuentra el match, usa el nombre del catálogo; si no, deja el original
        });
        
        setIngredientesModal(nombresNevera); // lista fija
        setUsados(nombresNevera); // todos marcados por defecto
    };

    const handleConfirmarCocinar = async () => {
        // Buscar el id de cada ingrediente marcado en ingredientesNevera
        const aMover = usados
            .map(nombre => ingredientesNevera.find(ing => 
                nombre.toLowerCase().includes(ing.nombre.toLowerCase()) ||
                ing.nombre.toLowerCase() === nombre.toLowerCase()
            ))
            .filter(Boolean); // ignorar los que no encuentre

        await Promise.all(aMover.map(ing => moverIngredienteACompra(ing.id)));
        setModalCocinar(null);
        setUsados([]);
    };

    // Al generar recetas, guardarlas en localStorage
    const handleGetRecetas = async () => {
        setLoading(true);
        try {
            const data = await getRecetas(haySeleccionados ? seleccionados : []);
            setRecetas(data);
            localStorage.setItem('recetas_recientes', JSON.stringify(data));
        } catch (error) {
            console.error('Error al obtener recetas:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className='bg-white/70 backdrop-blur-sm border border-amber-100 rounded-xl shadow-md p-4 mb-6'>
                <h2 className='text-lg font-semibold text-sky-900 mb-4'>🍳 Recetas</h2>

                {/* Pestañas */}
                <div className='flex gap-2 mb-4'>
                    <button
                        onClick={() => setVista('sugerir')}
                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${vista === 'sugerir' ? 'bg-sky-400 text-white' : 'bg-white/50 text-sky-900 border border-amber-100'}`}
                    >
                        ✨ Sugerir
                    </button>
                    <button
                        onClick={() => setVista('favoritas')}
                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${vista === 'favoritas' ? 'bg-sky-400 text-white' : 'bg-white/50 text-sky-900 border border-amber-100'}`}
                    >
                        ⭐ Favoritas ({favoritas.length})
                    </button>
                </div>

                {vista === 'sugerir' && (
                    <>
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
                                    <TarjetaReceta
                                        key={index}
                                        receta={receta}
                                        favoritas={favoritas}
                                        onToggleFavorita={handleToggleFavorita}
                                        onCocinar={handleAbrirCocinar}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {vista === 'favoritas' && (
                    <div className='flex flex-col gap-3'>
                        {favoritas.length === 0 && (
                            <p className='text-xs text-sky-700 text-center py-4'>No hay recetas favoritas todavía.</p>
                        )}
                        {favoritas.map((receta, index) => (
                            <TarjetaReceta
                                key={index}
                                receta={receta}
                                favoritas={favoritas}
                                onToggleFavorita={handleToggleFavorita}
                                onCocinar={handleAbrirCocinar}
                            />
                        ))}
                    </div>
                )}
            </div>
            {modalCocinar && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={() => setModalCocinar(null)} />
                    <div style={{
                        position: 'relative', zIndex: 10,
                        background: 'white', borderRadius: '16px',
                        padding: '24px', width: '300px',
                    }}>
                        <h3 className='font-semibold text-sky-900 mb-2'>¿Qué se ha acabado?</h3>
                        <p className='text-xs text-sky-700 mb-4'>Marca los ingredientes que hayas usado y se moverán a la lista de compra.</p>

                        {ingredientesModal.map(nombre => (
                            <label key={nombre} className='flex items-center gap-2 mb-2 cursor-pointer'>
                                <input
                                    type='checkbox'
                                    checked={usados.includes(nombre)}
                                    onChange={() => setUsados(prev =>
                                        prev.includes(nombre)
                                            ? prev.filter(n => n !== nombre)
                                            : [...prev, nombre]
                                    )}
                                />
                                <span className='text-sm text-sky-900'>{nombre}</span>
                            </label>
                        ))}

                        <div className='flex gap-2 mt-4'>
                            <button onClick={() => setModalCocinar(null)} className='flex-1 border border-amber-100 text-sky-900 rounded-lg py-2 text-sm'>Cancelar</button>
                            <button onClick={handleConfirmarCocinar} className='flex-1 bg-green-500 text-white rounded-lg py-2 text-sm font-medium'>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Recetas;