import Card from "../components/card/Card";
import IconButton from "../components/icon-button/IconButton";
import close from '../assets/close.svg?react'
import tick from '../assets/tick.svg?react'
import flip from '../assets/flip.svg?react'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/button/Button";
import "./flashcards-styles/FlashcardTest.css"
import Progressbar from "../components/progress-bar/ProgressBar";
import Modal from "../components/modal/Modal";
import ModalSuccess from "../assets/modal-success.svg?react";
import Spinner from "../components/spinner/Spinner";
import useApi from "../authentication/useApi";

class Flashcard{
    term: string;
    definition: string;
    constructor(term: string, definition: string){
        this.term = term;
        this.definition = definition;
    }
}

function FlashcardTest(){
    const {deckId} = useParams();
    const [flashcardQueue, setFlashcardQueue] = useState<Flashcard[] | null>(null);
    const [numOfCards, setNumOfCards] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [showEndTestModal, setShowEndTestModal] = useState(false);
    const [slideDirection, setSlideDirection] = useState<"exit-left" | "enter-right">("enter-right");
    const [slideTriggerSlide, setTriggerSlide] = useState<"active" | "inactive">("inactive");
    const progress = (numOfCards > 0 && flashcardQueue !== null) ? (numOfCards - flashcardQueue.length) / numOfCards : 0;
    const api = useApi();

    useEffect(() => {
        let isMounted = true;
        const fetchDeck = async () => {
            await api.get(`api/decks/${deckId}`).then(response => {
                if(isMounted){
                    setFlashcardQueue(response.data.flashcards);
                    setNumOfCards(response.data.flashcards.length);
                }
            }).catch(error => console.log(error));
        }
        fetchDeck();
        return () => {
            isMounted = false;
            setTimeout(() => {
                setTriggerSlide("active");
            }, 100);
            
        }
    }, []);

    const handleNextCard = (state: "remembered" | "forgot") => {
        if(flashcardQueue === null){
            return;
        }
        const [card, ...rest] = flashcardQueue;
        let newQueue: Flashcard[];

        if(state === "forgot"){
            newQueue = [...rest, card];
        } else if(state === "remembered"){
            newQueue = rest;
        }

        setSlideDirection("exit-left");
        setTriggerSlide("inactive");
        
        setTimeout(() => {
            setFlipped(false);
            setSlideDirection("enter-right");
            setTriggerSlide("inactive");
            
            requestAnimationFrame(() => {
                setFlashcardQueue(newQueue);
                setTriggerSlide("active");
            });
        }, 400);
        


        return;
    }

    const showCard = () => {
        if(flashcardQueue === null){
            return(
                <div className="fetch-deck-loading">
                    <h1>Fetching cards...</h1>
                    <Spinner />
                </div>
            )
        }

        if(progress === 1 && showEndTestModal === false){
            setShowEndTestModal(true);
        }

        return(
            <div className="flashcard-container">
                <Progressbar value={progress} className="test-progress-bar"/>
                {flashcardQueue.length > 0 && <>
                    <Card className={`card ${flipped ? 'flipped' : ''} ${slideDirection} ${slideTriggerSlide}`}>                     
                            <>
                                <div className="front">
                                    <div className="flashcard-content">
                                        <h1>Term</h1>
                                        <p className="flashcard-term">{flashcardQueue[0].term}</p>
                                        <IconButton className="flip-button" icon={flip} tooltip="Flip card" onClick={() => {setFlipped(!flipped)}}/>
                                    </div>
                                </div>
                                <div className="back">
                                    <div className="flashcard-content">
                                        <h1>Definition</h1>
                                        <p className="flashcard-definition">{flashcardQueue[0].definition}</p>
                                        <IconButton className="flip-button" icon={flip} tooltip="Flip card" onClick={() => {setFlipped(!flipped)}}/>
                                    </div>
                                </div>
                            </>
                    </Card> 
                    <div className="page-bottom">
                        {flipped &&
                            <>
                                <Button text="Forgot" className="forgot-button" iconLeft={close} variant="outlined" onClick={() => {handleNextCard("forgot")}}/>
                                <Button text="Remembered" className="remember-button" iconLeft={tick} variant="outlined" onClick={() => {handleNextCard("remembered")}}/>  
                            </>
                        }
                    </div>
                </>}
            </div>
        )
    }

    return(
        <div className="test-screen">
            <div className="page-header">
                {flashcardQueue && flashcardQueue.length > 0 && <IconButton icon={close} tooltip="Exit test" onClick={() => {setShowExitModal(true)}}/>}
            </div>
            <div className="page-content">
                {showCard()}
            </div>
            <Modal open={showExitModal}>
                {flashcardQueue && <div className="end-modal">
                    <h1>End this test?</h1>
                    <p className="end-modal-description">Only {flashcardQueue.length} card{flashcardQueue.length === 1 ? "" : "s"} left. You can do it!</p>
                    <div className="modal-actions">
                        <Button id="continue-button" text="Keep going" variant="outlined" onClick={() => {setShowExitModal(false)}}/>
                        <Button id="end-test-button" text="End test" variant="filled" onClick={() => {setShowExitModal(false); setShowEndTestModal(true)}}/>
                    </div>
                </div>}
            </Modal>
            <Modal className="success-modal" open={showEndTestModal}>
                <h1>Test completed!</h1>
                <ModalSuccess/>
                <div className="modal-actions">
                    <Button text="View all decks" variant="filled" to={`/flashcards/`} onClick={() => {setShowEndTestModal(false)}}/>
                    <Button text="Edit deck" variant="outlined" to={`/flashcards/edit/${deckId}`} onClick={() => {setShowEndTestModal(false)}}/>
                </div>
            </Modal>
        </div>
        
    )
}

export default FlashcardTest