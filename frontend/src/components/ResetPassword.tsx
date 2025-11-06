import axios from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState<string | null>(null);
  const [params] = useSearchParams();
  const requestId = params.get("id");

  const navigate = useNavigate();
  async function sendReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await axios.post(`/resetpassword?id=${requestId}`, formData);
      if (res.status === 200) {
        setMessage("Tack!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      if (err instanceof Error) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setMessage("Något fick fel, ");
        }
        console.error("Error fetching reset request: ", err);
      }
    }
  }
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <>
      {message ? (
        <div className="reset">{message}</div>
      ) : (
        <div className="reset">
          <form onSubmit={sendReset}>
            <input
              type="password"
              name="password"
              id="password"
              required
              placeholder="Lösenord"
              onChange={handleInput}
            />
            <button className="primary-btn-green">SPARA</button>
          </form>
        </div>
      )}
    </>
  );
}
export default ResetPassword;
