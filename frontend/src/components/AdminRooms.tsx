function AdminRooms() {
    const rooms = [
        {
            id: '1',
            name: 'Tvättstuga 1',
            description: '1 torkrum, 2 tvättmaskiner och en torktumlare, aojdjadjajsdoj jandöjasöjjfaji aöojjafjfs aojfajsj jaa'
        },
        {
            id: '2',
            name: 'Tvättstuga 2',
            description: '1 torkrum, 2 tvättmaskiner och en torktumlare, aojdjadjajsdoj jandöjasöjjfaji aöojjafjfs aojfajsj jaa'
        },
        {
            id: '3',
            name: 'Tvättstuga 3',
            description: '1 torkrum, 2 tvättmaskiner och en torktumlare, aojdjadjajsdoj jandöjasöjjfaji aöojjafjfs aojfajsj jaa'
        },
    ]
    return(
        <>
<article>
        <form action="" id="room-form">
          <label htmlFor="room-form">Ny tvättstuga: </label>
          <input
            className="input-admin"
            type="text"
            name="name"
            id="name"
            placeholder="Namn"
          />
          <textarea name="description" id="description" rows={8}></textarea>
          <button id="create-room" className="primary-btn">
            SPARA
          </button>
        </form>
      </article>
      <article className="edit-container">
        {rooms.map((room, index) => (
          <form key={index} id="edit-room-form" action="">
            <label htmlFor="edit-room-form">{`Redigera ${room.name}`} </label>
            <input
              className="input-admin"
              type="text"
              name="title"
              id="title"
              value={room.name}
            />
            <textarea name="description" id="description" rows={8}>
              {room.description}
            </textarea>
            <div className="btn-container">
              <button id="edit-room" className="primary-btn">
                SPARA
              </button>
              <button id="delete-room" className="primary-btn">
                RADERA
              </button>
            </div>
          </form>
        ))}
      </article>
        </>
    )
}
export default AdminRooms