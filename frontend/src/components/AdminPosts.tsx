import { useState } from "react";

function AdminPosts() {
  const [formData, setFormData] = useState({});
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
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
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
            onChange={handleInput}
          />
          <textarea
            name="description"
            id="description"
            rows={8}
            onChange={handleInput}
          ></textarea>
          <button id="create-msg" className="primary-btn-green">
            SPARA
          </button>
        </form>
      </article>
      <article className="edit-container">
        {posts.map((post, index) => (
          <form key={index} id="edit-msg-form" action="">
            <label htmlFor="edit-msg-form">
              {`Redigera meddelande ${index + 1}`}{" "}
            </label>
            <input
              className="input-admin"
              type="text"
              name="title"
              id={`title-${index}`}
              value={post.title}
              onChange={handleInput}
            />
            <textarea
              name="description"
              id={`description-${index}`}
              rows={8}
              value={post.description}
              onChange={handleInput}
            >
            </textarea>
            <div className="btn-container">
              <button id={`edit-msg-${index}`} className="primary-btn-green">
                SPARA
              </button>
              <button id={`delete-msg-${index}`} className="primary-btn-red">
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
