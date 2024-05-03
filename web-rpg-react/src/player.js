import PlayerView from './playerView';

/**
 * saves all elements of the game
 */
function Player({isActive}){
    if(isActive){    
        return(
             <PlayerView />
        )
    }
}

export default Player;