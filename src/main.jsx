import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from './components/ui/provider';
import { Root } from './components/Root';
import { EventPage, eventLoader } from './pages/EventPage';
import { EventsPage, eventsLoader } from './pages/EventsPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/',
                element: <EventsPage />,
                loader: eventsLoader,
                hydrateFallbackElement: <p>Loading events...</p>,
                errorElement: <p>Could not load events</p>
            },
            {
                path: '/event/:eventId',
                element: <EventPage />,
                loader: eventLoader,
                hydrateFallbackElement: <p>Loading event...</p>,
                errorElement: <p>Could not load event</p>
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