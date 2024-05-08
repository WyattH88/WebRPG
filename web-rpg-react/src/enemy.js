import enemie from "./Data/enemies.json";

class enemy{
    /**
     * makes an enemy object from the enemy data.
     * @param {*} id 
     */
    enemy(id){
        this.ID = id;
        this.Name = enemie.at(id).Name;
        this.Level = enemie.at(id).Level;
        this.AIID = enemie.at(id).AI-ID;
        this.HP = enemie.at(id).HP;
        this.ItemID = enemie.at(id).ItemID;
        this.Defense = enemie.at(id).Defense;
        this.Sprite = enemie.at(id).Sprite;
        this.Tags;
        //deep copy tags array
        let tag = []
        for(i=0;i<items.at(itemID).Tags[0].length;i++){
            tag = []
            for(j=0;j<items.at(itemID).Tags[0][i].length;j++){
                tag.add(items.at.apply(itemID).Tags[0][i][j].copy())
            }
            this.Tags.add(tag)
        }
    }

    /**
    *checks if an enemy has a tag with the given ID number
    * @param {*} IdNumber 
    */
    checkforTag(tagIDNumber){
        for(i=0;i<this.Tags.length;i++){
            if(this.Tags[i][0]==tagIDNumber){
                return true;
            }
        }
        return false;
    }

}

