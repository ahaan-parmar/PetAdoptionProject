import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PawPrint, Menu, X, Search, Filter, Heart, Dog, Cat, ChevronRight, Facebook, Twitter, Instagram, Mail, Phone, Rabbit, Bird, ChevronLeft } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Data arrays
const stats = [
  { label: 'Pets Adopted', value: '10,000+' },
  { label: 'Shelters', value: '500+' },
  { label: 'Available Pets', value: '5,000+' }
];

const tabs = [
  { id: 'featured', label: 'Featured Pets', icon: <PawPrint className="w-5 h-5" /> },
  { id: 'dogs', label: 'Dogs', icon: <Dog className="w-5 h-5" /> },
  { id: 'cats', label: 'Cats', icon: <Cat className="w-5 h-5" /> },
  { id: 'other', label: 'Other Animals', icon: <Rabbit className="w-5 h-5" /> }
];

const pets = [
  {
    id: 1,
    name: 'Max',
    breed: 'Golden Retriever',
    age: '2 years',
    gender: 'Male',
    description: 'Max is a friendly and energetic dog who loves to play fetch and go on long walks.',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    name: 'Luna',
    breed: 'Siamese',
    age: '1 year',
    gender: 'Female',
    description: 'Luna is a gentle and curious cat who enjoys lounging in sunny spots and playing with toy mice.',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 3,
    name: 'Rocky',
    breed: 'German Shepherd',
    age: '3 years',
    gender: 'Male',
    description: 'Rocky is a loyal and intelligent dog who is great with kids and loves to learn new tricks.',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 4,
    name: 'Bella',
    breed: 'Labrador Retriever',
    age: '4 years',
    gender: 'Female',
    description: 'Bella is a sweet and gentle dog who loves cuddles and playing in water.',
    image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 5,
    name: 'Oliver',
    breed: 'Tabby',
    age: '2 years',
    gender: 'Male',
    description: 'Oliver is an independent cat who enjoys climbing and exploring new spaces.',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 6,
    name: 'Charlie',
    breed: 'Beagle',
    age: '1 year',
    gender: 'Male',
    description: 'Charlie is a playful and curious puppy who loves to sniff and explore.',
    image: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  }
];

const featured = [
  {
    id: 1,
    title: 'Max Found His Forever Home',
    description: 'After 6 months in the shelter, Max was adopted by the Johnson family and is now living his best life in a loving home.',
    image: 'https://images.unsplash.com/photo-1544013582-38d1ca95ccae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    date: 'May 12, 2023'
  },
  {
    id: 2,
    title: 'Luna Transforms from Shy to Confident',
    description: 'Luna was scared and shy when she first arrived at the shelter. After weeks of care, she blossomed and found a loving family.',
    image: 'https://images.unsplash.com/photo-1608096275202-85fd2fc2e4d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    author: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    date: 'June 3, 2023'
  }
];

const PetCard = ({ pet }) => (
  <div className="relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md animate-fadeIn border border-gray-100">
    <div className="relative">
      <img 
        src={pet.image} 
        alt={pet.name}
        className="w-full h-52 object-cover"
      />
      <button className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200">
        <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors duration-200" />
      </button>
    </div>
    <div className="p-4 text-center">
      <h3 className="text-xl font-semibold text-gray-900">{pet.name}</h3>
    </div>
  </div>
);

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('featured');

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <PawPrint className="h-8 w-8 text-white" />
              <span className="ml-2 text-2xl font-bold">
                Pawesome
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">ADOPT OR GET INVOLVED</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">DOGS & PUPPIES</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">CATS & KITTENS</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">OTHER TYPES OF PETS</a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-purple-600 transition-colors duration-200"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-purple-900/90" />
        <img 
          src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Pets" 
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find your new best friend
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Browse pets from our network of over 14,500 shelters and rescues.
              </p>
              
              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
                <input 
                  type="text" 
                  placeholder="Search Terrier, Kitten, etc." 
                  className="px-4 py-3 rounded-md flex-1 text-gray-800"
                />
                <input 
                  type="text" 
                  placeholder="Enter City, State, or ZIP" 
                  className="px-4 py-3 rounded-md flex-1 text-gray-800"
                />
                <button className="bg-purple-600 hover:bg-purple-700 p-3 rounded-md">
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pet Categories */}
      <div className="bg-gray-50 pt-6 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="p-4 rounded-full bg-purple-100 mb-3">
                  {React.cloneElement(tab.icon, { className: "w-8 h-8 text-purple-600" })}
                </div>
                <span className="text-lg font-medium text-gray-800">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pets Available Section */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Pets Available for Adoption Nearby</h2>
            <ChevronRight className="w-6 h-6 text-purple-600" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
            <div className="relative bg-purple-700 rounded-lg flex flex-col items-center justify-center p-8 text-white animate-fadeIn h-full">
              <PawPrint className="w-16 h-16 mb-4" />
              <p className="text-lg text-center mb-3">7 more pets available on Petfinder</p>
              <button className="uppercase tracking-wider font-semibold">
                Meet them
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Adoption Articles */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80"
                alt="Dog"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-center -mt-12 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                    alt="Dog" 
                    className="w-16 h-16 rounded-full border-4 border-white object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center">Dog Adoption Articles</h3>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80"
                alt="Cat"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-center -mt-12 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                    alt="Cat" 
                    className="w-16 h-16 rounded-full border-4 border-white object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center">Cat Adoption Articles</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <PawPrint className="h-8 w-8 text-white" />
                <span className="ml-2 text-2xl font-bold">Pawesome</span>
              </div>
              <p className="text-gray-400">
                Making pet adoption easier and more accessible for everyone.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Adopt</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  info@pawesome.com
                </li>
                <li className="flex items-center text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  +1 (555) 123-4567
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; 2024 Pawesome. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300">
            <div className="p-5">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="mt-10 space-y-2">
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-md">ADOPT OR GET INVOLVED</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-md">DOGS & PUPPIES</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-md">CATS & KITTENS</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-md">OTHER TYPES OF PETS</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Profile page (protected)
const ProfilePage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      <p className="text-lg text-gray-600">
        This is a protected route. Only authenticated users can see this page.
      </p>
    </div>
  );
};

// Shelter Dashboard (protected, shelter role required)
const ShelterDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shelter Dashboard</h1>
      <p className="text-lg text-gray-600">
        This is a protected route. Only users with the 'shelter' role can see this page.
      </p>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          
          {/* Protected routes with role requirements */}
          <Route element={<ProtectedRoute requiredRole="shelter" />}>
            <Route path="/shelter/dashboard" element={<ShelterDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App; 