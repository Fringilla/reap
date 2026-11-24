import { useState } from "react";
import { Box, Heading, Skeleton, Text } from "@chakra-ui/react";
import { EventCard } from "../components/EventCard";
import { EventSearchFilters } from "../components/EventSearchFilters";
import { useAppData } from "../context/AppDataContext";

export const EventsPage = () => {
  const { events, categories, isLoading, error } = useAppData();
  const [searchText, setSearchText] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  if (isLoading) {
    return (
      <Box p={{ base: "4", md: "6" }}>
        {/* <Heading mb="4">Loading events...</Heading> */}
        <EventSearchFilters
          categories={categories}
          searchText={searchText}
          selectedCategoryIds={selectedCategoryIds}
        />
        <Box
          display="grid" 
          gridTemplateColumns="repeat(auto-fill, minmax(min(100%, 350px), 1fr))"
          gap="4"
          justifyItems="center">
          {[0, 1, 2, 3].map((placeholder) => (
            <Skeleton key={placeholder} w="320px" h="615px" borderRadius="md" boxShadow="md" />
          ))}

        </Box>
      </Box>
    );
  }

  if (error) {
    return <Text role="alert">Could not load events: {error}</Text>;
  }

  const normalizedSearch = searchText.trim().toLocaleLowerCase();
  const filteredEvents = events.filter((event) => {
    const matchesTitle = event.title.toLocaleLowerCase().includes(normalizedSearch);
    const matchesCategory = selectedCategoryIds.length === 0
      || selectedCategoryIds.some((selectedId) =>
        (event.categoryIds ?? []).some((categoryId) => String(categoryId) === selectedId));
    return matchesTitle && matchesCategory;
  });

  const toggleCategory = (categoryId, checked) => {
    const id = String(categoryId);
    setSelectedCategoryIds((previous) => (
      checked ? [...previous, id] : previous.filter((selectedId) => selectedId !== id)
    ));
  };
  const clearFilters = () => {
    setSearchText("");
    setSelectedCategoryIds([]);
  };

  return (
    <Box p={{ base: "4", md: "6" }}>
      <EventSearchFilters
        categories={categories}
        searchText={searchText}
        selectedCategoryIds={selectedCategoryIds}
        onSearchTextChange={setSearchText}
        onToggleCategory={toggleCategory}
        onClearFilters={clearFilters}
      />

      {filteredEvents.length > 0 ? (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(min(100%, 350px), 1fr))"
          gap="4"
          justifyItems="center">

          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              event={event}
            />
          ))}

        </Box>
      ) : (
        <Text role="status">No events match your search and selected categories.</Text>
      )}
    </Box>
  );
}
