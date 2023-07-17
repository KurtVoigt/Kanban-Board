# Kanban Board

### A Kanban Board written entirely in typescript


## General Architecture
This codebase is seperated into several modules that control specific funtionality. Each module is contains a class responsible for both the data necessary for it to create its associated dom object and managing its specific object index.ts is the starting point. This was my way of limiting potentially conflicting calls on dom objects from places all over the application.

### index.ts
Responisible for orchestrating the various parts of the application, it is responisbile for the creation and management of the top level DOM, the creation of other application objects, listening for various events on those objects, spelling out the order in which certain events should occur, and making calls to the LocalStorageController.


### board.ts
This file contains the board class. The board class is responsible for containing cards in one of its various sections and rendering them appropriately. To this end the underlying data structure of the board is a map with a key of the name of each of its section and a value being another map representing an individual section.

This value map has a key of an individual card's ID and a value of a card object associated with that ID. In this way we can quickly find and reference individual cards within a section. Other than that the board class opens up drag and drop functionallity in its associated dom object and emmiting a card dropped event to index

### card.ts
This file contains the card class. The card class is responsible for managing the requisite data of a card, communicating various card events, and creation and managing an individual card's dom node. Card has 3 events, one for editing, one for deleting and one for dragging. These events are picked up by index.ts and the requisite actions are taken via further member functions in card.

### card-modal.ts
This file contains two classes, cardmodal and cardform. Cardform is simply the associated dom node, the logic of creating forms through ts was simply overbearing and I seperated it for ease of use. Other than that it is similar to the previous two, CardModal contains the data input into the form by the user and either a submit or cancel event is emmited to Index.

### CardIDManger.ts
This file contains a min heap which is tailored to store and distribute unique IDs to each card. This both solves the problem of the max amount of cards a user can have and ensuring that each ID is unique, which is vital for local storage

### BoardStorage.ts
This file contains a localStorageController class. My way of organizing the use of local storage within this application. At it's base, local storage is set into two parts, sections and cards. Each section is a key of a section name corresponding to a section on the board, with a value of a number array of our (guarenteed unique!) card IDs:

get("Backlog") -> "[1,4,7,42]"

Each one of these returned Ids is then associated in localstorage with a JSON object containg the info necessarry to create a card object

get("1") -> {
                "title": "your card"
                "type": "management"
                "desc": "your card description"
}

In this way you can create sections and cards based off of what is saved in local storage. Because our CardIDManager is only saved in memory, fetching local storage will also clear it, allowing each card to get a new ID and each section to start from a clean slate as they are filled. Other member functions of LocalStorageController simply allow functionallity needed to maintain this order while running the application.

### Application Flow
The flow of this app goes as follows
1. Index checks whether user has data for this app stored locally
2. If it does, fetches it, creates card objects form data and creates board object, passing it these cards so that they will be correctly displayed
- if it does not, creates a new example card object and an empty board object, adding the example card to the board
3. Index then creates its top level dom elements (board container and the add button) and appends the board dom element.
4. User can now freely create card via the add button
5. Cards can be edited, deleted, or dragged and dropped between the sections of the Board

## Webpack
I originally started this project to learn some webpack as I had only had experience on Vite. A nifty tool, though I find working with the config file a bit cumbersome. I used sass loader to convert scss to css, ts loader to convert typescript into whatever JS standard that nobody writes anymore, and the HTMLWebpack plugin to create an index.html in my dist folder with a template (found here in template.html) so that I could pull in some google fonts. 

##Running
Clone this repo and run 
```
npm install
npm run build
``` 

## Still to do
I am calling this done. 
