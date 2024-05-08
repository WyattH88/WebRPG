import items from "./Data/items.json"
import skills from "./Data/skills.json"
import item from "./item"

/**
 * saves all elements of the game
 */
class player{
    /**
     * Construcotr makes palyer object
     * Pass the players name, color, and email
     */
    player(name, color, email){
        this.name = name;
        this.color = color;
        this.email = email;
        this.maxHP = 100;
        this.maxSP = 100;
        this.playerSkills = [];
        this.inventory = [];
        this.equipment=[null,null,null,null,null,null,null];
        this.keyItems =[];
        this.position = 0;
        this.currentHP = 100;
        this.currentSP = 100;
        this.money = 0;
        this.exp = 0;
        this.totalExpEarned = 0;
        this.map = new this.map();

        //gives starting items
        this.inventory.add(new item(0));
        this.inventory.add(new item(6));
        //equips starting items
        this.equip(0,1);
        this.equip(1,3);
    }

    /**
     * Use to load the player from a JSON object
     */
    player(name, color, email, maxHP, MaxSP, playerSkills, inventory, equipment, keyItems, position, currentHP, currentSP, money, exp, totalExpEarned){
        this.name = name;
        this.color = color;
        this.email = email;
        this.maxHP = maxHP;
        this.maxSP = MaxSP;
        this.playerSkills = playerSkills;
        this.inventory = inventory;
        this.equipment = equipment;
        this.keyItems = keyItems;
        this.position = position;
        this.currentHP = currentHP;
        this.currentSP = currentSP;
        this.money = money;
        this.exp = exp;
        this.totalExpEarned = totalExpEarned;
        this.map = new this.map();
        for(let i=0;i<keyItems.length;i++){
            this.map.gotKeyItem(keyItems[i].ID);
        }
    }

    /**
     * takes an item ID and adds it to the inventory in the least empty slot
     * if none exists then it will return false so you can let the player delete an item from the inventory
     * puts key items in there slots in key items
     * @param {*} itemID 
     */
    addItem(itemID){
        let itemToAdd = new item(itemID);
        
        if(itemToAdd.checkItemforTag(36)){
            //case the item is key should be added to the key items array
            this.keyItems[itemID-80]= itemToAdd;
            this.map.gotKeyItem(itemID);
            return [true,itemID-80];
        }else{
            //not a key item
            for(i=0; i<24; i++){
                if(this.inventory[i]==null){
                    this.inventory[i]= itemToAdd;
                    return [true,i];
                }
            }
        }
        return [false,0];
    }

    /**
     * deletes an item from the inventory
     * if no weapon is equiped throw a no weapon equiped error to prevent the player from having no weapon
     * @param {*} inventroySlot 
     */
    deleteItem(inventroySlot){
        //check you have at least 1 weapon equiped
        if(this.equipment[1]==null && this.equipment[2]){
            throw "No weapon equiped";
        }
        
        this.inventory[inventroySlot]=null;
    }

    /**
     * takes an item removes it from the inventory and adds money to the player
     * if no weapon is equiped throw a no weapon equiped error to prevent the player from having no weapon
     * @param {*} inventroySlot 
     */
    sellItem(inventroySlot){
        //check you have at least 1 weapon equiped
        if(this.equipment[1]==null && this.equipment[2]){
            
            throw "No weapon equiped";
        }
        if(this.checkForSkill(10)){
            this.money += this.inventory[inventroySlot].getPrice()*0.7;
        } else{
            this.money += this.inventory[inventroySlot].getPrice()*0.5;
        }
        this.inventory[inventroySlot]=null;
    }

    /**
     * function for buying an item throws error if the player has no inventory space for the item
     * and if the player dosent have enough money
     * @param {*} itemID 
     */
    buyItem(itemID){
        //do the add item
        let data = this.addItem();
        //get the price
        let price = 0;
        if(data[0]){
            if(this.checkForSkill(9)){
                price = items.at(itemID).Price;
            }else{
                price = items.at(itemID).Price*1.2;
            }
            //NEED TO ADD FUNCTIONALITY TO THE DECIDANT RING and the GOLD RING
        }else{
            throw "No room for item";
        }
        //subract the price
        if(0<=this.money-price){
            this.money-=price;
        }else{
            //not enough money removes the item and throws the error

            this.inventory[data[1]]=null;
            throw "not enough money";
        }
    }

    /**
     * adds a kill to the player unless the player dosent have enough exp to buy it then it throws an error
     * @param {*} skillID 
     */
    addSkill(skillID){
        let skillToAdd = skills.at(skillID);

        if(0<=this.exp-skillToAdd.Price){
            this.exp -= skillToAdd.Price
            this.playerSkills.add(skillToAdd);
        }else{
            throw "Not enough exp";
        }
        switch(skillID){
            case 0:
                this.maxHP +=10;
            case 1:
                this.maxSP +=10;
            case 2:
                this.maxHP +=20;
            case 3:
                this.maxSP +=20;
            case 4:
                this.maxHP +=40;
            case 5:
                this.maxSP +=40;
            default:

        }

    }

    /**
     * 
     * @returns player skills array of tags
     */
    getSkills(){
        let tagsArr = [];
        for(let i=0; i<this.playerSkills;i++){
            if(this.playerSkills[i].Tags!=null){
                for(let j=0; j<this.playerSkills[i].Tags[0].length;j++){
                    tagsArr.add(this.playerSkills[i].Tags[0][j]);
                }               
            }
        }
        return tagsArr;
    }

    /**
     * Takes an item and adds it by inventory number in the array.
     * Then adds it to the slot by number
     * 0 = armor
     * 1 = right hand
     * 2 = left hand
     * 3 = accsessory 1
     * 4 = accessory 2
     * 5 = accessory 3 (the extra accessory slot)
     */
    equip(inventroySlot, slotNumber){
        item = this.inventory[inventroySlot];
        succsess = false;
        switch(item){
            case item.checkItemforTag(33) && slotNumber==0:
                //Armor in the armor slot
                this.equipment[slotNumber]=item;
                succsess = true;
                this.inventory[inventroySlot]=null;
            case item.checkItemforTag(34) && slotNumber==0:
                //Robes in the armor slot
                this.equipment[slotNumber]=item;
                this.inventory[inventroySlot]=null;
                succsess = true;
            case item.checkItemforTag(35) && slotNumber==0 && this.checkForSkill(36):
                //Accessory in the armor slot
                this.equipment[slotNumber]=item;
                this.inventory[inventroySlot]=null;
                succsess = true;
            case item.checkItemforTag(35) && 3<=slotNumber<=4:
                //Accessory in a accessory slot
                this.equipment[slotNumber]=item;
                this.inventory[inventroySlot]=null;
                succsess = true;
            case item.checkItemforTag(35) && slotNumber==5 && this.checkForSkill(41):
                //Accessory in the extra accessory slot
                this.equipment[slotNumber]=item;
                this.inventory[inventroySlot]=null;
                succsess = true;
            case item.checkItemforTag(27) && 1<=slotNumber<=2:
                //Sword in a hand slot
                this.equipment[slotNumber]=item;
                this.inventory[inventroySlot]=null;
                succsess = true;
            case item.checkItemforTag(28) && 1<=slotNumber<=2:
                //Not-Sword in a hand slot
                this.equipment[slotNumber]=item;
                this.inventory[inventroySlot]=null;
                succsess = true;
            case item.checkItemforTag(29) && 1<=slotNumber<=2:
                //Shield in a hand slot
                this.equipment[slotNumber]=item;
                this.inventory[inventroySlot]=null;
                succsess = true;
            case item.checkItemforTag(30) && 1<=slotNumber<=2:
                //Staff in a hand slot
                this.equipment[slotNumber]=item;
                this.inventory[inventroySlot]=null;
                succsess = true;
            case item.checkItemforTag(31) && 1<=slotNumber<=2:
                //Tome in a hand slot
                this.equipment[slotNumber]=item;
                this.inventory[inventroySlot]=null;
                succsess = true;
            case item.checkItemforTag(32) && 1<=slotNumber<=2:
                //Relic in a hand slot
                this.equipment[slotNumber]=item;
                this.inventory[inventroySlot]=null;
                succsess = true;
            default:
                //no above case must be an error
                throw "item cannot be placed in this slot";
        }
    }

    /**
     * 
     * @returns an array of the players equipment
     */
    getEquipment(){
        return this.equipment;
    }

    /**
     * given a skill ID, this will return if a player has that skill
     */
    checkForSkill(IdNumber){
        for(i=0; this.playerSkills.length; i++){
            if(this.playerSkills[i].ID == IdNumber){
                return true;
            }
        }
        return false;
    }

    /**
     * check for a skill and returns true if the program finds it then removes it from the skills
     * @param {*} IdNumber 
     * @returns 
     */
    skillRemove(IdNumber){
        for(i=0; this.playerSkills.length; i++){
            if(this.playerSkills[i].ID == IdNumber){
                this.playerSkills.splice(i,1);
                return true;
            }
        }
        return false;
    }

    /**
     * adds hp up to max, if you hit the max it sets hp to the max
     * @param {*} amount 
     */
    addHP(amount){
        this.currentHP += amount;
        if(this.maxHP<=this.currentHP){
            this.currentHP=this.maxHP
        }
    }

    /**
     * adds sp up to the max, if you hit the max it set sp to the max
     * @param {*} amount 
     */
    addSP(amount){
        this.currentSP += amount;
        if(this.maxSP<=this.currentSP){
            this.currentSP=this.maxSP
        }
    }

    /**
     * sets hp to a % of the max hp use 1.x for increase
     * @param {*} amount 
     */
    setHP(amount){
        this.currentHP=this.maxHP*amount;
    }

    /**
     * set sp to a % of the max sp use 1.x for increase
     * @param {*} amount 
     */
    setSP(amount){
        this.currentSP=this.maxSP*amount;
    }

    /**
     * returns an object for generating an enemy at the level approximatly equal to the player power
     * @returns 
     */
    getPlayerLevel(){
        let baseLevel = this.getSkills().length;
        let intLevel = Math.round(baseLevel/2);
        return [intLevel+2,intLevel+1,intLevel];
    }
}
