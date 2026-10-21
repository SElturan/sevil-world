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
  // Разделы книги: картинка на главной странице, медаль и рассказ из сцен.
  sections: {
    family: { title: "Семья", icon: "❤️", medal: { name: "Доброе сердце", icon: "💖", c1: "#ff8fa3", c2: "#ff4d6d" } },
    school: { title: "Школа", icon: "📚", medal: { name: "Юный исследователь", icon: "🔭", c1: "#4cc9f0", c2: "#3a86ff" } },
    land:   { title: "Родина", icon: "🇰🇬", medal: { name: "Патриот", icon: "🇰🇬", c1: "#ff6b6b", c2: "#e8112d" } },
  },
  // Сцены рассказов. Если рядом лежит голос voice/<id>.mp3, он зазвучит сам.
  scenes: [
    { id: "land1", sec: "land", area: "🇰🇬 Родина", text: "Моя Родина — Кыргызстан", pano: true, from: [0, 1.0], to: [-12, 1.12], origin: "15% 70%", music: "land", fx: "dust", dur: 7 },
    { id: "land2", sec: "land", area: "🇰🇬 Родина", text: "Высокие горы и чистые озёра", pano: true, from: [-26, 1.05], to: [-54, 1.12], origin: "50% 60%", music: "land", fx: "dust", dur: 7 },
    { id: "land3", sec: "land", area: "🇰🇬 Родина", text: "Юрта — дом кыргызов", pano: true, from: [-48, 1.15], to: [-62, 1.4], origin: "78% 80%", music: "land", fx: "dust", dur: 7 },
    { id: "land4", sec: "land", area: "🇰🇬 Родина", text: "Красный флаг с солнцем и тундуком", pano: true, from: [-2, 1.5], to: [-6, 1.9], origin: "17% 72%", music: "land", fx: "sparks", dur: 6 },
    { id: "family1", sec: "family", area: "❤️ Семья", text: "Моя семья — моё счастье", scene: "familyTree", music: "family", fx: "hearts", dur: 7 },
    { id: "family2", sec: "family", area: "❤️ Семья", text: "Папа, мама, бабушка, дедушка, брат и сестра", scene: "family", names: true, music: "family", fx: "hearts", dur: 8 },
    { id: "school1", sec: "school", area: "📚 Школа", text: "Моя школа «Баластан»", scene: "school", music: "school", fx: "dust", dur: 7 },
    { id: "school2", sec: "school", area: "📚 Школа", text: "Здесь я учусь, дружу и узнаю новое", scene: "school", bus: true, letters: true, music: "school", fx: "sparks", dur: 8 },
  ],
};
