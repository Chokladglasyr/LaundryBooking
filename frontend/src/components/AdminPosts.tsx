function AdminPosts() {
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
  ];
  return (
    <>
      <article>
        <form action="" id="msg-form">
          <label htmlFor="msg-form">Nytt meddelande: </label>
          <input
            className="input-admin"
            type="text"
            name="title"
            id="title"
            placeholder="Rubrik"
          />
          <textarea name="description" id="description" rows={8}></textarea>
          <button id="create-msg" className="primary-btn">
            SPARA
          </button>
        </form>
      </article>
      <article>
        {posts.map((post, index) => (
          <form key={index} id="edit-msg-form" action="">
            <label htmlFor="edit-msg-form">{`Meddelande nummer ${index+1}`} </label>
            <input
              className="input-admin"
              type="text"
              name="title"
              id="title"
              value={post.title}
            />
            <textarea name="description" id="description" rows={8}>
              {post.description}
            </textarea>
            <div className="btn-container">
              <button id="edit-msg" className="primary-btn">
                SPARA
              </button>
              <button id="delete-msg" className="primary-btn">
                RADERA
              </button>
            </div>
          </form>
        ))}
      </article>
    </>
  );
}
export default AdminPosts;
