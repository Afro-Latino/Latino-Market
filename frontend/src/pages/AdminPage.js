import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI, recipesAPI, settingsAPI, noticesAPI, blogAPI, announcementsAPI } from '../services/api';
import { mockProducts, mockCategories, mockRecipes, mockTestimonials } from '../mock';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { 
  Package, 
  Grid, 
  BookOpen, 
  MessageSquare, 
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  BarChart,
  DollarSign,
  Calendar,
  CreditCard,
  Megaphone
} from 'lucide-react';

export const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState(mockProducts);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settings = await settingsAPI.get();
      setSiteSettings(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleUpdateSettings = async (updatedSettings) => {
    setSettingsLoading(true);
    try {
      const result = await settingsAPI.update(updatedSettings);
      setSiteSettings(result);
      toast.success('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-600' },
    { label: 'Categories', value: mockCategories.length, icon: Grid, color: 'text-green-600' },
    { label: 'Recipes', value: mockRecipes.length, icon: BookOpen, color: 'text-amber-600' },
    { label: 'Reviews', value: mockTestimonials.length, icon: MessageSquare, color: 'text-red-600' }
  ];

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
              <p className="text-gray-400">Manage your Afro-Latino marketplace</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Logged in as</p>
              <p className="font-semibold">Admin User</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2">
              <Grid className="w-4 h-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="recipes" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Recipes</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                        <stat.icon className={`w-12 h-12 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-semibold">Order #ORD-00{i}</p>
                          <p className="text-sm text-gray-600">Customer {i} • 2 hours ago</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-600">$45.99</p>
                          <p className="text-sm text-green-600">Completed</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Products Management</h2>
                  <Button
                    onClick={() => setShowAddProduct(!showAddProduct)}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Product
                  </Button>
                </div>

                {showAddProduct && (
                  <Card className="mb-6 border-2 border-amber-200">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-4">Add New Product</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Product Name</Label>
                          <Input placeholder="e.g., Nigerian Jollof Rice Mix" />
                        </div>
                        <div>
                          <Label>Price ($)</Label>
                          <Input type="number" placeholder="12.99" />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <select className="w-full px-4 py-2 border rounded-lg">
                            {mockCategories.map(cat => (
                              <option key={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label>Culture</Label>
                          <select className="w-full px-4 py-2 border rounded-lg">
                            <option>African</option>
                            <option>Latino</option>
                            <option>Fusion</option>
                          </select>
                        </div>
                        <div>
                          <Label>Country</Label>
                          <Input placeholder="e.g., Nigeria" />
                        </div>
                        <div>
                          <Label>Region</Label>
                          <Input placeholder="e.g., West Africa" />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Description</Label>
                          <textarea
                            className="w-full px-4 py-2 border rounded-lg"
                            rows="3"
                            placeholder="Product description..."
                          ></textarea>
                        </div>
                        <div className="md:col-span-2">
                          <Label>Image URL</Label>
                          <Input placeholder="https://..." />
                        </div>
                      </div>
                      <div className="flex space-x-3 mt-4">
                        <Button className="bg-green-600 hover:bg-green-700">
                          Save Product
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddProduct(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Image</th>
                        <th className="text-left p-4">Name</th>
                        <th className="text-left p-4">Category</th>
                        <th className="text-left p-4">Price</th>
                        <th className="text-left p-4">Culture</th>
                        <th className="text-left p-4">Stock</th>
                        <th className="text-right p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </td>
                          <td className="p-4 font-semibold">{product.name}</td>
                          <td className="p-4 text-sm text-gray-600">{product.category}</td>
                          <td className="p-4 font-bold text-amber-600">${product.price}</td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                              {product.culture}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                              In Stock
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Categories Management</h2>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Category
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockCategories.map(category => (
                    <Card key={category.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-4xl">{category.icon}</div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <h3 className="font-bold mb-1">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.count} products</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recipes Tab */}
          <TabsContent value="recipes">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Recipes Management</h2>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Recipe
                  </Button>
                </div>
                <div className="space-y-4">
                  {mockRecipes.map(recipe => (
                    <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-lg mb-1">{recipe.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                                <div className="flex space-x-4 text-sm text-gray-600">
                                  <span>⏱️ {recipe.cookTime}</span>
                                  <span>👨‍🍳 {recipe.difficulty}</span>
                                  <span className="px-2 py-1 bg-gray-100 rounded">{recipe.culture}</span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Users Management</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-red-600 flex items-center justify-center text-white font-bold">
                          U{i}
                        </div>
                        <div>
                          <p className="font-semibold">User {i}</p>
                          <p className="text-sm text-gray-600">user{i}@afrolatino.ca</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{5 - i} orders</span>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              {/* General Settings */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Settings className="w-6 h-6 text-amber-600" />
                    <h2 className="text-2xl font-bold">General Settings</h2>
                  </div>
                  {siteSettings && (
                    <div className="space-y-4">
                      <div>
                        <Label>Site Title</Label>
                        <Input 
                          value={siteSettings.site_title}
                          onChange={(e) => setSiteSettings({...siteSettings, site_title: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Contact Email</Label>
                        <Input 
                          type="email"
                          value={siteSettings.contact_email}
                          onChange={(e) => setSiteSettings({...siteSettings, contact_email: e.target.value})}
                        />
                      </div>
                      <Button 
                        onClick={() => handleUpdateSettings({
                          site_title: siteSettings.site_title,
                          contact_email: siteSettings.contact_email
                        })}
                        disabled={settingsLoading}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        {settingsLoading ? 'Saving...' : 'Save General Settings'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Settings */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <h2 className="text-2xl font-bold">Delivery Settings</h2>
                  </div>
                  {siteSettings && (
                    <div className="space-y-4">
                      <div>
                        <Label>Free Delivery Threshold ($)</Label>
                        <Input 
                          type="number" 
                          value={siteSettings.free_delivery_threshold}
                          onChange={(e) => setSiteSettings({...siteSettings, free_delivery_threshold: parseFloat(e.target.value)})}
                        />
                        <p className="text-sm text-gray-600 mt-1">Orders above this amount get free delivery</p>
                      </div>
                      <div>
                        <Label>Delivery Base Fee ($)</Label>
                        <Input 
                          type="number" 
                          value={siteSettings.delivery_base_fee}
                          onChange={(e) => setSiteSettings({...siteSettings, delivery_base_fee: parseFloat(e.target.value)})}
                        />
                        <p className="text-sm text-gray-600 mt-1">Fee for first 5km</p>
                      </div>
                      <div>
                        <Label>Per Kilometer Fee ($)</Label>
                        <Input 
                          type="number" 
                          value={siteSettings.delivery_per_km_fee}
                          onChange={(e) => setSiteSettings({...siteSettings, delivery_per_km_fee: parseFloat(e.target.value)})}
                        />
                        <p className="text-sm text-gray-600 mt-1">Additional fee per km beyond 5km</p>
                      </div>
                      <Button 
                        onClick={() => handleUpdateSettings({
                          free_delivery_threshold: siteSettings.free_delivery_threshold,
                          delivery_base_fee: siteSettings.delivery_base_fee,
                          delivery_per_km_fee: siteSettings.delivery_per_km_fee
                        })}
                        disabled={settingsLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {settingsLoading ? 'Saving...' : 'Save Delivery Settings'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Social Media Links */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Megaphone className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold">Social Media Links</h2>
                  </div>
                  {siteSettings && (
                    <div className="space-y-4">
                      <div>
                        <Label>Facebook URL</Label>
                        <Input 
                          type="url"
                          value={siteSettings.facebook_url || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, facebook_url: e.target.value})}
                          placeholder="https://facebook.com/afrolatino"
                        />
                      </div>
                      <div>
                        <Label>Instagram URL</Label>
                        <Input 
                          type="url"
                          value={siteSettings.instagram_url || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, instagram_url: e.target.value})}
                          placeholder="https://instagram.com/afrolatino"
                        />
                      </div>
                      <div>
                        <Label>Twitter/X URL</Label>
                        <Input 
                          type="url"
                          value={siteSettings.twitter_url || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, twitter_url: e.target.value})}
                          placeholder="https://twitter.com/afrolatino"
                        />
                      </div>
                      <div>
                        <Label>YouTube Channel URL</Label>
                        <Input 
                          type="url"
                          value={siteSettings.youtube_url || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, youtube_url: e.target.value})}
                          placeholder="https://youtube.com/@afrolatino"
                        />
                      </div>
                      <Button 
                        onClick={() => handleUpdateSettings({
                          facebook_url: siteSettings.facebook_url,
                          instagram_url: siteSettings.instagram_url,
                          twitter_url: siteSettings.twitter_url,
                          youtube_url: siteSettings.youtube_url
                        })}
                        disabled={settingsLoading}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {settingsLoading ? 'Saving...' : 'Save Social Media Links'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Credentials */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold">Payment Credentials</h2>
                  </div>
                  {siteSettings && (
                    <div className="space-y-6">
                      {/* Stripe */}
                      <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                        <h3 className="font-bold text-lg mb-4 flex items-center">
                          <span className="mr-2">💳</span> Stripe Configuration
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <Label>Stripe API Key</Label>
                            <Input 
                              type="password"
                              value={siteSettings.stripe_api_key || ''}
                              onChange={(e) => setSiteSettings({...siteSettings, stripe_api_key: e.target.value})}
                              placeholder="sk_live_..."
                            />
                            <p className="text-sm text-gray-600 mt-1">Get this from your Stripe Dashboard</p>
                          </div>
                          <div>
                            <Label>Stripe Webhook Secret (Optional)</Label>
                            <Input 
                              type="password"
                              value={siteSettings.stripe_webhook_secret || ''}
                              onChange={(e) => setSiteSettings({...siteSettings, stripe_webhook_secret: e.target.value})}
                              placeholder="whsec_..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* PayPal */}
                      <div className="p-4 border-2 border-yellow-200 rounded-lg bg-yellow-50">
                        <h3 className="font-bold text-lg mb-4 flex items-center">
                          <span className="mr-2">💰</span> PayPal Configuration
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <Label>PayPal Client ID</Label>
                            <Input 
                              type="password"
                              value={siteSettings.paypal_client_id || ''}
                              onChange={(e) => setSiteSettings({...siteSettings, paypal_client_id: e.target.value})}
                              placeholder="Your PayPal Client ID"
                            />
                          </div>
                          <div>
                            <Label>PayPal Client Secret</Label>
                            <Input 
                              type="password"
                              value={siteSettings.paypal_client_secret || ''}
                              onChange={(e) => setSiteSettings({...siteSettings, paypal_client_secret: e.target.value})}
                              placeholder="Your PayPal Client Secret"
                            />
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleUpdateSettings({
                          stripe_api_key: siteSettings.stripe_api_key,
                          stripe_webhook_secret: siteSettings.stripe_webhook_secret,
                          paypal_client_id: siteSettings.paypal_client_id,
                          paypal_client_secret: siteSettings.paypal_client_secret
                        })}
                        disabled={settingsLoading}
                        className="bg-blue-600 hover:bg-blue-700 w-full"
                      >
                        {settingsLoading ? 'Saving...' : 'Save Payment Credentials'}
                      </Button>
                      
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-900">
                          <strong>🔐 Security Note:</strong> Payment credentials are securely stored in the database and only accessible by administrators.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};