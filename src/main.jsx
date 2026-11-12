import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from './components/ui/provider';
import { AppDataProvider } from './context/AppDataContext';
import { Root } from './components/Root';
import { EventPage } from './pages/EventPage';
import { EventsPage } from './pages/EventsPage';
import AboutPage from './pages/AboutPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/',
                element: <EventsPage />,
            },
            {
                path: '/event/:eventId',
                element: <EventPage />,
            },
            {
                path: '/about',
                element: <AboutPage />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider>
            <AppDataProvider>
                <RouterProvider router={router} />
            </AppDataProvider>
        </Provider>
    </React.StrictMode>,
);