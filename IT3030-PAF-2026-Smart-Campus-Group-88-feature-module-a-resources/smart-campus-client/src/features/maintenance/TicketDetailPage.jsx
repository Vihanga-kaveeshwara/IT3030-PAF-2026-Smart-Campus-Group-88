import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TicketDetailPage = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/tickets/${id}`);
                setTicket(response.data);
            } catch (error) {
                console.error('Error fetching ticket', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [id]);

    if (loading) return <div className="p-8">Loading ticket details...</div>;
    if (!ticket) return <div className="p-8">Ticket not found.</div>;

    const createdDate = new Date(ticket.createdDate);
    const now = new Date();
    const elapsedHours = Math.floor((now - createdDate) / (1000 * 60 * 60));
    
    let timerColor = 'bg-green-100 text-green-700 border-green-200';
    if (elapsedHours >= 24 && elapsedHours <= 48) timerColor = 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (elapsedHours > 48) timerColor = 'bg-red-100 text-red-700 border-red-200';

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Ticket Details</h1>
                    <p className="text-gray-500">Ticket ID: {ticket.id}</p>
                </div>
                <div className={`px-6 py-4 rounded-xl border ${timerColor} text-center`}>
                    <p className="text-xs font-bold uppercase tracking-wider">Time Elapsed</p>
                    <p className="text-2xl font-bold">⏱ {elapsedHours}h</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Ticket Information</h2>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">📍 Resource/Location</p>
                                <p className="font-medium">{ticket.resourceLocation}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">🏷️ Category</p>
                                <p className="font-medium">{ticket.category}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">⚠️ Priority</p>
                                <p className="font-medium">
                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-sm">{ticket.priority}</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">📅 Status</p>
                                <p className="font-medium">
                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-sm">{ticket.status}</span>
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 border-t pt-4">
                            <p className="text-sm text-gray-500 mb-2">Description</p>
                            <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Attachments</h2>
                        <div className="flex gap-4">
                            <div className="w-1/2 h-32 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center text-gray-400">Image 1 Placeholder</div>
                            <div className="w-1/2 h-32 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center text-gray-400">Image 2 Placeholder</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">💬 Comments & Updates</h2>
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
                                <p className="font-medium">{ticket.contactDetails}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailPage;
