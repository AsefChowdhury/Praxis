import Button from "../components/button/Button";
import "./flashcards-styles/ManageDeck.css";
import addIcon from "../assets/add.svg?react";
import copyIcon from "../assets/copy.svg?react";
import deleteIcon from "../assets/delete.svg?react";
import editIcon from "../assets/edit.svg?react";
import InputField from "../components/input-field/InputField";
import Card from "../components/card/Card";
import IconButton from "../components/icon-button/IconButton";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Textarea from "../components/textarea/Textarea";
import Modal from "../components/modal/Modal";
import ModalSuccess from "../assets/modal-success.svg?react";
import dragIcon from "../assets/drag.svg?react";
import { useToast } from "../components/toast/toast";
import Reorderlist from "../components/reorder-list/ReorderList";
import useApi from "../authentication/useApi";

class Flashcard {
    term: string;
    definition: string;
    termError?: string;
    definitionError?: string;
    index: number;
    id?: string;
    clientId: string;

    constructor(term?: string, definition?: string) {
        this.term = term ?? "";
        this.definition = definition ?? "";
        this.clientId = crypto.randomUUID();
        this.index = 0;
    }
}

type FlashcardComponentProps = {
    flashcard: Flashcard
    onDelete: (index: number) => void
    onCopy: (index: number) => void
    disableDelete: boolean
    onDragStart: (cardId: string, e: React.MouseEvent) => void
}
function FlashcardComponent(props: FlashcardComponentProps) {

    const handleDragStart = (e: React.MouseEvent) => {
        props.onDragStart(props.flashcard.clientId, e);
    }

    return (
        <Card className={`flashcard`}>
            <div className="card-top">
                <div className="index">{props.flashcard.index !== undefined ? props.flashcard.index + 1 : ""}</div>
                <div className="card-actions">
                    <IconButton className="copy-button" icon={copyIcon} tooltip="Duplicate" onClick={() => {props.onCopy(props.flashcard.index)}}/>
                    <IconButton className="delete-button" icon={deleteIcon} disabled={props.disableDelete} tooltip="Delete" onClick={() => {props.onDelete(props.flashcard.index)}}/>
                    <IconButton className="drag-button" icon={dragIcon} tooltip="Drag to reorder" onMouseDown={(e) => {handleDragStart(e)}}/>
                </div>
            </div>
            <div className="card-bottom">
                <Textarea placeholder="Term" error={props.flashcard.termError} variant="underlined" defaultValue={props.flashcard.term} onChange={(e) => {props.flashcard.term = e.target.value}}/>
                <Textarea placeholder="Definition" error={props.flashcard.definitionError} variant="underlined" defaultValue={props.flashcard.definition} onChange={(e) => {props.flashcard.definition = e.target.value}}/>
            </div>
        </Card> 
    )
}

class Deck{
    title: string;
    flashcards: Flashcard[];
    
    constructor(title: string, flashcards: Flashcard[]) {
        this.title = title;
        this.flashcards = flashcards;
    }
}

type ManageDeckProps = {
    mode: "edit" | "create";
}

function ManageDeck(props: ManageDeckProps) {
    const {deckId} = useParams();
    const [flashcards, setFlashcards] = useState([new Flashcard()]);
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState<string | undefined>(undefined);
    const [showFinishedModal, setShowFinishedModal] = useState(false);
    const [submittingDeck, setSubmittingDeck] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    let navigate = useNavigate();
    const api = useApi();
    
    useEffect(() => {
        if(props.mode === "create"){
            setTitle("");
            setFlashcards([new Flashcard()]);
        }

        if(props.mode === "edit"){
            setTitleError(undefined);
            setLoading(true);
            let isMounted = true;
            const fetchDeck = async () => {
                await api.get(`api/decks/${deckId}`).then(response => {
                    if(isMounted){
                        setTitle(response.data.title);
                        const flashcards: Flashcard[] = response.data.flashcards.map((flashcard: Flashcard) => ({...flashcard, clientId: flashcard.id?.toString(), index: flashcard.index}));
                        setFlashcards(flashcards.sort((a, b) => a.index - b.index));
                    }
                }).catch(() => {
                    toast?.addToast({message: "Something went wrong whilst fetching your deck, please try again", type: "error"});
                }).finally(() => {
                    setLoading(false);
                });
            }
            fetchDeck();
            return () => {
                isMounted = false;
            }
        }
    }, [props.mode, deckId]);

    const addFlashcard = () => {
        const newList = [...flashcards, new Flashcard()].map((flashcard, index) => ({...flashcard, index: index}));
        setFlashcards(newList);
    }

    const deleteFlashcard = (index: number) => {
        const newList = flashcards.filter((_, i) => i !== index).map((flashcard, index) => ({...flashcard, index: index}));
        setFlashcards(newList);
    }

    const copyFlashcard = (index: number) => {
        const newFlashcard = new Flashcard(flashcards[index].term, flashcards[index].definition);
        const newList = [...flashcards, newFlashcard].map((flashcard, index) => ({...flashcard, index: index}));
        setFlashcards(newList);
    }

    const validateDeck = () => {
        let isValid = true;
        if(title === ""){
            setTitleError("Title cannot be empty");
            isValid = false;
        } else if(title.length > 100){
            setTitleError("Title must be less than or equal to 100 characters");
            isValid = false;
        } else {
            setTitleError(undefined);
        }
        const validateFlashcards = flashcards.map(flashcard => {
            if(flashcard.term === ""){
                flashcard.termError = "Term cannot be empty";
                isValid = false;
            }
            else if(flashcard.term.length > 100){
                flashcard.termError = "Term must be less than or equal to 100 characters";
                isValid = false;
            } else {
                flashcard.termError = undefined;
            }
            if(flashcard.definition === ""){
                flashcard.definitionError = "Definition cannot be empty";
                isValid = false;
            }
            else if(flashcard.definition.length > 1000){
                flashcard.definitionError = "Definition must be less than or equal to 1000 characters";
                isValid = false;
            } else {
                flashcard.definitionError = undefined;
            }
            return flashcard;
        });
        setFlashcards(validateFlashcards)
        return isValid;
    }

    const submitDeck = async () => {
        if(submittingDeck){
            return;
        }
        if(!validateDeck()){
            return;
        }
        for(let i = 0; i < flashcards.length; i++){
            flashcards[i].index = i;
        }
        try{
            setSubmittingDeck(true);
            setLoading(true);
            let response;
            if (props.mode == "edit"){
                response = await api.put(`api/decks/${deckId}/`, {
                    id: deckId,
                    title: title,
                    flashcards: flashcards
                })
            } else if (props.mode == "create"){
                const deck = new Deck(title, flashcards);
                response = await api.post('api/decks/', deck)
            }
            if(response?.status === 200 || response?.status === 201){
                if(props.mode === "create"){
                    navigate(`/flashcards/edit/${response.data.id}`);
                }
                setShowFinishedModal(true);
            }
        } catch (error) {
            toast?.addToast({message: `Something went wrong whilst ${props.mode === "edit" ? "saving" : "creating"} your deck, please try again`, type: "error"});
        } finally {
            setSubmittingDeck(false);
            setLoading(false);
        }
    }

    const handleReorder = (newOrder: Flashcard[]) => {
        setFlashcards(newOrder);
    }

    return (
        <>
            <div className="page-header">
                <h1>{props.mode === "edit" ? "Edit deck" : "Create a new deck"}</h1>
                <div className="save-buttons">
                    <Button loading={loading} iconLeft={editIcon} text={props.mode === "edit" ? "Save" : "Create"} type="button" variant="outlined" onClick={() => {submitDeck()}}/>
                    <Button loading={loading} text={props.mode === "edit" ? "Save and test" : "Create and test"} type="button" variant="filled" />
                </div>
            </div>
            <div className="deck-info">
                <InputField error={titleError} placeholder="Title" value={title} onChange={(e) => {setTitle(e.target.value)}}/>
            </div>

            <Reorderlist className="flashcard-list" items={flashcards} onReorder={handleReorder}>
                {(item, helpers) => (
                    <li key={item.clientId}>
                        <FlashcardComponent
                            flashcard={item}
                            disableDelete={flashcards.length === 1}
                            onDelete={deleteFlashcard}
                            onCopy={copyFlashcard}
                            onDragStart={helpers.onDragStart}
                        />
                    </li>
                )}
            </Reorderlist>
            <div className="flashcards-bottom">
                <Button disabled={loading} id="add-flashcard-button" iconLeft={addIcon} variant="outlined" text="Add flashcard" onClick={addFlashcard}/>
            </div>
            <Modal open={showFinishedModal}>
                <div className="finished-modal">
                    <h1>Your deck is ready!</h1>
                    <ModalSuccess/>
                    <div className="modal-actions">
                        <Button text="Continue editing" variant="filled" onClick={() => {setShowFinishedModal(false)}}/>
                        <Button text="View all decks" variant="outlined" onClick={() => {setShowFinishedModal(false); navigate(`/flashcards/`)}}/>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ManageDeck