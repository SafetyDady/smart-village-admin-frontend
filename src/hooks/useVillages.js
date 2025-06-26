import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../lib/api';

// Custom hook for managing villages data
export const useVillages = () => {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all villages
  const fetchVillages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.villages.getAll();
      // API returns { success: true, data: [...], count: number, message: string }
      setVillages(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message);
      setVillages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new village
  const createVillage = useCallback(async (villageData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.villages.create(villageData);
      // API returns { success: true, data: {...}, message: string }
      const newVillage = response.data;
      setVillages(prev => [...prev, newVillage]);
      return newVillage;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update village
  const updateVillage = useCallback(async (id, villageData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.villages.update(id, villageData);
      // API returns { success: true, data: {...}, message: string }
      const updatedVillage = response.data;
      setVillages(prev => 
        prev.map(village => 
          village.id === id ? updatedVillage : village
        )
      );
      return updatedVillage;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete village
  const deleteVillage = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.villages.delete(id);
      setVillages(prev => prev.filter(village => village.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load villages on mount
  useEffect(() => {
    fetchVillages();
  }, [fetchVillages]);

  return {
    villages,
    loading,
    error,
    fetchVillages,
    createVillage,
    updateVillage,
    deleteVillage,
  };
};

// Custom hook for API health check
export const useHealthCheck = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.healthCheck();
      setHealth(data);
    } catch (err) {
      setError(err.message);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return {
    health,
    loading,
    error,
    checkHealth,
  };
};

