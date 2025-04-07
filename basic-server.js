const http = require('http');
const url = require('url');

// Sample data
const pets = [
  {
    id: 1,
    name: 'Max',
    breed: 'Golden Retriever',
    age: '3 years',
    gender: 'Male',
    description: 'Friendly and energetic dog who loves to play fetch.',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'dog',
    size: 'Large',
    adoptionStatus: 'Available'
  },
  {
    id: 2,
    name: 'Luna',
    breed: 'Siamese',
    age: '2 years',
    gender: 'Female',
    description: 'Sweet and gentle cat who loves to cuddle.',
    image: 'https://images.unsplash.com/photo-1501820488136-72669149e0d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'cat',
    size: 'Medium',
    adoptionStatus: 'Available'
  },
  {
    id: 3,
    name: 'Rocky',
    breed: 'German Shepherd',
    age: '5 years',
    gender: 'Male',
    description: 'Loyal and protective dog, good with families.',
    image: 'https://images.unsplash.com/photo-1554692918-08fa0fdc9db3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'dog',
    size: 'Large',
    adoptionStatus: 'Available'
  }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  // Set headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  console.log('Request path:', path);
  
  // Handle routes
  if (path === '/' || path === '/api/health') {
    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      status: 'OK',
      message: 'Server is running!',
      timestamp: new Date()
    }));
  } 
  else if (path === '/api/pets') {
    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      count: pets.length,
      data: pets
    }));
  }
  else if (path.match(/\/api\/pets\/\d+/)) {
    const id = parseInt(path.split('/')[3]);
    const pet = pets.find(p => p.id === id);
    
    if (pet) {
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        data: pet
      }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({
        success: false,
        error: 'Pet not found'
      }));
    }
  }
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({
      success: false,
      error: 'Route not found'
    }));
  }
});

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`Basic server running at http://localhost:${PORT}/`);
}); 