const playerMove =  document.getElementById('letterCheck');
const giveMove = document.getElementById('bot_move');
const playerPoints = document.getElementById('player_points');
let isAnswerTrue;
let points;
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
            //получаем случайное слово из массива
            const word = data[Math.floor(Math.random()*data.length)];
            //вводим данные в страницу
            const theme = localStorage.getItem('category');
            document.getElementById('theme').innerHTML = `<h3>${theme}</h3>`;
            // document.getElementById('word').innerHTML = `<h3>${word.body}</h3>`;
            localStorage.setItem('word', `${word.body}`);
            localStorage.setItem('category', `${word.category}`);
        })
        //логгируем ошибку (если она будет)
        .catch(err => console.log(err));
    alert('Добро пожаловать в игру! Пожалуйста, вращайте барабан и пишите букву.')
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
document.getElementById('word').innerHTML = `<h3>${hiddenWord}</h3>`;

//------------------------Ход человека--------------------------
let endPoints = 0;
let letterCheck = (e) => {
    //получаем букву из ui
    let letter = document.getElementById('letter-input').value;
    // console.log(letter);

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
        document.getElementById('letter-input').value = '';
        isAnswerTrue = true;
        //забираем из памяти очки
        let points = Number(localStorage.getItem('points'));
        console.log('Points: ' + points); //пашет
        endPoints = endPoints + points;
        document.getElementById('player_points').innerText = endPoints.toString();
        // botHandler();

    } else {
        alert('Такой буквы нет, увы.');
        isAnswerTrue = false;
        giveMove.style.display = 'block';
        playerMove.style.display = 'none';
        document.getElementById('letter-input').style.visibility = 'hidden';
    }


    // console.log(hiddenWord);

    e.preventDefault();
}
//листенер для поиска буквы
playerMove.addEventListener('click', letterCheck);

//------------------------Боты--------------------------
let botPoints1 = 0;
let botPoints2 = 0;
const botHandler = () => {
    const waitHandler = (bot1, bot2) => {
        const botMove = (bot) => {
            //Запрашиваем данные
            fetch('bot_letters.json')
                //получаем данные
                .then(response => response.json())
                .then(data => {
                    console.log(bot + ' data fetch is success');
                    //получаем случайное слово из массива
                    const botLetter = data[Math.floor(Math.random()*data.length)];
                    console.log(bot + ' letter is ' + botLetter.body);
                    document.getElementById(bot).innerText = `${botLetter.body}`;
                })
                //логгируем ошибку (если она будет)
                .catch(err => console.log(err));
        }

        const botCheck = (bot) => {
            let letter = document.getElementById(bot).innerText; //this is null
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

            const botPoints = (bot) => {
                const botOptions = [5, 4, 20, 1, 10, 30, 15, 25, 10, 20, 5, 7, 0, 15, 2, 30, 55, 10];
                const currentOption =  botOptions[Math.floor(Math.random()*botOptions.length)];
                console.log('THIS IS BOT POINTS: '+ currentOption);


                if (bot === 'first_bot') {
                    botPoints1 = botPoints1 + currentOption;
                    console.log('FIRST BOT POINTS: ' + botPoints1);
                    document.getElementById('first_points').innerHTML = `${botPoints1}`;
                } else {
                    botPoints2 = botPoints2 + currentOption;
                    console.log('SECOND BOT POINTS: ' + botPoints2);
                    document.getElementById('second_points').innerHTML = `${botPoints2}`;
                }

            }


            if (pos >= 0) {
                letterSearcher(pos,letter.toString());
                botPoints(bot);
                alert(`Bot ${bot} ответил верно, буква "${letter}" открыта. Ему предоставлен повторный ход.`);
                botMove(bot);
                botCheck(bot);

            } else {
                alert(`Bot ${bot} ответил неверно.`);
                if (bot === 'first_bot') {
                    botMove(bot2);
                    botCheck(bot2);
                } else {
                    giveMove.style.display = 'none';
                    playerMove.style.display = 'block';
                    document.getElementById('letter-input').style.visibility = 'visible';
                    alert('Теперь ваш ход!')
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
giveMove.addEventListener('click', botHandler);

//*****************БАРАБАН**********************БАРАБАН*************************БАРАБАН****************БАРАБАН*********************************************************************************
let options = [5, 4, 20, 0, 10, 30, 15, 25, 10, 20, 5, 7, 0, 15, 2, 30, 55, 10];

let startAngle = 0;
let arc = Math.PI / (options.length / 2);
let spinTimeout = null;

let spinArcStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;

let ctx;

document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
    let nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
    let phase = 0;
    let center = 128;
    let width = 127;
    let frequency = Math.PI*2/maxitem;

    red   = Math.sin(frequency*item+2+phase) * width + center;
    green = Math.sin(frequency*item+0+phase) * width + center;
    blue  = Math.sin(frequency*item+4+phase) * width + center;

    return RGB2Color(red,green,blue);
}

function drawRouletteWheel() {
    let canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        let outsideRadius = 200;
        let textRadius = 160;
        let insideRadius = 125;

        ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,500,500);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;

        ctx.font = 'bold 12px Helvetica, Arial';

        for(let i = 0; i < options.length; i++) {
            let angle = startAngle + i * arc;
            //ctx.fillStyle = colors[i];
            ctx.fillStyle = getColor(i, options.length);

            ctx.beginPath();
            ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
            ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            ctx.save();
            ctx.shadowOffsetX = -1;
            ctx.shadowOffsetY = -1;
            ctx.shadowBlur    = 0;
            // ctx.shadowColor   = "rgb(220,220,220)";
            ctx.fillStyle = "white";
            ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius,
                250 + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            let text = options[i];
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        }

        //Arrow
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
        ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.fill();
    }
}

function spin() {
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;
    rotateWheel();
}

function rotateWheel() {
    spinTime += 30;
    if(spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    let spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    let degrees = startAngle * 180 / Math.PI + 90;
    let arcd = arc * 180 / Math.PI;
    let index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 30px Helvetica, Arial';
    let text = options[index];
    ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
    console.log(text)
    localStorage.setItem('points', text);
    ctx.restore();
}

function easeOut(t, b, c, d) {
    let ts = (t/=d)*t;
    let tc = ts*t;
    return b+c*(tc + -3*ts + 3*t);
}

drawRouletteWheel();