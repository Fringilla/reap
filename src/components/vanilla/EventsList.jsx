import React from "react";
import { useLoaderData } from "react-router-dom";
import { EventsListItem } from "./EventsListItem";

export const loader = async () => {
  const events = await fetch("http://localhost:3000/events");
  const users = await fetch("http://localhost:3000/users");
  const categories = await fetch("http://localhost:3000/categories");

  return { events: await events.json(), users: await users.json(), categories: await categories.json() };
}

export function EventsList() {
  const { events, users, categories } = useLoaderData();

  // console.log("events", events);
  // console.log("users", users);
  // console.log("categories", categories);

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
