import React, { useState, useContext } from 'react'

import AuthContext from '../../context/authContext';
import Modal from '../../components/Modal/Modal';
import Backdrop from '../../components/Backdrop/Backdrop';

import './Events.css';

const EventsPage = () => {
    const authContext = useContext(AuthContext);
    const [creating, setCreating] = useState(false);

    const startCreateEventHandler = () => setCreating(true);
    const closeModalHandler = () => setCreating(false);
    
    return (
        <>
            {creating && <Backdrop />}
            {creating &&
                <Modal
                    title="Add Event"
                    canCancel
                    canConfirm
                    onCancel={closeModalHandler}
                    onConfirm={closeModalHandler}
                >
                    <p>Content</p>
                </Modal>
            }
            {authContext.token && <div className="events-control">
                <p>Share your events!</p>
                <button className="btn" onClick={startCreateEventHandler}>
                    Create Event
                </button>
            </div>}
        </>
    );
}

export default EventsPage;