import {
  OWGames,
  OWGamesEvents,
  OWHotkeys
} from "@overwolf/overwolf-api-ts";

import { AppWindow } from "../AppWindow";
import { kHotkeys, kWindowNames, kGamesFeatures } from "../consts";

import WindowState = overwolf.windows.WindowStateEx;

// The window displayed in-game while a game is running.
// It listens to all info events and to the game events listed in the consts.ts file
// and writes them to the relevant log using <pre> tags.
// The window also sets up Ctrl+F as the minimize/restore hotkey.
// Like the background window, it also implements the Singleton design pattern.
class InGame extends AppWindow {
  private static _instance: InGame;
  private _gameEventsListener: OWGamesEvents;
  private _eventsLog: HTMLElement;
  private _infoLog: HTMLElement;

  private constructor() {
    super(kWindowNames.inGame);

    this._eventsLog = document.getElementById('eventsLog');
    this._infoLog = document.getElementById('infoLog');

    this.setToggleHotkeyBehavior();
    //this.setToggleHotkeyText();
    //this.setToggleMenuBehavior();
    //this.setCoorsHotkeyBehavior();
  }

  public static instance() {
    if (!this._instance) {
      this._instance = new InGame();
    }

    return this._instance;
  }

  public async run() {
    const gameClassId = await this.getCurrentGameClassId();

    const gameFeatures = kGamesFeatures.get(gameClassId);

    if (gameFeatures && gameFeatures.length) {
      this._gameEventsListener = new OWGamesEvents(
        {
          onInfoUpdates: this.onInfoUpdates.bind(this),
          onNewEvents: this.onNewEvents.bind(this)
        },
        gameFeatures
      );

      this._gameEventsListener.start();
    }
  }

  private onInfoUpdates(info) {
    this.logLine(this._infoLog, info, false);
  }

  // Special events will be highlighted in the event log
  private onNewEvents(e) {
    const shouldHighlight = e.events.some(event => {
      switch (event.name) {
        case 'kill':
        case 'death':
        case 'assist':
        case 'level':
        case 'matchStart':
        case 'match_start':
        case 'matchEnd':
        case 'match_end':
          return true;
      }

      return false
    });
    this.logLine(this._eventsLog, e, shouldHighlight);
  }

  // Displays the toggle minimize/restore hotkey in the window header
  private async setToggleHotkeyText() {
    const gameClassId = await this.getCurrentGameClassId();
    const hotkeyText = await OWHotkeys.getHotkeyText(kHotkeys.toggle, gameClassId);
    const hotkeyElem = document.getElementById('hotkey');
    hotkeyElem.textContent = hotkeyText;
  }

  // Sets toggleInGameWindow as the behavior for the Ctrl+F hotkey
  private async setToggleHotkeyBehavior() {
    const toggleInGameWindow = async (
      hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent
    ): Promise<void> => {
      console.log(`pressed hotkey for ${hotkeyResult.name}`);
      const inGameState = await this.getWindowState();

      if (inGameState.window_state === WindowState.NORMAL ||
        inGameState.window_state === WindowState.MAXIMIZED) {
        this.currWindow.minimize();
      } else if (inGameState.window_state === WindowState.MINIMIZED ||
        inGameState.window_state === WindowState.CLOSED) {
        this.currWindow.restore();
      }
    }
    OWHotkeys.onHotkeyDown(kHotkeys.toggle, toggleInGameWindow);
  }

  //const formData = new FormData();
  //formData.append('file', file);



  // alert the xy on hotkey Ctrl+K hotkey
  private async setCoorsHotkeyBehavior() {
    const alertthexy = async (
    //  mouseResult: overwolf.settings.hotkeys.OnPressedEvent
    ): Promise<void> => {
      //do something here.
      //document.addEventListener("click", function(event) {
      //  alert("clientX: " + event.clientX + " - clientY: " + event.clientY);
      //});
      //var settings = {"roundAwayFromZero" : true, "crop": {x:964,y:96, width:916, height:858}, "rescale" :{width:850, height:850}};
      //overwolf.media.getScreenshotUrl(settings, function(info){
      //overwolf.media.takeScreenshot(function(info) {
      //  if (typeof info.url === 'undefined') {
      //    console.error(info);
       //   return;
      //  }
      //  const gameimage = info.url;
     //   overwolf.windows.sendMessage('menu', '1', {data:gameimage}, ()=>{console.log('Message sent to window "secondWindow"')})
        //overwolf.windows.sendMessage("menu", {data:gameimage});
        //fetch('http://tf.raum.au/', {
        //  method: 'POST',
         // body: info.url
        //})
        //.then(response => response.json())
        //.then(data => {
        //  console.log('File uploaded successfully:', data);
        //})
        //.catch(error => {
        //  console.error('Error uploading file:', error);
        //});

    //    window.addEventListener("message", message => {
    //      if (message.origin !== "https://yourdomain.gg") {
    //      return;
   //       }
//
    //      let data = message.data;
    //      if (!data) {
   //       return;
   //       }

   //       // do something interesting with the data
//      });
        //document.getElementById("eventsLog").innerHTML = "<img src='"+info.url+"' width='500'/>"; 
        //console.log(overwolf.games.launchers.getRunningLaunchersInfo());

        
    //});
    //console.log(overwolf.games.launchers.getRunningLaunchersInfo(function(errors){}));
    }
    OWHotkeys.onHotkeyDown(kHotkeys.alertxy, alertthexy);
  }
  // Appends a new line to the specified log
  private logLine(log: HTMLElement, data, highlight) {
    const line = document.createElement('pre');
    line.textContent = JSON.stringify(data);

    if (highlight) {
      line.className = 'highlight';
    }

    // Check if scroll is near bottom
    const shouldAutoScroll =
      log.scrollTop + log.offsetHeight >= log.scrollHeight - 10;

    log.appendChild(line);

    if (shouldAutoScroll) {
      log.scrollTop = log.scrollHeight;
    }
  }

  private async getCurrentGameClassId(): Promise<number | null> {
    const info = await OWGames.getRunningGameInfo();

    return (info && info.isRunning && info.classId) ? info.classId : null;
  }
}

InGame.instance().run();
