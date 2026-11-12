import { Box, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { CreateEventDialog } from "./CreateEventDialog";

export const Navigation = () => {
  return (
    <Box as="nav" position="sticky" top="0" zIndex="sticky" bg="bg" pb="4">
      <Flex gap={4} align="center">
        <Link to="/">Events</Link>
        <Link to="/about">About</Link>
        <CreateEventDialog />
      </Flex>
    </Box>
  );
};