const firstBotMove = document.getElementById('first_bot_move');

//------------------------ПОЛУЧЕНИЕ СЛОВ--------------------------

//Листенер для получения слов
window.addEventListener('DOMContentLoaded', (e) => getWords());

//Функция получения слов
const getWords = () => {
    //Запращиваем данные
    fetch('words.json')
        //получаем данные
        .then(res => res.json())
        //логгируем данные
        .then(data => {
            // console.log(data);
            //получаем случайное слово из массива
            const word = data[Math.floor(Math.random()*data.length)];
            console.log(word.category);
            //вводим данные в страницу
            const theme = localStorage.getItem('category');
            document.getElementById('theme').innerHTML = `<h3>${theme}</h3>`;
            // document.getElementById('word').innerHTML = `<h3>${word.body}</h3>`;
            localStorage.setItem('word', `${word.body}`);
            localStorage.setItem('category', `${word.category}`);
        })
        //логгируем ошибку (если она будет)
        .catch(err => console.log(err));
}

//------------------------ШИФРОВКА--------------------------

//получаем слово из локальной памяти
let word = localStorage.getItem('word');
console.log(word);
//приводим к нижнему регистру для корреткности поиска
word = word.toLowerCase();

//инит скрытого слова
let hiddenWord = ''
//шифровка
const wordCipher = (word) => {
    let i = 1;
    while (i!== (word.toString().length + 1)) {
        hiddenWord += i;
        i++;
    }
}
//вызов шифровки
wordCipher(word);
// console.log(hiddenWord);
//отправляем шифровку на ui
document.getElementById('word').innerHTML = `<h3>${hiddenWord}</h3>`;

//------------------------Ход человека--------------------------
let letterCheck = (e) => {
    //получаем букву из ui
    let letter = document.getElementById('letter-input').value;
    // console.log(letter);

    let pos = word.indexOf(letter.toString());
    // console.log(pos);

    const letterSearcher = (pos, letter) => {
        while (pos>=0) {
            //лог самой буквы
            // console.log('Буква найдена: ' + word[pos] + '  Index: ' + pos);

            //Заменяем в скрытом слове звездочку на букву
            hiddenWord = hiddenWord.replace(hiddenWord[pos], letter);

            //удаляем букву из открытого слова
            word = word.replace(letter, 'q');

            //снова ищем букву
            pos = word.indexOf(letter);

            document.getElementById('word').innerHTML = `<h3>${hiddenWord}</h3>`;

        }
    }

    if (pos >= 0) {
        letterSearcher(pos,letter.toString());
        document.getElementById('letter-input').value = '';
        // botHandler();

    } else {
        alert('Такой буквы нет, увы.');
        document.getElementById('bot_move').style.display = 'inline';
        document.getElementById('letterCheck').style.display = 'none';
        document.getElementById('letter-input').style.display = 'none';
    }


    console.log(hiddenWord);

    e.preventDefault();
}
//листенер для поиска буквы
document.getElementById('letterCheck').addEventListener('click', letterCheck);


//------------------------БАРАБАН--------------------------
//Листенер для барабана
const drum = document.getElementById('drum-img');
const spinButton = document.getElementById('spin');
spinButton.addEventListener('click', rotateDrum);

//Вращаем барабан
function rotateDrum(e) {
    drum.style.transform = 'rotate('+Math.random()*1000+'deg)';
}

//------------------------Боты--------------------------
const botHandler = () => {
    const waitHandler = (bot1, bot2) => {
        const botMove = (bot) => {
            //Запращиваем данные
            fetch('bot_letters.json')
                //получаем данные
                .then(response => response.json())
                //логгируем данные
                .then(data => {
                    console.log(bot + ' data fetch is success');
                    //получаем случайное слово из массива
                    const botLetter = data[Math.floor(Math.random()*data.length)];
                    console.log(bot + ' letter is ' + botLetter.body);
                    document.getElementById(bot).innerText = ` ${botLetter.body}`;

                    let pos = word.indexOf(botLetter.body.toString());
                })
                //логгируем ошибку (если она будет)
                .catch(err => console.log(err));
        }

        const botCheck = (bot) => {
            let letter = document.getElementById(bot).innerText;
            let pos = word.indexOf(letter.toString());
            // console.log(pos);

            const letterSearcher = (pos, letter) => {
                while (pos>=0) {
                    //Заменяем в скрытом слове звездочку на букву
                    hiddenWord = hiddenWord.replace(hiddenWord[pos], letter);

                    //удаляем букву из открытого слова
                    word = word.replace(letter, 'q');

                    //снова ищем букву
                    pos = word.indexOf(letter);

                    document.getElementById('word').innerHTML = `<h3>${hiddenWord}</h3>`;

                }
            }

            if (pos >= 0) {
                letterSearcher(pos,letter.toString());
                alert(`Bot ${bot} ответил верно, буква "${letter}" открыта. Ему предоставлен повторный ход.`);
                botMove(bot);
                botCheck(bot);
                // botHandler();

            } else {
                alert(`Bot ${bot} ответил неверно.`);
                if (bot === 'first_bot') {
                    botMove(bot2);
                    botCheck(bot2);
                }
            }
        }
        botMove(bot1);
        botCheck(bot1);

    }
    waitHandler('first_bot', 'second_bot')
    // botLetters('second_bot');
}
// botHandler();
document.getElementById('bot_move').addEventListener('click', botHandler);

// class User {
//
//     constructor(name) {
//         this.name = name;
//     }
//
//     sayHi() {
//         alert(this.name);
//     }
//
// }
//
// // Использование:
// let user = new User("Иван");
// user.sayHi();