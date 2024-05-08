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
                        let enemy = enemies.at(this.randomEncounter(player))

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
        let normalEnemies = [];
        let level = encouterArr[2];
        
        //construct and array of possilbe enemies as an array saved
        // [ID, Level, rare boolean]
        for(let i=0;i<enemies.length;i++){
            let newEntry = [-1,0,false];
            for(let j=0; j<enemies.at(i).Tags[0].length;j++){
                if(enemies.at(i).Tags[0][j][0]==21){
                    newEntry[0]=(enemies.at(i).ID);
                    newEntry[1]=(enemies.at(i).Level);
                }
                if(enemies.at(i).Tags[0][j][0]==104){
                    newEntry[2]=(true);
                }
            }
            if(newEntry[0]==-1){
                normalEnemies.add(newEntry);
            }
        }
        
        //get the state of the player as rare, weak, or true random
        
        if(player.checkForSkill(79)){
            //case rare
            player.skillRemove(79);
            let returnID = 4;
            for(let k=0;k<normalEnemies.length;k++){
                if(normalEnemies[k][2] && (level-normalEnemies[k][1])<(level-normalEnemies[returnID][1])){
                    returnID = k;
                }
            }
            return returnID;
        } else if(player.checkForSkill(80)){
            //case weak
            player.skillRemove(80);
            encouterArr[0] = Math.round(encouterArr[0]/3);
            encouterArr[1] = Math.round(encouterArr[1]/3);
            encouterArr[2] = Math.round(encouterArr[2]/3);
        } else if(player.checkForSkill(81)){
            //case true random
            player.skillRemove(81);
            let returnID = Math.round(Math.random()*28);
            return returnID;
        }
        //case normal
        
        //find closest enemy in level to the encouter arr levels change encounter arr into an arr of id nums
        for(let i=0;i<encouterArr.length;i++){
            let notDone = true;
            let radius = 0;
            while(notDone){
                for(let j=0;j<normalEnemies.length;j++){
                    if(encounterArr[i]-normalEnemies[j][1]<=radius){
                        if(i==0 || normalEnemies[j][0]!=encouterArr[i-1]){
                            //check not too many repeats
                            encouterArr[i]=normalEnemies[j][0];
                            notDone=false;
                        }
                    }
                }
                radius+=1;
            }
        }   

        //roll for the 3 current options check that they are not rare
        let randInt = Math.round(Math.random()*100);
        if(0<=randInt<40){
            if(!normalEnemies[encouterArr[2]][2]){
                return encounterArr[2];
            }
        }else if(40<=randInt<75){
            if(!normalEnemies[encouterArr[1]][2]){
                return encounterArr[1];
            }
        }else if(75<=randInt<=100){
            if(!normalEnemies[encouterArr[0]][2]){
                return encounterArr[0];
            }
        }else{
            return 1;
        }        
    }

    gotKeyItem(itemID){
        switch(itemID){
            case 80:
                //key 1 room 8 left
                roomArr[8].removeLock(itemID);
            case 81:
                //key 2 room 8 right
                roomArr[8].removeLock(itemID);
            case 82:
                //key 3 room 33 bottom
                roomArr[33].removeLock(itemID);
            case 83:
                //key 4 room 8 top
                roomArr[8].removeLock(itemID);
            case 84:
                //trial token
                this.trialState = true
            default:
        }
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
