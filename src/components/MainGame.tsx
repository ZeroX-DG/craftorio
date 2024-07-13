import { createEffect } from 'solid-js';
import { Game } from '../game/game';

export const MainGame = () => {
    let gameContainer!: HTMLDivElement;

    createEffect(() => {
        const game = new Game();
        game.render(gameContainer).then(() => {
            console.log("Game Start!");
        });
    });

    return (
        <div ref={gameContainer}></div>
    );
}
