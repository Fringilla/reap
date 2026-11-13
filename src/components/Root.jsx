import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import ErrorBoundary from './ErrorBoundary';
import { Toaster } from './ui/toaster';
import { Box } from '@chakra-ui/react';

export const Root = () => {
    return (
        <Box minH="100vh" bg="bg" color="fg">
            <Navigation />
            <ErrorBoundary>
                <Outlet />
            </ErrorBoundary>
            <Toaster />
        </Box>
    );
};