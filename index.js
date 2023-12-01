const fs = require('fs');
const process = require('process');
const axios = require('axios');

const JOKES_API_URL = 'https://icanhazdadjoke.com/search';

const fetchJokes = async (searchTerm) => {
  try {
    const response = await axios.get(`${JOKES_API_URL}?term=${encodeURIComponent(searchTerm)}`, {
      headers: { 'Accept': 'application/json' }
    });
    return response.data.results;
  } catch (error) {
    throw error;
  }
};

//for display the random joke 

const displayRandomJoke = (jokes) => {
  if (jokes.length > 0) {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)].joke;
    console.log('\n🎉 Here is your joke:');
    console.log(randomJoke);
    console.log('\n😄 Hope that brought a smile to your face!');
    return randomJoke;
  } else {
    console.log('\n😢 No jokes found! The joke gods must be taking a day off.');
    return null;
  }
};

//save joke to the file

const saveJokeToFile = (joke) => {
  if (joke) {
    fs.appendFile('jokes.txt', `\n${joke}\n`, (err) => {
      if (err) {
        console.error('Error saving joke to file:', err);
      } else {
        console.log('📝 Joke saved to jokes.txt for future laughs!');
      }
    });
  }
};

//display leaderboard

const displayLeaderboard = () => {
  fs.readFile('jokes.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading jokes file:', err);
    } else {
      const jokesArray = data.split('\n').filter(joke => joke.trim() !== '');
      if (jokesArray.length > 0) {
        const mostPopularJoke = getMostPopularJoke(jokesArray);
        console.log('\n🏆 And the award for the most popular joke goes to:');
        console.log(mostPopularJoke);
        console.log('\n🎊 Congratulations, you have an excellent taste in jokes!');
      } else {
        console.log('\n😕 No jokes found in the leaderboard. Start saving some jokes first!');
      }
    }
  });
};

// get popular joke
const getMostPopularJoke = (jokesArray) => {
  const jokeCounts = {};
  jokesArray.forEach(joke => {
    jokeCounts[joke] = (jokeCounts[joke] || 0) + 1;
  });

  const sortedJokes = Object.keys(jokeCounts).sort((a, b) => jokeCounts[b] - jokeCounts[a]);
  return sortedJokes[0];
};

const main = async () => {
  const command = process.argv[2];
  const searchTerm = process.argv[2];

  if (command === 'leaderboard') {
    displayLeaderboard();
  } else if (searchTerm) {
    try {
      const jokes = await fetchJokes(searchTerm);
      const selectedJoke = displayRandomJoke(jokes);
      saveJokeToFile(selectedJoke);
    } catch (error) {
      console.error('Error fetching jokes:', error);
    }
  } else {
    console.log('Usage:');
    console.log('To search for jokes: node index.js <searchTerm>');
    console.log('To view the leaderboard: node index.js leaderboard');
  }
};

main();
