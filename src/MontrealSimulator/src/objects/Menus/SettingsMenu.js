import EventName from "../../enums/EventName.js";
import FontName from "../../enums/FontName.js";
import GameStateName from "../../enums/GameStateName.js";
import SoundName from "../../enums/SoundName.js";
import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, context, settings, sounds, stateMachine } from "../../globals.js";
import ConfirmMenu from "./ConfirmMenu.js";
import Menu from "./Menu.js";

export default class SettingsMenu extends Menu
{
    static BACK_Y = CANVAS_HEIGHT - 125;
	static MUTE_SOUND_Y = CANVAS_HEIGHT - 225;
	static MUTE_MUSIC_Y = CANVAS_HEIGHT - 325;
	static RESET_Y = CANVAS_HEIGHT - 425;
	static TEXT_SIZE = 25;

    constructor()
    {
        super();

        this.menuOptions = [this.resetProgress, this.muteMusic, this.muteSound, this.return];

		this.confirmMenu = new ConfirmMenu(this);

		this.state = GameStateName.SettingsMenu;

		canvas.addEventListener(EventName.SettingsReset, () =>
        {
            this.state = GameStateName.SettingsConfirm;
        });

		canvas.addEventListener(EventName.SettingsMuteMusic, () =>
        {
			if (settings.muteMusic) sounds.play(SoundName.MenuMusic);
			else sounds.stop(SoundName.MenuMusic);

            settings.muteMusic = !settings.muteMusic;

            settings.saveSettings();
        });

        canvas.addEventListener(EventName.SettingsMuteSound, () =>
        {
            settings.muteSound = !settings.muteSound;
            settings.saveSettings();
        });

        canvas.addEventListener(EventName.SettingsReturn, () => 
        {
            this.cursor = 0;
            stateMachine.change(GameStateName.TitleScreen, { playMusic: false, fade : false });
        });
    }

    update(dt)
    {
        if (this.state === GameStateName.SettingsMenu) 
		{
			if (!this.holding) super.update(dt);
		}
		else if (this.state === GameStateName.SettingsConfirm) 
		{
			if (!this.holding) this.confirmMenu.update(dt);
		}
    }

    render()
    {
        super.render();

		if (this.state === GameStateName.SettingsConfirm) this.confirmMenu.render();
    }

    renderText()
	{
		context.fillStyle = 'white';
		context.font = `${SettingsMenu.TEXT_SIZE}px ${FontName.Joystix}`;

		context.fillText("RESET PROGRESS", CANVAS_WIDTH / 2, SettingsMenu.RESET_Y);

		if (!settings.muteMusic) context.fillText("MUTE MUSIC", CANVAS_WIDTH / 2, SettingsMenu.MUTE_MUSIC_Y);
		else context.fillText("UNMUTE MUSIC", CANVAS_WIDTH / 2, SettingsMenu.MUTE_MUSIC_Y);

		if (!settings.muteSound) context.fillText("MUTE SOUNDS", CANVAS_WIDTH / 2, SettingsMenu.MUTE_SOUND_Y);
		else context.fillText("UNMUTE SOUNDS", CANVAS_WIDTH / 2, SettingsMenu.MUTE_SOUND_Y);

		context.fillText("BACK", CANVAS_WIDTH / 2, SettingsMenu.BACK_Y);
	}

	renderCursor()
	{
		let pos = { x: 0, y: 0 };
		let len = 0;

		switch (this.cursor)
		{
			case 0:
				len = context.measureText("RESET PROGRESS").width;
				pos = { x: CANVAS_WIDTH / 2 - (len / 2), y: SettingsMenu.RESET_Y + Menu.CURSOR_OFFSET };
				break;

			case 1:
				if (!settings.muteMusic) len = context.measureText("MUTE MUSIC").width;
				else len = context.measureText("UNMUTE MUSIC").width;
				pos = { x: CANVAS_WIDTH / 2 - (len / 2), y: SettingsMenu.MUTE_MUSIC_Y + Menu.CURSOR_OFFSET };
				break;

			case 2:
				if (!settings.muteSound) len = context.measureText("MUTE SOUNDS").width;
				else len = context.measureText("UNMUTE SOUNDS").width;
				pos = { x: CANVAS_WIDTH / 2 - (len / 2), y: SettingsMenu.MUTE_SOUND_Y + Menu.CURSOR_OFFSET };
				break;

			case 3:
				len = context.measureText("BACK").width;
				pos = { x: (CANVAS_WIDTH / 2) - (len / 2), y: SettingsMenu.BACK_Y + Menu.CURSOR_OFFSET };
				break;
		}

		context.strokeStyle = 'white';
		context.lineWidth = 5;

		context.save();

		context.beginPath();
		context.moveTo(pos.x, pos.y);
		context.lineTo(pos.x + len, pos.y);
		context.stroke();

		context.restore();
	}

	resetProgress()
	{
        canvas.dispatchEvent(new CustomEvent(EventName.SettingsReset));
	}

	muteMusic()
	{
        canvas.dispatchEvent(new CustomEvent(EventName.SettingsMuteMusic));
	}

    muteSound()
	{
        canvas.dispatchEvent(new CustomEvent(EventName.SettingsMuteSound));
	}

	return()
	{
        canvas.dispatchEvent(new CustomEvent(EventName.SettingsReturn));
	}
}