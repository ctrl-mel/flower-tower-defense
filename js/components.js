// ------------------
// General Components
// ------------------

// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
    init: function() {
        this.attr({
            w: Game.map_grid.tile.width,
            h: Game.map_grid.tile.height
        })
    },

    // Locate this entity at the given position on the grid
    at: function(x, y) {
        if (x === undefined && y === undefined) {
            return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
        } else {
            this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
            return this;
        }
    }
});

// The PathWalker component allows an entity to move along a path,
// given as an array of objects with x and y attributes
Crafty.c('PathWalker', {
    init: function() {
    },

    // animate this entity along the given path
    animate_along: function(path, speed) {
        if (!speed) speed = 1;
        var animation = {
            actor: this,
            speed: speed,
            steps: []
        };
        for (var i = 0; i < path.length; i++) {
            animation.steps.push({
                x: path[i].x * Game.map_grid.tile.width,
                y: path[i].y * Game.map_grid.tile.height
            });
            //console.log("Tweening to x=" + path[i].x + ", y=" + path[i].y);
        }
        Tweening.targets.push(animation);
        return this;
    },

    animate_to: function(x, y, speed) {
        return this.animate_along([{x: x, y: y}], speed);
    },

    destroy_after_animation: function() {
        var that = this;
        Crafty.bind("TweenEnded", function(actor) {
            if (actor == that) {
                that.destroy();
            }
        });
        return this;
    }
});

Crafty.c('Actor', {
    init: function() {
        this.requires('2D, Canvas, Grid');
    }
});

Crafty.c('Bullet', {
    init: function() {
        this.requires('Actor, Collision, PathWalker');

        this.checkHits('Enemy');
        this.bind('HitOn', function() {
            this.destroy();
        });
    }
});

Crafty.c('Enemy', {
    init: function() {
        this.requires('Actor, Collision, PathWalker');

        Game.enemyCount++;

        this.checkHits('Bullet');
        this.bind('HitOn', function() {
            this.attr({health: this.health - 1});
            if (this.health <= 0) {
                Game.money += this.reward;
                Game.enemyCount--;
                this.destroy();
            }
            console.log("Health: " + this.health);
        });

        var that = this;
        this.animate_along(Game.path.getPath(), this.speed);
        this.bind('TweenEnded', function(actor) {
            if (that == actor) {
                Game.lifes--;
                Game.enemyCount--;
                this.destroy();
            }
        })
    }
});

Crafty.c('Wave', {
    init: function() {
        this.requires('Delay');

        var enemies = Game.waves[Game.currentWave - 1];
        var i = 0;
        this.delay(function() {
            Crafty.e(enemies[i]).at(Game.path.start.x, Game.path.start.y);
            //console.log("Added new " + enemies[i] + " at " + Game.path.start.x + "/" + Game.path.start.y);
            i++;
        }, 3000, enemies.length - 1);

        this.delay(function() {
            this.bind('EnterFrame', function() {
                if (Game.enemyCount == 0) {
                    Game.currentWave++;
                    Game.money += Game.moneyAfterWave;
                    if (Game.currentWave <= Game.waves.length && Game.lifes > 0) {
                        console.log("Started wave " + Game.currentWave);
                        Crafty.e('Wave');
                    } else {
                        console.log("Last wave or lifes reached 0");
                    }
                    this.destroy();
                }
            })
        }, 30000);
    }
});


// ------------------
// UI Elements
// ------------------

Crafty.c('HudElement', {
    init: function() {
        this.requires('2D, DOM, Text');
        this.attr({ x: 0, y: 0, w: 150 });
        this.textFont(Game.hudFont);
        this.textColor(Game.textColor);
    },

    observe: function(prefix, observable) {
        this.bind('EnterFrame', function() {
            this.text(prefix + ": " + Game[observable])
        });
        return this;
    },

    at: function(x) {
        this.attr({ x: x * 150});
        return this;
    }
});

Crafty.c('RestartButton', {
    init: function() {
        this.requires('2D, DOM, Text, Mouse');
        this.text('Start again?');
        this.attr({ x: 0, y: Game.height() - 100, w: Game.width(), h: 50});
        this.textFont(Game.restartFont);
        this.textColor(Game.restartColor);
        this.css(Game.restartCss);
        this.bind('MouseOver', function() {
            this.textColor('white');
        });
        this.bind('MouseOut', function() {
            this.textColor(Game.restartColor);
        });
        this.bind('Click', function() {
            console.log('Restaaaaaart');
            Crafty.scene('Loading');
        });
    }
});


Crafty.c('Tree', {
    init: function() {
        this.requires('Actor, Color');
        this.color('rgb(20, 125, 40)');
    }
});

Crafty.c('Path', {
    init: function() {
        this.requires('Actor, Image, Color');
        this.image("assets/transparent.png").color("#969696", 0.15);
    }
});

Crafty.c('TowerPlace', {
    init: function() {
        this.requires('Actor, Mouse, Image, Color');
        this.image("assets/transparent.png").color("#ffffff", 0.0);
        this.bind('MouseOver', function() {
            this.color("#b66666", 0.2);
        });
        this.bind('MouseOut', function() {
            this.color("#ffffff", 0.0);
        });
        this.bind('Click', function() {
            if (Game.money >= Game.towers[Game.selectedTower]) {
                Crafty.e(Game.selectedTower).at(this.at().x, this.at().y);
                Game.money -= Game.towers[Game.selectedTower];
            }
        });
    }
});


// ------
// Towers
// ------

Crafty.c('FlowerTower', {
    init: function() {
        this.requires('Actor, Image, Delay');
        this.image("assets/flower.png");

        var that = this;
        this.delay(function() {
            // TODO AI that only shoots when an enemy is near
            // TODO consider playing field bounds for animation
            var x = that.at().x, y = that.at().y;

            Crafty.e('Bullet, leaf_up').at(x, y).animate_to(x, y - 4, 4).destroy_after_animation();
            Crafty.e('Bullet, leaf_right').at(x, y).animate_to(x + 4, y, 4).destroy_after_animation();
            Crafty.e('Bullet, leaf_down').at(x, y).animate_to(x, y + 4, 4).destroy_after_animation();
            Crafty.e('Bullet, leaf_left').at(x, y).animate_to(x - 4, y, 4).destroy_after_animation();
        }, 1000, -1);
    }

});


// -------
// Enemies
// -------

Crafty.c('Witch', {
    init: function() {
        this.requires('Enemy, witch_right');
        this.attr({
            health: 8,
            reward: 1,
            speed: 2
        });
    }
});

Crafty.c('Squid', {
    init: function() {
        this.requires('Enemy, Image');
        this.image("assets/squid.png");
        this.attr({
            health: 40,
            reward: 5,
            speed: 1.6
        });
    }
});

Crafty.c('Knight', {
    init: function() {
        this.requires('Enemy, knight_right');
        this.attr({
            health: 100,
            reward: 20,
            speed: 2.5
        });
    }
});



// ---------------------
// custom Tween handling
// ---------------------

Tweening = {
    targets: [],
    lastExecuted: new Date().getTime(),
    fps: 25,
    speedup: 1
};

// bind pause/unpause key 'p'
Crafty.e('Keyboard').bind('KeyDown', function() {
    if (this.isDown('S')) {
        if (Tweening.speedup == 1) {
            Tweening.speedup = 4;
        } else {
            Tweening.speedup = 1;
        }
    }
});

function tween_handler() {
    var newLastExecuted = new Date().getTime();
    var delay = Tweening.fps * Tweening.speedup * (newLastExecuted - Tweening.lastExecuted) / 1000.0;
    Tweening.lastExecuted = newLastExecuted;

    if (Crafty.isPaused()) {
        return;
    }

    for (var i = 0; i < Tweening.targets.length; i++) {
        var current = Tweening.targets[i],
            distanceX = current.speed * delay * Game.map_grid.tile.width / Tweening.fps,
            distanceY = current.speed * delay * Game.map_grid.tile.height / Tweening.fps;
        if (current.actor.x != current.steps[0].x ||
                current.actor.y != current.steps[0].y) {
            var newX = current.actor.x,
                newY = current.actor.y;
            if (current.actor.x < current.steps[0].x) {
                newX = Math.min(current.actor.x + distanceX, current.steps[0].x);
            } else if (current.actor.x > current.steps[0].x) {
                newX = Math.max(current.actor.x - distanceX, current.steps[0].x);
            }
            if (current.actor.y < current.steps[0].y) {
                newY = Math.min(current.actor.y + distanceY, current.steps[0].y);
            } else if (current.actor.y > current.steps[0].y) {
                newY = Math.max(current.actor.y - distanceY, current.steps[0].y);
            }
            current.actor.attr({x: newX, y: newY});
        } else {
            //console.log("Arrived at x=" + current.actor.x + ", y=" + current.actor.y);
            current.steps.shift();
            // TODO emit event that tells the actor in which direction we move next (down, up, right, left)
        }

        // no more steps to take for current target: remove it from tween_targets array
        if (current.steps.length == 0) {
            Tweening.targets.splice(i, 1);
            i--;
            Crafty.trigger("TweenEnded", current.actor);
        }
    }
}
setInterval(tween_handler, 1000 / Tweening.fps);
