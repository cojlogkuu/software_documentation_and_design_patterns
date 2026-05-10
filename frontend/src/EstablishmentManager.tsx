import { useState, useEffect } from 'react';
import { api } from './api';

export function EstablishmentManager() {
  const [establishments, setEstablishments] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', address: '', type: 'Hotel', stars: '', cuisineType: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  };

  const openModal = (isEdit = false, est: any = null) => {
    setError(null);
    if (isEdit && est) {
      setEditingId(est.placeId);
      const isHotel = est.stars !== undefined && est.stars !== null;
      setFormData({
        name: est.name,
        address: est.address || '',
        type: isHotel ? 'Hotel' : 'Restaurant',
        stars: est.stars || '',
        cuisineType: est.cuisineType || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', address: '', type: 'Hotel', stars: '', cuisineType: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setError(null);
  };

  const loadData = async () => {
    try {
      const data = await api.getAll();
      const sorted = data.sort((a: any, b: any) => a.placeId - b.placeId);
      setEstablishments(sorted);
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        name: formData.name,
        address: formData.address,
        type: formData.type
      };
      
      if (payload.type === 'Hotel') {
        payload.stars = parseInt(formData.stars, 10);
      } else {
        payload.cuisineType = formData.cuisineType;
      }

      if (editingId) {
        await api.update(editingId, payload);
      } else {
        await api.create(payload);
      }
      
      closeModal();
      loadData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this establishment?')) return;
    try {
      await api.delete(id);
      loadData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Establishment Manager</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>Create New</button>
      </div>
      
      {error && <div className="alert-error">{error}</div>}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Establishment' : 'Create New Establishment'}</h3>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Type: </label>
                  <select name="type" className="form-input" value={formData.type} onChange={handleInputChange} disabled={!!editingId}>
                    <option value="Hotel">Hotel</option>
                    <option value="Restaurant">Restaurant</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Name: </label>
                  <input name="name" className="form-input" value={formData.name} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label>Address: </label>
                  <input name="address" className="form-input" value={formData.address} onChange={handleInputChange} />
                </div>

                {formData.type === 'Hotel' && (
                  <div className="form-group">
                    <label>Stars (1-5): </label>
                    <input type="number" name="stars" className="form-input" min="1" max="5" value={formData.stars} onChange={handleInputChange} required />
                  </div>
                )}

                {formData.type === 'Restaurant' && (
                  <div className="form-group">
                    <label>Cuisine Type: </label>
                    <input name="cuisineType" className="form-input" value={formData.cuisineType} onChange={handleInputChange} required />
                  </div>
                )}

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  <button type="button" className="btn btn-secondary" style={{ marginLeft: 0 }} onClick={closeModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Name</th>
              <th>Address</th>
              <th>Specifics</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {establishments.map(est => {
              const isHotel = est.stars !== undefined && est.stars !== null;
              const typeLabel = isHotel ? 'Hotel' : 'Restaurant';
              const specificsLabel = isHotel ? `Stars: ${est.stars}` : `Cuisine: ${est.cuisineType}`;
              
              return (
                <tr key={est.placeId}>
                  <td>{est.placeId}</td>
                  <td>{typeLabel}</td>
                  <td>{est.name}</td>
                  <td>{est.address}</td>
                  <td>{specificsLabel}</td>
                  <td className="actions-cell">
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', margin: 0 }} onClick={() => openModal(true, est)}>Edit</button>
                    <button className="btn btn-danger" style={{ padding: '6px 12px' }} onClick={() => handleDelete(est.placeId)}>Delete</button>
                  </td>
                </tr>
              );
            })}
            {establishments.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No establishments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
