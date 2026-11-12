import { useState } from "react";
import { Box, Button, Checkbox, Field, Heading, Input, Skeleton, Text } from "@chakra-ui/react";
import { EventCard } from "../components/EventCard";
import { useAppData } from "../context/AppDataContext";

export const EventsPage = () => <EventsList />;

export const EventsList = () => {
  const { events, users, categories, isLoading, error } = useAppData();
  const [searchText, setSearchText] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  if (isLoading) {
    return (
      <Box>
        <Heading mb="4">List of events</Heading>
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap="4">
          {[0, 1, 2, 3].map((placeholder) => (
            <Skeleton key={placeholder} height="320px" borderRadius="md" />
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
      <Heading mb="4">List of events</Heading>
      <Box mb="6" display="grid" gap="4">
        <Field.Root>
          <Field.Label>Search events by title</Field.Label>
          <Input
            type="search"
            value={searchText}
            onChange={(changeEvent) => setSearchText(changeEvent.target.value)}
            placeholder="Search events"
          />
        </Field.Root>
        <Box as="fieldset">
          <Text as="legend" fontWeight="semibold" mb="2">Filter by category</Text>
          <Box display="flex" flexWrap="wrap" gap="4">
            {categories.map((category) => (
              <Checkbox.Root
                key={category.id}
                checked={selectedCategoryIds.includes(String(category.id))}
                onCheckedChange={({ checked }) => toggleCategory(category.id, checked)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>{category.name}</Checkbox.Label>
              </Checkbox.Root>
            ))}
          </Box>
        </Box>
        <Button
          type="button"
          variant="subtle"
          alignSelf="start"
          onClick={clearFilters}
          disabled={!searchText && selectedCategoryIds.length === 0}
        >
          Clear search and filters
        </Button>
      </Box>
      {filteredEvents.length > 0 ? (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(min(100%, 350px), 1fr))"
          gap="4"
          justifyItems="center"
        >
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              event={event}
              users={users}
              categories={categories}
            />
          ))}
        </Box>
      ) : (
        <Text role="status">No events match your search and selected categories.</Text>
      )}
    </Box>
  );
}
