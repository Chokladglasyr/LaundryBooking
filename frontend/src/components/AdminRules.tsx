import { useState } from "react";

function AdminRules() {
  const [formData, setFormData] = useState({});
  const rules = [
    {
      id: "1",
      title: "Nycklar",
      description:
        "Nycklar till tvättrum och tork finns hängande utanför respektive dörr. Efter tvättpassets slut skall nycklarna hängas upp på sina krokar, så att nycklarna finns tillgängliga till nästa pass.",
    },
    {
      id: "2",
      title: "Bokningsregler",
      description:
        "Varje lägenhet har möjlighet att boka en tvättid åt gången. Först när den bokade tvättiden är avslutad kan en ny tecknas. Tvättpass som ej har påbörjats inom en timme får användas av annan. Om man har för avsikt att börja tvätta senare skall detta anges på tvättlistan.",
    },
    {
      id: "3",
      title: "Städning",
      description:
        "Efter tvättpasset skall var och en städa efter sig genom att torka av golvet och maskinerna. Lämna tvättstugan i det skicka som du själv önskar finna den.",
    },
    {
      id: "1",
      title: "Nycklar",
      description:
        "Nycklar till tvättrum och tork finns hängande utanför respektive dörr. Efter tvättpassets slut skall nycklarna hängas upp på sina krokar, så att nycklarna finns tillgängliga till nästa pass.",
    },
    {
      id: "2",
      title: "Bokningsregler",
      description:
        "Varje lägenhet har möjlighet att boka en tvättid åt gången. Först när den bokade tvättiden är avslutad kan en ny tecknas. Tvättpass som ej har påbörjats inom en timme får användas av annan. Om man har för avsikt att börja tvätta senare skall detta anges på tvättlistan.",
    },
    {
      id: "3",
      title: "Städning",
      description:
        "Efter tvättpasset skall var och en städa efter sig genom att torka av golvet och maskinerna. Lämna tvättstugan i det skicka som du själv önskar finna den.",
    },
    {
      id: "1",
      title: "Nycklar",
      description:
        "Nycklar till tvättrum och tork finns hängande utanför respektive dörr. Efter tvättpassets slut skall nycklarna hängas upp på sina krokar, så att nycklarna finns tillgängliga till nästa pass.",
    },
    {
      id: "2",
      title: "Bokningsregler",
      description:
        "Varje lägenhet har möjlighet att boka en tvättid åt gången. Först när den bokade tvättiden är avslutad kan en ny tecknas. Tvättpass som ej har påbörjats inom en timme får användas av annan. Om man har för avsikt att börja tvätta senare skall detta anges på tvättlistan.",
    },
    {
      id: "3",
      title: "Städning",
      description:
        "Efter tvättpasset skall var och en städa efter sig genom att torka av golvet och maskinerna. Lämna tvättstugan i det skicka som du själv önskar finna den.",
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
        {rules.map((rule, index) => (
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
              onChange={handleInput}
            />
            <textarea
              name="description"
              id={`description-${index}`}
              rows={8}
              onChange={handleInput}
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
