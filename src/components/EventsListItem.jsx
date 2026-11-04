export function EventsListItem({ key, event, users, categories }) {

  // Helper: find creator name
  const getCreator = (id) => {
    const user = users.find((u) => u.id == id);
    return user ? user.name : "Unknown";
  };

  // Helper: convert category IDs → names
  const getCategoryNames = (ids) => {
    // console.log("ids", ids);
    const categoryNames = ids
      .map((cid) => {
        // console.log("cid", cid);
        // console.log("categories", categories);
        const categoryName = categories.find((c) => c.id == cid)?.name;
        // console.log("category", categoryName);
        return categoryName;
      } 
      ).filter(Boolean);
    // console.log("categoryNames", categoryNames);
    return categoryNames;
  };

  return (
    <>
      <ul>
          <li key={key ? key : event.id}>
          {getCategoryNames(event.categoryIds).join(", ")}
          &nbsp;- {event.title} by {getCreator(event.createdBy)}
          &nbsp; (Starts: {new Date(event.startTime).toLocaleString()}, Ends: {new Date(event.endTime).toLocaleString()})
          </li>
      </ul>

    <div key={event.id} className="event-card">
      <img src={event.image} alt={event.title} className="event-image" width={320} />

      <div className="event-content">
        <h2>{event.title}</h2>
        <p>{event.description}</p>

        <p>
          <strong>Location:</strong> {event.location}
        </p>

        <p>
          <strong>Starts:</strong>{" "}
          {new Date(event.startTime).toLocaleString()}
        </p>

        <p>
          <strong>Ends:</strong>{" "}
          {new Date(event.endTime).toLocaleString()}
        </p>

        <p>
          <strong>Categories:</strong> {getCategoryNames(event.categoryIds).join(", ")}
        </p>

        <p>
          <strong>Created by:</strong> {getCreator(event.createdBy)}
        </p>
      </div><hr />
    </div>
  </>
 );
}
