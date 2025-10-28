import { Outlet } from "react-router-dom";
import ChooseRoom from "./ChooseRoom";
import { useEffect, useState } from "react";
import type { Posts } from "../store/types";
import axios from "axios";

function Home() {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPosts() {
      try {
        const res = await axios.get("/messages", { withCredentials: true });
        setPosts(res.data.messages);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Failed fetching posts: ", err);
        }
        setLoading(false);
      }
    }
    getPosts();
  }, []);

  return (
    <>
      <div className="landing" id="home">
        <ChooseRoom />
        <Outlet />
        <article className="post-container">
          <h2>Information</h2>
          {loading && <p>Hämtar meddelanden...</p>}
          {posts.map((post, index) => (
            <div className="post" key={index}>
              <h3>{post.title}</h3>
              <p className="post-date">
                {new Date(post.created_at).toLocaleDateString("sv-SE")}
              </p>
              <p>{post.description}</p>
            </div>
          ))}
        </article>
      </div>
    </>
  );
}
export default Home;
