import Card from "../components/card/Card";
import api from "../api";
import Modal from "../components/modal/Modal";
import Button from "../components/button/Button";
import { useState, useEffect } from "react";


type NoteCardProps = {
    title : string,
    preview : string,
    id : number,
    onDelete : (id: number) => void,
}

function NoteCard(props: NoteCardProps){
    return(
        <Card>
            <div className="note-card-container"></div>
        </Card>
    )
}

function MyNotes() {
    return (
        <div className="note-list-container">
            <div className="recent-notes">
                <h1>Recent Notes</h1>
            </div>

            <div className="user-notes">
                <div className="note-list-header">
                    <h1>My Notes</h1>
                </div>

                <div className="user-notes-list">
                </div>
            </div>

        </div>
    )
}

export default MyNotes