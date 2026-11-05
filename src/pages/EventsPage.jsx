import { useLoaderData } from "react-router";
import { Heading,
    Badge,
    Box,
    Button,
    Card,
    Flex,
    Image,
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

  return (
    <Box style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1rem", justifyItems: "center" }}>
      {events.map((event) => (
        <EventsListItem
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

export function EventsListItem({ id, event, users, categories }) {

  return (
    <Card.Root key={id || event.id} maxW="sm" overflow="hidden">
      <Image src={event.image} alt={event.title} w="100%" />
      <Card.Header>
        <Card.Title color="orange.500">{event.title}</Card.Title>
      </Card.Header>
      <Card.Body gap="2">
        <Card.Description fontWeight="normal">{event.description}</Card.Description>

        <Card.Description fontWeight="thin">Location:</Card.Description>
        <Card.Description fontWeight="semibold">{event.location}</Card.Description>

        <Card.Description fontWeight="thin">Time:</Card.Description>
        <Card.Description fontWeight="semibold">
          {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
        </Card.Description>

        <Card.Description fontWeight="thin">Categories:</Card.Description>
        <Card.Description fontWeight="semibold">
        {getCategoryNames(event.categoryIds, categories).map((categoryName) => (
          <Badge key={categoryName} variant="solid" mr="1">
            {categoryName}
          </Badge>
        ))}</Card.Description>

        <Card.Description fontWeight="thin">Created by:</Card.Description>
        <Card.Description fontWeight="semibold">{getCreator(event.createdBy, users)}</Card.Description>
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
