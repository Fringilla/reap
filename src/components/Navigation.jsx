import { Box, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { CreateEventDialog } from "./CreateEventDialog";
import { ColorModeButton } from "./ui/color-mode";

export const Navigation = () => {
  return (
    <Box as="nav" position="sticky" top="0" zIndex="sticky" bg="bg" pl="4" pr="4" pb="4">
      <Flex align="center">
        <Flex gap={4} align="center">
          <Link to="/">Events</Link>
          <Link to="/about">About</Link>
          <CreateEventDialog />
        </Flex>
        <ColorModeButton ml="auto" />
      </Flex>
    </Box>
  );
};