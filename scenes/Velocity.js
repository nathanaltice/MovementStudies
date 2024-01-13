class Velocity extends Phaser.Scene {
    constructor() {
        super('velocityScene')
    }

    init() {
        // variables and settings
        this.MAX_VELOCITY = 300    // pixels/second
        this.physics.world.gravity.y = 1000
    }

    create() {
        // set bg color
        this.cameras.main.setBackgroundColor('#CCC')

        // print Scene name
        this.add.text(game.config.width/2, 30, 'Scene 1: Velocity Moves (with Grumpy Fly Buddy)', { font: '14px Futura', fill: '#FFFFFF' }).setOrigin(0.5)
        this.add.text(game.config.width/2, 50, '(Number Keys 1–7 Start Their Respective Scene Numbers)', { font: '14px Futura', fill: '#FFFFAA' }).setOrigin(0.5)

        // make ground tiles
        this.ground = this.add.group()
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0)
            groundTile.body.immovable = true
            groundTile.body.allowGravity = false
            this.ground.add(groundTile)
        }

        // add some physics clouds
        this.cloud01 = this.physics.add.sprite(600, 100, 'platformer_atlas', 'cloud_1')
        this.cloud01.body.setAllowGravity(false).setVelocityX(25)
        this.cloud02 = this.physics.add.sprite(200, 200, 'platformer_atlas', 'cloud_2')
        this.cloud02.body.setAllowGravity(false).setVelocityX(45)

        // add the alien 👽
        // see: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/arcade-gameobject/#sprite-object
        this.alien = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'platformer_atlas', 'front').setScale(SCALE)
        this.alien.setCollideWorldBounds(true)
       
        // add a fly friend 🦟
        this.fly = this.add.sprite(game.config.width/2 + 150, game.config.height/2, 'platformer_atlas', 'fly_normal').setScale(SCALE)
        // go ahead and start the flapping animation since the fly is non-interactive
        this.fly.anims.play('flyflap')

        // add arrow key graphics as UI
        this.upKey = this.add.sprite(64, 32, 'arrowKey')
		this.leftKey = this.add.sprite(32, 64, 'arrowKey')
		this.downKey = this.add.sprite(64, 64, 'arrowKey')
		this.rightKey = this.add.sprite(96, 64, 'arrowKey')
		this.leftKey.rotation = Math.PI/2*3
		this.downKey.rotation = Math.PI
        this.rightKey.rotation = Math.PI/2
        this.upKey.tint = 0x333333
        this.downKey.tint = 0x333333

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys()

        // add physics collider
        this.physics.add.collider(this.alien, this.ground)

        // set up Scene switcher
        // note: this style of scene switching is for demo purposes only
        this.input.keyboard.on('keydown', (event) => {
            //console.log(event)
            switch(event.key) {
                case '1':
                    this.scene.start('velocityScene')
                    break
                case '2':
                    this.scene.start('accelerationScene')
                    break
                case '3':
                    this.scene.start('fixedJumpScene')
                    break
                case '4':
                    this.scene.start('variableJumpScene')
                    break
                case '5':
                    this.scene.start('runnerScene')
                    break
                case '6':
                    this.scene.start('pogoScene')
                    break
                case '7':
                    this.scene.start('asteroidsScene')
                    break
                default:
                    break
            }
        })

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', function() {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)
    }

    update() {
        // check keyboard input
        if(cursors.left.isDown) {
            this.alien.setVelocityX(-this.MAX_VELOCITY)
            this.alien.setFlip(true, false)
            // see: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html#play__anchor
            // play(key [, ignoreIfPlaying] [, startFrame])
            this.alien.anims.play('walk', true)
            this.leftKey.tint = 0xFACADE   // tint key
        } else if(cursors.right.isDown) {
            this.alien.setVelocityX(this.MAX_VELOCITY)
            this.alien.resetFlip()
            this.alien.anims.play('walk', true)
            this.rightKey.tint = 0xFACADE  // tint key
        } else {
            this.alien.body.velocity.x = 0
            this.alien.anims.play('idle')
            this.leftKey.tint = 0xFFFFFF   // un-tint keys
            this.rightKey.tint = 0xFFFFFF  
        }

        // wrap physics object(s) .wrap(gameObject, padding)
        this.physics.world.wrap(this.cloud01, this.cloud01.width/2)
        this.physics.world.wrap(this.cloud02, this.cloud02.width/2)
    }
}