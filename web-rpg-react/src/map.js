import rooms from './rooms.json'
import room from './room'
import enemies from './Data/enemies.json'
/**
 * saves the map and its elements
 */
class map{
    /**
     * constructor for the map object that saves the states of the rooms
     */
    map(){
        this.roomArr = []
        for(let i=0;i<rooms.length;i++){
            roomArr.add(new room(
                rooms.at(i).ID,
                rooms.at(i).Location,
                rooms.at(i).Adjacency,
                rooms.at(i).image,
                rooms.at(i).Tags,
                rooms.at(i).otherImages
            ))
        }
        this.trialState = false;
    }

    /**
     * call this with the direction and player position will process accounting for evreything and 
     * returns the new player position
     * @param {*} direction 
     * @param {*} playerPosition 
     * @returns 
     */
    move(direction, player){
        player.playerPosition;
        //get rooms and destiantions
        let currentRoom = this.roomArr[playerPosition];
        //hadle moving into a wall
        if(currentRoom.Adjacency[direction]==-1){
            throw "you cann't move into a wall"
        }
        let destination = this.roomArr[currentRoom.Adjacency[direction]];
        let currentTags = currentRoom.getTagsArr();
        let destinationTags = destination.getTagsArr();
        //handle a locked door
        if(currentRoom.checkRoomforTag(0)){
            for(let i=0;i<currentTags.length;i++){
                if(currentTags[i][0]==0 && currentTags[i][1] == direction){
                    throw "The door is locked you need a key";
                }
            }
        }
        //handle a portal
        if(currentRoom.checkRoomforTag(2)){
            for(let i=0;i<currentTags.length;i++){
                if(currentTags[i][0] == 2 && currentTags[i][1] == direction){
                    teleport();
                }
            }
        }
        
        //good to move call the animation or whatever.
        

        //handle enemies, trial, and treasure
        for(let i=0;i<destinationTags.length;i++){
            switch(destinationTags[i][0]){
                case 4:
                    //case enemy
                    if(destinationTags[i][1]==-1){
                        //generate random encounter app equal to player strength
                        

                    }else{
                        let enemy = enemies.at(destinationTags[i][1]);
                    }
                    combatProcess(player, enemy);
                case 3:
                    //case trial
                    if(this.trialState){
                        let enemy = enemies.at(destinationTags[i][2])
                    }else{
                        let enemy = enemies.at(destinationTags[i][1])
                    }
                    combatProcess(player, enemy);
                case 1:
                    //case treasue
                    if(this.trialState && playerPosition==58){
                        itemID = destinationTags[i][2];
                    }else{
                        itemID = destinationTags[i][1];
                    }
                    player.addItem(itemID);
                default:
            }
        }


        return currentRoom.Adjacency[direction];
    }
    
    /**
     * needs to account for the weaker, stronger and rare enemies tags
     * then load randome encounter in a list of 3 and pick the least level enemy 
     * @param {*} player 
     */
    randomEncounter(player){
        let encouterArr = player.getPlayerLevel();
    }

    gotKeyItem(itemID){

    }

    //Out of date don't use
    generateMap(canvas){
        for(let i=0; i<roomArr.length; i++){
            canvas.drawImage(roomArr[i].image, roomArr[i].Location[0]*60, roomArr[i].Location[1]*60)
            if(roomArr[i].otherImages!=null){
                for(let j=0; j<roomArr[i].otherImages.length; j++){
                    canvas.drawImage(roomArr[i].otherImages[j],  roomArr[i].Location[0]*60, roomArr[i].Location[1]*60)
                }
            }
        }
    }


}
