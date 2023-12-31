import "./card.scss";
import CardIDManager from "./CardIDManager";
const eventEmitter = require('events');


enum taskType {
    engineering = 'engineering',
    management = 'management',
    other = 'other'
}

interface cardInfo{
    title:string,
    type: taskType,
    desc:string
}

interface EditEventDetails {
    desc: string,
    type: taskType,
}

interface EditEvent extends CustomEvent {
    detail: EditEventDetails
}

interface DropEventDetails{
    id:number
}

interface DropEvent extends CustomEvent {
    detail: DropEventDetails
} 
//review this whole typing business


class Card {
    private static IDManager:CardIDManager;
    private _type: taskType;
    private _title: string;
    private _desc: string;
    private _domElement: HTMLDivElement;
    private clickEvent: CustomEvent;
    private editEvent: EditEvent;
    private deleteEvent: CustomEvent;
    private dragEndEvent: DropEvent;
    private editButton:HTMLButtonElement;
    private deleteButton: HTMLButtonElement;
    private buttonContainer: HTMLDivElement;
    private header: HTMLHeadingElement;
    private description: HTMLParagraphElement;
    private ID: number;    

    constructor(cardInfo: cardInfo) {  //type: taskType, title: string, desc: string,
        if(!Card.IDManager){
            Card.IDManager = new CardIDManager();
        }
        this._type = cardInfo.type;
        this._desc = cardInfo.desc;
        this._title = cardInfo.title;
        this.ID = Card.IDManager.requestID();
        this.clickEvent = new CustomEvent('view-card');
        this.editEvent = new CustomEvent('edit-request', {
            detail:
            {
                desc: this._desc,
                type: this._type,
            }
        });

        this.deleteEvent = new CustomEvent('delete-card',{
            detail:
            {
                id:this.ID
            }
        });

        this.dragEndEvent = new CustomEvent('card-dropped', {
            detail: {id:this.ID}
        });

        this._domElement = document.createElement('div');
        this._domElement.className = "card " + this._type;
        this._domElement.draggable = true;
        this._domElement.addEventListener('dragstart', (event:DragEvent) => {this.handleDragStart(event, this.ID)});
        this._domElement.addEventListener('dragend', ()=>{
            this.handleDragEnd(this._domElement)});

        this._domElement.addEventListener('click', (e:Event)=>{
            e.preventDefault();
            this._domElement.dispatchEvent(this.clickEvent);});
        



        this.editButton = document.createElement('button');
        this.editButton.classList.add('edit-card-button');
        this.editButton.innerText = "Edit";
        this.editButton.addEventListener('click', (e:MouseEvent)=>{
            e.stopPropagation();
            this.edit();   
        });

        this.deleteButton = document.createElement('button');
        this.deleteButton.classList.add('delete-card-button');
        this.deleteButton.innerText = 'Delete';
        this.deleteButton.addEventListener('click', (e:MouseEvent)=>{
            e.stopPropagation();
            this.delete();   
        });

        this.buttonContainer = document.createElement('div');
        this.buttonContainer.classList.add('card-button-container');
        this.buttonContainer.append(this.editButton, this.deleteButton);

        this.header = document.createElement('h5');
        this.header.innerText = this._title;

        this.description = document.createElement('div');
        this.description.classList.add("card-description");
        this.description.innerText = this._desc;

        const topRow = document.createElement('div');
        topRow.classList.add('card-buttons-title');
        topRow.append(this.buttonContainer, this.header);

        this._domElement.appendChild(topRow);
        this._domElement.appendChild(this.description);

        
 

    }

    get type() {
        return this._type;
    }

    get title() {
        return this._title;
    }

    get desc() {
        return this._desc;
    }

    get domElement() {
        return this._domElement;
    }

    get Id(){
        return this.ID;
    }

    private edit() {
        this._domElement.dispatchEvent(this.editEvent);
    }

    private delete():void{
        this._domElement.dispatchEvent(this.deleteEvent);
        Card.IDManager.freeID(this.ID);
    }


    PublishEdit(cardInfo:cardInfo){
        this._title = cardInfo.title;
        this._type = cardInfo.type;
        this._desc = cardInfo.desc;
        this.updateDomElement();
    }

    private updateDomElement(){
        this.header.innerText = this._title;
        this.description.innerText = this._desc;
        this._domElement.className = "card " + this._type;
    }

    private handleDragStart(e:DragEvent, cardID:number){

        if(e.target instanceof HTMLDivElement){
            e.target.style.opacity = '0.4';
        
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', cardID.toString()); 
        }
    }

    
    private handleDragEnd(e:HTMLDivElement){
        if(e instanceof HTMLDivElement){
            e.style.opacity = '1.0';
            e.dispatchEvent(this.dragEndEvent);
        }
    }
}




export { Card, taskType, cardInfo };