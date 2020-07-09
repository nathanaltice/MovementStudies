class FixedJump extends Phaser.Scene {
    constructor() {
        super('fixedJumpScene');
    }

    create() {
        // variables and settings
        this.ACCELERATION = 500;
        this.MAX_X_VEL = 500;   // pixels/second
        this.MAX_Y_VEL = 5000;
        this.DRAG = 600;    // DRAG < ACCELERATION = icy slide
        this.JUMP_VELOCITY = -1000;
        this.physics.world.gravity.y = 3000;

        // set bg color
        this.cameras.main.setBackgroundColor('#227B96');

        // draw grid lines for jump height reference
        let graphics = this.add.graphics();
        graphics.lineStyle(2, 0xFFFFFF, 0.1);
	    for(let y = game.config.height-70; y >= 35; y -= 35) {
            graphics.lineBetween(0, y, game.config.width, y);
        }

        // print Scene name
        this.add.text(game.config.width/2, 30, 'Scene 3: Tight Jumpin\'', { font: '14px Futura', fill: '#FFFFFF' }).setOrigin(0.5);
        
        // add some physics clouds
        this.cloud01 = this.physics.add.sprite(600, 100, 'platformer_atlas', 'cloud_1');
        this.cloud01.body.setAllowGravity(false).setVelocityX(25);
        this.cloud02 = this.physics.add.sprite(200, 200, 'platformer_atlas', 'cloud_2');
        this.cloud02.body.setAllowGravity(false).setVelocityX(45);

        // make ground tiles group
        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        for(let i = tileSize*7; i < game.config.width-tileSize*4; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*5, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        for(let i = tileSize*2; i < game.config.width-tileSize*13; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*9, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        // set up my alien son 👽
        this.alien = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'platformer_atlas', 'front').setScale(SCALE);
        this.alien.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);

        // add arrow key graphics as UI
        this.upKey = this.add.sprite(64, 32, 'arrowKey');
		this.leftKey = this.add.sprite(32, 64, 'arrowKey');
		this.downKey = this.add.sprite(64, 64, 'arrowKey');
		this.rightKey = this.add.sprite(96, 64, 'arrowKey');
		this.leftKey.rotation = Math.PI/2*3;
		this.downKey.rotation = Math.PI;
        this.rightKey.rotation = Math.PI/2;
        this.downKey.tint = 0x333333;

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // add physics collider
        this.physics.add.collider(this.alien, this.ground);

        // set up Scene switcher
        this.input.keyboard.on('keydown', (event) => {
            //console.log(event);
            switch(event.key) {
                case '1':
                    this.scene.start('velocityScene');
                    break;
                case '2':
                    this.scene.start('accelerationScene');
                    break;
                case '3':
                    this.scene.start('fixedJumpScene');
                    break;
                case '4':
                    this.scene.start('variableJumpScene');
                    break;
                case '5':
                    this.scene.start('runnerScene');
                    break;
                case '6':
                    this.scene.start('pogoScene');
                    break;
                case '7':
                    this.scene.start('asteroidsScene');
                    break;
                default:
                    break;
            }
        });
    }

    update() {
        // check keyboard input
        if(cursors.left.isDown) {
            this.alien.body.setAccelerationX(-this.ACCELERATION);
            this.alien.setFlip(true, false);
            // see: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html#play__anchor
            // play(key [, ignoreIfPlaying] [, startFrame])
            this.alien.anims.play('walk', true);
            this.leftKey.tint = 0xFACADE;   // tint key
        } else if(cursors.right.isDown) {
            this.alien.body.setAccelerationX(this.ACCELERATION);
            this.alien.resetFlip();
            this.alien.anims.play('walk', true);
            this.rightKey.tint = 0xFACADE;  // tint key
        } else {
            // set acceleration to 0 so DRAG will take over
            this.alien.body.setAccelerationX(0);
            this.alien.body.setDragX(this.DRAG);
            this.alien.anims.play('idle');
            this.leftKey.tint = 0xFFFFFF;   // un-tint keys
            this.rightKey.tint = 0xFFFFFF;  
        }

        // jump
        if(!this.alien.body.touching.down) {
            this.alien.anims.play('jump', true);
        }
        // use JustDown to avoid 'pogo' jumps if you player keeps the up key held down
        // note: there is unfortunately no .justDown property in Phaser's cursor object
        if(this.alien.body.touching.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.alien.body.setVelocityY(this.JUMP_VELOCITY);
            this.upKey.tint = 0xFACADE;
        } else {
            this.upKey.tint = 0xFFFFFF;
        }

        // wrap physics object(s) .wrap(gameObject, padding)
        this.physics.world.wrap(this.cloud01, this.cloud01.width/2);
        this.physics.world.wrap(this.cloud02, this.cloud02.width/2);
        this.physics.world.wrap(this.alien, this.alien.width/2);
    }
}