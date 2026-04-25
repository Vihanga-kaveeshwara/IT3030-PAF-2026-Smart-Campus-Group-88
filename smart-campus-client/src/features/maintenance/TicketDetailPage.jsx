import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatTicketId } from './ticketIdFormatter';
import { TicketContext } from './TicketContext';
import { useAuth } from '../../context/AuthContext';
import { FiArrowLeft, FiMapPin, FiTool, FiFileText, FiAlertCircle, FiClock, FiUser, FiEdit, FiSave, FiX, FiTrash2, FiUpload, FiImage, FiCheckCircle, FiXCircle, FiLoader, FiGrid, FiMail } from 'react-icons/fi';

const CATEGORIES = ['Electrical', 'Furniture', 'IT Equipment', 'HVAC', 'Plumbing', 'Others'];
const PRIORITIES = ['Low', 'Medium', 'High'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

const TicketDetailPage = () => {
    const { getTicket, updateUserTicket, deleteUserTicket } = useContext(TicketContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

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

    if (loading) return (
        <div style={{
            padding: '2rem',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                padding: '3rem',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                backdropFilter: 'blur(10px)'
            }}>
                <FiGrid style={{
                    fontSize: '2.5rem',
                    color: '#3b82f6',
                    animation: 'pulse 2s infinite'
                }} />
                <span style={{
                    color: '#64748b',
                    fontSize: '1rem',
                    fontWeight: '500'
                }}>Loading ticket details...</span>
            </div>
        </div>
    );
    if (!ticket) return (
        <div style={{
            padding: '2rem',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                padding: '3rem',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                backdropFilter: 'blur(10px)'
            }}>
                <FiXCircle style={{ fontSize: '2.5rem', color: '#ef4444' }} />
                <span style={{
                    color: '#dc2626',
                    fontSize: '1rem',
                    fontWeight: '500'
                }}>Ticket not found</span>
            </div>
        </div>
    );

    const createdDate = new Date(ticket.createdDate);
    const now = new Date();
    const elapsedHours = Math.floor((now - createdDate) / (1000 * 60 * 60));
    const canManageTicket = ticket.status?.toLowerCase() === 'open';
    const comments = Array.isArray(ticket.comments) ? ticket.comments : [];

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
            
            // Redirect admin users to AllTicketsPage, regular users stay on the same page
            if (isAdmin) {
                navigate('/admin/maintenance');
            }
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
        <div style={{
            padding: '2rem',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    marginBottom: '2rem',
                    padding: '2rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '1.5rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div>
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
                            }}>Ticket Details</h1>
                            <p style={{
                                color: '#64748b',
                                fontSize: '1rem',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span style={{
                                    fontFamily: 'monospace',
                                    fontWeight: '600',
                                    color: '#334155',
                                    background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>Ticket ID: {formatTicketId(ticket.id)}</span>
                            </p>
                            <button
                                onClick={() => navigate('/maintenance/my-tickets')}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginTop: '1rem',
                                    padding: '0.75rem 1.5rem',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    color: '#053769',
                                    fontWeight: '600',
                                    borderRadius: '0.5rem',
                                    border: '1px solid rgba(5, 55, 105, 0.1)',
                                    textDecoration: 'none',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem'
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
                        </div>
                <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        {canManageTicket && !isEditing && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleEditStart}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.5rem',
                                        border: '2px solid #053769',
                                        borderRadius: '0.5rem',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        color: '#053769',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(5, 55, 105, 0.05)';
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 4px 8px rgba(5, 55, 105, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    <FiEdit style={{ fontSize: '1rem' }} />
                                    Edit Ticket
                                </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '0.5rem',
                                    background: isDeleting ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                                    color: '#ffffff',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                                    border: 'none',
                                    opacity: isDeleting ? 0.6 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!isDeleting) {
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 4px 8px rgba(220, 38, 38, 0.3)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isDeleting) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                {isDeleting ? (
                                    <>
                                        <FiLoader style={{ fontSize: '1rem', animation: 'spin 1s linear infinite' }} />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FiTrash2 style={{ fontSize: '1rem' }} />
                                        Delete Ticket
                                    </>
                                )}
                            </button>
                        </>
                    )}
                    {isEditing && (
                        <>
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '0.5rem',
                                    border: '2px solid #d1d5db',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    color: '#374151',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    cursor: isSaving ? 'not-allowed' : 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSaving) {
                                        e.target.style.background = 'rgba(75, 85, 99, 0.05)';
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSaving) {
                                        e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                <FiX style={{ fontSize: '1rem' }} />
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '0.5rem',
                                    background: isSaving ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 'linear-gradient(135deg, #053769 0%, #0f172a 100%)',
                                    color: '#ffffff',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    cursor: isSaving ? 'not-allowed' : 'pointer',
                                    border: 'none',
                                    opacity: isSaving ? 0.6 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSaving) {
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 4px 8px rgba(5, 55, 105, 0.3)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSaving) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                {isSaving ? (
                                    <>
                                        <FiLoader style={{ fontSize: '1rem', animation: 'spin 1s linear infinite' }} />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FiSave style={{ fontSize: '1rem' }} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </>
                    )}
                    <div style={{
                        padding: '1rem 1.5rem',
                        borderRadius: '0.75rem',
                        border: '2px solid',
                        textAlign: 'center',
                        background: elapsedHours < 24 ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' :
                                   elapsedHours <= 48 ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' :
                                   'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                        borderColor: elapsedHours < 24 ? '#22c55e' :
                                     elapsedHours <= 48 ? '#f59e0b' :
                                     '#ef4444',
                        color: elapsedHours < 24 ? '#166534' :
                               elapsedHours <= 48 ? '#d97706' :
                               '#dc2626'
                    }}>
                        <p style={{
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.5rem'
                        }}>Time Elapsed</p>
                        <p style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}>
                            <FiClock style={{ fontSize: '1.5rem' }} />
                            {elapsedHours}h
                        </p>
                    </div>
                </div>
            </div>

            {!canManageTicket && (
                <div style={{
                    marginBottom: '1.5rem',
                    borderRadius: '0.75rem',
                    border: '2px solid #fbbf24',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <FiAlertCircle style={{ fontSize: '1rem' }} />
                    This ticket can no longer be edited or deleted because it is already being processed.
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '1.5rem'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        padding: '1.5rem',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#1e293b',
                            marginBottom: '1rem',
                            paddingBottom: '0.5rem',
                            borderBottom: '2px solid #f1f5f9'
                        }}>Ticket Information</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: '1rem'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <FiMapPin style={{ fontSize: '1rem', color: '#3b82f6' }} />
                                    Resource/Location
                                </p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="resourceLocation"
                                        value={formData.resourceLocation}
                                        onChange={handleFieldChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem 0.75rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                            background: '#ffffff',
                                            transition: 'all 0.2s ease',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#3b82f6';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                ) : (
                                    <p style={{
                                        fontWeight: '500',
                                        color: '#1f2937',
                                        padding: '0.5rem 0.75rem',
                                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #e5e7eb'
                                    }}>{ticket.resourceLocation}</p>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <FiTool style={{ fontSize: '1rem', color: '#3b82f6' }} />
                                    Category
                                </p>
                                {isEditing ? (
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleFieldChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem 0.75rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                            background: '#ffffff',
                                            transition: 'all 0.2s ease',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#3b82f6';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        <option value="">Select a category</option>
                                        {CATEGORIES.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <p style={{
                                        fontWeight: '500',
                                        color: '#1f2937',
                                        padding: '0.5rem 0.75rem',
                                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #e5e7eb'
                                    }}>{ticket.category}</p>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <FiAlertCircle style={{ fontSize: '1rem', color: '#3b82f6' }} />
                                    Priority
                                </p>
                                {isEditing ? (
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleFieldChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem 0.75rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                            background: '#ffffff',
                                            transition: 'all 0.2s ease',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#3b82f6';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        <option value="">Select priority level</option>
                                        {PRIORITIES.map((priority) => (
                                            <option key={priority} value={priority}>{priority}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <p style={{
                                        fontWeight: '500',
                                        color: '#1f2937',
                                        padding: '0.5rem 0.75rem',
                                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #e5e7eb'
                                    }}>{ticket.priority}</p>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <FiCheckCircle style={{ fontSize: '1rem', color: '#3b82f6' }} />
                                    Status
                                </p>
                                <p style={{
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
                                        color: '#c2410c',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600'
                                    }}>{ticket.status}</span>
                                </p>
                            </div>
                        </div>
                        <div style={{
                            marginTop: '1.5rem',
                            paddingTop: '1rem',
                            borderTop: '2px solid #f1f5f9'
                        }}>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#64748b',
                                fontWeight: '500',
                                marginBottom: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <FiFileText style={{ fontSize: '1rem', color: '#3b82f6' }} />
                                Description
                            </p>
                            {isEditing ? (
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFieldChange}
                                    rows="4"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem 0.75rem',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.875rem',
                                        background: '#ffffff',
                                        transition: 'all 0.2s ease',
                                        outline: 'none',
                                        resize: 'vertical',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            ) : (
                                <p style={{
                                    color: '#374151',
                                    lineHeight: '1.6',
                                    padding: '0.75rem',
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #e5e7eb'
                                }}>{ticket.description}</p>
                            )}
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        padding: '1.5rem',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#1e293b',
                            marginBottom: '1rem',
                            paddingBottom: '0.5rem',
                            borderBottom: '2px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <FiImage style={{ fontSize: '1.25rem', color: '#3b82f6' }} />
                            Attachments
                        </h2>
                        {isEditing && (
                            <div style={{ marginBottom: '1rem' }}>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg"
                                    multiple
                                    onChange={handleAttachmentUpload}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        fontSize: '0.875rem',
                                        color: '#64748b',
                                        padding: '0.5rem',
                                        border: '2px dashed #d1d5db',
                                        borderRadius: '0.5rem',
                                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.style.background = 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.borderColor = '#d1d5db';
                                        e.target.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
                                    }}
                                />
                                <p style={{
                                    marginTop: '0.5rem',
                                    fontSize: '0.75rem',
                                    color: '#64748b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}>
                                    <FiAlertCircle style={{ fontSize: '0.75rem' }} />
                                    Maximum 3 images. You can remove existing attachments and add new ones.
                                </p>
                            </div>
                        )}
                        {attachmentPreviews.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: '1rem'
                            }}>
                                {attachmentPreviews.map((preview, index) => (
                                    <div key={`${ticket.id}-image-${index}`} style={{ position: 'relative' }}>
                                        <img
                                            src={preview}
                                            alt={`Ticket attachment ${index + 1}`}
                                            onClick={() => !isEditing && setSelectedImage(preview)}
                                            style={{
                                                width: '100%',
                                                height: '12rem',
                                                borderRadius: '0.5rem',
                                                objectFit: 'cover',
                                                border: '2px solid #e5e7eb',
                                                cursor: isEditing ? 'default' : 'pointer',
                                                opacity: isEditing ? 1 : 0.9,
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isEditing) {
                                                    e.target.style.opacity = '0.8';
                                                    e.target.style.transform = 'scale(1.02)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isEditing) {
                                                    e.target.style.opacity = '0.9';
                                                    e.target.style.transform = 'scale(1)';
                                                }
                                            }}
                                        />
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAttachment(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '0.5rem',
                                                    right: '0.5rem',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '0.375rem',
                                                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                                                    color: '#ffffff',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.transform = 'scale(1.05)';
                                                    e.target.style.boxShadow = '0 4px 6px rgba(220, 38, 38, 0.3)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = 'scale(1)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            >
                                                <FiX style={{ fontSize: '0.75rem' }} />
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                height: '8rem',
                                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                borderRadius: '0.5rem',
                                border: '2px dashed #d1d5db',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#9ca3af',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                            }}>
                                No attachments were submitted for this ticket.
                            </div>
                        )}
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        padding: '1.5rem',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#1e293b',
                            marginBottom: '1rem',
                            paddingBottom: '0.5rem',
                            borderBottom: '2px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <FiMail style={{ fontSize: '1.25rem', color: '#3b82f6' }} />
                            Comments & Updates
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {comments.length > 0 ? comments.map((comment, index) => (
                                <div key={`${comment.timestamp || index}-${index}`} style={{
                                    borderLeft: '4px solid #3b82f6',
                                    paddingLeft: '1rem',
                                    paddingTop: '0.25rem',
                                    paddingBottom: '0.25rem',
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                    borderRadius: '0.5rem',
                                    padding: '1rem'
                                }}>
                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: '#64748b',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: '1rem',
                                        flexWrap: 'wrap'
                                    }}>
                                        <span style={{
                                            fontWeight: '700',
                                            color: '#1e293b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <FiUser style={{ fontSize: '0.875rem', color: '#3b82f6' }} />
                                            {comment.authorName} <span style={{ fontWeight: '400', color: '#9ca3af' }}>({comment.authorRole})</span>
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                            {comment.timestamp ? new Date(comment.timestamp).toLocaleString() : 'Just now'}
                                        </span>
                                    </p>
                                    <p style={{
                                        color: '#374151',
                                        marginTop: '0.25rem',
                                        lineHeight: '1.5'
                                    }}>{comment.content}</p>
                                </div>
                            )) : (
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: '#9ca3af',
                                    textAlign: 'center',
                                    padding: '2rem',
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #e5e7eb'
                                }}>
                                    No comments have been posted yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {ticket.resolutionNotes && (
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '1rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            padding: '1.5rem',
                            border: '1px solid #e5e7eb'
                        }}>
                            <h2 style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                color: '#1e293b',
                                marginBottom: '1rem',
                                paddingBottom: '0.5rem',
                                borderBottom: '2px solid #f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <FiCheckCircle style={{ fontSize: '1.25rem', color: '#22c55e' }} />
                                Resolution Notes
                            </h2>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#64748b',
                                marginBottom: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <FiAlertCircle style={{ fontSize: '0.875rem', color: '#22c55e' }} />
                                Details shared by the assigned technician after resolving this ticket.
                            </p>
                            <div style={{
                                borderRadius: '0.75rem',
                                border: '2px solid #bbf7d0',
                                background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                                padding: '1rem'
                            }}>
                                <p style={{
                                    fontSize: '0.875rem',
                                    lineHeight: '1.6',
                                    color: '#166534'
                                }}>{ticket.resolutionNotes}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {selectedImage && !isEditing && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.8)',
                        zIndex: 50,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        cursor: 'zoom-out'
                    }}
                    onClick={() => setSelectedImage(null)}
                >
                    <img 
                        src={selectedImage} 
                        alt="Enlarged view" 
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            borderRadius: '0.5rem',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            transition: 'transform 0.3s ease-in-out'
                        }}
                    />
                </div>
            )}
        </div>
        </div>
        </div>
    );
};

export default TicketDetailPage;
