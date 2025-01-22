class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // set load path
        this.load.path = 'assets/'
        // take care of all of our asset loading now
        this.load.atlas('platformer_atlas', 'kenny_sheet.png', 'kenny_sheet.json')
        this.load.image('arrowKey', 'arrowKey.png')
        this.load.image('talltrees', 'talltrees.png')
        this.load.image('groundScroll', 'ground.png')
        this.load.atlasXML('shooter_atlas', 'shooter_sheet.png', 'shooter_sheet.xml')
    }

    create() {
        // initializing our animations here ensures that we can use them across all scenes without re-loading them

        // create alien animations from texture atlas
        // see: https://docs.phaser.io/api-documentation/namespace/types-animations
        // key: string, frames: array, frameRate: int, repeat: int
        // see: https://docs.phaser.io/api-documentation/class/animations-animationmanager#generateframenames
        // generateFrameNames returns an array of frame names derived from the rules provided in the configuration object parameter
        this.anims.create({ 
            key: 'walk', 
            frames: this.anims.generateFrameNames('platformer_atlas', {      
                prefix: 'walk',
                start: 1,
                end: 11,
                suffix: '',
                zeroPad: 4 
            }), 
            frameRate: 30,
            repeat: -1 
        })

        this.anims.create({
            key: 'idle',
            defaultTextureKey: 'platformer_atlas',
            frames: [
                { frame: 'front' }
            ],
            repeat: -1
        })

        this.anims.create({
            key: 'jump',
            defaultTextureKey: 'platformer_atlas',
            frames: [
                { frame: 'jump' }
            ],
        })

        this.anims.create({
            key: 'flyflap',
            frames: [
                { frame: 'fly_normal' },
                { frame: 'fly_fly'}
            ],
            defaultTextureKey: 'platformer_atlas',
            repeat: -1
        })

        // display info text below game canvas
        document.getElementById('info').innerHTML = 'Cursors: move/jump | 1–7: Choose scene | D: toggle debug'

        // ...and pass to the next Scene
        this.scene.start('velocityScene')
    }
}