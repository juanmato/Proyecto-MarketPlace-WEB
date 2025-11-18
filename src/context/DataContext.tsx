import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service, Quote, Insumo, InsumoPack } from '../types';
import { mockServices, mockQuotes, mockInsumos, mockInsumoPacks } from '../data/mockData';

interface DataContextType {
  services: Service[];
  quotes: Quote[];
  insumos: Insumo[];
  insumoPacks: InsumoPack[];
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  addQuote: (quote: Quote) => void;
  updateQuote: (quote: Quote) => void;
  deleteQuote: (id: string) => void;
  addInsumo: (insumo: Insumo) => void;
  updateInsumo: (insumo: Insumo) => void;
  deleteInsumo: (id: string) => void;
  addInsumoPack: (pack: InsumoPack) => void;
  selectQuote: (serviceId: string, quoteId: string) => void;
  completeService: (serviceId: string, rating: number, comment: string) => void;
  cancelService: (serviceId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('servicombo_services');
    return saved ? JSON.parse(saved) : mockServices;
  });

  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem('servicombo_quotes');
    return saved ? JSON.parse(saved) : mockQuotes;
  });

  const [insumos, setInsumos] = useState<Insumo[]>(() => {
    const saved = localStorage.getItem('servicombo_insumos');
    return saved ? JSON.parse(saved) : mockInsumos;
  });

  const [insumoPacks, setInsumoPacks] = useState<InsumoPack[]>(() => {
    const saved = localStorage.getItem('servicombo_packs');
    return saved ? JSON.parse(saved) : mockInsumoPacks;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('servicombo_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('servicombo_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('servicombo_insumos', JSON.stringify(insumos));
  }, [insumos]);

  useEffect(() => {
    localStorage.setItem('servicombo_packs', JSON.stringify(insumoPacks));
  }, [insumoPacks]);

  const addService = (service: Service) => {
    setServices(prev => [service, ...prev]);
  };

  const updateService = (service: Service) => {
    setServices(prev => prev.map(s => s.id === service.id ? service : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const addQuote = (quote: Quote) => {
    setQuotes(prev => [...prev, quote]);
    // Update service status to "en_evaluacion" when first quote is received
    const serviceQuotes = quotes.filter(q => q.serviceId === quote.serviceId);
    if (serviceQuotes.length === 0) {
      setServices(prev => prev.map(s => 
        s.id === quote.serviceId && s.status === 'publicado'
          ? { ...s, status: 'en_evaluacion' as const }
          : s
      ));
    }
  };

  const updateQuote = (quote: Quote) => {
    setQuotes(prev => prev.map(q => q.id === quote.id ? quote : q));
  };

  const deleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
  };

  const addInsumo = (insumo: Insumo) => {
    setInsumos(prev => [...prev, insumo]);
  };

  const updateInsumo = (insumo: Insumo) => {
    setInsumos(prev => prev.map(i => i.id === insumo.id ? insumo : i));
  };

  const deleteInsumo = (id: string) => {
    setInsumos(prev => prev.filter(i => i.id !== id));
  };

  const addInsumoPack = (pack: InsumoPack) => {
    setInsumoPacks(prev => [...prev, pack]);
  };

  const selectQuote = (serviceId: string, quoteId: string) => {
    setServices(prev => prev.map(s => 
      s.id === serviceId 
        ? { ...s, status: 'asignado' as const, assignedQuoteId: quoteId }
        : s
    ));
  };

  const completeService = (serviceId: string, rating: number, comment: string) => {
    setServices(prev => prev.map(s => 
      s.id === serviceId 
        ? { ...s, status: 'completado' as const, rating, ratingComment: comment }
        : s
    ));
  };

  const cancelService = (serviceId: string) => {
    setServices(prev => prev.map(s => 
      s.id === serviceId 
        ? { ...s, status: 'cancelado' as const }
        : s
    ));
  };

  return (
    <DataContext.Provider value={{
      services,
      quotes,
      insumos,
      insumoPacks,
      addService,
      updateService,
      deleteService,
      addQuote,
      updateQuote,
      deleteQuote,
      addInsumo,
      updateInsumo,
      deleteInsumo,
      addInsumoPack,
      selectQuote,
      completeService,
      cancelService
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
