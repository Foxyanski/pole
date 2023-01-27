//заданное слово
let word = "Ананас";
//приводим к нижнему регистру для корреткности поиска
word = word.toLowerCase();
//инит скрытого слова
let hiddenWord = '';

//делаем слово секретным
const wordCipher = (word) => {
    let i = 1;
    while (i!== (word.toString().length + 1)) {
        hiddenWord += i;
        i++;
    }
}
wordCipher(word);

//ввод буквы
let letter = 'а';
//поиск первого экземпляра
let pos = word.indexOf(letter);

const letterSearcher = (pos, letter) => {
    while (pos>=0) {
        //лог самой буквы
        console.log('Буква найдена: ' + word[pos] + '  Index: ' + pos);

        //Заменяем в скрытом слове звездочку на букву
        hiddenWord = hiddenWord.replace(hiddenWord[pos], letter);

        //удаляем букву из открытого слова
        word = word.replace(letter, 'q');

        //снова ищем букву
        pos = word.indexOf(letter);


    }
}
if (pos >= 0) {
    letterSearcher(pos,letter);
} else {
    console.log('Такой буквы нет, увы.')
}


console.log(hiddenWord);
