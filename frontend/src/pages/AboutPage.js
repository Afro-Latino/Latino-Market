import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Heart, Users, Globe, Award } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/2843394/pexels-photo-2843394.jpeg"
            alt="Community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-white text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Story</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            More than a store — it's a cultural bridge celebrating flavors, stories, and traditions
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Where Two Worlds Unite</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Afro-Latino was born from a simple observation: the culinary traditions of Africa and Latin America share 
            deep roots, complementary flavors, and a common thread of bringing people together through food. We're not 
            just selling products — we're building a community that celebrates the rich heritage of two continents.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <Heart className="w-12 h-12 mx-auto mb-4 text-red-600" />
              <h3 className="text-xl font-bold mb-3">Authenticity</h3>
              <p className="text-gray-600">
                Every product is carefully sourced from authentic suppliers who preserve traditional methods
              </p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-amber-600" />
              <h3 className="text-xl font-bold mb-3">Community</h3>
              <p className="text-gray-600">
                We support local farmers and suppliers, creating sustainable partnerships across continents
              </p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <Globe className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-bold mb-3">Diversity</h3>
              <p className="text-gray-600">
                Celebrating the incredible diversity of African and Latin American culinary traditions
              </p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <Award className="w-12 h-12 mx-auto mb-4 text-amber-600" />
              <h3 className="text-xl font-bold mb-3">Quality</h3>
              <p className="text-gray-600">
                We guarantee the freshness and quality of every product that reaches your kitchen
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Impact */}
        <div className="bg-gradient-to-r from-amber-600 to-red-600 rounded-2xl p-12 text-white mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-xl">Partner Farmers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">15</div>
              <div className="text-xl">Countries Represented</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">10,000+</div>
              <div className="text-xl">Happy Customers</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Founder & CEO', 'Head of Operations', 'Community Manager'].map((role, idx) => (
              <Card key={idx} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-red-600"></div>
                  <h3 className="text-xl font-bold mb-2">Team Member</h3>
                  <p className="text-amber-600 font-semibold mb-3">{role}</p>
                  <p className="text-gray-600 text-sm">
                    Passionate about bringing authentic flavors to your table
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Be part of a movement that celebrates cultural diversity through food. 
            Start your culinary journey with us today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Link to="/shop">Start Shopping</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};