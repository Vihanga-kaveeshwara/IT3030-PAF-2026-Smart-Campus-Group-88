import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

export const BookingContext = createContext();

// Static mock user ID used until OAuth2 authentication is wired up (Module E)
export const STATIC_USER_ID = 'user-123';

const API_BASE_URL = 'http://localhost:8081/api/bookings';

const AXIOS_CONFIG = {
  headers: {
    'Content-Type': 'application/json'
  }
};

const initialState = {
  bookings: [],
  allBookings: [],
  currentBooking: null,
  facilities: [],
  loading: false,
  error: null,
};

const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, bookings: action.payload };
    case 'FETCH_ALL_SUCCESS':
      return { ...state, loading: false, allBookings: action.payload };
    case 'FETCH_SINGLE_SUCCESS':
      return { ...state, loading: false, currentBooking: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_BOOKING':
      return { ...state, bookings: [action.payload, ...state.bookings] };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        allBookings: state.allBookings.map(b => b.id === action.payload.id ? action.payload : b),
        bookings: state.bookings.map(b => b.id === action.payload.id ? action.payload : b),
        currentBooking: state.currentBooking?.id === action.payload.id ? action.payload : state.currentBooking
      };
    case 'SET_FACILITIES':
      return { ...state, facilities: action.payload };
    default:
      return state;
  }
};

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const fetchMyBookings = useCallback(async (requesterId) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await axios.get(`${API_BASE_URL}/my?requesterId=${requesterId}`, AXIOS_CONFIG);
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (err) {
      console.error("Error fetching my bookings", err);
      dispatch({ type: 'FETCH_ERROR', payload: err.message || 'Error fetching bookings' });
    }
  }, []);

  const fetchAllBookings = useCallback(async (filters = {}) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.resourceId) params.append('resourceId', filters.resourceId);
      if (filters.requesterId) params.append('requesterId', filters.requesterId);
      if (filters.fromDate) params.append('fromDate', filters.fromDate);
      if (filters.toDate) params.append('toDate', filters.toDate);

      const url = `${API_BASE_URL}/admin?${params.toString()}`;
      const response = await axios.get(url, AXIOS_CONFIG);
      dispatch({ type: 'FETCH_ALL_SUCCESS', payload: response.data });
    } catch (err) {
      console.error("Error fetching all bookings", err);
      dispatch({ type: 'FETCH_ERROR', payload: err.message || 'Error fetching bookings' });
    }
  }, []);

  const getBooking = useCallback(async (id) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, AXIOS_CONFIG);
      dispatch({ type: 'FETCH_SINGLE_SUCCESS', payload: response.data });
      return response.data;
    } catch (err) {
      console.error("Error fetching booking", err);
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const createBooking = async (formData) => {
    try {
      const response = await axios.post(API_BASE_URL, formData, AXIOS_CONFIG);
      dispatch({ type: 'ADD_BOOKING', payload: response.data });
      return response.data;
    } catch (err) {
      console.error("Error creating booking", err);
      throw err;
    }
  };

  const approveBooking = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}/approve`, {}, AXIOS_CONFIG);
      dispatch({ type: 'UPDATE_BOOKING', payload: response.data });
      return response.data;
    } catch (err) {
      console.error("Error approving booking", err);
      throw err;
    }
  };

  const rejectBooking = async (id, reason) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}/reject`, { reason }, AXIOS_CONFIG);
      dispatch({ type: 'UPDATE_BOOKING', payload: response.data });
      return response.data;
    } catch (err) {
      console.error("Error rejecting booking", err);
      throw err;
    }
  };

  const cancelBooking = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}/cancel`, {}, AXIOS_CONFIG);
      dispatch({ type: 'UPDATE_BOOKING', payload: response.data });
      return response.data;
    } catch (err) {
      console.error("Error cancelling booking", err);
      throw err;
    }
  };

  const fetchFacilities = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/facilities', AXIOS_CONFIG);
      dispatch({ type: 'SET_FACILITIES', payload: response.data });
    } catch (err) {
      console.error("Error fetching facilities", err);
    }
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  return (
    <BookingContext.Provider value={{
      state,
      fetchMyBookings,
      fetchAllBookings,
      getBooking,
      createBooking,
      approveBooking,
      rejectBooking,
      cancelBooking,
      fetchFacilities
    }}>
      {children}
    </BookingContext.Provider>
  );
};
