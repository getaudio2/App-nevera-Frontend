const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Endpoints de la nevera
export async function getIngredientesNevera() {
  try {
    const response = await fetch(`${BASE_URL}/nevera`);
    if (!response.ok) {
      throw new Error('Error al obtener los ingredientes de la nevera');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addIngredienteNevera(data) {
  try {
    const response = await fetch(`${BASE_URL}/nevera`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Error al agregar el ingrediente a la nevera');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editarIngredienteNevera(id, data) {
  try {
    const response = await fetch(`${BASE_URL}/nevera/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Error al editar el ingrediente de la nevera');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function moverIngredienteACompra(id) {
  try {
    const response = await fetch(`${BASE_URL}/nevera/${id}/mover-compra`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Error al mover el ingrediente a la lista de compra');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function eliminarIngredienteNevera(id) {
  try {
    const response = await fetch(`${BASE_URL}/nevera/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar el ingrediente de la nevera');
    }
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Endpoints de la lista de compra
export async function getIngredientesCompra() {
  try {
    const response = await fetch(`${BASE_URL}/compra`);
    if (!response.ok) {
      throw new Error('Error al obtener los ingredientes de la lista de compra');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addIngredienteCompra(data) {
  try {
    const response = await fetch(`${BASE_URL}/compra`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Error al agregar el ingrediente a la lista de compra');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editarIngredienteCompra(id, data) {
  try {
    const response = await fetch(`${BASE_URL}/compra/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Error al editar el ingrediente de la lista de compra');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function moverIngredienteANevera(id) {
  try {
    const response = await fetch(`${BASE_URL}/compra/${id}/mover-nevera`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Error al mover el ingrediente a la nevera');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function marcarIngredienteComprado(id) {
    return await editarIngredienteCompra(id, { comprado: true });
}

export async function eliminarIngredienteCompra(id) {
  try {
    const response = await fetch(`${BASE_URL}/compra/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar el ingrediente de la lista de compra');
    }
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Endpoint de las recetas con IA
export async function getRecetas() {
    const response = await fetch(`${BASE_URL}/recetas`, {
        method: 'POST',
    });
    if (!response.ok) throw new Error('Error al obtener recetas');
    return await response.json();
}