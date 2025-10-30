import { useEffect, useState } from "react";
import type { PostType } from "../store/types";
import axios from "axios";

function AdminPosts() {
  const [formData, setFormData] = useState({});
  const [posts, setPosts] = useState<PostType[] | null>(null)

  useEffect(() => {
    async function getPosts() {
    try {
        const res = await axios.get('/posts', {withCredentials:true})
        console.log(res.data.posts)
      setPosts(res.data.posts)
      } catch(err){
        if(err instanceof Error) {
          console.log("Failed to fetch posts for admin: ", err)
        }
      }
    }
      getPosts();
  },[])
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const createPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post('/post', formData, {withCredentials: true})
      setPosts((prev) => (prev ? [res.data.post, ...prev] : [res.data.post]))
    } catch(err) {
      if( err instanceof Error ) {
        console.error("Error creating new post in admin: ", err)
      }
    }
  }
  const updatePost = async (e: React.FormEvent<HTMLFormElement>) => {

  }
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
        {posts?.map((post, index) => (
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
