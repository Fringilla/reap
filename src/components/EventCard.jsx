import { Badge, Card, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";

export function EventCard({ id, event }) {
  const { getCategoryNames, getCreatorName, getEventTime } = useAppData();
  const categoryNames = getCategoryNames(event.categoryIds);
  const creatorName = getCreatorName(event.createdBy);
  const eventTime = getEventTime(event);

  return (
    <Link
      to={`/event/${id ?? event.id}`}
      aria-label={`View details for ${event.title}`}
      style={{ display: "block", color: "inherit", textDecoration: "none" }}
    >
      <Card.Root maxW="sm" overflow="hidden">
        <Image src={event.image} alt={event.title} w="100%" h="180px" objectFit="cover" />
        <Card.Header>
          <Card.Title color="orange.500">{event.title}</Card.Title>
        </Card.Header>
        <Card.Body gap="2">
          <Card.Description fontWeight="semibold">{event.description}</Card.Description>

          <Card.Description fontWeight="thin">Location:</Card.Description>
          <Card.Description fontWeight="semibold">{event.location}</Card.Description>

          <Card.Description fontWeight="thin">Time:</Card.Description>
          <Card.Description fontWeight="semibold">{eventTime}</Card.Description>

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
