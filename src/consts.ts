export const kGamesFeatures = new Map<number, string[]>([
  //Diablo 4
  [
    22700, 
    [
        'game_info',
        'match_info',
        'location',
        'me'
    ]
  ],
]);

export const kGameClassIds = Array.from(kGamesFeatures.keys());

export const kWindowNames = {
  inGame: 'in_game',
  desktop: 'desktop',
  menu: 'menu'
};

export const kHotkeys = {
  toggle: 'sample_app_ts_showhide',
  alertxy: 'alert_the_XY',
  togglemenu: 'showhide_menu'
};
