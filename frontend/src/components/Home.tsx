function Home() {
  const rooms = [
    { name: "Tvättstuga 1", id: "1" },
    { name: "Tvättstuga 2", id: "2" },
    { name: "Tvättstuga 3", id: "3" },
  ];
  const posts = [
    {
      id: "1",
      title: "Stöld!",
      description:
        "Tidigare i veckan skedde ett stöldförsök. Fönstret krossades men inget togs förutom tvättstugenyckeln.",
      date: "2025-10-25",
    },
    {
      id: "2",
      title: "Glöm ej avboka!",
      description:
        "Många gånger tvättstugorna står tomma, glöm inte avboka nu när vi har fina nya sättet att boka.",
      date: "2025-10-25",
    },
    //     {
    //   id: "1",
    //   title: "Stöld!",
    //   description:
    //     "Tidigare i veckan skedde ett stöldförsök. Fönstret krossades men inget togs förutom tvättstugenyckeln.",
    //   date: "2025-10-25",
    // },
    //     {
    //   id: "1",
    //   title: "Stöld!",
    //   description:
    //     "Tidigare i veckan skedde ett stöldförsök. Fönstret krossades men inget togs förutom tvättstugenyckeln.",
    //   date: "2025-10-25",
    // },
    //     {
    //   id: "1",
    //   title: "Stöld!",
    //   description:
    //     "Tidigare i veckan skedde ett stöldförsök. Fönstret krossades men inget togs förutom tvättstugenyckeln.",
    //   date: "2025-10-25",
    // },
    //     {
    //   id: "1",
    //   title: "Stöld!",
    //   description:
    //     "Tidigare i veckan skedde ett stöldförsök. Fönstret krossades men inget togs förutom tvättstugenyckeln.",
    //   date: "2025-10-25",
    // },
    //     {
    //   id: "1",
    //   title: "Stöld!",
    //   description:
    //     "Tidigare i veckan skedde ett stöldförsök. Fönstret krossades men inget togs förutom tvättstugenyckeln.",
    //   date: "2025-10-25",
    // },    {
    //   id: "1",
    //   title: "Stöld!",
    //   description:
    //     "Tidigare i veckan skedde ett stöldförsök. Fönstret krossades men inget togs förutom tvättstugenyckeln.",
    //   date: "2025-10-25",
    // },
  ];
  return (
    <>
      <div className="landing" id="home">
        <form className="booking-form" action="">
          <label htmlFor="room">Välj tvättstuga:</label>
          <select name="room" id="room">
            <option value="">Tvättstuga</option>
            {rooms.map((room, index) => (
              <option key={index} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
          <button className="primary-btn" id="book">
            BOKA
          </button>
        </form>
        <article className="post-container">
            <h2>Information</h2>
          {posts.map((post, index) => (
            <div className="post" key={index}>
              <h3>{post.title}</h3>
              <p className="post-date">{post.date}</p>
              <p>{post.description}</p>
            </div>
          ))}
        </article>
      </div>
    </>
  );
}
export default Home;
