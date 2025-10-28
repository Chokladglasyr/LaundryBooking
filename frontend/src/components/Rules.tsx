import { useEffect, useState } from "react";
import type { RulesType } from "../store/types";
import axios from "axios";

function Rules() {
  const [rules, setRules] = useState<RulesType[]>([]);
  useEffect(() => {
    async function getRules() {
      const res = await axios.get("rules", { withCredentials: true });
      console.log(res.data.rules);
      setRules(res.data.rules);
    }
    getRules();
  }, []);
  return (
    <>
      <div className="landing" id="rules">
        <div className="rules">
          {rules.map((rule, index) => (
            <article key={index}>
              <h2>{rule.title}</h2>
              <p>{rule.description}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
export default Rules;
