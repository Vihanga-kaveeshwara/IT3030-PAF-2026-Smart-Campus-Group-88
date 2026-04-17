import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

export const TicketContext = createContext();

const initialState = {
  tickets: [],
  loading: false,
  error: null,
};

const ticketReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, tickets: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_TICKET':
      return { ...state, tickets: [action.payload, ...state.tickets] };
    default:
      return state;
  }
};

export const TicketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  const fetchTickets = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await axios.get('http://localhost:8080/api/tickets/my');
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (err) {
      console.error("Error fetching tickets", err);
      dispatch({ type: 'FETCH_ERROR', payload: err.message || 'Error fetching tickets' });
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const addTicket = async (ticketData) => {
    try {
      const response = await axios.post('http://localhost:8080/api/tickets', ticketData);
      dispatch({ type: 'ADD_TICKET', payload: response.data });
      return response.data;
    } catch (err) {
      console.error("Error adding ticket", err);
      throw err;
    }
  };

  return (
    <TicketContext.Provider value={{ state, fetchTickets, addTicket }}>
      {children}
    </TicketContext.Provider>
  );
};
