import { createContext, useContext, ReactNode } from 'react';
import { Service, Quote, Insumo, InsumoPack, InsumoEquivalencia } from '../types';
import { mockServices, mockQuotes, mockInsumos, mockInsumoPacks } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface DataContextType {
  services: Service[];
  quotes: Quote[];
  insumos: Insumo[];
  insumoPacks: InsumoPack[];
  equivalencias: InsumoEquivalencia[];
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
  addEquivalencia: (equivalencia: InsumoEquivalencia) => void;
  selectQuote: (serviceId: string, quoteId: string) => void;
  completeService: (serviceId: string, rating: number, comment: string) => void;
  cancelService: (serviceId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // Usar el hook personalizado para sincronizar automáticamente con localStorage
  const [services, setServices] = useLocalStorage<Service[]>('servicombo_services', mockServices);
  const [quotes, setQuotes] = useLocalStorage<Quote[]>('servicombo_quotes', mockQuotes);
  const [insumos, setInsumos] = useLocalStorage<Insumo[]>('servicombo_insumos', mockInsumos);
  const [insumoPacks, setInsumoPacks] = useLocalStorage<InsumoPack[]>('servicombo_packs', mockInsumoPacks);
  const [equivalencias, setEquivalencias] = useLocalStorage<InsumoEquivalencia[]>('servicombo_equivalencias', []);

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

  const addEquivalencia = (equivalencia: InsumoEquivalencia) => {
    setEquivalencias(prev => [...prev, equivalencia]);
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
      equivalencias,
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
      addEquivalencia,
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
