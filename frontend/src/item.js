import items from "./Data/items.json";

class item{
   /**
    * Intializes an item by deep copying the base item from the items data
    * @param {item ID} itemID 
    */
    item(itemID){
        this.ID=itemID;
        this.Tier=items.at(itemID).Tier;
        this.Name=items.at(itemID).Name;
        this.Description=items.at(itemID).Description;
        this.Price=items.at(itemID).Price;
        this.LD=items.at(itemID).LD;
        this.LSP=items.at(itemID).LSP;
        this.HD=items.at(itemID).HD;
        this.HSP=items.at(itemID).HSP;
        this.Icon=items.at(itemID).Icon;
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
    *checks if an item has a tag with the given ID number
    * @param {*} IdNumber 
    */
    checkItemforTag(tagIDNumber){
        for(i=0;i<this.Tags.length;i++){
            if(this.Tags[i][0]==tagIDNumber){
                return true;
            }
        }
        return false;
    }

    getPrice(){
        return this.Price;
    }

}