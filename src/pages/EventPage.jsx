import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Card,
  CloseButton,
  Dialog,
  Heading,
  Image,
  Portal,
  Text,
} from "@chakra-ui/react";
import { EventDialog } from "../components/EventDialog";
import { toaster } from "../components/ui/toaster";

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
  const navigate = useNavigate();
  const [event, setEvent] = useState(loadedEvent);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    setEvent(loadedEvent);
  }, [loadedEvent]);

  const categoryNames = event.categoryIds
    .map((categoryId) => categories.find((category) => category.id === categoryId)?.name)
    .filter(Boolean);
  const creatorName = users.find((user) => user.id === event.createdBy)?.name ?? "Unknown";

  const handleDeleteOpenChange = ({ open }) => {
    if (isDeleting) return;
    setIsDeleteOpen(open);
    if (!open) setDeleteError("");
  };
  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Deleting the event failed (${response.status}).`);
      }

      toaster.create({
        title: "Event deleted",
        description: `${event.title} was deleted successfully.`,
        type: "success",
      });
      setIsDeleteOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not delete the event.";
      setDeleteError(message);
      toaster.create({ title: "Could not delete event", description: message, type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

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
          <Button
            colorPalette="red"
            variant="outline"
            onClick={() => {
              setDeleteError("");
              setIsDeleteOpen(true);
            }}
          >
            Delete Event
          </Button>
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
      <Dialog.Root open={isDeleteOpen} onOpenChange={handleDeleteOpenChange}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Delete event?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>Are you sure you want to delete “{event.title}”? This action cannot be undone.</Text>
                {deleteError && <Text role="alert" color="red.500" mt="3">{deleteError}</Text>}
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  type="button"
                  variant="subtle"
                  disabled={isDeleting}
                  onClick={() => handleDeleteOpenChange({ open: false })}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  colorPalette="red"
                  disabled={isDeleting}
                  onClick={handleDelete}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton aria-label="Close delete confirmation" disabled={isDeleting} />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
};
