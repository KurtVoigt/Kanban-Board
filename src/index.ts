import * as cards from "./modules/card/card";
import { Board, CardDroppedEvent } from "./modules/board/board";
import CardModal from "./modules/card/card-modal";
import { LocalStorageController, sections } from "./modules/localStorageStruct/BoardStorage";

const ghImg = require("./images/ghImage.png");
import "./index.scss";

//TODO local storage swap cards in same section?, allow dropping on to card 


interface FetchedSection {
    name: string,
    cards: cards.Card[],
}



let board: Board;
let card: cards.Card;
const LocalStore = new LocalStorageController();
let modal: CardModal;

const fetched = LocalStore.fetchSections();
if (fetched) {
    const convertedFetchedSections = ConvertFetchedSections(fetched);
    board = new Board();
    for (let i = 0; i < convertedFetchedSections.length; i++) {
        for (let j = 0; j < convertedFetchedSections[i].cards.length; j++) {
            board.addCard(convertedFetchedSections[i].cards[j], convertedFetchedSections[i].name);
        }
    }

}

else {
    board = new Board();
    card = CreateCard({ type: cards.taskType.engineering, title: "First Ticket", desc: "Very complicated programming task", });
    board.addCard(card);

}
//        Board.BoardStorage.saveSections(this._sections);

board.domElement.addEventListener('card-section-change', HandleCardSectionChange);

const headerContainer = document.createElement('header');
headerContainer.classList.add("page-header");
const header = document.createElement('h1');
header.innerText = "Kanban Board";
headerContainer.append(header);

const footerContainer = document.createElement('footer');
footerContainer.classList.add('page-footer');
const footer = document.createElement('p')
footer.innerText = "Made By: KurtVoigt";
const githubLink = document.createElement('a');
const githubImage = document.createElement('img');
githubImage.src =  ghImg;
githubLink.append(githubImage);
githubLink.href = "https://github.com/KurtVoigt/Kanban-Board/";
githubLink.classList.add("github-link");
footerContainer.append(footer);
footerContainer.append(githubLink);



const boardContainer = document.createElement('div');
boardContainer.classList.add('board-container');

const addButtonContainer = document.createElement('div');
addButtonContainer.classList.add("add-button-container");
const addButton = document.createElement("button");
const addButtonText = document.createElement('div');
addButton.className = "add-button";
addButtonText.innerText = "+";
addButton.appendChild(addButtonText);
addButton.addEventListener('click', () => {
    modal = new CardModal;
    document.body.appendChild(modal.domElement);
    boardContainer.classList.add("dimmed");
    addButton.disabled = true;
    modal.domElement.addEventListener("submitted", (e: CustomEvent) => {
        const newCard = CreateCard({ type: modal.type, title: modal.title, desc: modal.desc });

        board.addCard(newCard);
        document.body.removeChild(modal.domElement);
        boardContainer.classList.remove("dimmed");
        addButton.disabled = false;

    });

    modal.domElement.addEventListener("cancelled", () => {
        document.body.removeChild(modal.domElement);
        boardContainer.classList.remove("dimmed");
        addButton.disabled = false;
    });


});

document.body.addEventListener("submitted", () => { console.log("body") });




document.body.appendChild(headerContainer);
boardContainer.appendChild(board.domElement);
document.body.appendChild(boardContainer);
addButtonContainer.appendChild(addButton);
document.body.appendChild(addButtonContainer);
document.body.append(footerContainer);


const editCard = (card: cards.Card, disabled?:boolean): void => {
    
    const modal = new CardModal({ title: card.title, taskType: card.type, desc: card.desc }, disabled);
    document.body.appendChild(modal.domElement);
    boardContainer.classList.add("dimmed");
    addButton.disabled = true;

    modal.domElement.addEventListener("submitted", (e: CustomEvent) => {
        const editedInfo:cards.cardInfo = { title: modal.title, type: modal.type, desc: modal.desc };
        document.body.removeChild(modal.domElement);
        boardContainer.classList.remove("dimmed");

        addButton.disabled = false;
        
        LocalStore.editCard(card.Id, editedInfo);
        card.PublishEdit(editedInfo);

    });

    modal.domElement.addEventListener("cancelled", () => {
        document.body.removeChild(modal.domElement);
        boardContainer.classList.remove("dimmed");
        addButton.disabled = false;
    });


}

function CreateCard(cardInfo: cards.cardInfo, sectionName?: string): cards.Card {
    const card = new cards.Card({ type: cardInfo.type, desc: cardInfo.desc, title: cardInfo.title });
    card.domElement.addEventListener('edit-request', () => { editCard(card) });
    card.domElement.addEventListener('delete-card', () => { LocalStore.deleteCard(card.Id) });
    card.domElement.addEventListener('view-card', ()=>{editCard(card, true);});

    if (sectionName) {
        LocalStore.saveCard(card, sectionName);
    }
    else {
        LocalStore.saveCard(card);
    }

    return card;
}

function ConvertFetchedSections(fetchedLocal: sections[]): FetchedSection[] {
    let retArr: FetchedSection[] = [];
    for (let i = 0; i < fetchedLocal.length; ++i) {
        const pushed: FetchedSection = { name: fetchedLocal[i].sectionName, cards: [] };
        retArr.push(pushed);
        for (let j = 0; j < fetchedLocal[i].cardsInfo.length; ++j) {
            const newCard = CreateCard(fetchedLocal[i].cardsInfo[j], fetchedLocal[i].sectionName);
            retArr[i].cards.push(newCard);
        }
    }

    return retArr;
}

function HandleCardSectionChange(e: CardDroppedEvent): void {
    e.preventDefault();
    LocalStore.ChangeCardSection(e.detail.cardId, e.detail.droppedOn);
}


export { FetchedSection }
