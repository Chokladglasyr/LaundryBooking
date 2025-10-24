import Calendar from "./Calendar"
import ChooseRoom from "./ChooseRoom"


function Booking() {
const params = new URLSearchParams(document.location.search)
const room_id = params.get('id')
const room = {
    description: '1 torkrum, 2 tvättmaskiner och en torktumlare, aojdjadjajsdoj jandöjasöjjfaji aöojjafjfs aojfajsj jaa'
}
    return(
        <>
        <div className="landing" id="booking">
            <div className="description-container">

        <article className="room-details">
        <h1>{`Tvättstuga ${room_id}`}</h1>
        <p>{room.description}</p>
        </article>
        <ChooseRoom />
            </div>
        {/* <div className="calendar-container"> */}
        <Calendar />

        {/* </div> */}
        </div>
        </>
    )
}
export default Booking