import { useEffect, useState } from "react";
import type { PostType } from "../store/types";
import axios from "axios";

function AdminPosts() {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [createFormData, setCreateFormData] = useState({
    title: "",
    description: "",
  });
  const [posts, setPosts] = useState<PostType[] | null>(null);
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancel = false;
    if(message) {
      const messageTimer = setTimeout(() => {
        setMessage(null)
      }, 1500)
      return () => {
        clearTimeout(messageTimer)
      }
    }
    async function getPosts() {
      try {
        const res = await axios.get("/posts", { withCredentials: true });
        if (!cancel) {
          setPosts(res.data.posts);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.log("Failed to fetch posts for admin: ", err);
        }
      }
    }
    getPosts();
    return () => {
      cancel = true;
    };
  }, [message]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateFormData({ ...createFormData, [name]: value });
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setPosts((prev) =>
      prev
        ? prev.map((post, i) =>
            i === index ? { ...post, [name]: value } : post
          )
        : null
    );
    setFormData({ ...formData, [name]: value });
  };

  const createPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("/post", createFormData, {
        withCredentials: true,
      });
      setPosts((prev) => (prev ? [res.data.post, ...prev] : [res.data.post]));
      if(res.data.message.includes('created')) {
        setMessage('Ny meddelande skapad.')
      }
      setCreateFormData({ title: "", description: "" });
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error creating new post in admin: ", err);
      }
    }
  };

  const updatePost = async (
    e: React.FormEvent<HTMLFormElement>,
    post_id: string
  ) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/post?id=${post_id}`, formData, {
        withCredentials: true,
      });
      if(!res.data) return;
      if(res.data.message.includes('updated')) {
        setMessage('Sparad, listan uppdateras...')

      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error when updating post as admin: ", err);
      }
    }
  };

  const deletePost = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.preventDefault();
    if(!window.confirm('Vill du verkligen radera meddelandet?')) return;
    try {
      const res = await axios.delete(`post?id=${id}`, {
        withCredentials: true,
      });
      setPosts((prev) => prev?.filter((post) => id !== post.id) || null);
      if(res.data.message.includes('deleted')) {
        setMessage('Meddelande borttagen.')
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to delete post as admin: ", err);
      }
    }
  };

  return (
    <>
      <article>
        <form onSubmit={createPost} id="msg-form">
          <label htmlFor="msg-form">Nytt meddelande: </label>
          <input
            className="input-admin"
            type="text"
            name="title"
            id="title"
            value={createFormData.title}
            placeholder="Rubrik"
            onChange={handleInput}
          />
          <textarea
            name="description"
            id="description"
            rows={8}
            value={createFormData.description}
            onChange={handleInput}
          ></textarea>
          <button id="create-msg" className="primary-btn-green">
            SPARA
          </button>
        </form>
      </article>
      <article className="edit-container">
        {message && <p className="message">{message}</p>}
        {posts &&
          posts.map((post, index) => (
            <form
              key={index}
              id="edit-msg-form"
              onSubmit={(e) => updatePost(e, post.id)}
            >
              <label htmlFor="edit-msg-form">
                {`Redigera meddelande ${index + 1}`}
              </label>
              <input
                className="input-admin"
                type="text"
                name="title"
                id={`title-${index}`}
                value={post.title}
                onChange={(e) => handleInputChange(e, index)}
              />
              <textarea
                name="description"
                id={`description-${index}`}
                rows={8}
                value={post.description}
                onChange={(e) => handleInputChange(e, index)}
              ></textarea>
              <div className="btn-container">
                <button id={`edit-msg-${index}`} className="primary-btn-green">
                  SPARA
                </button>
                <button
                  type="button"
                  onClick={(e) => deletePost(e, post.id)}
                  id={`delete-msg-${index}`}
                  className="primary-btn-red"
                >
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
