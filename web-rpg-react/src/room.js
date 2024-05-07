

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

}