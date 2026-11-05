import { useLoaderData } from "react-router";
import { Heading,
    Badge,
    Box,
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Flex,
    Image,
    Text,
 } from '@chakra-ui/react';

export const EventsPage = () => { return (
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

  //console.log("events: ", events);

  return (
    <div style={{ display: "grid", gridTemplateRows: "auto auto auto auto", rowGap: "0.5rem" }}>
      {events.map((event) => (
        <EventsListItem
          key={event.id}
          id={event.id}
          event={event}
          users={users}
          categories={categories}
        />
      ))}
    </div>
  );
}

export function EventsListItem({ id, event, users, categories }) {

  return (
    <Card.Root key={id || event.id} maxW="sm" overflow="hidden">
      <Card.Header>
        <Image src={event.image} alt={event.title} w="100%" />
        <Card.Title color="orange.500">{event.title}</Card.Title>
      </Card.Header>
      <Card.Body gap="2">
        <Card.Description>{event.description}</Card.Description>
        <Card.Description><strong>Location:</strong> {event.location}</Card.Description>

        <Card.Description>
          <strong>Starts:</strong>{" "}
          {new Date(event.startTime).toLocaleString()}
        </Card.Description>

        <Card.Description>
          <strong>Ends:</strong>{" "}
          {new Date(event.endTime).toLocaleString()}
        </Card.Description>

        <Card.Description>
          <strong>Categories:</strong> {getCategoryNames(event.categoryIds, categories).map((categoryName) => (
            <Badge key={categoryName} variant="solid" mr="1">
              {categoryName}
            </Badge>
          ))}
        </Card.Description>

        <Card.Description>
          <strong>Created by:</strong> {getCreator(event.createdBy, users)}
        </Card.Description>
      </Card.Body>
      <Card.Footer>
        <Button mt="2" onClick={() => window.location.href = `/event/${event.id}`}>
          View Event
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}

// Helper: Find creator name
const getCreator = (id, users) => {
  const user = users.find((u) => u.id == id);
  return user ? user.name : "Unknown";
};

// Helper: convert category IDs → names
const getCategoryNames = (ids, categories) => {
  // console.log("ids", ids);
  const categoryNames = ids
    .map((cid) => {
      const categoryName = categories.find((c) => c.id == cid)?.name;
      return categoryName;
    } 
    ).filter(Boolean);
  return categoryNames;
};
