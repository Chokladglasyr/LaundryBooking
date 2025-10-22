import { Outlet } from "react-router-dom";
import ChooseRoom from "./ChooseRoom";

function Home() {
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
  ];

  return (
    <>
      <div className="landing" id="home">
        <ChooseRoom />
        <Outlet />
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
