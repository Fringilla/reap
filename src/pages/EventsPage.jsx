import { Heading } from '@chakra-ui/react';
import { EventsList } from "../components/vanilla/EventsList";

export const EventsPage = () => {
    return (
        <>
        <Heading>List of events</Heading>
        <EventsList />
        </>
    );
};