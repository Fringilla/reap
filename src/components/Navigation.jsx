import { Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { CreateEventDialog } from "./CreateEventDialog";

export const Navigation = () => {
  return (
    <nav>
      <Flex gap={4} mb={4} align="center">
        <Link to="/">Events</Link>
        <Link to="/about">About</Link>
        <CreateEventDialog />
      </Flex>
    </nav>
  );
};