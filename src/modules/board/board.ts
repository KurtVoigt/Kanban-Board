import { Card } from "../card/card";
import CardIDManager from "../card/CardIDManager";
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


//when dropped the accepting section needs the id of the card to add it to itself 
class Board {
    private _domElement: HTMLDivElement;
    private _sections: Map<string, Map<number, Card>>;
    private CardDroppedEvent: CardDroppedEvent;
    constructor(sections?: string[]) {
        this._sections = new Map();
        this._domElement = document.createElement('div');
        this._domElement.className = "board";
        //this whole if statement is unnecessary at the moment but... yknow, TODO
        if (sections) {
            /* for (let i = 0; i < sections.length; i++) {
                 const customSection = this.Section(sections[i]);
                 customSection.addEventListener('dragenter', this.handeDragEnter);
                 customSection.addEventListener('dragover', this.handleDragOver);
                 customSection.addEventListener('dragleave', this.handleDragLeave);
                 customSection.addEventListener('drop', this.handleDrop);
                 this._domElement.appendChild(customSection);
 
             }*/
        } else {
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


    addCard(card: Card,): void {
        this._sections.get(defaults[0]).set(card.Id, card);
        const firstSection = this._domElement.getElementsByClassName("board-section " + defaults[0]);
        firstSection[0].appendChild(card.domElement);
    }

    //renders a section of the board, having a seperate dom tree with signals would be better
    render(sectionName: string): void {
        const section = this._domElement.getElementsByClassName(sectionName)[0];
        const sectionMap = this._sections.get(sectionName);
        const cards = section.getElementsByClassName("card");
        while(cards[cards.length]){
            cards[cards.length].parentNode.removeChild(cards[cards.length]);
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
        console.log(boardSections);
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
       // e.preventDefault();

        console.log(sectionName);
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
        this.render(sectionName);
    }

    private handleDragOver(e: DragEvent) {
        e.preventDefault();
        return false;
    }
}

export { Board };
