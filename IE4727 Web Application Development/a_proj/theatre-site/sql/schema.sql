-- This script recreates the theatre database with fresh sample data.
DROP DATABASE IF EXISTS theatre;
CREATE DATABASE ie4727_project;
USE theatre;

CREATE TABLE shows (
  id VARCHAR(80) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  runtime VARCHAR(200) NOT NULL,
  venue VARCHAR(200) NOT NULL
);

CREATE TABLE performances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  show_id VARCHAR(80) NOT NULL,
  performance_date DATE NOT NULL,
  performance_time TIME NOT NULL,
  UNIQUE KEY show_performance (show_id, performance_date, performance_time),
  FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE
);

CREATE TABLE artwork (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  image_type VARCHAR(20) NOT NULL,
  show_id VARCHAR(80),
  UNIQUE KEY title_type (title, image_type),
  FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE
);

CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(254) NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO shows (id, title, genre, tagline, description, runtime, venue) VALUES
('moulin-rouge', 'Moulin Rouge', 'Musical', 'A bold story of music, love and life on the stage.', 'Step into a world of music, romance and spectacle. This vibrant production celebrates the power of art and the people who make a stage feel alive.', '160 minutes, including a 20-minute intermission.', 'Sands Theatre, Singapore'),
('glass-room', 'Hamilton', 'Musical', 'A story of ambition and legacy, brought to life on stage.', 'A musical theatre production featuring a dynamic score and a story of ambition, history and legacy.', '165 minutes, including intermission.', 'Sands Theatre, Singapore'),
('after-the-rain', 'Hadestown', 'Musical', 'A myth retold through music and theatre.', 'A musical theatre production inspired by Greek mythology and told through live performance.', '150 minutes, including intermission.', 'Sands Theatre, Singapore'),
('last-encore', 'Six', 'Musical', 'Six queens take the stage.', 'A concert-style musical bringing six queens together through music and performance.', '80 minutes, no intermission.', 'Sands Theatre, Singapore'),
('les-miserables', 'Les Miserables', 'Musical', 'A story of hope, justice and love.', 'A musical drama about people searching for hope and a better future.', '180 minutes, including intermission.', 'Sands Theatre, Singapore'),
('pagliacci', 'Pagliacci', 'Opera', 'A travelling theatre troupe brings a story to the stage.', 'An opera about performers whose lives and stage roles become difficult to separate.', '100 minutes, including intermission.', 'Sands Theatre, Singapore'),
('idol-of-my-dreams', 'Idol of My Dreams', 'Musical', 'A new musical about ambition and finding your voice.', 'A music-filled story about following a dream and deciding what success means.', '120 minutes, including intermission.', 'Sands Theatre, Singapore'),
('gatekeepers-lament', 'The Gatekeeper''s Lament', 'Play', 'A mysterious tale about choices and their consequences.', 'A theatrical story about a gatekeeper who must decide who can pass and what each choice will cost.', '110 minutes, including intermission.', 'Sands Theatre, Singapore'),
('beetlejuice', 'Beetlejuice', 'Musical', 'A strange and funny story from the other side.', 'A comic musical adventure filled with unusual characters and supernatural surprises.', '150 minutes, including intermission.', 'Sands Theatre, Singapore'),
('romeo-and-juliet', 'Romeo and Juliet', 'Play', 'A classic story of love and family conflict.', 'Two young people fall in love while their families remain divided.', '135 minutes, including intermission.', 'Sands Theatre, Singapore');

INSERT INTO performances (show_id, performance_date, performance_time) VALUES
('moulin-rouge', '2026-11-03', '19:30:00'),
('moulin-rouge', '2026-11-08', '14:30:00'),
('moulin-rouge', '2026-11-08', '19:30:00'),
('moulin-rouge', '2026-11-25', '19:30:00'),

('glass-room', '2026-11-04', '19:30:00'),
('glass-room', '2026-11-15', '14:30:00'),
('glass-room', '2026-12-01', '19:30:00'),

('after-the-rain', '2026-11-06', '19:30:00'),
('after-the-rain', '2026-11-12', '19:30:00'),
('after-the-rain', '2026-11-29', '14:30:00'),

('last-encore', '2026-11-07', '19:30:00'),
('last-encore', '2026-11-17', '19:30:00'),
('last-encore', '2026-12-03', '14:30:00'),

('les-miserables', '2026-11-09', '19:30:00'),
('les-miserables', '2026-11-20', '19:30:00'),

('pagliacci', '2026-11-10', '19:30:00'),
('pagliacci', '2026-11-22', '14:30:00'),

('idol-of-my-dreams', '2026-11-11', '19:30:00'),
('idol-of-my-dreams', '2026-11-26', '19:30:00'),

('gatekeepers-lament', '2026-11-13', '19:30:00'),
('gatekeepers-lament', '2026-12-06', '14:30:00'),

('beetlejuice', '2026-11-14', '19:30:00'),
('beetlejuice', '2026-12-08', '19:30:00'),

('romeo-and-juliet', '2026-11-16', '19:30:00'),
('romeo-and-juliet', '2026-12-10', '19:30:00');

INSERT INTO artwork (title, image_path, image_type, show_id) VALUES
('Moulin Rouge', '/images/posters/moulin-rouge.jpg', 'poster', 'moulin-rouge'),
('Hamilton', '/images/posters/hamilton.jpg', 'poster', 'glass-room'),
('Hadestown', '/images/posters/hadestown.jpg', 'poster', 'after-the-rain'),
('Six', '/images/posters/six.jpg', 'poster', 'last-encore'),
('Les Miserables', '/images/posters/les-miserables.jpg', 'poster', 'les-miserables'),
('Pagliacci', '/images/posters/pagliacci.jpg', 'poster', 'pagliacci'),
('Idol of My Dreams', '/images/posters/idol-of-my-dreams.jpg', 'poster', 'idol-of-my-dreams'),
('The Gatekeeper''s Lament', '/images/posters/the-gatekeepers-lament.jpg', 'poster', 'gatekeepers-lament'),
('Beetlejuice', '/images/posters/beetlejuice.jpg', 'poster', 'beetlejuice'),
('Romeo and Juliet', '/images/posters/romeo-and-juliet.jpg', 'poster', 'romeo-and-juliet'),
('Hamilton', '/images/banners/hamilton.jpg', 'banner', NULL),
('Hadestown', '/images/banners/hadestown.jpg', 'banner', NULL),
('The Greatest Showman', '/images/banners/greatest-showman.jpg', 'banner', NULL);

