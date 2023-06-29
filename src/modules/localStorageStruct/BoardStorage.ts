
interface BoardKeys{
    keys: string[]
}

const boardKeys:BoardKeys = {
    keys: ["Backlog", "In Progress", "Complete"]
};

export {boardKeys};


class BoardLocal{
    private backlog: string;
    private inProgress: string;
    private complete: string;

    constructor(backlogSearch:string, inProgressSearch:string, completeSearch:string){
        localStorage.getItem
    }
}