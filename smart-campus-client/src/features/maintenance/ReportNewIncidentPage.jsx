import React, { useState } from 'react';

const ReportNewIncidentPage = () => {
  const [formData, setFormData] = useState({
    resourceLocation: '',
    category: '',
    description: '',
    priority: '',
    contactDetails: '',
  });
  //helloff
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert('You can upload maximum 3 images only!');
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Ticket Submitted:', formData);
    console.log('Attached Images:', images);
    alert('✅ Ticket submitted successfully! (This will connect to API later)');
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Report New Incident</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">

        {/* Resource/Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resource/Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="resourceLocation"
            value={formData.resourceLocation}
            onChange={handleChange}
            placeholder="e.g., Lab A-301, Lecture Hall 5, Building B Washroom"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select a category</option>
            <option value="Electrical">Electrical</option>
            <option value="Furniture">Furniture</option>
            <option value="IT Equipment">IT Equipment</option>
            <option value="HVAC">HVAC</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the issue in detail..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 20 characters (0/20)</p>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select priority level</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Preferred Contact Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Contact Details <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="contactDetails"
            value={formData.contactDetails}
            onChange={handleChange}
            placeholder="e.g., email@slit.lk or +94 71 234 5678"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Image Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Attachments (Max 3)
          </label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            multiple
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />

          <div className="mt-4 flex flex-wrap gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#053769] text-white py-4 rounded-xl font-semibold hover:bg-[#042d55] transition"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default ReportNewIncidentPage;