function Rules() {
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
  return (
    <>
      <div className="landing" id="rules">
        <div className="rules">
            {rules.map((rule, index)=>(
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
