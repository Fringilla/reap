import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from './components/ui/provider';
import { Root } from './components/Root';
import { EventPage } from './pages/EventPage';
import { EventsPage } from './pages/EventsPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/',
                element: <EventsPage />,
                // loader: postListLoader,
            },
            {
                path: '/event/:eventId',
                element: <EventPage />,
                // loader: postLoader,
                // action: addComment,
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