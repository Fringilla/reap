import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://localhost:3000";
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
          fetch(`${API_BASE_URL}/events`),
          fetch(`${API_BASE_URL}/users`),
          fetch(`${API_BASE_URL}/categories`),
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

  const createEvent = useCallback(async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error(`Creating the event failed (${response.status}).`);
    }

    const createdEvent = await response.json();
    setEvents((currentEvents) => [...currentEvents, createdEvent]);
    return createdEvent;
  }, []);

  const updateEvent = useCallback(async (eventId, eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error(`Saving the event failed (${response.status}).`);
    }

    const updatedEvent = await response.json();
    setEvents((currentEvents) => currentEvents.map((event) => (
      String(event.id) === String(updatedEvent.id) ? updatedEvent : event
    )));
    return updatedEvent;
  }, []);

  const deleteEvent = useCallback(async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Deleting the event failed (${response.status}).`);
    }

    setEvents((currentEvents) => currentEvents.filter((event) => String(event.id) !== String(eventId)));
  }, []);

  const getCategoryNames = useCallback((categoryIds) => (
    (categoryIds ?? [])
      .map((categoryId) => categories.find(
        (category) => String(category.id) === String(categoryId),
      )?.name)
      .filter(Boolean)
  ), [categories]);

  const getCreatorName = useCallback((userId) => (
    users.find((user) => String(user.id) === String(userId))?.name ?? "Unknown"
  ), [users]);

  const value = useMemo(() => ({
    events,
    categories,
    users,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    getCategoryNames,
    getCreatorName,
  }), [
    events,
    categories,
    users,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    getCategoryNames,
    getCreatorName,
  ]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider.");
  }
  return context;
}
