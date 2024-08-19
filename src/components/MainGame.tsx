import { createEffect } from 'solid-js';
import { Game } from '../game/game';
import './MainGame.css';

export const MainGame = () => {
    let gameContainer!: HTMLDivElement;

    createEffect(() => {
        const game = new Game();
        game.render(gameContainer).then(() => {
            console.log("Game Start!");
        });
    });

    return (
        <>
            <div id="cross"></div>
            <div ref={gameContainer}></div>
        </>
    );
}
