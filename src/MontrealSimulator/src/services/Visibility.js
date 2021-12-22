import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import { settings, sounds, stateMachine } from "../globals.js";

export default class Visibility
{
    // Callback method on visibility change event.
    static handleVisibilityChange()
    {
        let state = stateMachine.currentState;
        if (state.name === GameStateName.Play)
        {
            if (state.level.player.isSlipping)
            {
                if (!settings.muteSound) sounds.pause(SoundName.Tires);
            }
            
            if (!settings.muteMusic) sounds.pause(SoundName.GameMusic);
            if (!settings.muteSound) sounds.play(SoundName.Poutine);
            stateMachine.change(GameStateName.PauseScreen, { player: state.level.player, level: state.level });
        }
    }

    // Static helper to get the visibility state.
    static isHidden()
    {
        return document.visibilityState === "hidden";
    }
}