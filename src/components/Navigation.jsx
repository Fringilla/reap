import { Flex, Link } from '@chakra-ui/react';

export const Navigation = () => {
    return (
        <nav>
            <Flex gap={2} mb={4}>
                <Link href="/">Events</Link>
                <Link>Add Event</Link>
            </Flex>
        </nav>
    );
};