class Game {
    constructor() {
        this.playerScore = [0, 0];
        this.array = Array.from({ length: 10 }, (_, i) => i + 1); // Фишки от 1 до 10
        this.currentPlayer = 0; // 0 - первый игрок, 1 - второй игрок
        this.moves = 0;
        this.boost = [0, 0.3];
    }

    start() {
        console.log(`Игрок ${this.currentPlayer + 1}, ваш ход!`);
        this.playTurn();
    }

    playTurn() {
        for (let index = 0; index < this.array.length; index++) {
            console.log(`Фишка ${this.array[index]}`);

            // Случайная вероятность переворота с учетом буста
            let random = Math.random();
            let probability = 0.4 + (this.boost[this.currentPlayer]);
            console.log(`Игрок ${this.currentPlayer} вероятность ${probability}`);
            
            if (random <= probability) {
                console.log('Перевернута!');
                this.playerScore[this.currentPlayer] += 1;
                this.boost[this.currentPlayer] += 0.05; // Увеличиваем буст
            } else {
                console.log('Не удалось перевернуть.');
                this.boost[this.currentPlayer] = 0; // Уменьшаем буст
            }

            // Удаляем фишку, если она перевернулась
            if (random <= probability) {
                this.array.splice(index, 1);
                index--; // Корректируем индекс
            }
        }
        this.boost[this.currentPlayer] = 0;
        this.moves++;
        this.currentPlayer = this.currentPlayer === 0 ? 1 : 0; // Меняем игрока

        // Проверяем, остались ли фишки
        if (this.array.length > 0) {
            this.start(); // Продолжаем игру
        } else {
            this.gameOver(); // Конец игры
        }
    }

    gameOver() {
        console.log('Игра окончена!');
        console.log('Счет игроков:', this.playerScore);
        console.log('Количество ходов:', this.moves);
    }
}

// Запуск игры
const game = new Game();
game.start();