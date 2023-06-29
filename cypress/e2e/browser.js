const results = await fetch(
  `https://redbubble-trends.onrender.com/results?date=${getDate(Date.now())}`
);
