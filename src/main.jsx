import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from './components/ui/provider';
import { Root } from './components/Root';
import { EventPage } from './pages/EventPage';
import { EventsPage, eventsLoader } from './pages/EventsPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/',
                element: <EventsPage />,
                hydrateFallbackElement: <div>Loading events...</div>,
                loader: eventsLoader,
                errorElement: <div>Could not load events</div>
            },
            {
                path: '/event/:eventId',
                element: <EventPage />,
                // loader: postLoader,
                // action: addComment,
                errorElement: <div>Could not load event</div>
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