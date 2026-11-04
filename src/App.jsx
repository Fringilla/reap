import "./App.css";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <EventsPage />
    </ErrorBoundary>
  );
}
