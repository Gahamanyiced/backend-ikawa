import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from './src/database/models/Article.js';
import Event from './src/database/models/Event.js';
import { connectDB } from './src/database/config/db.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config({ path: './src/database/config/config.env' });
connectDB()
  .then(() => console.log('connected'))
  .catch((e) => console.log(e));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const articles = JSON.parse(
  fs.readFileSync(`${__dirname}/src/_data/articles.json`, 'utf-8')
);
const events = JSON.parse(
  fs.readFileSync(`${__dirname}/src/_data/events.json`, 'utf-8')
);
//Import into DB
const importData = async () => {
  try {
    await Article.create(articles);
    await Event.create(events);
  } catch (error) {
    console.log(error);
  }
};
//Delete data
const deleteData = async () => {
  try {
    await Article.deleteMany();
    await Event.deleteMany();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
// const articles = [
//   new Article({
//     title: 'Elearn',
//     author: 'Eric Ganza',
//     content: 'Articles of Coffee',
//   }),
//   new Article({
//     title: 'Rwanda',
//     author: 'Ally soundy',
//     content: 'Articles of Rwanda',
//   }),
//   new Article({
//     title: 'Park',
//     author: 'zizou Gakwaya',
//     content: 'Articles of Park',
//   }),
// ];
// let done = 0;
// export const seedData = async () => {
//   try {
//     await Article.deleteMany({});
//     for (let article of articles) {
//       article.save(function (err, result) {
//         done++;
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
