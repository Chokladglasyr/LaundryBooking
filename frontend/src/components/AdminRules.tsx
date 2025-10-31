import { useEffect, useState } from "react";
import type { RuleType } from "../store/types";
import axios from "axios";

function AdminRules() {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [createFormData, setCreateFormData] = useState({
    title: "",
    description: "",
  });
  const [rules, setRules] = useState<RuleType[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    if (message) {
      const messageTimer = setTimeout(() => {
        setMessage(null);
      }, 4000);
      return () => {
        clearTimeout(messageTimer);
      };
    }
    async function fetchRules() {
      try {
        const res = await axios.get("/rules", { withCredentials: true });
        console.log(res.data.rules);
        if (!cancel) {
          setRules(res.data.rules);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("Failed to fetch rules for admin: ", err);
        }
      }
    }
    fetchRules();

    return () => {
      cancel = true;
    };
  }, [message]);

  const createRule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("/rule", createFormData, {
        withCredentials: true,
      });
      console.log(res.data);
      setRules((prev) => (prev ? [res.data.rule, ...prev] : [res.data.rule]));
      setCreateFormData({ title: "", description: "" });
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to create new rule as an admin: ", err);
      }
    }
  };

  const updateRule = async (
    e: React.FormEvent<HTMLFormElement>,
    rule_id: string
  ) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/rule?id=${rule_id}`, formData, {
        withCredentials: true,
      });
      if (!res.data) return;
      setMessage(res.data.message);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to update rule as an admin: ", err);
      }
    }
  };

  const deletedRule = async (
    e: React.MouseEvent<HTMLButtonElement>,
    rule_id: string
  ) => {
    e.preventDefault();
    try {
      await axios.delete(`/rule?id=${rule_id}`, { withCredentials: true });
      setRules((prev) => prev?.filter((rule) => rule_id !== rule.id) || null);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to delete rule as an admin: ", err);
      }
    }
  };

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
    setRules((prev) =>
      prev
        ? prev.map((rule, i) =>
            i === index ? { ...rule, [name]: value } : rule
          )
        : null
    );
    setFormData({ ...formData, [name]: value });
  };
  return (
    <>
      <article>
        <form onSubmit={createRule} id="rules-form">
          <label htmlFor="rules-form">Ny regel: </label>
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
          <button id="create-rule" className="primary-btn-green">
            SPARA
          </button>
        </form>
      </article>
      <article className="edit-container">
        {message && <p>Regel uppdaterad!</p>}
        {rules &&
          rules.map((rule, index) => (
            <form
              key={index}
              id="edit-rule-form"
              onSubmit={(e) => updateRule(e, rule.id)}
            >
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
                <button
                  onClick={(e) => deletedRule(e, rule.id)}
                  type="button"
                  id={`delete-rule-${index}`}
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
export default AdminRules;
