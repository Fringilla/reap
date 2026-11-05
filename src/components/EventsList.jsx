import { useLoaderData } from "react-router";
import { EventsListItem } from "./EventsListItem";

export async function loader() {
  const events = await fetch("http://localhost:3000/events");
  // const users = await fetch("http://localhost:3000/users");
  // const categories = await fetch("http://localhost:3000/categories");

  return { 
    events: await events.json(), 
    // users: await users.json(), 
    // categories: await categories.json() 
  };
}

export const EventsList = () => {
  let { events, users = [], categories = [] } = useLoaderData();

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


/*


(alias) function useLoaderData<T = any>(): SerializeFrom<T>
import useLoaderData

Returns the data from the closest route loader or clientLoader.

@example

import { useLoaderData } from "react-router";

export async function loader() {
 return await fakeDb.invoices.findAll();
}

export default function Invoices() {
 let invoices = useLoaderData<typeof loader>();
 // ...
}

@public

@category — Hooks

@mode — framework

@mode — data

@returns — The data returned from the route's loader or clientLoader function

*/