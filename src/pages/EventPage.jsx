import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Card,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { EventDialog } from "../components/EventDialog";

export async function eventLoader({ params }) {
  const [eventResponse, usersResponse, categoriesResponse] = await Promise.all([
    fetch(`http://localhost:3000/events/${params.eventId}`),
    fetch("http://localhost:3000/users"),
    fetch("http://localhost:3000/categories"),
  ]);

  if (!eventResponse.ok) {
    throw new Response("Could not load this event.", { status: eventResponse.status });
  }
  if (!usersResponse.ok || !categoriesResponse.ok) {
    throw new Response("Could not load event details.", { status: 500 });
  }

  return {
    event: await eventResponse.json(),
    users: await usersResponse.json(),
    categories: await categoriesResponse.json(),
  };
}

export const EventPage = () => {
  const { event: loadedEvent, users, categories } = useLoaderData();
  const [event, setEvent] = useState(loadedEvent);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    setEvent(loadedEvent);
  }, [loadedEvent]);

  const categoryNames = event.categoryIds
    .map((categoryId) => categories.find((category) => category.id === categoryId)?.name)
    .filter(Boolean);
  const creatorName = users.find((user) => user.id === event.createdBy)?.name ?? "Unknown";

  return (
    <Box maxW="4xl" mx="auto" p={{ base: "4", md: "8" }}>
      <Link to="/" style={{ display: "inline-block", marginBottom: "1rem" }}>
        Back to events
      </Link>
      <Card.Root overflow="hidden">
        <Image src={event.image} alt={event.title} w="100%" maxH="420px" objectFit="cover" />
        <Card.Header>
          <Heading size="xl">{event.title}</Heading>
        </Card.Header>
        <Card.Body gap="4">
          <Text>{event.description}</Text>
          <Box>
            <Text fontWeight="semibold">Location</Text>
            <Text>{event.location}</Text>
          </Box>
          <Box>
            <Text fontWeight="semibold">Start time</Text>
            <Text>{new Date(event.startTime).toLocaleString()}</Text>
          </Box>
          <Box>
            <Text fontWeight="semibold">End time</Text>
            <Text>{new Date(event.endTime).toLocaleString()}</Text>
          </Box>
          <Box>
            <Text fontWeight="semibold">Categories</Text>
            {categoryNames.length > 0
              ? categoryNames.map((categoryName) => (
                <Badge key={categoryName} variant="solid" mr="1">
                  {categoryName}
                </Badge>
              ))
              : <Text>No categories</Text>}
          </Box>
          <Box>
            <Text fontWeight="semibold">Created by</Text>
            <Text>{creatorName}</Text>
          </Box>
        </Card.Body>
        <Card.Footer>
          <Button onClick={() => setIsEditOpen(true)}>Edit Event</Button>
        </Card.Footer>
      </Card.Root>
      <EventDialog
        event={event}
        categories={categories}
        categoryNames={categoryNames}
        creatorName={creatorName}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onEventUpdated={setEvent}
      />
    </Box>
  );
};
