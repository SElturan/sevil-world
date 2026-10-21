// Все тексты и порядок сцен здесь. Меняйте слова, остальное трогать не нужно.
const CONTENT = {
  name: "Севиль",
  grade: "3 класс",
  school: "Баластан",
  title: "Мой большой мир",
  hello: "Салам! Меня зовут Севиль. Сегодня я расскажу вам о самом дорогом в моей жизни.",
  tap: "Коснись, чтобы начать",
  finaleText: "Мой мир начинается с Родины, согревается любовью семьи и становится больше благодаря знаниям!",
  voiceVersion: 1, // увеличьте число, когда замените голосовые файлы
  // песни играют тихим фоном; в начале и в финале играет встроенная мелодия
  songs: { land: "music/land.m4a", family: "music/family.m4a", school: "music/school.mp3" },
  music: {
    home: { root: 62, wave: "triangle", bpm: 100, bass: [0, 7, 5, 7], drum: false,
      melody: [0,4,7,9, 7,4,7,null, 5,9,12,9, 7,null,4,null, 0,4,7,12, 11,9,7,null, 5,7,9,7, 4,2,0,null] },
  },
  // Родные для сцены «Семья». Имена можно дописать: name: "Айгуль".
  people: [
    { role: "Дедушка", name: "" }, { role: "Бабушка", name: "" },
    { role: "Брат", name: "" }, { role: "Сестра", name: "" },
    { role: "Папа", name: "" }, { role: "Мама", name: "" },
  ],
  // Сцены по порядку. Если рядом лежит голос voice/<id>.mp3, он зазвучит сам.
  // img — картинка из папки img/ (если файла нет, рисуется встроенная сцена).
  scenes: [
    { id: "land1", area: "🇰🇬 Родина", text: "Моя Родина — Кыргызстан", img: "img/land.jpg", from: [0, 1.0], to: [-14, 1.18], origin: "20% 40%", music: "land", fx: "dust", dur: 7 },
    { id: "land2", area: "🇰🇬 Родина", text: "Высокие горы и чистые озёра", img: "img/land.jpg", from: [-28, 1.08], to: [-64, 1.14], origin: "60% 50%", music: "land", fx: "dust", dur: 7 },
    { id: "land3", area: "🇰🇬 Родина", text: "Юрта — дом кыргызов", img: "img/yurt.jpg", from: [-4, 1.05], to: [-62, 1.05], origin: "50% 50%", music: "land", fx: "dust", dur: 7 },
    { id: "land4", area: "🇰🇬 Родина", text: "Красный флаг с солнцем и тундуком", img: "img/land.jpg", from: [-2, 1.5], to: [-6, 1.9], origin: "20% 35%", music: "land", fx: "sparks", dur: 6 },
    { id: "family1", area: "❤️ Семья", text: "Моя семья — моё счастье", scene: "family", music: "family", fx: "hearts", dur: 7 },
    { id: "family2", area: "❤️ Семья", text: "Папа, мама, бабушка, дедушка, брат и сестра", scene: "family", names: true, music: "family", fx: "hearts", dur: 8 },
    { id: "school1", area: "📚 Школа", text: "Моя школа «Баластан»", scene: "school", music: "school", fx: "dust", dur: 7 },
    { id: "school2", area: "📚 Школа", text: "Здесь я учусь, дружу и узнаю новое", scene: "school", bus: true, letters: true, music: "school", fx: "sparks", dur: 8 },
  ],
};
