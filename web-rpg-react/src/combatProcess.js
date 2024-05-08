import enemies from "./Data/enemies.json"
import ai from "./Data/ai.json"
import attacks from "./Data/attacks.json"

/**
 * A combat process modles an encouter
 * @param {pass a player object} player 
 * @param {pass an enemy ID} enemyID 
 * @param {pass a move} move 
 */
class combatProcess{
    /**
     * creates a combat process to process an encouter
     * @param {*} player 
     * @param {*} enemyID 
     */
    combatProcess(player, enemyID){
        this.player = player;
        this.enemy =  new enemy(enemyID)
        this.ai = ai.at(this.enemy.AIID);
        this.phaseOrCycle = 0;
    }

    /**
     * gets the attack ID for the enemy in the round
     */
    getAttack(){
        
        //check phase cycle or other
        if(this.ai.Phase!=null){
            //do phase check
            let phases = this.ai.Phase;
            let hpRatio = this.enemy.HP/enemies.at(this.enemy.ID).HP;
            if(hpRatio<=phases[0]){
                this.phaseOrCycle = 0;
            }else{
                this.phaseOrCycle = 1;
            }
            //get attack
            let currentBlock = this.ai.AttackBlocks[0][this.phaseOrCycle];
            let randompeice = Math.random();
            let lowerBound = 0;
            for(let i=0; i<currentBlock.length;i++){
                if(lowerBound<=randompeice<=(lowerBound+currentBlock[i][1])){
                    return currentBlock[i][0]
                } else{
                    lowerBound += currentBlock[i][1];
                }
            }
        }else if(this.ai.Cycle!=null){
            //get attack
            let currentBlock = this.ai.AttackBlocks[0][this.phaseOrCycle];
            let randompeice = Math.random();
            let lowerBound = 0;
            let returnID = 0;
            for(let i=0; i<currentBlock.length;i++){
                if(lowerBound<=randompeice<=(lowerBound+currentBlock[i][1])){
                    returnID = currentBlock[i][0]
                } else{
                    lowerBound += currentBlock[i][1];
                }
            }
            //incrment the cycle
            this.phaseOrCycle += 1;
            //need to return to the start of the cycle if we hit the end
            this.phaseOrCycle %= this.ai.Cycle;
            return returnID;

        }else if(this.ai.Other!=null){
            if(this.ai.Other==1){
                //case truly random attack
                return Math.round(Math.random()*49);
            }
        }
    }

    /**
     * gets all the tags from:
     * the enemy
     * the player (skills)
     * the players equipment
     * Then returns all the tags except the weapon item's tags
     */
    getModifiers(){
        let returnTags = [];
        //get the enemy tags
        for(let i=0;i<this.enemy.Tags.length;i++){
            returnTags.add(this.enemy.Tags[0][i]);
        }
        //get the player skills tags
        let playerSkills = this.player.getSkills();
        for(let i=0;i<playerSkills.length;i++){
            returnTags.add(playerSkills[i]);
        }
        //get tags from the players equipment NOT in the hand slots
        let playerEquipment = this.player.getEquipment();
        for(let i=0;i<playerEquipment.length;i++){
            //check not handslots and not empty
            if(1<=i<=2 && playerEquipment[i]!=null){
                let itemTags = playerEquipment[i].Tags;
                for(let j=0; j<itemTags.length; j++){
                    returnTags.add(itemTags[j]);
                }
            }
        }
        return returnTags;

    }

    /**
     * Starts the combat for weakend enemys and weaken bosses effects as well as other start of battle effects.
     */
    initializeCombat(){
        let tags = this.getModifiers();
        for(let i=0; i<tags.length;i++){
            switch(tags[i][0]){
                case 54 && this.enemy.checkforTag(25):
                    //slime master
                case 53 && this.enemy.checkforTag(26):
                    //furbo Proficency
                case 58 && this.enemy.checkforTag(22):
                    //ghost proficency
                case 63 && this.enemy.checkforTag(24):
                    //gnome master
                case 73 && this.enemy.checkforTag(23):
                    //dragon Proficieny
                case 82:
                    //weaken enemy
                case 83:
                    //weaken Boss
            }
        }


    }
    /**
     * When given a players move will update the all approprite objects 
     * 0: RHL, 1RHH, 2LHL, 3LHH, 4 Rest, 5 items
     * @param {*} Move 
     */
    playerMove(Move){

    }

}