import { Card, cardInfo } from "../card/card";
import { sectionsType } from "../board/board";
interface BoardKeys {
    keys: string[]
}





type sections = {
    sectionName: string
    cardsInfo: cardInfo[];
}

type sectionCardIds = number[];






class LocalStorageController {
    private boardKeys = ["Backlog", "In Progress", "Complete"];
    private sections: sections[];

    constructor() {
        this.sections = [];
        this.sections[0] = { sectionName: this.boardKeys[0], cardsInfo: [] };
        this.sections[1] = { sectionName: this.boardKeys[1], cardsInfo: [] };
        this.sections[2] = { sectionName: this.boardKeys[2], cardsInfo: [] };

    }

    fetchSections(): sections[] | undefined {
        if (!this.isLocalStorageAvailable())
            return undefined;

        let noSavedCardCounter = 0;
        for (let i = 0; i < this.sections.length; ++i) {
            const cardIdArray = JSON.parse(localStorage.getItem(this.sections[i].sectionName)) as number[];
            if (cardIdArray) {
                for (let j = 0; j < cardIdArray.length; ++j) {
                    noSavedCardCounter++;
                    const cardInfo: cardInfo = JSON.parse(localStorage.getItem(cardIdArray[j].toString()));
                    this.sections[i].cardsInfo.push(cardInfo);
                }
            }
            
        }

        this.clear();
        if(noSavedCardCounter === 0)
            return undefined;
        return this.sections;
    }

    //TODO save card info associated w/ card
    /*saveSections(sections: sectionsType): void {
        sections.forEach((value: Map<number, Card>, key: string) => {
            let cardIds: number[] = [];
            value.forEach((value: Card, key: number) => {
                cardIds.push(key);
                localStorage.setItem(key.toString(), JSON.stringify({ title: value.title, type: value.type, desc: value.desc }));
            });
            localStorage.setItem(key, JSON.stringify(cardIds));
        });
    }*/

    saveCard(card: Card, sectionName?: string): void {


        localStorage.setItem(card.Id.toString(), JSON.stringify({ title: card.title, type: card.type, desc: card.desc }));
        if(sectionName){
            this.ChangeCardSection(card.Id, sectionName);   
        }
        else{
            this.ChangeCardSection(card.Id, this.boardKeys[0]);
        }
    }

    deleteCard(cardId:number):void{
        for (let i = 0; i < this.sections.length; ++i) {
            const fetchedSection = localStorage.getItem(this.sections[i].sectionName);
            
            if (fetchedSection) {
                let parsedSection: number[] = JSON.parse(fetchedSection);
                console.log(this.sections[i].sectionName);
                if (parsedSection) {
                    const index = parsedSection.indexOf(cardId);
                    if (index !== -1) {
                        parsedSection.splice(index, 1);
                        localStorage.setItem(this.sections[i].sectionName, JSON.stringify(parsedSection));

                        
                    }
                }
                
            }
        }
    }

    editCard(cardId:number, cardInfo:cardInfo):void{
        localStorage.setItem(cardId.toString(), JSON.stringify({ title: cardInfo.title, type: cardInfo.type, desc: cardInfo.desc }));
    }


    ChangeCardSection(cardId:number, newSectionName: string): void {
        //find and delete card from local section storage
        this.deleteCard(cardId);

        //add card to news section
        const fetchedSection = localStorage.getItem(newSectionName);
        if(fetchedSection){
            console.log(newSectionName);
            let parsedSection: number[] = JSON.parse(fetchedSection);
            if(parsedSection){
                parsedSection.push(cardId);
                localStorage.setItem(newSectionName, JSON.stringify(parsedSection));
            }
            else{
                parsedSection = [];
                parsedSection.push(cardId);
                localStorage.setItem(newSectionName, JSON.stringify(parsedSection))
            };
        }
        else{
            const jsonIDStringArray = JSON.stringify([cardId]);
            localStorage.setItem(newSectionName,jsonIDStringArray);
        }
    }



    private clear(): void {
        localStorage.clear();
    }


    private isLocalStorageAvailable(): boolean {
        const test = 'test';
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

}

export { LocalStorageController, sections };



