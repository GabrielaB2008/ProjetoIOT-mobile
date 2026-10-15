const BASE_URL = 'http://10.137.11.6/api/sensor/status';

async function request(url, options) {
  const res = await fetch(url, options);
  let json = null;
  try {
    json = await res.json();
  } catch (_) {}
  if (!res.ok) {
    throw new Error(json?.error || json?.message || `Erro ${res.status}`);
  }
  return json;
}

export async function listarSensores() {
  const json = await request(`${BASE_URL}/listar`);
  return json.data ?? [];
}

export async function consultarStatus(codigo) {
  const json = await request(
    `${BASE_URL}/visualizar/${encodeURIComponent(codigo.trim().toLowerCase())}`
  );
  return json.status;
}

// ATENÇÃO: ajuste método e corpo conforme a sua API
export async function atualizarStatus(codigo, status) {
  const json = await request(`${BASE_URL}/atualizar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ codigo: codigo.trim(), status }),
  });
  if (json?.status === false) throw new Error(json.message || 'Falha ao atualizar');
  return json;
}