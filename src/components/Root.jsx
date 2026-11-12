import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Toaster } from './ui/toaster';
import { Box } from '@chakra-ui/react';

export const Root = () => {
    return (
        <Box>
            <Navigation />
            <Outlet />
            <Toaster />
        </Box>
    );
};