import { useLoaderData } from "react-router";
import { Heading } from '@chakra-ui/react';
import ErrorBoundary from '../components/ErrorBoundary';
import { EventsListItem } from "../components/EventsListItem";

export const EventsPage = () => {return (
    <>
        <Heading>List of events</Heading>
        <EventsList />
    </>
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

  console.log("events: ", events);

  return (
    <div className="event-list">
      {events.map((event) => (
        <EventsListItem
          key={event.id}
          event={event}
          users={users}
          categories={categories}
        />
      ))}
    </div>
  );
}
