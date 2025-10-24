function AdminRules() {
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
    return(
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
          />
          <textarea name="description" id="description" rows={8}></textarea>
          <button id="create-rule" className="primary-btn">
            SPARA
          </button>
        </form>
      </article>
      <article className="edit-container">
        {rules.map((rule, index) => (
          <form key={index} id="edit-rule-form" action="">
            <label htmlFor="edit-msg-form">{`Redigera regel ${index+1}`} </label>
            <input
              className="input-admin"
              type="text"
              name="title"
              id="title"
              value={rule.title}
            />
            <textarea name="description" id="description" rows={8}>
              {rule.description}
            </textarea>
            <div className="btn-container">
              <button id="edit-rule" className="primary-btn">
                SPARA
              </button>
              <button id="delete-rule" className="primary-btn">
                RADERA
              </button>
            </div>
          </form>
        ))}
      </article>
        </>
    )
}
export default AdminRules