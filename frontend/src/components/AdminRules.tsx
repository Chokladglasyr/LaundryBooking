import { useEffect, useState } from "react";
import type { RuleType } from "../store/types";
import axios from "axios";

function AdminRules() {
  const [formData, setFormData] = useState({});
  const [rules, setRules] = useState<RuleType[] | null>(null);

  useEffect(() => {
    let cancel = false
    async function fetchRules() {
      try {
        const res = await axios.get('/rules', {withCredentials: true})
        console.log(res.data.rules)
        if(!cancel){
          setRules(res.data.rules)
        }
      }catch(err) {
        if(err instanceof Error){
          console.error("Failed to fetch rules for admin: ", err)
        }
      }
    }
    fetchRules()
    return () => {
      cancel = true
    }
  },[])

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setRules((prev) =>
      prev
        ? prev.map((rule, i) =>
            i === index ? { ...rule, [name]: value } : rule
          )
        : null
    );
    setFormData({...formData, [name]: value})
  };
  return (
    <>
      <article>
        <form action="" id="rules-form">
          <label htmlFor="rules-form">Ny regel: </label>
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
          <button id="create-rule" className="primary-btn-green">
            SPARA
          </button>
        </form>
      </article>
      <article className="edit-container">
        {rules && rules.map((rule, index) => (
          <form key={index} id="edit-rule-form" action="">
            <label htmlFor="edit-msg-form">
              {`Redigera regel ${index + 1}`}
            </label>
            <input
              className="input-admin"
              type="text"
              name="title"
              id={`title-${index}`}
              value={rule.title}
              onChange={(e) => handleInputChange(e, index)}
            />
            <textarea
              name="description"
              id={`description-${index}`}
              rows={8}
              onChange={(e) => handleInputChange(e, index)}
              value={rule.description}
            ></textarea>
            <div className="btn-container">
              <button id={`edit-rule-${index}`} className="primary-btn-green">
                SPARA
              </button>
              <button id={`delete-rule-${index}`} className="primary-btn-red">
                RADERA
              </button>
            </div>
          </form>
        ))}
      </article>
    </>
  );
}
export default AdminRules;
