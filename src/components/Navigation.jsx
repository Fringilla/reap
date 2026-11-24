import { Box, Button, Flex } from "@chakra-ui/react";
import { LuInfo, LuPlus, LuRows4 } from "react-icons/lu";
import { Link } from "react-router-dom";
import { CreateEventDialog } from "./CreateEventDialog";
import { ColorModeButton } from "./ui/color-mode";

export const Navigation = () => {
  return (
    <Box as="nav" top="0" position="sticky" zIndex="sticky" bg="bg" pl="4" pr="4" pb="4">
      <Flex align="center">
        <Flex gap={4} align="center">
          <Link to="/">
            <Button colorPalette="gray" variant="subtle">
              <LuRows4 />
              Events
            </Button>
          </Link>
          <Link to="/about">
            <Button colorPalette="gray" variant="subtle">
              <LuInfo />
              About
            </Button>
          </Link>
          <CreateEventDialog />
        </Flex>
        <ColorModeButton ml="auto" />
      </Flex>
    </Box>
  );
};