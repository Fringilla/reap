import { useLoaderData } from "react-router";
import { Box, Heading } from '@chakra-ui/react';
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
  let { events, users, categories } = useLoaderData();

  return (
    <Box style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1rem", justifyItems: "center" }}>
      {events.map((event) => (
        <EventCard
          key={event.id}
          id={event.id}
          event={event}
          users={users}
          categories={categories}
        />
      ))}
    </Box>
  );
}
