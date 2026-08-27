import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { EventPage } from './pages/EventPage';
import { EventsPage } from './pages/EventsPage';
import { Provider } from './components/ui/provider';
import { Root } from './components/Root';
import { loader as eventsListLoader } from './components/EventsList';
import ErrorBoundary from './components/ErrorBoundary';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/',
                element: <EventsPage />,
                hydrateFallbackElement: <div>Loading...</div>,
                loader: eventsListLoader,
                // errorElement: <ErrorBoundary />,
            },
            {
                path: '/event/:eventId',
                element: <EventPage />,
                hydrateFallbackElement: <div>Loading...</div>,
                // loader: eventLoader,
                // action: addComment,
                // errorElement: <ErrorBoundary />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>,
);