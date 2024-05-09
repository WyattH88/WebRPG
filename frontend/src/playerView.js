import React, {useState} from 'react';

/**
 * Makes view where the player picks information about themself
 * @returns 
 */
function PlayerView(){
    
    const [playerData, setPlayerData] = useState({
        name: "Wyatt",
        email: "wyatth88@iastate.edu",
        color: "blue"
    });

    const handleInputChange = e => {
        const { name, value } = e.target;
        setPlayerData({ ...playerData, [name]: value });
      };



    const handleSubmit = e => {
        e.preventDefault();
    }

    return(
        <><form onSubmit={handleSubmit}>
            <div>
            <h1>Please input the player's Name</h1>
            <label>Name: <input name='name' value={playerData.name} onChange={handleInputChange}></input></label>
            <label>Email: <input name='email' value={playerData.email} onChange={handleInputChange}></input></label>
            <label>Colors: 
                <button color="blue" name="blue" value={playerData.color} onClick={handleInputChange}>Blue</button>
                <button color="red" name="red" value={playerData.color} onClick={handleInputChange}>Red</button>
                <button color="yellow" name="yellow" value={playerData.color} onClick={handleInputChange}>Yellow</button>
            </label>
            </div>
            <button type='submit' onsubmit={handleSubmit}>submit</button>
        </form>
        <p>The players name is {playerData.name}, email is {playerData.email}, and color is {playerData.color}.</p>
        </>
        )
}

export default PlayerView;