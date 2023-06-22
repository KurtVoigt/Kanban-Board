import { Card } from "./card";


//prio queue to manage pool of IDs for cards. Max Number of cards set to 300 for arbitrary reasons

export default class CardIDManager {
    public length: number;
    private IDPool: number[];
    

    constructor() {
        this.IDPool = [];
        this.length = 0;
        for(let i = 1; i <= 300; ++i){
            this.insert(i);
        }
    }
    private heapifyUp(idx: number): void {
        if (idx === 0) {
            return;
        }
        const p = this.parent(idx);
        const pValue = this.IDPool[p];
        const val = this.IDPool[idx];

        if (pValue > val) {
            this.IDPool[idx] = pValue;
            this.IDPool[p] = val;
            this.heapifyUp(p);
        }
    }
    private heapifyDown(idx: number) {
        if (idx >= this.length) {
            return;
        }
        const lidx = this.leftChild(idx);
        const ridx = this.rightChild(idx);

        if (lidx >= this.length)
            return;

        const lV = this.IDPool[lidx];
        const rV = this.IDPool[ridx];
        const v = this.IDPool[idx];

        if (lV > rV && v > rV) {
            this.IDPool[idx] = rV;
            this.IDPool[ridx] = v;
            this.heapifyDown(ridx);
        } else if (rV > lV && v > lV) {
            this.IDPool[idx] = lV;
            this.IDPool[lidx] = v;
            this.heapifyDown(lidx);

        }
    }
    private parent(idx: number): number {
        return Math.floor((idx - 1) / 2);
    }
    private leftChild(idx: number): number {
        return idx * 2 + 1;
    }

    private rightChild(idx: number): number {
        return idx * 2 + 2;
    }

    private insert(value: number): void {
        this.IDPool[this.length] = value;
        this.heapifyUp(this.length);
        this.length++;

    }

    //basic checking for now, but should be fine if only called from cards and you don't use it arbitrarilly
    freeID(id:number):void{
        if(id < 1 || id > 300)
            return;
        this.IDPool[this.length] = id;
        this.heapifyUp(this.length);
        this.length++;
    }

    requestID(): number {
        if (this.length === 0) {
            return -1;
        }
        const out = this.IDPool[0];
        this.length--;
        if (this.length === 0) {
            this.IDPool = [];
            return out;
        }
        this.IDPool[0] = this.IDPool[this.length];
        this.heapifyDown(0);
        return out;
    }
}