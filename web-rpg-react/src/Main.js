import React, { useState } from 'react';
import Player from './player';
import PlayerView from './playerView';
import Header from './header';
import Map from './map';

/**
 * Runs the game returns the game itself
 * @returns 
 */
function Main(){
    const [gameState, setGameState] = useState({
        player: true,
        map: false,
    })


    return(
    <>
    <Header />
    <PlayerView isActive={gameState.player==true} />
    <Map isActive={gameState.map==true} />
    </>
    )
}

export default Main;