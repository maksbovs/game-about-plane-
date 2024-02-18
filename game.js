class Main extends Phaser.Scene {
    preload() {
        this.load.spritesheet('plane', 'assets/planesheet.png', { frameWidth: 98, frameHeight: 83 });
        this.load.image('pipe', 'assets/pipe.png');
        this.load.audio('jump', 'assets/jump.wav');
    }

    create() {
        this.plane = this.physics.add.sprite(50, 100, 'plane');
        this.plane.setScale(0.65, 0.65);
        this.plane.setOrigin(0, 0.5);
        this.anims.create({
            key: "planeAnimation",
            frames: this.anims.generateFrameNumbers('plane', { frames: [0, 1, 3, 2] }),
            frameRate: 10,
            repeat: -1
        });
        this.plane.play("planeAnimation");

        this.plane.body.gravity.y = 1000;
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors = this.input.keyboard.createCursorKeys(); // Додаємо об'єкт клавіш

        this.score = 0;
        this.labelScore = this.add.text(140, 20, "Created by Bovsunovskiy", { fontSize: 10, color: "white" });
        this.labelScore = this.add.text(15, 15, "0", { fontSize: 30, color: "white" });

        this.pipes = this.physics.add.group();

        this.timedEvent = this.time.addEvent({
            delay: 1500,
            callback: this.addRowOfPipes,
            callbackScope: this,
            loop: true
        });
        this.physics.add.overlap(this.plane, this.pipes, this.hitPipe, null, this);

        this.jumpSound = this.sound.add('jump');
    }

    update() {
        if (this.plane.angle < 20) {
            this.plane.angle += 1;
        }

        if (this.plane.y < 0 || this.plane.y > 490) {
            this.scene.restart();
        }
        
        if (this.input.keyboard.checkDown(this.cursors.up, 100)) {
            this.jump();
        } else if (this.input.keyboard.checkDown(this.cursors.down, 100)) {
            // Додайте дії, які виконуються при натисканні кнопки "Вниз" 
            // В цьому випадку, якщо ви хочете, щоб натискання кнопки "Вниз" також змінювало кут самоліті, то додайте код для цього тут
        }
    }

    jump() {
        this.tweens.add({
            targets: this.plane,
            angle: -20,
            duration: 100,
            repeat: 1
        });
        this.plane.body.velocity.y = -350;
        
        this.jumpSound.play();
    }

    addOnePipe(x, y) {
        var pipe = this.physics.add.sprite(x, y, 'pipe');
        pipe.setOrigin(0, 0);
        this.pipes.add(pipe);
        pipe.body.velocity.x = -300;

        pipe.collideWorldBounds = true;
        pipe.outOfBoundsKill = true;
    }

    addRowOfPipes() {
        var hole = Math.floor(Math.random() * 5) + 1;
        this.score += 1;
        this.labelScore.text = this.score;
    
        // Перевіряємо, чи кількість поінтів кратна 10
        if (this.score % 10 === 0) {
            this.plane.body.velocity.x += 10; // Збільшуємо швидкість літака на 10 кожні 10 поінтів
        }
    
        for (var i = 0; i < 8; i++) {
            if (!(i >= hole && i <= hole + 2))
                this.addOnePipe(400, i * 60 + 10);
        }
    }

    hitPipe() {
        if (this.plane.alive == false) return;
    
        this.timedEvent.remove(false);
        this.plane.alive = false;
    
        this.pipes.children.each(function(pipe) {
            pipe.body.velocity.x = 0;
        });
    
        // Додавання напису "Game Over"
        this.add.text(150, 200, "Game Over", { fontSize: '32px', fill: '#ff0000' });
    }
    }


const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 490,
    scene: Main,
    backgroundColor: '#71c5cf',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);
