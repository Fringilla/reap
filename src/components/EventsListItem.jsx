import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Flex,
  Image,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

export function EventsListItem({ key, event, users, categories }) {

  const getCreator = (id) => {
    const user = users.find((u) => u.id == id);
    return user ? user.name : "Unknown";
  };

  const getCategoryNames = (ids) => {
    return ids
      .map((cid) => categories.find((c) => c.id == cid)?.name)
      .filter(Boolean);
  };

  return (
    <Card key={key ? key : event.id} maxW="sm" boxShadow="lg" borderRadius="lg">
      <CardHeader p={0}>
        <Image
          src={event.image}
          alt={event.title}
            borderTopRadius="lg"
            objectFit="cover"
            h="200px"
            w="100%"
          />
        </CardHeader>

        <CardBody>
          <Stack spacing={3}>
            <Heading size="md">{event.title}</Heading>
            <Text>{event.description}</Text>

            <Box>
              <Text fontWeight="bold">Location:</Text>
              <Text>{event.location}</Text>
            </Box>

            <Box>
              <Text fontWeight="bold">Starts:</Text>
              <Text>{new Date(event.startTime).toLocaleString()}</Text>
            </Box>

            <Box>
              <Text fontWeight="bold">Ends:</Text>
              <Text>{new Date(event.endTime).toLocaleString()}</Text>
            </Box>

            <Box>
              <Text fontWeight="bold">Categories:</Text>
              <Flex gap={2} wrap="wrap">
                {getCategoryNames(event.categoryIds).map((cat) => (
                  <Badge key={cat} colorScheme="purple">
                    {cat}
                  </Badge>
                ))}
              </Flex>
            </Box>

            <Box>
              <Text fontWeight="bold">Created by:</Text>
              <Text>{getCreator(event.createdBy)}</Text>
            </Box>
          </Stack>
        </CardBody>

        <CardFooter></CardFooter>
      </Card>
  )
};
