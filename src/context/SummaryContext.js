import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllSummaries, getSummaryById, updateSummary, deleteSummary } from '../api/api';

// Create context
const SummaryContext = createContext();

// Custom hook to use the context
export const useSummary = () => useContext(SummaryContext);

// Provider component
export const SummaryProvider = ({ children }) => {
  const [summaries, setSummaries] = useState([]);
  const [currentSummary, setCurrentSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all summaries
  const fetchSummaries = async () => {
    try {
      setLoading(true);
      const response = await getAllSummaries();
      setSummaries(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch summaries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single summary by ID
  const fetchSummaryById = async (id) => {
    try {
      setLoading(true);
      const response = await getSummaryById(id);
      setCurrentSummary(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError('Failed to fetch summary');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update a summary
  const updateSummaryData = async (id, data) => {
    try {
      setLoading(true);
      const response = await updateSummary(id, data);
      
      // Update the current summary if it's the one being edited
      if (currentSummary && currentSummary._id === id) {
        setCurrentSummary(response.data);
      }
      
      // Update the summary in the list
      setSummaries(prev => 
        prev.map(summary => 
          summary._id === id ? response.data : summary
        )
      );
      
      setError(null);
      return response.data;
    } catch (err) {
      setError('Failed to update summary');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a summary
  const deleteSummaryById = async (id) => {
    try {
      setLoading(true);
      await deleteSummary(id);
      
      // Remove the deleted summary from the list
      setSummaries(prev => prev.filter(summary => summary._id !== id));
      
      // Clear the current summary if it's the one being deleted
      if (currentSummary && currentSummary._id === id) {
        setCurrentSummary(null);
      }
      
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to delete summary');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load summaries on component mount
  useEffect(() => {
    fetchSummaries();
  }, []);

  // Context value
  const value = {
    summaries,
    currentSummary,
    loading,
    error,
    fetchSummaries,
    fetchSummaryById,
    updateSummaryData,
    deleteSummaryById,
    setCurrentSummary
  };

  return (
    <SummaryContext.Provider value={value}>
      {children}
    </SummaryContext.Provider>
  );
};

export default SummaryContext;