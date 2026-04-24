import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

export const TicketContext = createContext();

const API_BASE_URL = 'http://localhost:8080/api/tickets';
const DEFAULT_USER_ID = 'user-123';
const DEFAULT_TECHNICIAN_ID = 'Mike Johnson';

const getAxiosConfig = (userId = DEFAULT_USER_ID) => ({
  headers: {
    'user-id': userId,
  },
});

const initialState = {
  tickets: [],
  allTickets: [],
  assignedTickets: [],
  loading: false,
  error: null,
};

const ticketReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, tickets: action.payload };
    case 'FETCH_ALL_SUCCESS':
      return { ...state, loading: false, allTickets: action.payload };
    case 'FETCH_ASSIGNED_SUCCESS':
      return { ...state, loading: false, assignedTickets: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_TICKET':
      return { ...state, tickets: [action.payload, ...state.tickets] };
    case 'UPDATE_TICKET':
      return {
        ...state,
        allTickets: state.allTickets.map((ticket) => ticket.id === action.payload.id ? action.payload : ticket),
        tickets: state.tickets.map((ticket) => ticket.id === action.payload.id ? action.payload : ticket),
        assignedTickets: state.assignedTickets.map((ticket) => ticket.id === action.payload.id ? action.payload : ticket),
      };
    case 'DELETE_TICKET':
      return {
        ...state,
        allTickets: state.allTickets.filter((ticket) => ticket.id !== action.payload),
        tickets: state.tickets.filter((ticket) => ticket.id !== action.payload),
        assignedTickets: state.assignedTickets.filter((ticket) => ticket.id !== action.payload),
      };
    default:
      return state;
  }
};

export const TicketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  const fetchTickets = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await axios.get(`${API_BASE_URL}/my`, getAxiosConfig());
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (err) {
      console.error('Error fetching tickets', err);
      dispatch({ type: 'FETCH_ERROR', payload: err.message || 'Error fetching tickets' });
    }
  }, []);

  const fetchAllTickets = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await axios.get(API_BASE_URL, getAxiosConfig());
      dispatch({ type: 'FETCH_ALL_SUCCESS', payload: response.data });
    } catch (err) {
      console.error('Error fetching all tickets', err);
      dispatch({ type: 'FETCH_ERROR', payload: err.message || 'Error fetching all tickets' });
    }
  }, []);

  const fetchAssignedTickets = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await axios.get(`${API_BASE_URL}/assigned`, getAxiosConfig(DEFAULT_TECHNICIAN_ID));
      dispatch({ type: 'FETCH_ASSIGNED_SUCCESS', payload: response.data });
    } catch (err) {
      console.error('Error fetching assigned tickets', err);
      dispatch({ type: 'FETCH_ERROR', payload: err.message || 'Error fetching assigned tickets' });
    }
  }, []);

  const getTicket = useCallback(async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, getAxiosConfig());
      return response.data;
    } catch (err) {
      console.error('Error fetching single ticket', err);
      throw err;
    }
  }, []);

  const addTicket = async (formData) => {
    try {
      const response = await axios.post(API_BASE_URL, formData, getAxiosConfig());
      dispatch({ type: 'ADD_TICKET', payload: response.data });
      return response.data;
    } catch (err) {
      console.error('Error adding ticket', err);
      throw err;
    }
  };

  const assignTicket = async (id, assignee) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/assign`, { assignee }, getAxiosConfig());
      dispatch({ type: 'UPDATE_TICKET', payload: response.data });
      return response.data;
    } catch (err) {
      console.error('Error assigning ticket', err);
      throw err;
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/status`, { status }, getAxiosConfig());
      dispatch({ type: 'UPDATE_TICKET', payload: response.data });
      return response.data;
    } catch (err) {
      console.error('Error updating status', err);
      throw err;
    }
  };

  const rejectTicket = async (id, reason) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/reject`, { reason }, getAxiosConfig());
      dispatch({ type: 'UPDATE_TICKET', payload: response.data });
      return response.data;
    } catch (err) {
      console.error('Error rejecting ticket', err);
      throw err;
    }
  };

  const addTicketComment = async (id, commentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${id}/comments`, commentData, getAxiosConfig(DEFAULT_TECHNICIAN_ID));
      dispatch({ type: 'UPDATE_TICKET', payload: response.data });
      return response.data;
    } catch (err) {
      console.error('Error posting comment', err);
      throw err;
    }
  };

  const startWork = async (id) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/start-work`, {}, getAxiosConfig(DEFAULT_TECHNICIAN_ID));
      dispatch({ type: 'UPDATE_TICKET', payload: response.data });
      return response.data;
    } catch (err) {
      console.error('Error starting work', err);
      throw err;
    }
  };

  const resolveTicket = async (id, resolutionNotes) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/resolve`, { resolutionNotes }, getAxiosConfig(DEFAULT_TECHNICIAN_ID));
      dispatch({ type: 'UPDATE_TICKET', payload: response.data });
      return response.data;
    } catch (err) {
      console.error('Error resolving ticket', err);
      throw err;
    }
  };

  const updateWorkProgress = async (id, progress) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/progress`, { progress }, getAxiosConfig(DEFAULT_TECHNICIAN_ID));
      dispatch({ type: 'UPDATE_TICKET', payload: response.data });
      return response.data;
    } catch (err) {
      console.error('Error updating work progress', err);
      throw err;
    }
  };

  const updateUserTicket = async (id, ticketData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, ticketData, getAxiosConfig());
      dispatch({ type: 'UPDATE_TICKET', payload: response.data });
      return response.data;
    } catch (err) {
      console.error('Error updating ticket', err);
      throw err;
    }
  };

  const deleteUserTicket = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, getAxiosConfig());
      dispatch({ type: 'DELETE_TICKET', payload: id });
    } catch (err) {
      console.error('Error deleting ticket', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <TicketContext.Provider value={{
      state,
      fetchTickets,
      fetchAllTickets,
      fetchAssignedTickets,
      getTicket,
      addTicket,
      addTicketComment,
      updateUserTicket,
      deleteUserTicket,
      assignTicket,
      startWork,
      resolveTicket,
      updateWorkProgress,
      updateStatus,
      rejectTicket,
    }}
    >
      {children}
    </TicketContext.Provider>
  );
};
