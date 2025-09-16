import Card from "../components/card/Card"
import IconButton from "../components/icon-button/IconButton";
import editIcon from "../assets/edit.svg?react"
import deleteIcon from "../assets/delete.svg?react"
import { useEffect, useState } from "react"
import "./flashcards-styles/MyFlashcards.css"
import Modal from "../components/modal/Modal"
import Button from "../components/button/Button"
import { useToast } from "../components/toast/toast"
import Spinner from "../components/spinner/Spinner"
import useApi from "../authentication/useApi"

type DeckElementProps = {
    title: string
    numOfCards?: number
    id: number
    onDelete: (id: number) => void
}

function DeckElement(props: DeckElementProps) {

    return (
        <Card>
            <div className="deck-component">
                <h2>{props.title}</h2>
                <div className="deck-actions">
                    <Button text="Test" variant="outlined" to={`/flashcards/test/${props.id}`}/>
                    <IconButton icon={editIcon} to={`/flashcards/edit/${props.id}`} tooltip="Edit deck"/>
                    <IconButton icon={deleteIcon} onClick={() => {props.onDelete(props.id)}} tooltip="Delete deck"/>
                </div>
            </div>
        </Card>
    )
}

function MyFlashcards() {
    const toast = useToast();
    const [decks, setDecks] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deckToDelete, setDeckToDelete] = useState({id: 0, title: undefined});
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const api = useApi();

    useEffect(() => {
        getDecks();
    }, []);

    const getDecks = async () => {
        setLoading(true);
        await api
        .get('api/decks/')
        .then(response => {
            setDecks(response.data);
        })
        .catch(error => {
            toast?.addToast({message: "Something went wrong whilst fetching your decks, please try again", type: "error"});
        })
        .finally(() => {
            setLoading(false);
        });
    }

    const handleDelete = async (id: number) => {
        if(isDeleting) {
            return;
        }
        setIsDeleting(true);
        await api.delete(`api/decks/${id}/`)
        .then(response => {
            if(response.status === 204) {
                setShowDeleteModal(false);
                toast?.addToast({message: `Deck "${deckToDelete.title}" has been deleted`, type: "success"});
            }
        })
        .catch(error => {
            toast?.addToast({message: "Something went wrong whilst deleting your deck, please try again", type: "error"});
        })
        .finally(() => {
            getDecks();
            setIsDeleting(false);
        });  
    }

    return (
        <div className="my-flashcards-page">
            <div className="page-header">
                <h1>My Flashcards</h1>
            </div>
            {!loading && <ul className="decks-list">
                {decks.map((deck: any) => (
                    <li key={deck.id}>
                        <DeckElement onDelete={() => {setDeckToDelete({id: deck.id, title: deck.title}); setShowDeleteModal(true)}} key={deck.id} title={deck.title} id={deck.id} />
                    </li>
                ))}
            </ul>}
            {loading && <div className="fetch-deck-loading">
                <h2>Fetching your decks...</h2>
                <Spinner />
            </div>}
            <Modal open={showDeleteModal}>
                <div className="delete-modal">
                    <h1>Are you sure?</h1>
                    <p>Are you sure you want to delete the deck "{deckToDelete.title}"?<br />This action cannot be undone.</p>
                    <div className="modal-actions">
                        <Button id="cancel-delete" text="Cancel" variant="outlined" onClick={() => {setShowDeleteModal(false)}}/>
                        <Button id="confirm-delete" text="Delete" variant="filled" onClick={() => {setShowDeleteModal(false); handleDelete(deckToDelete.id)}}/>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default MyFlashcards