import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatTicketId } from './ticketIdFormatter';
import { TicketContext } from './TicketContext';

const CATEGORIES = ['Electrical', 'Furniture', 'IT Equipment', 'HVAC', 'Plumbing', 'Others'];
const PRIORITIES = ['Low', 'Medium', 'High'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

const TicketDetailPage = () => {
    const { getTicket, updateUserTicket, deleteUserTicket } = useContext(TicketContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [attachmentPreviews, setAttachmentPreviews] = useState([]);
    const [formData, setFormData] = useState({
        resourceLocation: '',
        category: '',
        description: '',
        priority: '',
        contactDetails: '',
    });
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const data = await getTicket(id);
                setTicket(data);
                setFormData({
                    resourceLocation: data.resourceLocation || '',
                    category: data.category || '',
                    description: data.description || '',
                    priority: data.priority || '',
                    contactDetails: data.contactDetails || '',
                });
                setAttachments(Array.isArray(data.images) ? data.images : []);
            } catch (error) {
                console.error('Error fetching ticket', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [getTicket, id]);

    useEffect(() => {
        const previews = attachments.map((item) => (typeof item === 'string' ? item : URL.createObjectURL(item)));
        setAttachmentPreviews(previews);

        return () => {
            previews.forEach((preview, index) => {
                if (attachments[index] instanceof File) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, [attachments]);

    if (loading) return <div className="p-8">Loading ticket details...</div>;
    if (!ticket) return <div className="p-8">Ticket not found.</div>;

    const createdDate = new Date(ticket.createdDate);
    const now = new Date();
    const elapsedHours = Math.floor((now - createdDate) / (1000 * 60 * 60));
    const canManageTicket = ticket.status?.toLowerCase() === 'open';

    let timerColor = 'bg-green-100 text-green-700 border-green-200';
    if (elapsedHours >= 24 && elapsedHours <= 48) timerColor = 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (elapsedHours > 48) timerColor = 'bg-red-100 text-red-700 border-red-200';

    const handleFieldChange = (e) => {
        setFormData((current) => ({
            ...current,
            [e.target.name]: e.target.value,
        }));
    };

    const handleEditStart = () => {
        setFormData({
            resourceLocation: ticket.resourceLocation || '',
            category: ticket.category || '',
            description: ticket.description || '',
            priority: ticket.priority || '',
            contactDetails: ticket.contactDetails || '',
        });
        setAttachments(Array.isArray(ticket.images) ? ticket.images : []);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        handleEditStart();
        setIsEditing(false);
    };

    const handleAttachmentUpload = (e) => {
        const files = Array.from(e.target.files || []);

        if (attachments.length + files.length > 3) {
            alert('You can upload a maximum of 3 images.');
            return;
        }

        const invalidFiles = files.filter((file) => !ALLOWED_IMAGE_TYPES.includes(file.type));
        if (invalidFiles.length > 0) {
            alert('Invalid file format. Please upload only JPG, JPEG, or PNG images.');
            return;
        }

        setAttachments((current) => [...current, ...files]);
        e.target.value = '';
    };

    const handleRemoveAttachment = (indexToRemove) => {
        setAttachments((current) => current.filter((_, index) => index !== indexToRemove));
    };

    const serializeAttachments = async () => Promise.all(
        attachments.map((item) => {
            if (typeof item === 'string') {
                return Promise.resolve(item);
            }

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(item);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        })
    );

    const handleSave = async () => {
        if (!formData.resourceLocation || !formData.category || !formData.description || !formData.priority || !formData.contactDetails) {
            alert('Please fill in all required fields before saving.');
            return;
        }

        setIsSaving(true);
        try {
            const images = await serializeAttachments();
            const updatedTicket = await updateUserTicket(id, { ...formData, images });
            setTicket(updatedTicket);
            setFormData({
                resourceLocation: updatedTicket.resourceLocation || '',
                category: updatedTicket.category || '',
                description: updatedTicket.description || '',
                priority: updatedTicket.priority || '',
                contactDetails: updatedTicket.contactDetails || '',
            });
            setAttachments(Array.isArray(updatedTicket.images) ? updatedTicket.images : []);
            setIsEditing(false);
            alert('Ticket updated successfully.');
        } catch (error) {
            alert(error?.response?.data?.message || error?.response?.data?.error || 'Failed to update ticket.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.');
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            await deleteUserTicket(id);
            alert('Ticket deleted successfully.');
            navigate('/maintenance/my-tickets');
        } catch (error) {
            alert(error?.response?.data?.message || error?.response?.data?.error || 'Failed to delete ticket.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Ticket Details</h1>
                    <p className="text-gray-500">Ticket ID: {formatTicketId(ticket.id)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {canManageTicket && !isEditing && (
                        <>
                            <button
                                type="button"
                                onClick={handleEditStart}
                                className="px-4 py-2 rounded-lg border border-[#053769] text-[#053769] font-medium hover:bg-blue-50 transition"
                            >
                                Edit Ticket
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition disabled:opacity-60"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Ticket'}
                            </button>
                        </>
                    )}
                    {isEditing && (
                        <>
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 rounded-lg bg-[#053769] text-white font-medium hover:bg-[#042d55] transition disabled:opacity-60"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </>
                    )}
                    <div className={`px-6 py-4 rounded-xl border ${timerColor} text-center`}>
                        <p className="text-xs font-bold uppercase tracking-wider">Time Elapsed</p>
                        <p className="text-2xl font-bold">⏱ {elapsedHours}h</p>
                    </div>
                </div>
            </div>

            {!canManageTicket && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    This ticket can no longer be edited or deleted because it is already being processed.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Ticket Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Resource/Location</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="resourceLocation"
                                        value={formData.resourceLocation}
                                        onChange={handleFieldChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                ) : (
                                    <p className="font-medium">{ticket.resourceLocation}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Category</p>
                                {isEditing ? (
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleFieldChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">Select a category</option>
                                        {CATEGORIES.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="font-medium">{ticket.category}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Priority</p>
                                {isEditing ? (
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleFieldChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">Select priority level</option>
                                        {PRIORITIES.map((priority) => (
                                            <option key={priority} value={priority}>{priority}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="font-medium">
                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-sm">{ticket.priority}</span>
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Status</p>
                                <p className="font-medium">
                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-sm">{ticket.status}</span>
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 border-t pt-4">
                            <p className="text-sm text-gray-500 mb-2">Description</p>
                            {isEditing ? (
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFieldChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            ) : (
                                <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Attachments</h2>
                        {isEditing && (
                            <div className="mb-4">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg"
                                    multiple
                                    onChange={handleAttachmentUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#053769] file:text-white hover:file:bg-[#042d55]"
                                />
                                <p className="mt-2 text-xs text-gray-500">Maximum 3 images. You can remove existing attachments and add new ones.</p>
                            </div>
                        )}
                        {attachmentPreviews.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {attachmentPreviews.map((preview, index) => (
                                    <div key={`${ticket.id}-image-${index}`} className="relative">
                                        <img
                                            src={preview}
                                            alt={`Ticket attachment ${index + 1}`}
                                            onClick={() => !isEditing && setSelectedImage(preview)}
                                            className={`w-full h-48 rounded-lg object-cover border border-gray-200 ${isEditing ? '' : 'cursor-pointer hover:opacity-90'} transition`}
                                        />
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAttachment(index)}
                                                className="absolute top-2 right-2 px-2 py-1 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-32 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                No attachments were submitted for this ticket.
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Comments & Updates</h2>
                        <div className="space-y-4">
                            <div className="border-l-2 border-blue-500 pl-4 py-1">
                                <p className="text-sm text-gray-500 flex justify-between">
                                    <span className="font-bold text-gray-800">Admin <span className="font-normal text-gray-400">(System Administrator)</span></span>
                                    <span>{new Date(ticket.createdDate).toLocaleDateString()}</span>
                                </p>
                                <p className="text-gray-700 mt-1">Ticket received and assigned to local technicians.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Information</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Created</p>
                                <p className="font-medium">{new Date(ticket.createdDate).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Contact</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="contactDetails"
                                        value={formData.contactDetails}
                                        onChange={handleFieldChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                ) : (
                                    <p className="font-medium">{ticket.contactDetails}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedImage && !isEditing && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={() => setSelectedImage(null)}
                >
                    <img src={selectedImage} alt="Enlarged view" className="max-w-full max-h-full rounded-lg shadow-2xl transition-transform duration-300 ease-in-out" />
                </div>
            )}
        </div>
    );
};

export default TicketDetailPage;
