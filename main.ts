/*

*************CHECKLIST**************
- create all the enemies
- create the introductions
- create a double jump function
- attach animation to jump, run, and crouch
- attach animations to all enemies
- create a function to initialize the level (clear the game, set the level, create the player & enemies)
- onOverlaps for; coin, fliers, goombas, goals
- function to create the goals
- function to cycle through introductions
- function to check which level we are on
- game.onUpdate to check how the hero is moving (and whether to animate)
- game.onUpdate to regulate flier movement
- game.onUpdate to check if we are standing on the ground
- game.onupdate to regulate goomba movement

*/
function createEnemies () {
    // spawn bumpers
    for (let bumperLocation of tiles.getTilesByType(assets.tile`tile4`)){
        bumper = sprites.create(img`
            . . . . . . e e e e . . . . . .
            . . . . . e e e e e e . . . . .
            . . . . e e e e e e e e . . . .
            . . . e e e e e e e e e e . . .
            . . e f f e e e e e e f f e . .
            . e e e 1 f e e e e f 1 e e e .
            e e e e 1 f f f f f f 1 e e e e
            e e e e 1 f 1 e e 1 f 1 e e e e
            e e e e 1 1 1 e e 1 1 1 e e e e
            . e e e d e e e e e e d e e e .
            . . . d d d d d d d d d d . . .
            . f f d d d d d d d d d d f f .
            f f f f f d d d d d d f f f f f
            f f f f f f f . . f f f f f f f
            f f f f f f f . . f f f f f f f
            . f f f f f . . . . f f f f f .
        `, SpriteKind.Bumper)
        tiles.placeOnTile(bumper, bumperLocation)
        tiles.setTileAt(bumperLocation, assets.tile`tile0`)
        bumper.ay = gravity
        if (Math.percentChance(50)){
            bumper.vx = randint(30, 60)
        }
        else {
            bumper.vx = randint(-60, -30)
        }
    }
    // spawn fliers
    for (let flierLocation of tiles.getTilesByType(assets.tile`tile7`)){
        flier = sprites.create(flierImgs[0], SpriteKind.Flier)
        tiles.placeOnTile(flier, flierLocation)
        tiles.setTileAt(flierLocation, assets.tile`tile0`)
    }
}

function initializeLevel(level: number){
    effects.clouds.startScreenEffect()
    playerStartLocation = tiles.getTilesByType(assets.tile`tile6`)[0]
    tiles.placeOnTile(hero, playerStartLocation)
    tiles.setTileAt(playerStartLocation, assets.tile`tile0`)
    // createEnemies
    // spawnGoals
}

initializeLevel(currentLevel)