import { Box, Heading, Text } from "@chakra-ui/react";

const AboutPage = () => (
  <Box maxW="3xl" mx="auto" p={{ base: "4", md: "8" }}>
    <Heading mb="4">About this event app</Heading>
    <Text>My Winc Academy React-advanced exercise solution.</Text>
    <Text>Thanks to my mentors: Jordy and Ian.</Text>
  </Box>
);

export default AboutPage;