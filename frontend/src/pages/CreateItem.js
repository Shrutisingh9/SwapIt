import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateItem.css';

function CreateItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: 'GOOD',
    location: '',
    tags: '',
    isForSwap: true,
    isForDonation: false,
    ngoId: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  React.useEffect(() => {
    const fetchNgos = async () => {
      try {
        const res = await axios.get('/api/v1/ngos');
        setNgos(res.data || []);
      } catch (e) {
        console.error('Failed to load NGOs', e);
      }
    };
    fetchNgos();
  }, []);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const valid = files.filter((f) => f.type.startsWith('image/'));
    const combined = [...imageFiles, ...valid].slice(0, 5);
    setImageFiles(combined);
    const urls = await Promise.all(combined.map(fileToDataUrl));
    setImagePreviews(urls);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (imageFiles.length === 0) {
      setError('Please add at least one photo');
      return;
    }

    setLoading(true);
    try {
      const imageUrls = await Promise.all(imageFiles.map(fileToDataUrl));
      const payload = {
        ...formData,
        imageUrls,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        isForSwap: formData.isForSwap && !formData.isForDonation,
        isForDonation: formData.isForDonation,
        ngoId: formData.isForDonation && formData.ngoId ? formData.ngoId : undefined
      };
      await axios.post('/api/v1/items', payload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-item-page fade-in">
      <div className="create-item-card">
        <div className="create-item-header">
          <i className="fas fa-plus-circle"></i>
          <h2>Add Item</h2>
          <p>Share your item with the SwapIt community</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><i className="fas fa-heading"></i> Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Vintage Camera, Gaming Console"
              required
            />
          </div>
          <div className="form-group">
            <label><i className="fas fa-align-left"></i> Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your item in detail..."
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label><i className="fas fa-tag"></i> Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label><i className="fas fa-check-circle"></i> Condition *</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                required
              >
                <option value="NEW">New</option>
                <option value="GOOD">Good</option>
                <option value="USED">Used</option>
                <option value="POOR">Poor</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label><i className="fas fa-map-marker-alt"></i> City</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Mumbai, Delhi, Bangalore"
            />
          </div>
          <div className="form-group">
            <label>Availability</label>
            <div className="availability-options">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isForSwap && !formData.isForDonation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isForSwap: e.target.checked,
                      isForDonation: formData.isForDonation && !e.target.checked ? true : formData.isForDonation
                    })
                  }
                />
                <span>Available for Swap</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.isForDonation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isForDonation: e.target.checked,
                      isForSwap: !e.target.checked ? true : formData.isForSwap
                    })
                  }
                />
                <span>Donate to NGO</span>
              </label>
            </div>
          </div>
          {formData.isForDonation && (
            <div className="form-group">
              <label><i className="fas fa-hand-holding-heart"></i> Choose NGO</label>
              <select
                value={formData.ngoId}
                onChange={(e) => setFormData({ ...formData, ngoId: e.target.value })}
                required
              >
                <option value="">Select NGO</option>
                {ngos.map((ngo) => (
                  <option key={ngo._id} value={ngo._id}>
                    {ngo.name} {ngo.city ? `- ${ngo.city}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group">
            <label><i className="fas fa-tags"></i> Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. vintage, collectible, rare"
            />
          </div>

          <div className="form-group">
            <label><i className="fas fa-camera"></i> Photos *</label>
            <div className="photo-upload-area">
              <label className="photo-upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  onChange={handleImageChange}
                />
                <i className="fas fa-camera"></i>
                <span>Take photo or upload</span>
              </label>
              <p className="photo-hint">Use camera or select from device. Max 5 images.</p>
            </div>
            {imagePreviews.length > 0 && (
              <div className="photo-previews">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="photo-preview">
                    <img src={src} alt={`Preview ${i + 1}`} />
                    <button type="button" className="photo-remove" onClick={() => removeImage(i)} aria-label="Remove">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading"></span>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i>
                  <span>Create Item</span>
                </>
              )}
            </button>
            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateItem;
