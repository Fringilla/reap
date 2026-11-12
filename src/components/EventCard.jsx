import { useState } from "react";
import { Badge, Button, Card, Image } from "@chakra-ui/react";
import { EventDialog } from "./EventDialog";

export function EventCard({ id, event, users, categories }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(event);
  const categoryNames = getCategoryNames(currentEvent.categoryIds, categories);
  const creatorName = getCreator(currentEvent.createdBy, users);

  const openDetails = () => setIsDetailsOpen(true);
  const handleCardKeyDown = (keyEvent) => {
    if (keyEvent.target === keyEvent.currentTarget && (keyEvent.key === "Enter" || keyEvent.key === " ")) {
      keyEvent.preventDefault();
      openDetails();
    }
  };

  return (
    <>
      <Card.Root
        key={id || event.id}
        maxW="sm"
        overflow="hidden"
        cursor="pointer"
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-label={`View details for ${currentEvent.title}`}
        onClick={openDetails}
        onKeyDown={handleCardKeyDown}
      >
        <Image src={currentEvent.image} alt={currentEvent.title} w="100%" />
        <Card.Header>
          <Card.Title color="orange.500">{currentEvent.title}</Card.Title>
        </Card.Header>
        <Card.Body gap="2">
          <Card.Description fontWeight="normal">{currentEvent.description}</Card.Description>

          <Card.Description fontWeight="thin">Location:</Card.Description>
          <Card.Description fontWeight="semibold">{currentEvent.location}</Card.Description>

          <Card.Description fontWeight="thin">Time:</Card.Description>
          <Card.Description fontWeight="semibold">
            {new Date(currentEvent.startTime).toLocaleString()} - {new Date(currentEvent.endTime).toLocaleString()}
          </Card.Description>

          <Card.Description fontWeight="thin">Categories:</Card.Description>
          <Card.Description fontWeight="semibold">
            {categoryNames.map((categoryName) => (
              <Badge key={categoryName} variant="solid" mr="1">
                {categoryName}
              </Badge>
            ))}
          </Card.Description>

          <Card.Description fontWeight="thin">Created by:</Card.Description>
          <Card.Description fontWeight="semibold">{creatorName}</Card.Description>
        </Card.Body>
        <Card.Footer>
          <Button mt="2" variant="subtle" onClick={openDetails}>View details</Button>
        </Card.Footer>
      </Card.Root>

      <EventDialog
        event={currentEvent}
        categories={categories}
        categoryNames={categoryNames}
        creatorName={creatorName}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEventUpdated={setCurrentEvent}
      />
    </>
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
