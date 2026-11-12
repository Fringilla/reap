import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadAppData = async () => {
      try {
        const [eventsResponse, usersResponse, categoriesResponse] = await Promise.all([
          fetch("http://localhost:3000/events"),
          fetch("http://localhost:3000/users"),
          fetch("http://localhost:3000/categories"),
        ]);

        if (!eventsResponse.ok || !usersResponse.ok || !categoriesResponse.ok) {
          throw new Error("Could not load app data from the server.");
        }

        const [loadedEvents, loadedUsers, loadedCategories] = await Promise.all([
          eventsResponse.json(),
          usersResponse.json(),
          categoriesResponse.json(),
        ]);

        if (isCurrent) {
          setEvents(loadedEvents);
          setUsers(loadedUsers);
          setCategories(loadedCategories);
          setError("");
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(loadError instanceof Error ? loadError.message : "Could not load app data.");
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    loadAppData();
    return () => {
      isCurrent = false;
    };
  }, []);

  const addEvent = useCallback((event) => {
    setEvents((currentEvents) => [...currentEvents, event]);
  }, []);

  const updateEvent = useCallback((updatedEvent) => {
    setEvents((currentEvents) => currentEvents.map((event) => (
      String(event.id) === String(updatedEvent.id) ? updatedEvent : event
    )));
  }, []);

  const removeEvent = useCallback((eventId) => {
    setEvents((currentEvents) => currentEvents.filter((event) => String(event.id) !== String(eventId)));
  }, []);

  const value = useMemo(() => ({
    events,
    categories,
    users,
    isLoading,
    error,
    addEvent,
    updateEvent,
    removeEvent,
  }), [events, categories, users, isLoading, error, addEvent, updateEvent, removeEvent]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider.");
  }
  return context;
}
