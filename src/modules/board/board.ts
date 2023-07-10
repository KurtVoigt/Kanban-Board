import { FetchedSection } from "../..";
import { Card } from "../card/card";
import CardIDManager from "../card/CardIDManager";
import { LocalStorageController, sections } from "../localStorageStruct/BoardStorage";
import "./board.scss";


const defaults = [
    "Backlog",
    "In Progress",
    "Complete"
];

interface CardDroppedDetails {
    cardId: number,
    droppedOn: string
}

interface CardDroppedEvent extends CustomEvent {
    detail: CardDroppedDetails
}

type sectionsType = Map<string, Map<number, Card>>;

//when dropped the accepting section needs the id of the card to add it to itself 
class Board {
    private _domElement: HTMLDivElement;
    private _sections: sectionsType;
    private CardDroppedEvent: CardDroppedEvent;
    constructor(fetchedSections?: FetchedSection[]) {
        this._sections = new Map();
        this._domElement = document.createElement('div');
        this._domElement.className = "board";
       

        //todo, custom section names / amounts

        for (let i = 0; i < defaults.length; i++) {
            const sectionMap: Map<number, Card> = new Map();
            this._sections.set(defaults[i], sectionMap);
            const defaultSection = this.Section(defaults[i]);
            defaultSection.addEventListener('dragenter', this.handeDragEnter);
            defaultSection.addEventListener('dragover', this.handleDragOver);
            defaultSection.addEventListener('dragleave', this.handleDragLeave);
            defaultSection.addEventListener('drop', (event: DragEvent) => { this.handleDrop(event, this._sections, defaults); });
            this._domElement.appendChild(defaultSection);

        }

        if (fetchedSections) {
            fetchedSections.forEach((section: FetchedSection) => {
                for (let i = 0; i < section.cards.length; i++) {
                    this._sections.get(section.name).set(section.cards[i].Id, section.cards[i]);
                }
                this.render(section.name);
            });
        }


    }

    get domElement() {
        return this._domElement;
    }



    private Section(title: string): HTMLDivElement {
        const section = document.createElement('div');
        const header = document.createElement('h4');

        section.className = "board-section " + title;
        header.className = "section-title";

        header.innerText = title;
        section.appendChild(header);
        return section;

    }


    addCard(card: Card, sectionName?: string): void {
        let section: HTMLCollection;

        if (sectionName){
            section = this._domElement.getElementsByClassName("board-section " + sectionName);
            this._sections.get(sectionName).set(card.Id, card);
        }
        else {
            section = this._domElement.getElementsByClassName("board-section " + defaults[0]);
            this._sections.get(defaults[0]).set(card.Id, card);
        }
        card.domElement.addEventListener('delete-card', (event: CustomEvent) => {
            const deleteHander = this.handleCardDelete.bind(this, event);
            deleteHander();
        });
        section[0].appendChild(card.domElement);


    }

    //renders a section of the board, having a seperate dom tree with signals would be better
    render(sectionName: string): void {
        const section = this._domElement.getElementsByClassName(sectionName)[0];
        const sectionMap = this._sections.get(sectionName);
        const cards = section.getElementsByClassName("card");
        while (cards.length > 0) {
            cards[cards.length - 1].parentNode.removeChild(cards[cards.length - 1]);
        }
        sectionMap.forEach((value, key, map) => {
            section.appendChild(value.domElement);
        })
    }

    private handeDragEnter(e: DragEvent) {
        if (e.target instanceof HTMLDivElement) {
            e.target.classList.add("dragged-over");
        }
    }
    private handleDragLeave(e: DragEvent) {
        if (e.target instanceof HTMLDivElement) {
            e.target.classList.remove("dragged-over");
        }
    }

    private handleDrop(e: DragEvent, boardSections: Map<string, Map<number, Card>>, sectionNames: string[]): void {
        //find the section the card was in and remove it
        const droppedToDiv = e.target as HTMLDivElement;
        const cardID = Number(e.dataTransfer.getData('text/html'));
        const sectionClassList = droppedToDiv.classList;

        droppedToDiv.classList.remove("dragged-over")
        let sectionName = sectionClassList[1];
        if (sectionClassList.length > 2) {
            for (let i = 2; i < sectionClassList.length; ++i) {
                sectionName = sectionName + " " + sectionClassList[i]
            }
        }
        this.CardDroppedEvent = new CustomEvent('card-section-change', {
            detail:
            {
                cardId: cardID,
                droppedOn: sectionName
            }
        });

        //TODO, implement drop on to children
        if (!boardSections.get(sectionName))
            throw new Error("Map in board drop event handler does not exist");
        if (boardSections.get(sectionName).get(cardID)) {//already in
            return;
        }

        //find card, delete from current section and add to new section and rerender

        let card: Card;
        for (let i = 0; i < sectionNames.length; ++i) {
            const foundCard = boardSections.get(sectionNames[i]).get(cardID);
            if (foundCard) {
                card = foundCard;
                boardSections.get(sectionNames[i]).delete(cardID);
                this.render(sectionNames[i]);
                break;
            }
        }

        boardSections.get(sectionName).set(card.Id, card);
        this._domElement.dispatchEvent(this.CardDroppedEvent);
        this.render(sectionName);
    }

    private handleDragOver(e: DragEvent) {
        e.preventDefault();
        return false;
    }

    private handleCardDelete(e: CustomEvent) {
        for (let i = 0; i < defaults.length; ++i) {
            if (this._sections.get(defaults[i]).delete(e.detail.id)) {
                this.render(defaults[i]);
                break;
            }
        }

    }
}

export { Board, sectionsType, CardDroppedEvent };
