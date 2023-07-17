import { Card, taskType } from "../card/card";
import "./card-modal.scss";
const eventEmitter = require('events');

interface CardModalInfo {
   title: string,
   taskType: taskType,
   desc: string
}

interface SubmitEvent extends CustomEvent {
   detail: submitEventDetail
}

interface submitEventDetail {
   detail: CardModalInfo
}

//
class CardForm {
   private _container: HTMLDivElement;
   private _modal: HTMLFormElement;
   private _title: HTMLHeadingElement;
   private submitEvent: CustomEvent;
   private cancelEvent: CustomEvent;
   private fieldClassName = "form-field";
   private _titleContainer: HTMLDivElement;
   private _titleInput: HTMLInputElement;
   private _titleLabel: HTMLLabelElement;
   private _dropDownContainer: HTMLDivElement;
   private _dropDownSelect: HTMLSelectElement;
   private _dropDownLabel: HTMLLabelElement;
   private _descContainer: HTMLDivElement;
   private _descInput: HTMLTextAreaElement;
   private _descLabel: HTMLLabelElement;
   private _submitButton: HTMLButtonElement;
   private _cancelButton: HTMLButtonElement;
   private buttonContainer: HTMLDivElement;


   constructor(cardInfo?: CardModalInfo) {

      //this.submitEvent = new CustomEvent("submitted", {detail:cardInfo});
      this._container = document.createElement('div');
      this._container.className = "card-modal-container";
      this._modal = document.createElement('form');
      this._modal.className = "card-modal";
      this._title = document.createElement("h2");
      this._title.innerText = "Create New Card";

      let titleValue = "";
      let dropDownValue: taskType = taskType.engineering;
      let descValue = "";
      if (cardInfo) {
         titleValue = cardInfo.title;
         dropDownValue = cardInfo.taskType;
         descValue = cardInfo.desc;
         this._title.innerText = "Edit Card";
      }

      //title for new card
      this._titleContainer = document.createElement("div");
      this._titleContainer.className = this.fieldClassName;
      this._titleInput = document.createElement('input');
      this._titleInput.id = "Title";
      this._titleInput.value = titleValue;
      this._titleLabel = document.createElement('label')
      this._titleLabel.htmlFor = "Title";
      this._titleLabel.innerText = "Title";
      this._titleContainer.append(this._titleLabel, this._titleInput);

      //dropdown menu
      this._dropDownContainer = document.createElement('div');
      this._dropDownContainer.className = "dropdown-container " + this.fieldClassName;
      this._dropDownSelect = document.createElement('select');
      this._dropDownSelect.id = "Type";
      this._dropDownSelect.className = "dropdown";
      this._dropDownLabel = document.createElement('label')
      this._dropDownLabel.htmlFor = "Type";
      this._dropDownLabel.innerText = "Type";
      const engiOption = document.createElement("option");
      engiOption.value = taskType.engineering;
      engiOption.innerText = taskType.engineering.toUpperCase();
      const manageOption = document.createElement("option");
      manageOption.value = taskType.management;
      manageOption.innerText = taskType.management.toUpperCase();
      const otherOption = document.createElement("option");
      otherOption.value = taskType.other;
      otherOption.innerText = taskType.other.toUpperCase();
      this._dropDownSelect.value = dropDownValue;
      this._dropDownSelect.append(engiOption, manageOption, otherOption);
      this._dropDownContainer.append(this._dropDownLabel, this._dropDownSelect);


      //description

      this._descInput = document.createElement('textarea');
      this._descInput.id = "Description";
      this._descLabel = document.createElement('label')
      this._descLabel.htmlFor = "Description";
      this._descLabel.innerText = "Description";
      this._descContainer = document.createElement('div');
      this._descContainer.className = "desc-field";
      this._descInput.value = descValue;
      this._descContainer.append(this._descLabel, this._descInput);


      //submit button
      this._submitButton = document.createElement("button");
      this._submitButton.type = "button";
      this._submitButton.innerText = "Submit";
      this._submitButton.addEventListener("click", () => {
         const formData: CardModalInfo = { title: this._titleInput.value, taskType: this._dropDownSelect.value as taskType, desc: this._descInput.value };
         this.submitEvent = new CustomEvent("submitted", { detail: formData });
         this._container.dispatchEvent(this.submitEvent);
      });

      //cancel button
      this._cancelButton = document.createElement("button");
      this._cancelButton.type = "button";
      this._cancelButton.innerText = "Cancel";
      this._cancelButton.addEventListener("click", () => {
         this.cancelEvent = new CustomEvent("cancelled");
         this._container.dispatchEvent(this.cancelEvent);
      });

      //button container
      this.buttonContainer = document.createElement('div');
      this.buttonContainer.classList.add("button-container");
      this.buttonContainer.appendChild(this._submitButton);
      this.buttonContainer.appendChild(this._cancelButton);


      this._modal.append(this._title, this._titleContainer, this._dropDownContainer, this._descContainer, this.buttonContainer);
      this._container.appendChild(this._modal);

   }

   get domElement() {
      return this._container;
   }

   disableInputs():void{
      this._descInput.disabled = true;
      this._dropDownSelect.disabled = true;
      this._titleInput.disabled = true;
      this._submitButton.style.visibility = "hidden";
      this._cancelButton.innerText = "Close";
      this._title.innerText = "View Card";
   }


}

export default class CardModal {
   private _domElement: CardForm;
   private _title: string;
   private _type: taskType;
   private _desc: string;
   constructor(cardInfo?: CardModalInfo, disabled?:boolean) {
      if (cardInfo){
         this._domElement = new CardForm(cardInfo);
         if(disabled){
            this._domElement.disableInputs();
         }
      }
      else
         this._domElement = new CardForm();
      this._domElement.domElement.addEventListener("submitted", (e: CustomEvent) => {
         this._title = e.detail.title;
         this._type = e.detail.taskType;
         this._desc = e.detail.desc;
      });
   }



   get domElement() {
      return this._domElement.domElement;
   }
   get title() {
      return this._title;
   }
   get type() {
      return this._type;
   }
   get desc() {
      return this._desc;
   }
}

