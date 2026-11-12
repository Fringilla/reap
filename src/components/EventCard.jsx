import { Badge, Card, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function EventCard({ id, event, users, categories }) {
  const categoryNames = getCategoryNames(event.categoryIds, categories);
  const creatorName = getCreator(event.createdBy, users);

  return (
    <Link
      to={`/event/${id ?? event.id}`}
      aria-label={`View details for ${event.title}`}
      style={{ display: "block", color: "inherit", textDecoration: "none" }}
    >
      <Card.Root maxW="sm" overflow="hidden">
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
        </Card.Footer>
      </Card.Root>
    </Link>
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
