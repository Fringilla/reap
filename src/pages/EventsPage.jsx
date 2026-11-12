import { useState } from "react";
import { useLoaderData } from "react-router";
import { Box, Button, Checkbox, Field, Heading, Input, Text } from "@chakra-ui/react";
import { EventCard } from "../components/EventCard";

export const EventsPage = () => { return (
  <EventsList />
)};

export async function eventsLoader() {
  const events = await fetch("http://localhost:3000/events");
  const users = await fetch("http://localhost:3000/users");
  const categories = await fetch("http://localhost:3000/categories");

  return {
    events: await events.json(),
    users: await users.json(),
    categories: await categories.json()
  };
}

export const EventsList = () => {
  const { events, users, categories } = useLoaderData();
  const [searchText, setSearchText] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
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
    <Box>
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
        <Box style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1rem", justifyItems: "center" }}>
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
