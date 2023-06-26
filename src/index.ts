import * as cards from "./modules/card/card"; 
import { Board } from "./modules/board/board";
import CardModal from "./modules/card/card-modal";
import "./index.scss";

//TODO local storage swap cards in same section?, allow dropping on to card 
    
const board = new Board();
let modal:CardModal;
const card = new cards.Card(cards.taskType.engineering, "First Ticket", "Very complicated programming task", ); 
card.domElement.addEventListener('edit-request', ()=>{editCard(card)});
const boardContainer = document.createElement('div');
boardContainer.classList.add('board-container');

const addButtonContainer = document.createElement('div');
addButtonContainer.classList.add("add-button-container");
const addButton = document.createElement("button");
const addButtonText = document.createElement('div');
addButton.className = "add-button";
addButtonText.innerText = "+";
addButton.appendChild(addButtonText);
addButton.addEventListener('click', () =>{
    modal = new CardModal;
    document.body.appendChild(modal.domElement);
    boardContainer.classList.add("dimmed");
    addButton.disabled = true;
    modal.domElement.addEventListener("submitted", (e:CustomEvent) =>{
        const newCard = new cards.Card(modal.type, modal.title, modal.desc);
        
        newCard.domElement.addEventListener('edit-request', ()=>{editCard(newCard)});
        board.addCard(newCard);
        document.body.removeChild(modal.domElement);
        boardContainer.classList.remove("dimmed");
        addButton.disabled = false;
        
    });

    modal.domElement.addEventListener("cancelled", ()=>{
        document.body.removeChild(modal.domElement);
        boardContainer.classList.remove("dimmed");
        addButton.disabled = false;
    });

    
}); 



board.addCard(card);
boardContainer.appendChild(board.domElement);
document.body.appendChild(boardContainer);
addButtonContainer.appendChild(addButton);
document.body.appendChild(addButtonContainer);


const editCard = (card:cards.Card):void => {
    const modal = new CardModal({title:card.title, taskType:card.type, desc:card.desc});
    document.body.appendChild(modal.domElement);
    boardContainer.classList.add("dimmed");
    addButton.disabled = true;

    modal.domElement.addEventListener("submitted", (e:CustomEvent) =>{
        
        document.body.removeChild(modal.domElement);
        boardContainer.classList.remove("dimmed");
        
        addButton.disabled = false;
        card.PublishEdit({title:modal.title, type:modal.type, desc:modal.desc});
        
    });

    modal.domElement.addEventListener("cancelled", ()=>{
        document.body.removeChild(modal.domElement);
        boardContainer.classList.remove("dimmed");
        addButton.disabled = false;
    });
    
    
}
