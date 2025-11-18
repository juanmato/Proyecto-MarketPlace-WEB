import { useReducer, useCallback } from 'react';
import { Service } from '../types';

type ServicesState = {
  services: Service[];
  loading: boolean;
  filters: {
    search: string;
    category: string;
    city: string;
    status: string;
  };
};

type ServicesAction =
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'UPDATE_SERVICE'; payload: Service }
  | { type: 'DELETE_SERVICE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FILTER'; payload: { key: string; value: string } }
  | { type: 'RESET_FILTERS' };

const initialState: ServicesState = {
  services: [],
  loading: false,
  filters: {
    search: '',
    category: 'all',
    city: 'all',
    status: 'all'
  }
};

function servicesReducer(state: ServicesState, action: ServicesAction): ServicesState {
  switch (action.type) {
    case 'SET_SERVICES':
      return {
        ...state,
        services: action.payload,
        loading: false
      };

    case 'ADD_SERVICE':
      return {
        ...state,
        services: [action.payload, ...state.services]
      };

    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(s =>
          s.id === action.payload.id ? action.payload : s
        )
      };

    case 'DELETE_SERVICE':
      return {
        ...state,
        services: state.services.filter(s => s.id !== action.payload)
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value
        }
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialState.filters
      };

    default:
      return state;
  }
}

export function useServicesReducer(initialServices: Service[] = []) {
  const [state, dispatch] = useReducer(servicesReducer, {
    ...initialState,
    services: initialServices
  });

  // Helper functions - memoized with useCallback to prevent infinite loops
  const setServices = useCallback((services: Service[]) => {
    dispatch({ type: 'SET_SERVICES', payload: services });
  }, []);

  const addService = useCallback((service: Service) => {
    dispatch({ type: 'ADD_SERVICE', payload: service });
  }, []);

  const updateService = useCallback((service: Service) => {
    dispatch({ type: 'UPDATE_SERVICE', payload: service });
  }, []);

  const deleteService = useCallback((id: string) => {
    dispatch({ type: 'DELETE_SERVICE', payload: id });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setFilter = useCallback((key: string, value: string) => {
    dispatch({ type: 'SET_FILTER', payload: { key, value } });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  // Computed filtered services
  const filteredServices = state.services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(state.filters.search.toLowerCase()) ||
                         service.description.toLowerCase().includes(state.filters.search.toLowerCase());
    const matchesCategory = state.filters.category === 'all' || service.category === state.filters.category;
    const matchesCity = state.filters.city === 'all' || service.city === state.filters.city;
    const matchesStatus = state.filters.status === 'all' || service.status === state.filters.status;

    return matchesSearch && matchesCategory && matchesCity && matchesStatus;
  });

  return {
    state,
    dispatch,
    filteredServices,
    setServices,
    addService,
    updateService,
    deleteService,
    setLoading,
    setFilter,
    resetFilters
  };
}