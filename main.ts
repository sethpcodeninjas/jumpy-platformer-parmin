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
function createCoins(){
    for (let loc of tiles.getTilesByType(assets.tile`tile5`)){
        coin = sprites.create(coinImgs[0], SpriteKind.Coin)
        tiles.placeOnTile(coin, loc)
        animation.runImageAnimation(coin, coinImgs, 75, true)
        tiles.setTileAt(loc, assets.tile`tile0`)
    }
}
function attemptJump(){
    if (hero.isHittingTile(CollisionDirection.Bottom)) {
        hero.vy = -4 * pixelsToMeters
    }
    else if (canDoubleJump){
        if (hero.vy >= 40){
            hero.vy = -5 * pixelsToMeters
            scene.cameraShake(2)
            hero.startEffect(effects.spray,250)
        }
        else {
            hero.vy = -3 * pixelsToMeters
        }
        canDoubleJump = false
    }
}
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
    createEnemies()
    createCoins()
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function() {
    attemptJump()
})
initializeLevel(currentLevel)
game.onUpdate(function() {
    if (hero.isHittingTile(CollisionDirection.Bottom)){
        canDoubleJump = true
    }
})
// Check goomba movement 
game.onUpdate(function() {
    let currentGoombas = sprites.allOfKind(SpriteKind.Bumper)
    for (let goomba of currentGoombas){
        if (goomba.isHittingTile(CollisionDirection.Left)){
            goomba.vx = randint(30, 60)
        }
        else if (goomba.isHittingTile(CollisionDirection.Right)){
            goomba.vx = randint(-60, -30)
        }
    }
})
// check flier movement
game.onUpdate(function() {
    let currentFliers = sprites.allOfKind(SpriteKind.Flier)
    for (let value of currentFliers){
        if (Math.abs(value.x - hero.x) < 60){
            if (value.x - hero.x < 5){
                value.vx = 25
            }
            else if (value.x - hero.x > 5){
                value.vx = -25
            }
            if (value.y - hero.y < -5){
                value.vy = 25
            }
            else if (value.y - hero.y > 5){
                value.vy = -25
            }
            animation.runImageAnimation(value, flierImgs, 20, false)
        }
        else {
            value.vy = -20
            value.vx = 0
        }
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Bumper, function(sprite: Sprite, otherSprite: Sprite) {
    if (sprite.vy > 0 && !sprite.isHittingTile(CollisionDirection.Bottom)){
        otherSprite.destroy(effects.ashes, 250)
        otherSprite.vy = -50
        sprite.vy = -2 * pixelsToMeters
        info.changeScoreBy(1)
        music.powerUp.play()
    }
    else {
        info.changeLifeBy(-1)
        sprite.say("Ow!", invincibilityPeriod)
        music.powerDown.play()
    }
    pause(invincibilityPeriod)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Coin, function(sprite: Sprite, otherSprite: Sprite) {
    otherSprite.destroy(effects.trail, 250)
    info.changeScoreBy(3)
    music.baDing.play()
})