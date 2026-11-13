import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { EventDialog } from "../components/EventDialog";
import { toaster } from "../components/ui/toaster";
import { useAppData } from "../context/AppDataContext";

export const EventPage = () => {
  const {
    events,
    isLoading,
    error,
    deleteEvent,
    getCategoryNames,
    getCreatorName,
  } = useAppData();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  if (isLoading) {
    return <Skeleton height="400px" m="8" borderRadius="md" />;
  }
  if (error) {
    return <Text role="alert">Could not load event details: {error}</Text>;
  }

  const event = events.find((item) => String(item.id) === eventId);
  if (!event) {
    return <Text role="alert">Event not found.</Text>;
  }

  const categoryNames = getCategoryNames(event.categoryIds);
  const creatorName = getCreatorName(event.createdBy);

  const handleDeleteOpenChange = ({ open }) => {
    if (isDeleting) return;
    setIsDeleteOpen(open);
    if (!open) setDeleteError("");
  };
  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteEvent(event.id);
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
          <Button onClick={() => navigate("/")} colorPalette="gray" type="button" variant="subtle">Back</Button>
          <Button onClick={() => setIsEditOpen(true)} colorPalette="blue" type="button" variant="subtle">Edit</Button>
          <Button
            colorPalette="red"
            variant="subtle"
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
        open={isEditOpen}
        startInEditMode
        onOpenChange={setIsEditOpen}
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
