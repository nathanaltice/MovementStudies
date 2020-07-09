class Asteroids extends Phaser.Scene {
    constructor() {
        super('asteroidsScene');
    }

    create() {
        // define variables
        this.ANG_VELOCITY = 180;    // degrees/second
        this.MAX_VELOCITY = 500;    // pixels/second
        this.DRAG = 0.99;
        currentScene = 7;

        // change bg color
        this.cameras.main.setBackgroundColor('#111');

        // print Scene name
        this.add.text(game.config.width/2, 30, 'Scene 7: Asteroids-style Movement', { font: '14px Futura', fill: '#FFFFFF' }).setOrigin(0.5);

        // setup ship physics sprite
        this.ship01 = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'shooter_atlas', 'spaceShips_003.png').setScale(SCALE);
        this.ship01.setMaxVelocity(this.MAX_VELOCITY);
        this.ship01.setDamping(true);
        this.ship01.setDrag(this.DRAG);

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
        // physics methods adapted from the Phaser 3 Asteroids Example 👍
        // handle input
        if(cursors.up.isDown) {
            this.physics.velocityFromRotation(this.ship01.rotation-Math.PI/2*3, 200, this.ship01.body.acceleration);
            this.upKey.tint = 0xFACADE;     // tint keyboard key
        } else {
            this.ship01.setAcceleration(0);
            this.upKey.tint = 0xFFFFFF;     // un-tint key
        }

        if(cursors.left.isDown) {
            this.ship01.setAngularVelocity(-this.ANG_VELOCITY);
            this.leftKey.tint = 0xFACADE;   // tint keyboard key
        } else if (cursors.right.isDown) {
            this.ship01.setAngularVelocity(this.ANG_VELOCITY);
            this.rightKey.tint = 0xFACADE;   // tint keyboard key
        } else {
            this.ship01.setAngularVelocity(0);
            this.leftKey.tint = 0xFFFFFF;   // un-tint keys
            this.rightKey.tint = 0xFFFFFF;
        }

        // wrap physics object(s) .wrap(gameObject, padding)
        this.physics.world.wrap(this.ship01, this.ship01.width*SCALE/2);
    }
}