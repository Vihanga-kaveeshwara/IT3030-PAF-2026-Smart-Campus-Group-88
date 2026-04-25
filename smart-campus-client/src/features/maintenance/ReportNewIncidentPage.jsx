import React, { useContext, useEffect, useMemo, useState } from 'react';
import { TicketContext } from './TicketContext';

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
      if (!trimmedValue) return 'Resource or location is required.';
      if (trimmedValue.length < 5) return 'Please enter at least 5 characters.';
      if (trimmedValue.length > 120) return 'Location must be 120 characters or less.';
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
  const [formData, setFormData] = useState(initialFormState);
  const [images, setImages] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imageError, setImageError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

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
    <div className="p-8 max-w-3xl mx-auto relative">
      {successToast && (
        <div className="fixed top-6 left-1/2 z-50 w-[min(92vw,32rem)] -translate-x-1/2 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-green-800">{successToast}</p>
              <p className="mt-1 text-xs text-green-700">Your maintenance request has been recorded and sent for review.</p>
            </div>
            <button
              type="button"
              onClick={() => setSuccessToast('')}
              className="text-sm font-semibold text-green-700 hover:text-green-900"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Report New Incident</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resource/Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="resourceLocation"
            value={formData.resourceLocation}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., Lab A-301, Lecture Hall 5, Building B Washroom"
            className={getInputClassName('resourceLocation')}
          />
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
          className="w-full bg-[#053769] text-white py-4 rounded-xl font-semibold hover:bg-[#042d55] transition disabled:opacity-70"
        >
          {isSubmitting ? 'Submitting Ticket...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
};

export default ReportNewIncidentPage;
