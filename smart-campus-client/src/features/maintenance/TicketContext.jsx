// Frontend: src/features/maintenance/TicketContext.jsx
import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

export const TicketContext = createContext();

const API_BASE_URL = 'http://localhost:8080/api/tickets';

// Common headers, especially useful for identification in lab projects.
// Change 'user-123' to a valid ID from your database if necessary.
const AXIOS_CONFIG = {
  headers: {
    'user-id': 'user-123' 
  }
};

const initialState = {
  tickets: [],
  allTickets: [],
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
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_TICKET':
      return { ...state, tickets: [action.payload, ...state.tickets] };
    case 'UPDATE_TICKET':
      return {
        ...state,
        allTickets: state.allTickets.map(t => t.id === action.payload.id ? action.payload : t),
        tickets: state.tickets.map(t => t.id === action.payload.id ? action.payload : t)
      };
    case 'DELETE_TICKET':
      return {
        ...state,
        allTickets: state.allTickets.filter(t => t.id !== action.payload),
        tickets: state.tickets.filter(t => t.id !== action.payload)
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
      // Note: If this results in a 500 error, verify that the backend 
      // doesn't require an Auth token or a hardcoded User ID in the headers.
      const response = await axios.get(`${API_BASE_URL}/my`, AXIOS_CONFIG);
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (err) {
      console.error("Error fetching tickets", err);
      dispatch({ type: 'FETCH_ERROR', payload: err.message || 'Error fetching tickets' });
    }
  }, []);

  const fetchAllTickets = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await axios.get(API_BASE_URL, AXIOS_CONFIG);
      dispatch({ type: 'FETCH_ALL_SUCCESS', payload: response.data });
    } catch (err) {
      console.error("Error fetching all tickets", err);
      dispatch({ type: 'FETCH_ERROR', payload: err.message || 'Error fetching all tickets' });
    }
  }, []);

  const getTicket = useCallback(async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, AXIOS_CONFIG);
      return response.data;
    } catch (err) {
      console.error("Error fetching single ticket", err);
      throw err;
    }
  }, []);


  const addTicket = async (formData) => {
    try {
      // By passing a plain object, Axios automatically sets 'Content-Type: application/json'.
      // This fixes the 415 error.
      // We also include the identification header to avoid 500 errors.
      const response = await axios.post(API_BASE_URL, formData, AXIOS_CONFIG);
      dispatch({ type: 'ADD_TICKET', payload: response.data });
      return response.data;
    } catch (err) {
      console.error("Error adding ticket", err);
      throw err;
    }
  };

  const assignTicket = async (id, assignee) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/assign`, { assignee }, AXIOS_CONFIG);
      dispatch({ type: 'UPDATE_TICKET', payload: response.data });
      return response.data;
    } catch (err) {
      console.error("Error assigning ticket", err);
      throw err;
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/status`, { status }, AXIOS_CONFIG);
      dispatch({ type: 'UPDATE_TICKET', payload: response.data });
      return response.data;
    } catch (err) {
      console.error("Error updating status", err);
      throw err;
    }
  };

  const rejectTicket = async (id, reason) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/reject`, { reason }, AXIOS_CONFIG);
      dispatch({ type: 'UPDATE_TICKET', payload: response.data });
      return response.data;
    } catch (err) {
      console.error("Error rejecting ticket", err);
      throw err;
    }
  };

  const updateUserTicket = async (id, ticketData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, ticketData, AXIOS_CONFIG);
      dispatch({ type: 'UPDATE_TICKET', payload: response.data });
      return response.data;
    } catch (err) {
      console.error("Error updating ticket", err);
      throw err;
    }
  };

  const deleteUserTicket = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, AXIOS_CONFIG);
      dispatch({ type: 'DELETE_TICKET', payload: id });
    } catch (err) {
      console.error("Error deleting ticket", err);
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
      getTicket,
      addTicket,
      updateUserTicket,
      deleteUserTicket,
      assignTicket,
      updateStatus,
      rejectTicket
    }}>
      {children}
    </TicketContext.Provider>
  );
};
