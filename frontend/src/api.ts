const API_URL = 'http://localhost:3000/establishments';

export const api = {
  getAll: async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  },
  create: async (data: any) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json();
      const message = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message;
      throw new Error(message || 'Failed to create');
    }
    return res.json();
  },
  update: async (id: number, data: any) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json();
      const message = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message;
      throw new Error(message || 'Failed to update');
    }
    return res.json();
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
  },
  executeExport: async (strategyType: string) => {
    const res = await fetch(`http://localhost:3000/export/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ strategyType }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to execute export');
    }
    return res.json();
  },
  getViolations: async () => {
    const res = await fetch(`http://localhost:3000/export/violations`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch violations');
    }
    return res.json();
  }
};
