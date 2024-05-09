import enemies from "./Data/enemies.json"
import ai from "./Data/ai.json"
import attacksData from "./Data/attacks.json"
import tagsData from "./Data/tags.json"

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
        this.dialog = [];
        this.round = [];
        this.isComplete = false;
        this.initializeCombat();
        this.fireDOTPlayer = [0,0];
        this.fireDOTEnemy = [0,0];
        this.venomDOTPlayer = [0,0];
        this.venomDOTEnemy = [0,0];
        this.Stacks = [];
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
        //need to account for the item boosts tags 52 70 72 93 100


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
     * increases the power of the tag passed by the amount provided
     * @param {*} tag 
     * @param {*} amount 
     * @returns 
     */
    increaseTagPower(tag, amount){
        try{
            tag[0]=tag[0]*amount;
        }catch(e){
        }finally{
            return tag;
        }
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
                    this.isComplete = true;
                    this.dialog.add("The" + this.enemy.name + "surrendured due to the " +  tagsData.at(tags[i][0]).Name + "effect.");
                    this.launchRewardsSping();
                case 53 && this.enemy.checkforTag(26):
                    //furbo Proficency
                    this.dialog("the " + this.enemy.name + " took 20% of its hp as damage and -20% attack stength due to the" + tagsData.at(tags[i][0]).Name + " effect." );
                    this.enemy.HP -= this.enemy.HP*0.2;
                    this.enemy.addTag([16,-0.2,-1]);
                case 58 && this.enemy.checkforTag(22):
                    //ghost proficency
                    this.dialog("the " + this.enemy.name + " took 20% of its hp as damage and -20% attack stength due to the" + tagsData.at(tags[i][0]).Name + " effect." );
                    this.enemy.HP -= this.enemy.HP*0.2;
                    this.enemy.addTag([16,-0.2,-1]);
                case 63 && this.enemy.checkforTag(24):
                    //gnome master
                    this.isComplete = true;
                    this.dialog.add("The" + this.enemy.name + "surrendured due to the " + tagsData.at(tags[i][0]).Name + "effect.");
                    this.launchRewardsSping();
                case 73 && this.enemy.checkforTag(23):
                    //dragon Proficieny
                    this.dialog("the " + this.enemy.name + " took 20% of its hp as damage and -20% attack stength due to the" + tagsData.at(tags[i][0]).Name + " effect." );
                    this.enemy.HP -= this.enemy.HP*0.2;
                    this.enemy.addTag([16,-0.2,-1]);
                case 82 && this.enemy.checkforTag(21):
                    //weaken enemy
                    this.dialog("the " + this.enemy.name + " took " +tags[i][1]*0.1+ "% of its hp as damage and -" +tags[i][1]*0.1+ "% attack stength due to the" + tagsData.at(tags[i][0]).Name + " effect." )
                    this.enemy.HP -= this.enemy.HP*tags[i][1]*0.1;
                    this.enemy.addTag([16,-tags[i][1]*0.1,-1]);
                case 83 && (this.enemy.checkforTag(19) || this.enemy.checkforTag(20)):
                    //weaken Boss
                    this.dialog("the " + this.enemy.name + " took " +tags[i][1]*0.1+ "% of its hp as damage and -" +tags[i][1]*0.1+ "% attack stength due to the" + tagsData.at(tags[i][0]).Name + " effect." )
                    this.enemy.HP -= this.enemy.HP*tags[i][1]*0.1;
                    this.enemy.addTag([16,-tags[i][1]*0.1,-1]);
            }
        }
    }
    /**
     * When given a players move will update the all approprite objects 
     * 0: RHL, 1RHH, 2LHL, 3LHH, 4 Rest, 5 items
     * @param {*} Move 
     */
    playerMove(Move){
        let playerAttack;
        let playerDefense;
        let SPCost;
        let enemyAttack;
        let SPModString = [];
        let playerModString = [];
        let enemyModString = [];
        let tags = this.getModifiers();
        let enemyAttackSlow = false;
        let enemyAttackName;
        let result;
        
        //get the enemies attck and process it
        let attackObject = attacksData.at(this.getAttack())
        enemyAttack = attackObject.BaseDamage;
        if(this.checkLocalTags(tags, 98)!=-1){
            enemyAttack += (attackObject.LevelCurb-0.5)*this.enemy.Level;
            this.dialog.add(this.enemy.name + "'s attack lost " + 0.5*attackObject.LevelCurb*this.enemy.Level + " damage due to Re Curb effect");
        }else{
            enemyAttack += (attackObject.LevelCurb)*this.enemy.Level
        }
        for(let i=0; i<attackObject.Tags[0].length;i++){
            tags.add(attackObject.Tags[0][i]);
        }
        if(attackObject.Slow == 1){
            enemyAttackSlow = true;
        }
        enemyAttackName = attackObject.Name;

        //Deal with the weapon
        let heavy = true;
        let weapon;
        switch(Move){
            case 0:
                weapon = player.getEquipment()[1];
                heavy=false;
                playerAttack = weapon.LD;
                SPCost = weapon.LSP;
            case 1:
                weapon = player.getEquipment()[1];
                playerAttack = weapon.HD;
                SPCost = weapon.HSP;
            case 2:
                weapon = player.getEquipment()[2];
                heavy=false;
                playerAttack = weapon.LD;
                SPCost = weapon.LSP;
            case 3:
                weapon = player.getEquipment()[2];
                playerAttack = weapon.HD;
                SPCost = weapon.HSP;
            case 4:
                weapon = 0;
                //do the resting add hp and sp based on the cases
                let amount = 1.2;
                for(let i=0; i<tags.legth;i++){
                    if(tags[i][0]==92){
                        amount *= tags[i][1]
                        this.dialog.add("You revocered " + amount + " more due to the " + tagsData.at(tags[i][0]).Name + "effect");
                        
                    }
                }
                enemyAttack *= (1-(amount-1));
                this.player.addHP(Math.round(this.player.maxHP*(1-amount)*0.5));
                this.player.addSP(Math.round(this.player.maxSP*(1-amount)));
                result += "You recovered " + Math.round(this.player.maxHP*(1-amount)*0.5) + " HP and " + Math.round(this.player.maxSP*(1-amount)) + " SP.";
            case 5:
                //the use consumable item case
                //call the inventory select of some kind.
                let itemID =  0;
                weapon = 0
                switch(itemID){
                    case 89:
                        result += "You recovered 40 HP." ;
                        this.player.addHP(40);
                    case 90:
                        result += "You recovered 40 SP." ;
                        this.player.addSP(40);
                    case 91:
                        result += "You recovered 70 HP." ;
                        this.player.addHP(70);
                    case 92:
                        result += "You recovered 70 SP." ;
                        this.player.addSP(70);
                    case 93:
                        result += "You recovered 40 SP." ;
                        this.player.addSP(40);
                    case 94:
                        result += "You recovered 100 HP." ;
                        this.player.addHP(100);
                    default:
                        throw "invalid item to select";
                }
        }
        //load weapon tags
        if(weapon!=0){
            for(let i=0;i<weapon.Tags[0].length;i++){
                tags.add(weapon.Tags[0][i]);
            }
        }
        //Deal with all the relivantTags
        let recoil = [0,0]; //assigned here used after damage calc
        let lifeSteal = [0,0]; // assigned here used after damage calc
        let defensePierce = [0,0]; // assigned here used after damage calc
        let damageReduction; // assigned here used after damage calc
        let enemyName = enemy.name;
        for(let i=0; i<tags.length;i++){
            let amount =0;
            let returnVal =0;
            switch(tags[i][0]){
                case 5:
                    amount = Math.random()*tags[i][1];
                    enemyAttack *= amount;
                    enemyModString.add("Variability made "+enemyName +" attack do " + amount + "% damage");
                case 6:
                    amount = enemies.at(this.enemy.ID).HP*tags[i][1];
                    this.enemy.HP += amount;
                    enemyModString.add(enemyName +" healed " + amonut + ".");
                case 7:
                    amount = tags[i][1];
                    recoil[1] = amount;
                case 8:
                    this.fireDOTPlayer[0] = tags[i][1];
                    this.fireDOTPlayer[1] = tags[i][2];
                case 9:
                    amount = tags[i][1];
                    lifeSteal[1] = amount;
                case 10:
                    if(tags[i][1][3]==1){
                        this.player.HP -= this.player.maxHP*tags[i][1][0];
                        enemyModString.add(enemyName +" did " + this.player.maxHP*tags[i][1][0] + " direct damage to HP");
                    }else{
                        amount = [10, tags[i][1][0], tags[i][1][1], tags[i][2]]
                        returnVal = this.manageStackables(amount);
                        if(returnVal == -1){
                            enemyModString.add(enemyName +" hit the limit on stackable Damage");
                        }else{
                            enemyModString.add(enemyName + " added a " + tags[i][1][0] + " times " + returnVal + "Damage Buff");
                        }
                    }
                case 11:
                    amount = tags[i][1];
                    defensePierce[1] += amount;
                    enemyModString.add(enemyName + " added " + amount + " defensePierce.");
                case 12:
                    amount = [12, tags[i][1][0], tags[i][1][1], -1];
                    returnVal = this.manageStackables(amount);
                    if(returnVal == -1){
                        enemyModString.add(enemyName +" hit the limit on stackable Defense");
                    }else{
                        enemyModString.add(enemyName + " added " + tags[i][1][0] + "defense");
                    }
                case 13:
                    //[ID, [amount, light, heavy, both], limit, duration]
                    amount = [13, [tags[i][1][0],tags[i][2][0],tags[i][2][1],tags[i][2][2]],tags[i][1][1], tags[i][2][3]];
                    returnVal = this.manageStackables(amount);
                    if(returnVal == -1){
                        enemyModString.add(enemyName +" hit the limit on stackable player attack reductions");
                    }else{
                        enemyModString.add(enemyName + " decreased player attack by " + tags[i][1][0] + " by " + returnVal + " times");
                    }
                case 14:
                    if(this.enemy.HP/enemies.at(this.enemy.ID).HP <= 0.25){
                        enemyAttack *= 1.5;
                        enemyModString(enemyName + " did an extra 50% damage from being under 25% HP");
                    }else if(this.enemy.HP/enemies.at(this.enemy.ID).HP <= 0.5){
                        enemyAttack *= 1.25;
                        enemyModString(enemyName + " did an extra 25% damage from being under 50% HP");
                    }
                case 15:
                    if(heavy){
                        recoil[0]+=tags[i][1][0];
                        enemyModString.add(enemyName + " made the players heavy attacks have "+ tags[i][1][0] + "recoil.");
                    }else{
                        recoil[0]+=tags[i][1][1];
                        enemyModString.add(enemyName + " made the players light attacks have "+ tags[i][1][1] + "recoil.");
                    }
                case 16:
                    amount = [16, tags[i][1], 100, tags[i][2]];
                    returnVal = this.manageStackables(amount);
                    if(returnVal == -1){
                        enemyModString.add(enemyName +" hit the limit on stackable attack Strength increases");
                    }else{
                        enemyModString.add(enemyName + " increased attack stength by " + tags[i][1][0] + ", " + returnVal + " times");
                    }
                case 17:
                    amount = [17, tags[i][1], 1, tags[i][2]];
                    returnVal = this.manageStackables(amount);
                    if(returnVal == -1){
                        enemyModString.add(enemyName +" is already on fire");
                    }else{
                        enemyModString.add(enemyName + " is on fire doing " + tags[i][1][0] + " damage for " + tags[i][2] + " turns.");
                    }
                case 18:
                    amount = [18, tags[i][1], 1, tags[i][2]];
                    returnVal = this.manageStackables(amount);
                    if(returnVal == -1){
                        enemyModString.add(enemyName +" is already on infliced with venom");
                    }else{
                        enemyModString.add(enemyName + " is inflicted with venom doing " + tags[i][1][0] + " damage for " + tags[i][2] + " turns.");
                    }
                case 39:
                    //Don't implment for now
                case 40:
                    amount = 1+Math.random()*(1-tags[i][1]);
                    playerAttack *= amount;
                    playerModString.add("Variability made "+this.player.name +" attack do " + amount + "% damage");
                case 41:
                    playerDefense += tags[i][1];
                    playerModString.add("Increased defense" + tags[i][i]);
                case 42:
                    if(tags[i][1][2]!=0){
                        amount+=tags[i][1][2];
                    }
                    if(heavy){
                        amount +=tags[i][1][1];
                    }else{
                        amount +=tags[i][1][0]
                    }
                    if(tags[i][2]==-1){
                        recoil[1]+= amount;
                        playerModString.add(this.player.Name + "increased thorns by " + amount);
                    }else{
                        amount = [42, amount, -1, tags[i][2]];
                        returnVal = this.manageStackables(amount);
                        if(returnVal == -1){
                            playerModString.add(this.player.Name +" has already set thorns");
                        }else{
                            playerModString.add(this.player.Name + " set thorns of " + amount[1] + " for " + tags[i][2] + " turns.");
                        }
                    }
                case 43:
                    defensePierce += tags[i][1];
                    playerModString.add(this.player.Name + "increased there defense pierce by " + tags[i][1] +".");
                case 45:
                    if(heavy){
                        amount =tags[i][1][1];
                    }else{
                        amount = tags[i][1][0];
                    }
                    if(weapon!=0){
                        let hit0 = false;
                        for(let i=0;i<weapon.Tags[0].length;i++){
                            switch(weapon.Tags[0][i]){
                                case 27 && tags[i][2][0]:
                                hit0 = true;
                                case 28 && tags[i][2][1]:
                                hit0 = true;
                                case 29 && tags[i][2][2]:
                                hit0 = true;
                                case 30 && tags[i][2][3]:
                                hit0 = true;
                                case 31 && tags[i][2][4]:
                                hit0 = true;
                                case 32 && tags[i][2][5]:
                                hit0 = true;
                            }
                        }
                        if(hit0 && amount!=0){
                            playerAttack +=amount;
                            playerModString.add(this.player.Name + " got +" + amount +" damage on this attack");
                        }
                    }
                    case 46:
                        if(heavy){
                            amount =tags[i][1][1];
                        }else{
                            amount = tags[i][1][0];
                        }
                        if(weapon!=0){
                            let hit0 = false;
                            for(let i=0;i<weapon.Tags[0].length;i++){
                                switch(weapon.Tags[0][i]){
                                    case 27 && tags[i][0]:
                                    hit0 = true;
                                    case 28 && tags[i][1]:
                                    hit0 = true;
                                    case 29 && tags[i][2]:
                                    hit0 = true;
                                    case 30 && tags[i][3]:
                                    hit0 = true;
                                    case 31 && tags[i][4]:
                                    hit0 = true;
                                    case 32 && tags[i][5]:
                                    hit0 = true;
                                }
                            }
                            if(hit0 && amount!=0){
                                playerAttack *=amount;
                                playerModString.add(this.player.Name + " got +" + amount*100 +"% damage on this attack");
                            }
                        }
                    case 48:
                        let addlengthb = 0
                        let addPowerb = 1;
                        if(this.checkLocalTags(88)){
                            addlengthb = 2;
                        }
                        if(this.checkLocalTags(89)){
                            addPowerb = 1.05;
                        }
                        if(heavy){
                            amount = [18, tags[i][1][1]*addPowerb, 1, tags[i][2]+addlengthb]
                        }else{
                            amount = [18, tags[i][1][0]*addPowerb, 1, tags[i][2]+addlengthb]
                        }
                        if(returnVal == -1){
                            playerModString.add(enemyName +" is already on fire");
                        }else{
                            playerModString.add(enemyName + " is on fire doing " + tags[i][1][0] + " damage for " + tags[i][2] + " turns.");
                        }
                    case 53 && this.enemy.checkforTag(26):
                        enemyAttack *= 0.8;
                        enemyModString.add("made weaker by the furbo proficeny");
                        playerAttack *= 1.2;
                        playerModString.add("Increased Damage by 120% due to furbo proficency");
                    case 55:
                        lifeSteal[0]+=tags[i][1];
                        playerModString.add("Increased the amount of lifesteal for this attack by" + tags[i][i]);
                    case 56:
                        if(heavy){
                            amount =tags[i][1][1];
                        }else{
                            amount = tags[i][1][0];
                        }
                        if(weapon!=0){
                            let hit0 = false;
                            for(let i=0;i<weapon.Tags[0].length;i++){
                                switch(weapon.Tags[0][i]){
                                    case 27 && tags[i][2][0]:
                                    hit0 = true;
                                    case 28 && tags[i][2][1]:
                                    hit0 = true;
                                    case 29 && tags[i][2][2]:
                                    hit0 = true;
                                    case 30 && tags[i][2][3]:
                                    hit0 = true;
                                    case 31 && tags[i][2][4]:
                                    hit0 = true;
                                    case 32 && tags[i][2][5]:
                                    hit0 = true;
                                }
                            }
                            if(hit0 && amount!=0){
                                SPCost -=amount;
                                SPModString.add(this.player.Name + " got -" + amount +" SP cost for this attack");
                            }
                        }
                    case 57:
                        if(this.enemy.HP/enemies.at(this.enemy.ID).HP <= tags[i][1]){
                            this.enemy.HP =0;
                            playerModString.add("insta killed" + enemyName);
                        }
                    case 58 && this.enemy.checkforTag(22):
                        enemyAttack *= 0.8;
                        enemyModString.add("made weaker by the ghost proficeny");
                        playerAttack *= 1.2;
                        playerModString.add("Increased Damage by 120% due to ghost proficency");
                    case 22:
                        if(this.checkLocalTags(tags, 27) || this.checkLocalTags(tags, 28) || this.checkLocalTags(tags, 29)){
                            playerAttack *= 0.8;
                            enemyModString.add("reduced damage taken from physical attacks");
                        }
                    case 59:
                        amount = 1 + (tags.length*0.05);
                        playerAttack *= amount;
                        playerModString.add("increased " + this.player.Name + " by " + amount*100 + "% due to Damage per Tag");
                    case 60:
                        damageReduction += tags[i][1];
                        playerModString.add("increased damage reduction due to shields");
                    case 61:
                        amount = [61, tags[i][1], tags[i][2][1],-2];
                        returnVal = this.manageStackables(amount);
                        if(returnVal == -2){
                            playerModString.add(this.player.Name +" maintained the string");
                        }else{
                            playerModString.add(this.player.Name + " caused an error way to go.");
                        }
                    case 62:
                        amount = tags[i][1];
                        //do roll
                        if(Math.random() <= tags[i][2][0]){
                            playerModString.add("did an additional "+ amount + "damage due to " + tags[i][2][1]);
                            playerAttack += amount;
                        }else{
                            playerModString.add("missed chance to do additional damage");
                        }
                    case 63:
                        amount = [63, tags[i][1], tags[i][2][1],-2];
                        returnVal = this.manageStackables(amount);
                        if(returnVal == -2){
                            playerModString.add(this.player.Name +" maintained the string");
                        }else{
                            playerModString.add(this.player.Name + " caused an error way to go.");
                        }
                    case 66:
                        let addlength = 0
                        let addPower = 1;
                        if(this.checkLocalTags(88)){
                            addlength = 2;
                        }
                        if(this.checkLocalTags(89)){
                            addPower = 1.05;
                        }
                        if(heavy){
                            amount = [18, tags[i][1][1]*addPower, 1, tags[i][2]+addlength]
                        }else{
                            amount = [18, tags[i][1][0]*addPower, 1, tags[i][2]+addlength]
                        }
                        returnVal = this.manageStackables(amount);
                        if(returnVal == -1){
                            enemyModString.add(enemyName +" is already on infliced with venom");
                        }else{
                            enemyModString.add(enemyName + " is inflicted with venom doing " + tags[i][1][0] + " damage for " + tags[i][2] + " turns.");
                        }
                    case 73 && this.enemy.checkforTag(23):
                        enemyAttack *= 0.8;
                        enemyModString.add("made weaker by the dragon proficeny");
                        playerAttack *= 1.2;
                        playerModString.add("Increased Damage by 120% due to dragon proficency");
                    case 74:
                        amount [74,1,-1,tags[i][2]];
                        returnVal = this.manageStackables(amount);
                        if(returnVal == -1){
                            enemyModString.add(this.player.Name +" is already on infliced with slime");
                        }else{
                            enemyModString.add(this.player.Name + " is inflicted with slimed! for" + amount[3] + "turns.");
                        }
                    case 75:
                        if(heavy){
                            amount =tags[i][1][1];
                        }else{
                            amount = tags[i][1][0];
                        }
                        if(weapon!=0){
                            let hit0 = false;
                            for(let i=0;i<weapon.Tags[0].length;i++){
                                switch(weapon.Tags[0][i]){
                                    case 27 && tags[i][2][0]:
                                    hit0 = true;
                                    case 28 && tags[i][2][1]:
                                    hit0 = true;
                                    case 29 && tags[i][2][2]:
                                    hit0 = true;
                                    case 30 && tags[i][2][3]:
                                    hit0 = true;
                                    case 31 && tags[i][2][4]:
                                    hit0 = true;
                                    case 32 && tags[i][2][5]:
                                    hit0 = true;
                                }
                            }
                            if(hit0 && amount!=0){
                                playerAttack +=amount;
                                playerModString.add(this.player.Name + " got +" + amount +" damage on this attack");
                            }
                        }
                    case 78:
                        playerDefense += tags[i][1];
                        playerModString.add("Increased defense" + tags[i][i]);
                    case 84:
                        if(heavy){
                            amount =tags[i][1][1];
                        }else{
                            amount = tags[i][1][0];
                        }
                        if(weapon!=0){
                            let hit0 = false;
                            for(let i=0;i<weapon.Tags[0].length;i++){
                                switch(weapon.Tags[0][i]){
                                    case 27 && tags[i][2][0]:
                                    hit0 = true;
                                    case 28 && tags[i][2][1]:
                                    hit0 = true;
                                    case 29 && tags[i][2][2]:
                                    hit0 = true;
                                    case 30 && tags[i][2][3]:
                                    hit0 = true;
                                    case 31 && tags[i][2][4]:
                                    hit0 = true;
                                    case 32 && tags[i][2][5]:
                                    hit0 = true;
                                }
                            }
                            if(hit0 && amount!=0){
                                playerAttack +=amount;
                                playerModString.add(this.player.Name + " got +" + amount +" damage on this attack");
                            }
                        }
                    case 85:
                        if(heavy){
                            amount =tags[i][1][1];
                        }else{
                            amount = tags[i][1][0];
                        }
                        if(weapon!=0){
                            let hit0 = false;
                            for(let i=0;i<weapon.Tags[0].length;i++){
                                switch(weapon.Tags[0][i]){
                                    case 27 && tags[i][0]:
                                    hit0 = true;
                                    case 28 && tags[i][1]:
                                    hit0 = true;
                                    case 29 && tags[i][2]:
                                    hit0 = true;
                                    case 30 && tags[i][3]:
                                    hit0 = true;
                                    case 31 && tags[i][4]:
                                    hit0 = true;
                                    case 32 && tags[i][5]:
                                    hit0 = true;
                                }
                            }
                            if(hit0 && amount!=0){
                                playerAttack *=amount;
                                playerModString.add(this.player.Name + " got +" + amount*100 +"% damage on this attack");
                            }
                        }
                    case 87:
                        if(heavy){
                            amount =tags[i][1][1];
                        }else{
                            amount = tags[i][1][0];
                        }
                        if(weapon!=0){
                            let hit0 = false;
                            for(let i=0;i<weapon.Tags[0].length;i++){
                                switch(weapon.Tags[0][i]){
                                    case 27 && tags[i][2][0]:
                                    hit0 = true;
                                    case 28 && tags[i][2][1]:
                                    hit0 = true;
                                    case 29 && tags[i][2][2]:
                                    hit0 = true;
                                    case 30 && tags[i][2][3]:
                                    hit0 = true;
                                    case 31 && tags[i][2][4]:
                                    hit0 = true;
                                    case 32 && tags[i][2][5]:
                                    hit0 = true;
                                }
                            }
                            if(hit0 && amount!=0){
                                SPCost -=amount;
                                SPModString.add(this.player.Name + " got -" + amount +" SP cost for this attack");
                            }

                        }
                    case 94: 
                        let equipment =this.player.getEquipment();
                        let armor = true;
                        if(equipment[0].checkItemforTag(34)){
                            armor = fales;
                        }
                        let synnergized = false;
                        if(armor && this.checkItemPHSorMG(equipment[1])==0 && this.checkItemPHSorMG(equipment[2])==0){
                                synnergized = true;
                        }else if (this.checkItemPHSorMG(equipment[1])==1 && this.checkItemPHSorMG(equipment[2])==1){
                                synnergized = true;
                        }
                    
                        if(tags[i][1][[0]==0]){
                            if(tags[i][1][1]==1){
                                if(armor){
                                    playerDefense +=2;
                                }else{
                                    if(weapon != 0 && this.checkItemPHSorMG(weapon)==1){
                                        playerAttack += 5;
                                    }
                                }
                            }else{
                                if(armor){
                                    playerDefense +=5;
                                    defensePierce +=5;
                                }else{
                                    playerDefense +=2;
                                    if(weapon != 0 && this.checkItemPHSorMG(weapon)==1){
                                        playerAttack += 5;
                                    }
                                }  
                            }
                        }else if(tags[i][1]==1 && synnergized){
                            playerDefense += 2;
                            playerAttack += 2;
                        }else if(tags[i][1]==2 && synnergized){
                            playerAttack += 4
                            SPCost -=4;
                        }
                    case 95:
                        if(weapon!=0 && weapon.checkforTag(29)){
                            damageReduction += tags[i][1];
                            playerModString.add("increased damage reduction due to shields");
                        }
                    case 96:
                        if(tags[i][2]!=-1){
                            tags[i][2]-=1;
                            if(tags[i][2]==0){
                                tags.splice(i,1);
                            }
                        }
                        amount = 1 + tags[i][1]*0.1;
                        playerAttack *= amount;
                        playerDefense *= amount;
                        enemyAttack *= 1-(amount-1);
                    case 101:
                        equipment =this.player.getEquipment();
                        if(equipment[1]!=0 && equipment[2]!=0){
                            if(this.checkItemPHSorMG(equipment[1])!=this.checkItemPHSorMG(equipment[2])){
                                playerAttack += 5;
                                SPCost -= 5;
                            }
                        }
                    case 102:
                        amount = [102, tags[i][1], -1, tags[i][2]];
                        returnVal = this.manageStackables(amount);
                        if(returnVal == -1){
                            enemyModString.add(enemyName +" reapplied damage reduction");
                        }else{
                            enemyModString.add(enemyName + " got a " + amount[1] + "% damage reduction for " + amount[3] + "turns.");
                        }
                    case 103:
                        if(this.checkLocalTags(tags, 30) || this.checkLocalTags(tags, 31) || this.checkLocalTags(tags, 32)){
                            playerAttack *= 0.8;
                            enemyModString.add("reduced damage taken from magical attacks");
                        }
            }
        }


        //Do the calculation (rember recoil, lifesteal, and DOT)

        //return all the data
    }

    /**
     * starts the rewards spin and passes all the relevant tags (don't forget tag 46 & 77 after encouter recovery)
     */
    launchRewardsSping(){

    }

    /**
     * pass the function an array that looks like:
     * [tagID, Variable, limit, duration], it will turn it into:
     * [tagID, Variable, Instance, limit, duration, uses], 
     * this is used to manage the creation and limiting creation of stackable useable tags in memory
     * returns the number of stacks or -1 if you hit the stack limit
     * 
     * instance incrments evrey time you try to add the same ID
     * limit is the max on the number of instances, -1 to reset evrey use
     * duration is the amount of time it lasts -1 if for the whole combat, (-2 if lasts one round but subtracts one use when used)
     * uses incrments every round of combat after caluculations
     * variable saves something perticular to the id
     */
    manageStackables(arr){
        for(let i=0; i<this.Stacks.length; i++){
            if(arr[0]==this.Stacks[i][0]){
                this.Stacks[i][2]+=1;
                if(this.Stacks[i][3]==-1){
                    //case meet reset delete ieself
                    this.Stacks.splice(i,1);
                }else if(this.Stacks[i][2]==this.Stacks[i][3]){
                    //case limit reached
                    return -1;
                }else if (this.Stacks[i][4]==-2){
                    //case strings
                    this.Stacks[i][5]=0;
                    return -2;
                }else{
                    //case return the instance
                    return this.Stacks[i][2];
                }
            }
        }
        this.Stacks.add([arr[0],arr[1],1,arr[2],arr[3],arr[4],0])
        return 1;
    }

    /**
     * A helper method you pass an array of tag arrays and it check the first entry for the id
     * if it finds it it reurns the spot in the array otherwise it returns -1
     * @param {*} tags 
     * @param {*} tagID 
     * @returns 
     */
    checkLocalTags(tags, tagID){
        for(let i=0; i<tags.legth;i++){
            if(tags[i][0]==tagID){
                return i;
            }
        }
        return -1;
    }

    /**
     * pass with method a weapon an it will return 0 physical weapon, 1 magical weapon, or -1 neither.
     * @param {*} item 
     * @returns 
     */
    checkItemPHSorMG(item){
        if(item.checkItemforTag(27) || item.checkItemforTag(28) || item.checkItemforTag(29)){
            return 0;
        }else if(item.checkItemforTag(30) || item.checkItemforTag(31) || item.checkItemforTag(32)){
            return 1;
        }else{
            return -1;
        }
    }
}