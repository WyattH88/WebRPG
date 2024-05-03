import rooms from './rooms.json';
/**
 * saves the map and its elements
 */
function Map(){
    const [roomArr, setRoomArr] = useState(rooms);
    
    

    function generateMap(canvas){
        for(let i=0; i<roomArr.length; i++){
            canvas.drawImage(roomArr[i].image, roomArr[i].Location[0]*60, roomArr[i].Location[1]*60)
            if(roomArr[i].otherImages!=null){
                for(let j=0; j<roomArr[i].otherImages.length; j++){
                    canvas.drawImage(roomArr[i].otherImages[j],  roomArr[i].Location[0]*60, roomArr[i].Location[1]*60)
                }
            }
        }
    }

    return(
        <>
        <canvas id='0' width='600' height='360' />
        </>
    )

}

export default Map;