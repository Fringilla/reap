import { Flex } from "@chakra-ui/react";
import { Link, useRevalidator } from "react-router-dom";
import { CreateEventDialog } from "./CreateEventDialog";

export const Navigation = () => {
  const revalidator = useRevalidator();

  return (
    <nav>
      <Flex gap={4} mb={4} align="center">
        <Link to="/">Events</Link>
        <CreateEventDialog onCreated={() => revalidator.revalidate()} />
      </Flex>
    </nav>
  );
};