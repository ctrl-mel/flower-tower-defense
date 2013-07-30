Game = {
    // This defines our grid's size and the size of each of its tiles
    map_grid: {
        width:  25,
        height: 15,
        tile: {
            width:  32,
            height: 32
        }
    },

    // The total width of the game screen. Since our grid takes up the entire screen
    //  this is just the width of a tile times the width of the grid
    width: function() {
        return this.map_grid.width * this.map_grid.tile.width;
    },

    // The total height of the game screen. Since our grid takes up the entire screen
    //  this is just the height of a tile times the height of the grid
    height: function() {
        return this.map_grid.height * this.map_grid.tile.height;
    },

    start: function() {
        Crafty.init(Game.width(), Game.height());
        Crafty.background('rgb(249, 223, 125)');

        Crafty.scene('Loading');
    }
};

$text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' };
