import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { User, Package, Heart, Settings, LogOut, ShoppingBag } from 'lucide-react';

export const AccountPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const mockUser = localStorage.getItem('mockUser');
    if (!mockUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(mockUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('mockUser');
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!user) return null;

  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2025-12-01',
      total: 45.99,
      status: 'Delivered',
      items: 3
    },
    {
      id: 'ORD-002',
      date: '2025-11-25',
      total: 78.50,
      status: 'Delivered',
      items: 5
    },
    {
      id: 'ORD-003',
      date: '2025-11-15',
      total: 32.99,
      status: 'Delivered',
      items: 2
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-600 to-red-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">My Account</h1>
          <p className="text-lg opacity-90">Welcome back, {user.name}!</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-red-600 flex items-center justify-center text-white text-3xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="orders">
              <TabsList className="mb-8">
                <TabsTrigger value="orders" className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Orders</span>
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Favorites</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Order History</h2>
                    {mockOrders.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
                        <Button onClick={() => navigate('/shop')} className="bg-amber-600 hover:bg-amber-700">
                          Start Shopping
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {mockOrders.map((order) => (
                          <Card key={order.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="mb-4 md:mb-0">
                                  <div className="flex items-center space-x-4 mb-2">
                                    <h3 className="font-bold text-lg">{order.id}</h3>
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                      {order.status}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">Placed on {order.date}</p>
                                  <p className="text-sm text-gray-600">{order.items} items</p>
                                </div>
                                <div className="flex flex-col md:items-end space-y-2">
                                  <div className="text-2xl font-bold text-amber-600">${order.total.toFixed(2)}</div>
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Favorite Products</h2>
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-600 mb-4">You haven't added any favorites yet</p>
                      <Button onClick={() => navigate('/shop')} className="bg-amber-600 hover:bg-amber-700">
                        Browse Products
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Full Name</label>
                        <input
                          type="text"
                          value={user.name}
                          className="w-full px-4 py-2 border rounded-lg"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                          type="email"
                          value={user.email}
                          className="w-full px-4 py-2 border rounded-lg"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Phone</label>
                        <input
                          type="tel"
                          placeholder="Add phone number"
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Delivery Address</label>
                        <textarea
                          placeholder="Add your delivery address"
                          className="w-full px-4 py-2 border rounded-lg"
                          rows="3"
                        ></textarea>
                      </div>
                      <Button className="bg-amber-600 hover:bg-amber-700">
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">Email Notifications</h3>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">Order updates</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">New recipes and blog posts</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">Promotions and deals</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Password</h3>
                        <Button variant="outline">Change Password</Button>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3 text-red-600">Danger Zone</h3>
                        <Button variant="outline" className="text-red-600 hover:bg-red-50">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};