import React, { useContext, useEffect, useMemo, useState } from 'react';
import { TicketContext } from './TicketContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { FiMapPin, FiTool, FiFileText, FiAlertCircle, FiMail, FiUpload, FiImage, FiX, FiSend, FiLoader, FiArrowLeft } from 'react-icons/fi';

const CATEGORY_OPTIONS = ['Electrical', 'Furniture', 'IT Equipment', 'HVAC', 'Plumbing', 'Others'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const MAX_ATTACHMENTS = 3;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const initialFormState = {
  resourceLocation: '',
  category: '',
  description: '',
  priority: '',
  contactDetails: '',
};

const getContactValidationError = (value) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'Preferred contact details are required.';
  }

  if (trimmedValue.length > 120) {
    return 'Contact details must be 120 characters or less.';
  }

  const normalizedPhone = trimmedValue.replace(/[\s()-]/g, '');
  const looksLikeEmail = trimmedValue.includes('@');
  const looksLikePhone = /^[+\d\s()-]+$/.test(trimmedValue);

  if (looksLikeEmail) {
    if (!EMAIL_REGEX.test(trimmedValue)) {
      return 'Enter a valid email address like name@example.com.';
    }
    return '';
  }

  if (!looksLikePhone) {
    return 'Enter a valid email address or phone number.';
  }

  if (normalizedPhone.startsWith('+')) {
    const phoneDigits = normalizedPhone.slice(1);
    if (!/^\d+$/.test(phoneDigits)) {
      return 'Phone number can contain only digits after the + sign.';
    }
    if (phoneDigits.length < 9 || phoneDigits.length > 14) {
      return 'Phone number must contain 9 to 14 digits after the country code.';
    }
    return '';
  }

  if (!/^\d+$/.test(normalizedPhone)) {
    return 'Phone number can contain only digits, spaces, parentheses, or hyphens.';
  }

  if (normalizedPhone.length < 10 || normalizedPhone.length > 12) {
    return 'Phone number must contain 10 to 12 digits.';
  }

  return '';
};

const getFieldError = (name, value) => {
  const trimmedValue = value.trim();

  switch (name) {
    case 'resourceLocation':
      if (!trimmedValue) return 'Please select a resource or location.';
      return '';
    case 'category':
      if (!trimmedValue) return 'Please select a category.';
      if (!CATEGORY_OPTIONS.includes(trimmedValue)) return 'Please choose a valid category.';
      return '';
    case 'description':
      if (!trimmedValue) return 'Description is required.';
      if (trimmedValue.length < 20) return 'Description must be at least 20 characters.';
      if (trimmedValue.length > 1000) return 'Description must be 1000 characters or less.';
      return '';
    case 'priority':
      if (!trimmedValue) return 'Please select a priority level.';
      if (!PRIORITY_OPTIONS.includes(trimmedValue)) return 'Please choose a valid priority.';
      return '';
    case 'contactDetails':
      return getContactValidationError(trimmedValue);
    default:
      return '';
  }
};

const validateForm = (formData) => ({
  resourceLocation: getFieldError('resourceLocation', formData.resourceLocation),
  category: getFieldError('category', formData.category),
  description: getFieldError('description', formData.description),
  priority: getFieldError('priority', formData.priority),
  contactDetails: getFieldError('contactDetails', formData.contactDetails),
});

const ReportNewIncidentPage = () => {
  const { addTicket } = useContext(TicketContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [images, setImages] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imageError, setImageError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [facilitiesLoading, setFacilitiesLoading] = useState(true);
  const [facilitiesError, setFacilitiesError] = useState(null);

  const imagePreviews = useMemo(
    () => images.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [images]
  );

  useEffect(() => () => {
    imagePreviews.forEach((image) => URL.revokeObjectURL(image.url));
  }, [imagePreviews]);

  useEffect(() => {
    if (!successToast) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setSuccessToast('');
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [successToast]);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setFacilitiesLoading(true);
        const response = await api.get('/api/facilities');
        setFacilities(response.data);
        setFacilitiesError(null);
      } catch (err) {
        setFacilitiesError('Failed to load facilities. Please try again later.');
        console.error('Error fetching facilities:', err);
      } finally {
        setFacilitiesLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (touched[name]) {
      setFieldErrors((current) => ({
        ...current,
        [name]: getFieldError(name, value),
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    setTouched((current) => ({
      ...current,
      [name]: true,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: getFieldError(name, value),
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    setSubmitError('');

    if (files.length === 0) {
      return;
    }

    if (images.length + files.length > MAX_ATTACHMENTS) {
      setImageError(`You can upload up to ${MAX_ATTACHMENTS} images only.`);
      event.target.value = '';
      return;
    }

    const invalidTypeFile = files.find((file) => !ALLOWED_IMAGE_TYPES.includes(file.type));
    if (invalidTypeFile) {
      setImageError('Only JPG, JPEG, and PNG files are allowed.');
      event.target.value = '';
      return;
    }

    const oversizedFile = files.find((file) => file.size > MAX_IMAGE_SIZE_BYTES);
    if (oversizedFile) {
      setImageError(`Each image must be ${MAX_IMAGE_SIZE_MB}MB or smaller.`);
      event.target.value = '';
      return;
    }

    setImageError('');
    setImages((current) => [...current, ...files]);
    event.target.value = '';
  };

  const removeImage = (indexToRemove) => {
    setImages((current) => current.filter((_, index) => index !== indexToRemove));
    setImageError('');
  };

  const serializeImages = async () => Promise.all(
    images.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    }))
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextTouched = {
      resourceLocation: true,
      category: true,
      description: true,
      priority: true,
      contactDetails: true,
    };
    const nextErrors = validateForm(formData);

    setTouched(nextTouched);
    setFieldErrors(nextErrors);
    setSubmitError('');

    const hasFieldErrors = Object.values(nextErrors).some(Boolean);
    if (hasFieldErrors || imageError) {
      setSubmitError('Please fix the highlighted fields before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const base64Images = await serializeImages();
      const submissionData = {
        ...formData,
        resourceLocation: formData.resourceLocation.trim(),
        description: formData.description.trim(),
        contactDetails: formData.contactDetails.trim(),
        images: base64Images,
      };

      await addTicket(submissionData);

      setFormData(initialFormState);
      setImages([]);
      setFieldErrors({});
      setTouched({});
      setImageError('');
      setSubmitError('');
      setSuccessToast('Ticket Submitted Successfully');
      
      // Redirect to MyTicketsPage after successful submission
      navigate('/maintenance/my-tickets');
    } catch (error) {
      const apiMessage = error?.response?.data?.message
        || error?.response?.data?.error
        || 'Failed to submit ticket. Please try again.';
      setSubmitError(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const descriptionCount = formData.description.trim().length;

  const getInputClassName = (fieldName) => {
    const hasError = touched[fieldName] && fieldErrors[fieldName];
    return `w-full px-4 py-3 rounded-lg outline-none transition ${
      hasError
        ? 'border border-red-300 bg-red-50 focus:border-red-500'
        : 'border border-gray-300 focus:border-blue-500'
    }`;
  };

  return (
    <div style={{
      padding: '2rem',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {successToast && (
          <div style={{
            position: 'fixed',
            top: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            width: 'min(92vw, 32rem)',
            borderRadius: '1rem',
            border: '2px solid #22c55e',
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            padding: '1rem 1.25rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1rem',
              width: '100%'
            }}>
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#166534'
                }}>{successToast}</p>
                <p style={{
                  marginTop: '0.25rem',
                  fontSize: '0.75rem',
                  color: '#15803d'
                }}>Your maintenance request has been recorded and sent for review.</p>
              </div>
              <button
                type="button"
                onClick={() => setSuccessToast('')}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#15803d',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#166534';
                  e.target.style.background = 'rgba(34, 197, 94, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#15803d';
                  e.target.style.background = 'none';
                }}
              >
                <FiX style={{ fontSize: '1rem' }} />
              </button>
            </div>
          </div>
        )}

      <div style={{
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => navigate('/maintenance/my-tickets')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#053769',
              fontWeight: '600',
              borderRadius: '0.5rem',
              border: '1px solid rgba(5, 55, 105, 0.1)',
              textDecoration: 'none',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(5, 55, 105, 0.05)';
              e.target.style.transform = 'translateX(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.9)';
              e.target.style.transform = 'translateX(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
            }}
          >
            <FiArrowLeft style={{ fontSize: '1rem' }} />
            Back to My Tickets
          </button>
          
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#1e293b',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Report New Incident</h1>
          <p style={{
            color: '#64748b',
            fontSize: '1rem',
            fontWeight: '500'
          }}>Submit a maintenance request for campus facilities</p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '1.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(10px)',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {submitError && (
            <div style={{
              borderRadius: '0.75rem',
              border: '2px solid #fecaca',
              background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FiAlertCircle style={{ fontSize: '1rem' }} />
              {submitError}
            </div>
          )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resource/Location <span className="text-red-500">*</span>
          </label>
          {facilitiesLoading ? (
            <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-500">
              Loading facilities...
            </div>
          ) : facilitiesError ? (
            <div className="w-full px-4 py-3 rounded-lg border border-red-300 bg-red-50">
              <p className="text-sm text-red-600">{facilitiesError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-2 text-xs text-red-700 underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <select
              name="resourceLocation"
              value={formData.resourceLocation}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName('resourceLocation')}
            >
              <option value="">Select a resource or location</option>
              {facilities.map((facility) => (
                <option key={facility.id} value={`${facility.name} - ${facility.location || 'No location specified'}`}>
                  {facility.name} - {facility.location || 'No location specified'}
                </option>
              ))}
            </select>
          )}
          {touched.resourceLocation && fieldErrors.resourceLocation && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.resourceLocation}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClassName('category')}
          >
            <option value="">Select a category</option>
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {touched.category && fieldErrors.category && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="4"
            placeholder="Describe the issue in detail..."
            className={getInputClassName('description')}
          />
          <div className="mt-1 flex items-center justify-between gap-3">
            {touched.description && fieldErrors.description ? (
              <p className="text-xs text-red-600">{fieldErrors.description}</p>
            ) : (
              <p className="text-xs text-gray-500">Describe what happened, where it happened, and any impact.</p>
            )}
            <p className={`text-xs ${descriptionCount < 20 ? 'text-amber-600' : 'text-gray-500'}`}>
              {descriptionCount}/1000
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClassName('priority')}
          >
            <option value="">Select priority level</option>
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
          {touched.priority && fieldErrors.priority && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.priority}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Contact Details <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="contactDetails"
            value={formData.contactDetails}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., email@slit.lk or +94 71 234 5678"
            className={getInputClassName('contactDetails')}
          />
          <div className="mt-1">
            {touched.contactDetails && fieldErrors.contactDetails ? (
              <p className="text-xs text-red-600">{fieldErrors.contactDetails}</p>
            ) : (
              <p className="text-xs text-gray-500">Use a valid email like `name@example.com` or a phone number like `+94 71 234 5678`.</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Attachments
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            multiple
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>Up to {MAX_ATTACHMENTS} images</span>
            <span>JPG, JPEG, PNG only</span>
            <span>Max {MAX_IMAGE_SIZE_MB}MB each</span>
          </div>
          {imageError && (
            <p className="mt-2 text-xs text-red-600">{imageError}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-4">
            {imagePreviews.map((image, index) => (
              <div key={`${image.file.name}-${index}`} className="relative">
                <img
                  src={image.url}
                  alt={`Attachment preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '1rem 2rem',
            background: isSubmitting ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 'linear-gradient(135deg, #053769 0%, #0f172a 100%)',
            color: '#ffffff',
            fontWeight: '700',
            borderRadius: '0.75rem',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            fontSize: '1rem',
            boxShadow: '0 4px 6px rgba(5, 55, 105, 0.2)',
            opacity: isSubmitting ? 0.6 : 1,
            marginTop: '1rem'
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 12px rgba(5, 55, 105, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px rgba(5, 55, 105, 0.2)';
            }
          }}
        >
          {isSubmitting ? (
            <>
              <FiLoader style={{ fontSize: '1.25rem', animation: 'spin 1s linear infinite' }} />
              Submitting Ticket...
            </>
          ) : (
            <>
              <FiSend style={{ fontSize: '1.25rem' }} />
              Submit Ticket
            </>
          )}
        </button>
        </form>
      </div>
    </div>
  );
};

export default ReportNewIncidentPage;
