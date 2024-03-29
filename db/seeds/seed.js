const format = require('pg-format');
const db = require('../connection');
const {
    convertTimestampToDate,
    createRef,
    formatComments,
  } = require('./utils');
  
  const seed = ({ topicData, userData, articleData, commentData, habitData, frequencyData }) => {
    return db
      .query(`DROP TABLE IF EXISTS comments;`)
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS articles;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS habits;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS topics;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS frequency;`);
      })
      
      .then(() => {
        const topicsTablePromise = db.query(`
        CREATE TABLE topics (
          slug VARCHAR PRIMARY KEY,
          description VARCHAR
        );`);
        const frequencyTablePromise = db.query(`
        CREATE TABLE frequency (
          name VARCHAR PRIMARY KEY,
          description VARCHAR
        );`);
        
  
        const usersTablePromise = db.query(`
        CREATE TABLE users (
          username VARCHAR PRIMARY KEY,
          name VARCHAR NOT NULL,
          avatar_url VARCHAR
        );`);

  
        return Promise.all([topicsTablePromise, frequencyTablePromise,usersTablePromise]);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          topic VARCHAR NOT NULL REFERENCES topics(slug),
          author VARCHAR NOT NULL REFERENCES users(username),
          body VARCHAR NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          votes INT DEFAULT 0 NOT NULL,
          article_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
        );`);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE habits (
          habit_id SERIAL PRIMARY KEY,
         name VARCHAR NOT NULL,
          frequency VARCHAR NOT NULL REFERENCES frequency(name),
          owner VARCHAR NOT NULL REFERENCES users(username),
          body VARCHAR NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          amount_days INT DEFAULT 0 NOT NULL,
          percentage INT DEFAULT 0 NOT NULL,
         motivational_message VARCHAR NOT NULL
        );`);
      })
      .then(() => {
        return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          body VARCHAR NOT NULL,
          article_id INT REFERENCES articles(article_id) NOT NULL,
          author VARCHAR REFERENCES users(username) NOT NULL,
          votes INT DEFAULT 0 NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );`);
      })
      .then(() => {
        const insertTopicsQueryStr = format(
          'INSERT INTO topics (slug, description) VALUES %L;',
          topicData.map(({ slug, description }) => [slug, description])
        );
        const topicsPromise = db.query(insertTopicsQueryStr);
  
        const insertUsersQueryStr = format(
          'INSERT INTO users ( username, name, avatar_url) VALUES %L;',
          userData.map(({ username, name, avatar_url }) => [
            username,
            name,
            avatar_url,
          ])
        );
        const usersPromise = db.query(insertUsersQueryStr);
  
        return Promise.all([topicsPromise, usersPromise]);
      })
      .then(()=>{
        const insertFrequencyQueryStr = format(
          'INSERT INTO frequency (name, description) VALUES %L;',
        frequencyData.map(({ name, description }) => [name, description])
      );
      return db.query(insertFrequencyQueryStr);
        })

      .then(() => {
        const formattedArticleData = articleData.map(convertTimestampToDate);
        const insertArticlesQueryStr = format(
          'INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;',
          formattedArticleData.map(
            ({
              title,
              topic,
              author,
              body,
              created_at,
              votes = 0,
              article_img_url,
            }) => [title, topic, author, body, created_at, votes, article_img_url]
          )
        );
  
        return db.query(insertArticlesQueryStr);
      })
      .then(() => {
        const formattedHabitData = habitData.map(convertTimestampToDate);
        const insertHabitQueryStr = format(
          'INSERT INTO habits (name, frequency, owner, body, created_at, amount_days, percentage, motivational_message) VALUES %L RETURNING *;',
          formattedHabitData.map(
            ({
              name,
            frequency,
              owner,
              body,
              created_at,
              amount_days = 0,
              percentage = 0,
              motivational_message,
            }) => [name, frequency, owner, body, created_at, amount_days, percentage, motivational_message]
          )
        );
  
        return db.query(insertHabitQueryStr);
      })
      .then(({ rows: articleRows }) => {
        const articleIdLookup = createRef(articleRows, 'title', 'article_id');
        const formattedCommentData = formatComments(commentData, articleIdLookup);
  
        const insertCommentsQueryStr = format(
          'INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;',
          formattedCommentData.map(
            ({ body, author, article_id, votes = 0, created_at }) => [
              body,
              author,
              article_id,
              votes,
              created_at,
            ]
          )
        );
        return db.query(insertCommentsQueryStr);
      });
  };
  
  module.exports = seed;