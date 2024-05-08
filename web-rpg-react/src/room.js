

class room{
    room(ID, Location, Adjacency, image, Tags, otherImages){
        this.ID = ID;
        this.Location = Location;
        this.Adjacency = Adjacency;
        this.image = image;
        this.Tags = Tags;
        this.otherImages = otherImages;
        let tag = []
        for(i=0;i<Tags[0].length;i++){
            tag = []
            for(j=0;j<Tags[0][i];j++){
                tag.add(Tags[0][i][j].copy())
            }
            this.Tags.add(tag)
        }
    }

    checkRoomforTag(tagIDNumber){
        for(i=0;i<this.Tags.length;i++){
            if(this.Tags[i][0]==tagIDNumber){
                return true;
            }
        }
        return false;
    }

    getTagsArr(){
        return this.Tags[0];
    }
    
    removeLock(keyID){
        for(let i=0; i<this.Tags.length; i++){
            if(this.Tags[i][0]==0){
                if(this.Tags[i][3]==keyID){
                    this.Tags.splice(i,1);
                    for(let j=0;j<this.otherImages.length;j++){
                        switch(this.Tags[i][1]){
                            case 0 && this.otherImages[i]=="./images/topLock":
                                this.otherImages.splice(j,1);
                            case 1 && this.otherImages[i]=="./images/rightLock":
                                this.otherImages.splice(j,1);
                            case 2 && this.otherImages[i]=="./images/bottomLock":
                                this.otherImages.splice(j,1);
                            case 3 && this.otherImages[i]=="./images/leftLock":
                                this.otherImages.splice(j,1);
                        }
                    }
                }
            }
        }
    }

}