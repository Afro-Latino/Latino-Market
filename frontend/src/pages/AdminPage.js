import React, { useState, useEffect } from "react";
import {
  productsAPI,
  categoriesAPI,
  usersAPI,
  ordersAPI,
  settingsAPI,
  recipesAPI,
  blogAPI,
  noticesAPI,
  announcementsAPI,
  adminNotificationsAPI,
  authAPI,
  faqsAPI,
  dealsAPI,
  reviewsAPI,
  shippingAPI,
  newsletterAPI,
  adminsAPI,
  themesAPI,
  franchiseAPI,
  bulkImportAPI,
  autoBlogAPI,
  blogAutomationAPI,
  brandingAPI,
  emailAPI,
  customersAPI,
} from "../services/api";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import {
  Package,
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  BarChart,
  DollarSign,
  CreditCard,
  Bell,
  ShoppingCart,
  Eye,
  Ban,
  CheckCircle,
  RefreshCw,
  Search,
  Clock,
  Check,
  LogIn,
  ArrowLeft,
  Mail,
  Lock,
  Grid,
  BookOpen,
  FileText,
  Star,
  HelpCircle,
  Tag,
  Megaphone,
  AlertCircle,
  Truck,
  Newspaper,
  Palette,
  Store,
  Upload,
  UserCog,
  X,
  Save,
  Download,
  Sparkles,
  Crown,
  User,
  Bot,
  Image,
  Zap,
  Send,
} from "lucide-react";

// Admin Login Component
const AdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });
      if (response.user.is_admin) {
        localStorage.setItem("user", JSON.stringify(response.user));
        onLogin(response.user);
        toast.success("Welcome to Admin Dashboard!");
      } else {
        toast.error("Access denied. Admin privileges required.");
      }
    } catch (error) {
      toast.error(formatError(error, "Invalid credentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img
            src="https://customer-assets.emergentagent.com/job_culticommerce/artifacts/x3503la8_afro-latino%20logo.png"
            alt="Afro-Latino"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
        </div>
        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="admin@afrolatino.ca"
                  required
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper to format backend errors
const formatError = (error, defaultMsg) => {
  const detail = error?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail
      .map((err) => {
        const field =
          err.loc && err.loc.length > 0 ? err.loc[err.loc.length - 1] : "Field";
        return `${field}: ${err.msg}`;
      })
      .join(", ");
  }
  if (typeof detail === "object" && detail !== null)
    return JSON.stringify(detail);
  return detail || defaultMsg;
};

export const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  // Data states
  const [data, setData] = useState({
    products: [],
    categories: [],
    orders: [],
    users: [],
    recipes: [],
    blogPosts: [],
    reviews: [],
    faqs: [],
    deals: [],
    notices: [],
    announcements: [],
    subscribers: [],
    shipping: [],
    notifications: [],
    admins: [],
    themes: [],
    franchises: [],
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [siteSettings, setSiteSettings] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [adminTier, setAdminTier] = useState(2);

  // Form states
  const [formData, setFormData] = useState({});

  // Blog generation states
  const [blogGenTopic, setBlogGenTopic] = useState("");
  const [blogGenCategory, setBlogGenCategory] = useState("recipe");
  const [generatedBlog, setGeneratedBlog] = useState(null);

  // Bulk import states
  const [importFile, setImportFile] = useState(null);
  const [importResult, setImportResult] = useState(null);

  // Branding states
  const [branding, setBranding] = useState({ logo_url: "", favicon_url: "" });

  // Blog automation states
  const [blogAutomation, setBlogAutomation] = useState({
    enabled: false,
    post_time: "09:00",
    keywords: "",
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Email states
  const [emailStatus, setEmailStatus] = useState({
    configured: false,
    from_email: "",
    provider: "",
  });
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user.is_admin) {
            setCurrentUser(user);
            setIsAuthenticated(true);
          }
        } catch (e) {
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const fetchAllData = React.useCallback(async () => {
    try {
      const [
        products,
        categories,
        orders,
        users,
        recipes,
        blog,
        settings,
        notifications,
        faqs,
        deals,
        reviews,
        notices,
        announcements,
        subscribers,
        shipping,
        admins,
        themes,
        franchises,
        brandingData,
        blogAutoData,
        emailStatusData,
      ] = await Promise.all([
        productsAPI.getAll({ limit: 200 }).catch(() => ({ products: [] })),
        categoriesAPI.getAll().catch(() => ({ categories: [] })),
        ordersAPI.getAllAdmin().catch(() => ({ orders: [] })),
        usersAPI.getAll().catch(() => ({ users: [] })),
        recipesAPI.getAll().catch(() => ({ recipes: [] })),
        blogAPI.getAll().catch(() => ({ posts: [] })),
        settingsAPI.get().catch(() => ({})),
        adminNotificationsAPI
          .getAll()
          .catch(() => ({ notifications: [], unread_count: 0 })),
        faqsAPI.getAllAdmin().catch(() => ({ faqs: [] })),
        dealsAPI.getAllAdmin().catch(() => ({ deals: [] })),
        reviewsAPI.getAllAdmin().catch(() => ({ reviews: [] })),
        noticesAPI.getAll().catch(() => ({ notices: [] })),
        announcementsAPI.getAll().catch(() => ({ announcements: [] })),
        newsletterAPI.getSubscribers().catch(() => ({ subscribers: [] })),
        shippingAPI.getAll().catch(() => ({ zones: [] })),
        adminsAPI.getAll().catch(() => ({ admins: [] })),
        themesAPI.getAll().catch(() => ({ themes: [] })),
        franchiseAPI.getAll().catch(() => ({ franchises: [] })),
        brandingAPI.get().catch(() => ({ logo_url: "", favicon_url: "" })),
        blogAutomationAPI
          .getSettings()
          .catch(() => ({ enabled: false, post_time: "09:00", keywords: "" })),
        emailAPI
          .getStatus()
          .catch(() => ({ configured: false, from_email: "", provider: "" })),
      ]);

      setData({
        products: products.products || [],
        categories: categories.categories || [],
        orders: orders.orders || [],
        users: users.users || [],
        recipes: recipes.recipes || [],
        blogPosts: blog.posts || [],
        reviews: reviews.reviews || [],
        faqs: faqs.faqs || [],
        deals: deals.deals || [],
        notices: notices.notices || [],
        announcements: announcements.announcements || [],
        subscribers: subscribers.subscribers || [],
        shipping: shipping.zones || [],
        notifications: notifications.notifications || [],
        admins: admins.admins || [],
        themes: themes.themes || [],
        franchises: franchises.franchises || [],
      });
      setUnreadCount(notifications.unread_count || 0);
      setSiteSettings(settings);
      setBranding(brandingData);
      setBlogAutomation(blogAutoData);
      setEmailStatus(emailStatusData);

      // Get current user's admin tier
      const currentUserData = users.users?.find(
        (u) => u.user_id === currentUser?.user_id
      );
      if (currentUserData) {
        setAdminTier(currentUserData.admin_tier || 2);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [currentUser?.user_id]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || getDefaultForm(type));
    setShowModal(true);
  };

  const getDefaultForm = (type) => {
    const defaults = {
      product: {
        name: "",
        price: "",
        image: "",
        category: "",
        culture: "African",
        description: "",
        in_stock: true,
        country: "",
        region: "",
      },
      category: { name: "", icon: "📦" },
      faq: { question: "", answer: "", category: "General", is_active: true },
      deal: {
        title: "",
        description: "",
        discount_type: "percentage",
        discount_value: 10,
        is_active: true,
      },
      blog: {
        title: "",
        content: "",
        featured_image: "",
        author: "",
        published: true,
      },
      recipe: {
        title: "",
        description: "",
        ingredients: "",
        instructions: "",
        image: "",
        culture: "African",
        cook_time: "30 mins",
        difficulty: "Medium",
      },
      notice: {
        message: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
        is_active: true,
      },
      announcement: { title: "", message: "", type: "info", is_active: true },
      shipping: {
        name: "",
        postal_codes: "",
        base_fee: 10,
        per_km_fee: 2,
        free_threshold: 50,
        is_active: true,
      },
      review: {
        user_name: "",
        rating: "5",
        comment: "",
        product_name: "",
        status: "approved",
      },
      admin: { name: "", email: "", password: "", admin_tier: 2 },
      franchise: {
        name: "",
        owner_name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        province: "",
        postal_code: "",
        notes: "",
      },
      newsletter: { email: "", name: "" },
      order: {
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        address: "",
        city: "",
        postal_code: "",
        items_description: "",
        total: "",
        payment_type: "pay_on_delivery",
        notes: "",
      },
      customer: { name: "", email: "", phone: "", address: "" },
    };
    return defaults[type] || {};
  };

  const handleSave = async () => {
    try {
      const apiMap = {
        product: editingItem
          ? () => productsAPI.update(editingItem.product_id, formData)
          : () =>
              productsAPI.create({
                ...formData,
                price: parseFloat(formData.price),
              }),
        category: editingItem
          ? () => categoriesAPI.update(editingItem.category_id, formData)
          : () => categoriesAPI.create(formData),
        faq: editingItem
          ? () => faqsAPI.update(editingItem.faq_id, formData)
          : () => faqsAPI.create(formData),
        deal: editingItem
          ? () => dealsAPI.update(editingItem.deal_id, formData)
          : () => dealsAPI.create(formData),
        blog: editingItem
          ? () => blogAPI.update(editingItem.post_id, formData)
          : () => blogAPI.create(formData),
        recipe: editingItem
          ? () =>
              recipesAPI.update(editingItem.recipe_id, {
                ...formData,
                ingredients: Array.isArray(formData.ingredients)
                  ? formData.ingredients
                  : formData.ingredients.split("\n"),
                instructions: Array.isArray(formData.instructions)
                  ? formData.instructions
                  : formData.instructions.split("\n"),
              })
          : () =>
              recipesAPI.create({
                ...formData,
                ingredients: formData.ingredients.split("\n"),
                instructions: formData.instructions.split("\n"),
              }),
        notice: editingItem
          ? () => noticesAPI.update(editingItem.notice_id, formData)
          : () => noticesAPI.create(formData),
        announcement: editingItem
          ? () => announcementsAPI.update(editingItem.announcement_id, formData)
          : () => announcementsAPI.create(formData),
        shipping: editingItem
          ? () => shippingAPI.update(editingItem.zone_id, formData)
          : () => shippingAPI.create(formData),
        review: editingItem
          ? () => reviewsAPI.update(editingItem.review_id, formData)
          : () =>
              reviewsAPI.create({
                ...formData,
                rating: parseInt(formData.rating),
              }),
        admin: editingItem
          ? () => adminsAPI.update(editingItem.user_id, formData)
          : () => adminsAPI.create(formData),
        franchise: editingItem
          ? () => franchiseAPI.update(editingItem.franchise_id, formData)
          : () => franchiseAPI.create(formData),
        newsletter: () => newsletterAPI.subscribe(formData),
        order: () => ordersAPI.createAdmin(formData),
        customer: editingItem
          ? () => usersAPI.update(editingItem.user_id, formData)
          : () => usersAPI.createCustomer(formData),
      };
      await apiMap[modalType]();
      toast.success(`${modalType} saved successfully!`);
      setShowModal(false);
      fetchAllData();
    } catch (error) {
      toast.error(formatError(error, `Failed to save ${modalType}`));
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const apiMap = {
        product: () => productsAPI.delete(id),
        category: () => categoriesAPI.delete(id),
        faq: () => faqsAPI.delete(id),
        deal: () => dealsAPI.delete(id),
        blog: () => blogAPI.delete(id),
        recipe: () => recipesAPI.delete(id),
        notice: () => noticesAPI.delete(id),
        announcement: () => announcementsAPI.delete(id),
        shipping: () => shippingAPI.delete(id),
        review: () => reviewsAPI.delete(id),
        user: () => usersAPI.delete(id),
        subscriber: () => newsletterAPI.unsubscribe(id),
        admin: () => adminsAPI.delete(id),
        franchise: () => franchiseAPI.delete(id),
      };
      await apiMap[type]();
      toast.success("Deleted successfully!");
      fetchAllData();
    } catch (error) {
      toast.error(formatError(error, "Failed to delete"));
    }
  };

  const handleToggleStock = async (product) => {
    try {
      await productsAPI.update(product.product_id, {
        in_stock: !product.in_stock,
      });
      toast.success(
        product.in_stock ? "Marked out of stock" : "Product relisted"
      );
      fetchAllData();
    } catch (error) {
      toast.error(formatError(error, "Failed to update"));
    }
  };

  const handleBlockUser = async (user) => {
    try {
      await usersAPI.block(user.user_id, { is_blocked: !user.is_blocked });
      toast.success(user.is_blocked ? "User unblocked" : "User blocked");
      fetchAllData();
    } catch (error) {
      toast.error(formatError(error, "Failed to update user"));
    }
  };

  const handleUpdateOrder = async (orderId, updates) => {
    try {
      await ordersAPI.updateStatus(orderId, updates);
      toast.success("Order updated");
      fetchAllData();
    } catch (error) {
      toast.error(formatError(error, "Failed to update order"));
    }
  };

  const handleUpdateSettings = async () => {
    try {
      await settingsAPI.update(siteSettings);
      toast.success("Settings saved!");
    } catch (error) {
      toast.error(formatError(error, "Failed to save settings"));
    }
  };

  const stats = {
    products: data.products.length,
    categories: data.categories.length,
    recipes: data.recipes.length,
    reviews: data.reviews.length,
    orders: data.orders.length,
    customers: data.users.filter((u) => !u.is_admin).length,
    subscribers: data.subscribers.length,
    faqs: data.faqs.length,
    deals: data.deals.length,
    blogPosts: data.blogPosts.length,
  };

  // Colorful menu categories with 3-column layout
  const menuCategories = [
    {
      title: "SALES",
      color: "from-emerald-500 to-green-600",
      bgLight: "bg-emerald-50",
      items: [
        {
          id: "orders",
          label: "Orders",
          icon: ShoppingCart,
          count: stats.orders,
          color: "text-emerald-600",
        },
        {
          id: "products",
          label: "Products",
          icon: Package,
          count: stats.products,
          color: "text-emerald-600",
        },
        {
          id: "bulk-import",
          label: "Bulk Import",
          icon: Upload,
          color: "text-emerald-600",
        },
        {
          id: "categories",
          label: "Categories",
          icon: Grid,
          count: stats.categories,
          color: "text-emerald-600",
        },
      ],
    },
    {
      title: "CONTENT",
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      items: [
        {
          id: "blog",
          label: "Blog",
          icon: FileText,
          count: stats.blogPosts,
          color: "text-blue-600",
        },
        {
          id: "recipes",
          label: "Recipes",
          icon: BookOpen,
          count: stats.recipes,
          color: "text-blue-600",
        },
        {
          id: "reviews",
          label: "Reviews",
          icon: Star,
          count: stats.reviews,
          color: "text-blue-600",
        },
        {
          id: "faqs",
          label: "FAQs",
          icon: HelpCircle,
          count: stats.faqs,
          color: "text-blue-600",
        },
      ],
    },
    {
      title: "MARKETING",
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50",
      items: [
        {
          id: "deals",
          label: "Deals",
          icon: Tag,
          count: stats.deals,
          color: "text-amber-600",
        },
        {
          id: "announcements",
          label: "Announcements",
          icon: Megaphone,
          color: "text-amber-600",
        },
        {
          id: "notices",
          label: "Notices",
          icon: AlertCircle,
          color: "text-amber-600",
        },
        {
          id: "newsletter",
          label: "Newsletter",
          icon: Mail,
          count: stats.subscribers,
          color: "text-amber-600",
        },
      ],
    },
    {
      title: "TEAM",
      color: "from-purple-500 to-violet-600",
      bgLight: "bg-purple-50",
      items: [
        {
          id: "customers",
          label: "Customers",
          icon: Users,
          count: stats.customers,
          color: "text-purple-600",
        },
        {
          id: "admins",
          label: "Admins",
          icon: UserCog,
          color: "text-purple-600",
        },
      ],
    },
    {
      title: "CONFIG",
      color: "from-slate-500 to-gray-600",
      bgLight: "bg-slate-50",
      items: [
        {
          id: "shipping",
          label: "Shipping",
          icon: Truck,
          color: "text-slate-600",
        },
        {
          id: "themes",
          label: "Themes",
          icon: Palette,
          color: "text-slate-600",
        },
        {
          id: "franchise",
          label: "Franchise",
          icon: Store,
          color: "text-slate-600",
        },
        {
          id: "settings",
          label: "Settings",
          icon: Settings,
          color: "text-slate-600",
        },
      ],
    },
  ];

  const menuSections = [
    { id: "dashboard", label: "Dashboard", icon: BarChart },
    { type: "divider", label: "SALES" },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "products", label: "Products", icon: Package },
    { id: "bulk-import", label: "Bulk Import", icon: Upload },
    { id: "categories", label: "Categories", icon: Grid },
    { type: "divider", label: "CONTENT" },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "recipes", label: "Recipes", icon: BookOpen },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "faqs", label: "FAQs", icon: HelpCircle },
    { type: "divider", label: "MARKETING" },
    { id: "deals", label: "Deals", icon: Tag },
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "notices", label: "Notices", icon: AlertCircle },
    { id: "newsletter", label: "Newsletter", icon: Mail },
    { type: "divider", label: "TEAM" },
    { id: "customers", label: "Customers", icon: Users },
    { id: "admins", label: "Admins", icon: UserCog },
    { type: "divider", label: "CONFIG" },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "themes", label: "Themes", icon: Palette },
    { id: "franchise", label: "Franchise", icon: Store },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  if (!isAuthenticated)
    return (
      <AdminLogin
        onLogin={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }}
      />
    );

  const renderModalContent = () => {
    const fields = {
      product: [
        { name: "name", label: "Name", type: "text" },
        { name: "price", label: "Price ($)", type: "number" },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: data.categories.map((c) => c.name),
        },
        {
          name: "culture",
          label: "Culture",
          type: "select",
          options: ["African", "Latino", "Fusion"],
        },
        { name: "country", label: "Country", type: "text" },
        { name: "region", label: "Region", type: "text" },
        { name: "image", label: "Image URL", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "in_stock", label: "In Stock", type: "checkbox" },
      ],
      category: [
        { name: "name", label: "Name", type: "text" },
        { name: "icon", label: "Icon (emoji)", type: "text" },
      ],
      faq: [
        { name: "question", label: "Question", type: "text" },
        { name: "answer", label: "Answer", type: "textarea" },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: ["General", "Shipping", "Payment", "Products", "Returns"],
        },
        { name: "is_active", label: "Active", type: "checkbox" },
      ],
      deal: [
        { name: "title", label: "Title", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        {
          name: "discount_type",
          label: "Discount Type",
          type: "select",
          options: ["percentage", "fixed"],
        },
        { name: "discount_value", label: "Discount Value", type: "number" },
        { name: "is_active", label: "Active", type: "checkbox" },
      ],
      blog: [
        { name: "title", label: "Title", type: "text" },
        { name: "content", label: "Content", type: "textarea" },
        { name: "featured_image", label: "Featured Image URL", type: "text" },
        { name: "author", label: "Author", type: "text" },
        { name: "published", label: "Published", type: "checkbox" },
      ],
      recipe: [
        { name: "title", label: "Title", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "ingredients", label: "Ingredients", type: "textarea" },
        { name: "instructions", label: "Instructions", type: "textarea" },
        { name: "image", label: "Image URL", type: "text" },
        {
          name: "culture",
          label: "Culture",
          type: "select",
          options: ["African", "Latino", "Fusion"],
        },
        { name: "cook_time", label: "Cook Time (e.g. 30 mins)", type: "text" },
        {
          name: "difficulty",
          label: "Difficulty",
          type: "select",
          options: ["Easy", "Medium", "Hard"],
        },
      ],
      notice: [
        { name: "message", label: "Message", type: "text" },
        { name: "start_date", label: "Start Date", type: "date" },
        { name: "end_date", label: "End Date", type: "date" },
        { name: "is_active", label: "Active", type: "checkbox" },
      ],
      announcement: [
        { name: "title", label: "Title", type: "text" },
        { name: "message", label: "Message", type: "textarea" },
        {
          name: "type",
          label: "Type",
          type: "select",
          options: ["info", "warning", "success", "error"],
        },
        { name: "is_active", label: "Active", type: "checkbox" },
      ],
      shipping: [
        { name: "name", label: "Zone Name", type: "text" },
        {
          name: "postal_codes",
          label: "Postal Codes (comma separated)",
          type: "text",
        },
        { name: "base_fee", label: "Base Fee ($)", type: "number" },
        { name: "per_km_fee", label: "Per KM Fee ($)", type: "number" },
        {
          name: "free_threshold",
          label: "Free Delivery Threshold ($)",
          type: "number",
        },
        { name: "is_active", label: "Active", type: "checkbox" },
      ],
      review: [
        { name: "user_name", label: "Reviewer Name", type: "text" },
        {
          name: "rating",
          label: "Rating (1-5)",
          type: "select",
          options: ["5", "4", "3", "2", "1"],
        },
        { name: "comment", label: "Review Comment", type: "textarea" },
        {
          name: "product_name",
          label: "Product Name (optional)",
          type: "text",
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["approved", "pending", "rejected"],
        },
      ],
      admin: [
        { name: "name", label: "Full Name", type: "text" },
        { name: "email", label: "Email", type: "email" },
        { name: "password", label: "Password", type: "password" },
        {
          name: "admin_tier",
          label: "Admin Tier",
          type: "select",
          options: ["2"],
        },
      ],
      franchise: [
        { name: "name", label: "Franchise Name", type: "text" },
        { name: "owner_name", label: "Owner Name", type: "text" },
        { name: "email", label: "Email", type: "email" },
        { name: "phone", label: "Phone", type: "text" },
        { name: "address", label: "Address", type: "text" },
        { name: "city", label: "City", type: "text" },
        { name: "province", label: "Province", type: "text" },
        { name: "postal_code", label: "Postal Code", type: "text" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["pending", "approved", "active", "suspended"],
        },
        { name: "notes", label: "Notes", type: "textarea" },
      ],
      newsletter: [
        { name: "email", label: "Email Address", type: "email" },
        { name: "name", label: "Name (optional)", type: "text" },
      ],
      order: [
        { name: "customer_name", label: "Customer Name", type: "text" },
        { name: "customer_email", label: "Customer Email", type: "email" },
        { name: "customer_phone", label: "Phone", type: "text" },
        { name: "address", label: "Delivery Address", type: "text" },
        { name: "city", label: "City", type: "text" },
        { name: "postal_code", label: "Postal Code", type: "text" },
        {
          name: "items_description",
          label: "Items (description)",
          type: "textarea",
        },
        { name: "total", label: "Total Amount ($)", type: "number" },
        {
          name: "payment_type",
          label: "Payment Type",
          type: "select",
          options: ["pay_now", "pay_on_delivery"],
        },
        { name: "notes", label: "Order Notes", type: "textarea" },
      ],
      customer: [
        { name: "name", label: "Full Name", type: "text" },
        { name: "email", label: "Email Address", type: "email" },
        { name: "phone", label: "Phone Number", type: "text" },
        { name: "address", label: "Address", type: "text" },
      ],
    };

    return (
      <div className="space-y-4">
        {(fields[modalType] || []).map((field) => (
          <div key={field.name}>
            <Label>{field.label}</Label>
            {field.type === "textarea" ? (
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
                value={formData[field.name] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [field.name]: e.target.value })
                }
              />
            ) : field.type === "select" ? (
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={formData[field.name] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [field.name]: e.target.value })
                }
              >
                <option value="">Select...</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "checkbox" ? (
              <input
                type="checkbox"
                className="ml-2"
                checked={formData[field.name] || false}
                onChange={(e) =>
                  setFormData({ ...formData, [field.name]: e.target.checked })
                }
              />
            ) : (
              <Input
                type={field.type}
                value={formData[field.name] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [field.name]: e.target.value })
                }
              />
            )}
          </div>
        ))}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
          <Button variant="outline" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  const renderDataTable = (type, items, columns, idField) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold capitalize">{type} Management</h2>
          <Button
            onClick={() => openModal(type)}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Add {type}
          </Button>
        </div>
        {items.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No {type}s yet. Click &quot;Add&quot; to create one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {columns.map((col) => (
                    <th key={col.key} className="text-left p-3">
                      {col.label}
                    </th>
                  ))}
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item[idField]} className="border-b hover:bg-gray-50">
                    {columns.map((col) => (
                      <td key={col.key} className="p-3">
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openModal(type, item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleDelete(type, item[idField])}
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
        )}
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                {
                  label: "Products",
                  value: stats.products,
                  icon: Package,
                  bg: "bg-emerald-500",
                  light: "bg-emerald-100",
                },
                {
                  label: "Orders",
                  value: stats.orders,
                  icon: ShoppingCart,
                  bg: "bg-blue-500",
                  light: "bg-blue-100",
                },
                {
                  label: "Customers",
                  value: stats.customers,
                  icon: Users,
                  bg: "bg-purple-500",
                  light: "bg-purple-100",
                },
                {
                  label: "Subscribers",
                  value: stats.subscribers,
                  icon: Mail,
                  bg: "bg-amber-500",
                  light: "bg-amber-100",
                },
                {
                  label: "Blog Posts",
                  value: stats.blogPosts,
                  icon: FileText,
                  bg: "bg-indigo-500",
                  light: "bg-indigo-100",
                },
                {
                  label: "Revenue",
                  value: `$${data.orders
                    .reduce((acc, o) => acc + (o.total || 0), 0)
                    .toFixed(0)}`,
                  icon: DollarSign,
                  bg: "bg-green-500",
                  light: "bg-green-100",
                },
              ].map((stat, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.light}`}>
                        <stat.icon
                          className={`w-6 h-6 ${stat.bg.replace(
                            "bg-",
                            "text-"
                          )}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Professional 3-Column Colorful Menu */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuCategories.map((category, idx) => (
                <Card
                  key={idx}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div
                    className={`bg-gradient-to-r ${category.color} px-4 py-3`}
                  >
                    <h3 className="text-white font-bold text-lg">
                      {category.title}
                    </h3>
                  </div>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {category.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center justify-between p-4 hover:${category.bgLight} transition-colors text-left`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${category.bgLight}`}
                            >
                              <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <span className="font-medium text-gray-700">
                              {item.label}
                            </span>
                          </div>
                          {item.count !== undefined && (
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${category.bgLight} ${item.color}`}
                            >
                              {item.count}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Orders */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Recent Orders</h2>
                  <Button
                    onClick={() => setActiveSection("orders")}
                    variant="outline"
                    size="sm"
                  >
                    View All
                  </Button>
                </div>
                {data.orders.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No orders yet
                  </p>
                ) : (
                  data.orders.slice(0, 5).map((order) => (
                    <div
                      key={order.order_id}
                      className="flex justify-between items-center p-3 border-b last:border-0 hover:bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-semibold">
                          #{order.order_id?.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.delivery_info?.first_name}{" "}
                          {order.delivery_info?.last_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">
                          ${order.total?.toFixed(2)}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            order.payment_status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "orders":
        return (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Orders ({data.orders.length})
                </h2>
                <Button
                  onClick={() => openModal("order")}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" /> Create Order
                </Button>
              </div>
              {data.orders.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No orders yet. Create a manual order or wait for customers to
                  place orders.
                </p>
              ) : (
                data.orders.map((order) => (
                  <div
                    key={order.order_id}
                    className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">
                          #{order.order_id?.slice(-8)}{" "}
                          {order.payment_type === "pay_on_delivery" && (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded ml-2">
                              Pay on Delivery
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.delivery_info?.first_name}{" "}
                          {order.delivery_info?.last_name} •{" "}
                          {order.delivery_info?.email}
                        </p>
                        {order.delivery_info?.address && (
                          <p className="text-xs text-gray-500 mt-1">
                            {order.delivery_info?.address},{" "}
                            {order.delivery_info?.city}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-emerald-600">
                          ${order.total?.toFixed(2)}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <select
                            className="text-sm border rounded px-2 py-1"
                            value={order.order_status}
                            onChange={(e) =>
                              handleUpdateOrder(order.order_id, {
                                order_status: e.target.value,
                              })
                            }
                          >
                            {[
                              "processing",
                              "confirmed",
                              "shipped",
                              "delivered",
                              "cancelled",
                            ].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <select
                            className="text-sm border rounded px-2 py-1"
                            value={order.payment_status}
                            onChange={(e) =>
                              handleUpdateOrder(order.order_id, {
                                payment_status: e.target.value,
                              })
                            }
                          >
                            {[
                              "pending",
                              "pending_delivery",
                              "paid",
                              "failed",
                            ].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        );

      case "products":
        return (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Products</h2>
                <Button
                  onClick={() => openModal("product")}
                  className="bg-amber-600"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Image</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Price</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map((p) => (
                    <tr
                      key={p.product_id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">
                        <img
                          src={p.image}
                          alt=""
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="p-3 font-semibold">{p.name}</td>
                      <td className="p-3 font-bold text-amber-600">
                        ${p.price}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            p.in_stock
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {p.in_stock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {!p.in_stock && (
                          <Button
                            size="sm"
                            className="bg-green-600 text-white mr-1"
                            onClick={() => handleToggleStock(p)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" /> Relist
                          </Button>
                        )}
                        {p.in_stock && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mr-1"
                            onClick={() => handleToggleStock(p)}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="mr-1"
                          onClick={() => openModal("product", p)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleDelete("product", p.product_id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        );

      case "categories":
        return renderDataTable(
          "category",
          data.categories,
          [
            { key: "icon", label: "Icon" },
            { key: "name", label: "Name" },
            {
              key: "product_count",
              label: "Products",
              render: (item) => item.product_count || 0,
            },
          ],
          "category_id"
        );

      case "faqs":
        return renderDataTable(
          "faq",
          data.faqs,
          [
            { key: "question", label: "Question" },
            { key: "category", label: "Category" },
            {
              key: "is_active",
              label: "Status",
              render: (item) => (
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    item.is_active ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {item.is_active ? "Active" : "Inactive"}
                </span>
              ),
            },
          ],
          "faq_id"
        );

      case "deals":
        return renderDataTable(
          "deal",
          data.deals,
          [
            { key: "title", label: "Title" },
            {
              key: "discount_value",
              label: "Discount",
              render: (item) =>
                `${item.discount_value}${
                  item.discount_type === "percentage" ? "%" : "$"
                }`,
            },
            {
              key: "is_active",
              label: "Status",
              render: (item) => (
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    item.is_active ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {item.is_active ? "Active" : "Inactive"}
                </span>
              ),
            },
          ],
          "deal_id"
        );

      case "blog":
        const handleGenerateBlog = async () => {
          if (!blogGenTopic) {
            toast.error("Please enter a topic");
            return;
          }
          try {
            const response = await autoBlogAPI.generate({
              topic: blogGenTopic,
              template_type: blogGenCategory,
              category:
                blogGenCategory === "recipe"
                  ? "Food & Recipes"
                  : blogGenCategory === "product"
                  ? "Products"
                  : "Culture",
            });
            setGeneratedBlog(response.generated_content);
            toast.success(
              "Blog content generated! Review and edit before publishing."
            );
          } catch (error) {
            toast.error(formatError(error, "Failed to generate blog content"));
          }
        };

        const handleUseGeneratedBlog = () => {
          if (generatedBlog) {
            setFormData({
              title: generatedBlog.title,
              content: generatedBlog.content,
              excerpt: generatedBlog.excerpt,
              category: generatedBlog.category,
              featured_image: generatedBlog.image || "",
              author: currentUser?.name || "Admin",
              published: false,
            });
            setEditingItem(null);
            setModalType("blog");
            setShowModal(true);
            setGeneratedBlog(null);
          }
        };

        return (
          <div className="space-y-6">
            {/* Automated Blog Generation */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-bold">Auto-Generate Blog Post</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label>Topic</Label>
                    <Input
                      placeholder="e.g., Jollof Rice, Plantains, Caribbean Culture"
                      value={blogGenTopic}
                      onChange={(e) => setBlogGenTopic(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Template Type</Label>
                    <select
                      className="w-full px-3 py-2 border rounded-lg"
                      value={blogGenCategory}
                      onChange={(e) => setBlogGenCategory(e.target.value)}
                    >
                      <option value="recipe">Recipe Post</option>
                      <option value="product">Product Feature</option>
                      <option value="culture">Cultural Article</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleGenerateBlog}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      <Sparkles className="w-4 h-4 mr-2" /> Generate
                    </Button>
                  </div>
                </div>

                {generatedBlog && (
                  <div className="border rounded-lg p-4 bg-amber-50">
                    <h3 className="font-semibold mb-2">
                      {generatedBlog.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {generatedBlog.excerpt}
                    </p>
                    <div className="max-h-40 overflow-y-auto text-sm bg-white p-3 rounded mb-3">
                      <pre className="whitespace-pre-wrap font-sans">
                        {generatedBlog.content.slice(0, 500)}...
                      </pre>
                    </div>
                    <Button
                      onClick={handleUseGeneratedBlog}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Edit className="w-4 h-4 mr-2" /> Edit & Publish
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Blog Management */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-bold">Blog Posts</h2>
                  <Button
                    onClick={() => openModal("blog")}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Manual Post
                  </Button>
                </div>
                {data.blogPosts.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No blog posts yet. Create one manually or use auto-generate
                    above.
                  </p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Title</th>
                        <th className="text-left p-3">Author</th>
                        <th className="text-left p-3">Views</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-right p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.blogPosts.map((post) => (
                        <tr
                          key={post.post_id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-3 font-semibold">{post.title}</td>
                          <td className="p-3">{post.author}</td>
                          <td className="p-3">{post.views || 0}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                post.published
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {post.published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openModal("blog", post)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 ml-1"
                              onClick={() => handleDelete("blog", post.post_id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "recipes":
        return renderDataTable(
          "recipe",
          data.recipes,
          [
            { key: "title", label: "Title" },
            { key: "culture", label: "Culture" },
            {
              key: "description",
              label: "Description",
              render: (item) => (item.description || "").slice(0, 50) + "...",
            },
          ],
          "recipe_id"
        );

      case "reviews":
        return (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Reviews ({data.reviews.length})
                </h2>
                <Button
                  onClick={() => openModal("review")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Review
                </Button>
              </div>
              {data.reviews.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No reviews yet. Add your first review!
                </p>
              ) : (
                data.reviews.map((review) => (
                  <div
                    key={review.review_id}
                    className="border rounded-lg p-4 mb-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">{review.user_name}</p>
                        <div className="text-amber-500 text-lg">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                        <p className="text-gray-600 mt-2">{review.comment}</p>
                        {review.product_name && (
                          <p className="text-sm text-gray-400 mt-1">
                            Product: {review.product_name}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <select
                          className="text-sm border rounded px-2 py-1"
                          value={review.status}
                          onChange={async (e) => {
                            try {
                              await reviewsAPI.update(review.review_id, {
                                status: e.target.value,
                              });
                              toast.success("Review status updated");
                              fetchAllData();
                            } catch (err) {
                              toast.error(formatError(err, "Failed to update"));
                            }
                          }}
                        >
                          {["pending", "approved", "rejected"].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openModal("review", review)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() =>
                            handleDelete("review", review.review_id)
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        );

      case "notices":
        return renderDataTable(
          "notice",
          data.notices,
          [
            { key: "message", label: "Message" },
            {
              key: "is_active",
              label: "Status",
              render: (item) => (
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    item.is_active ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {item.is_active ? "Active" : "Inactive"}
                </span>
              ),
            },
          ],
          "notice_id"
        );

      case "announcements":
        return renderDataTable(
          "announcement",
          data.announcements,
          [
            { key: "title", label: "Title" },
            { key: "type", label: "Type" },
            {
              key: "is_active",
              label: "Status",
              render: (item) => (
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    item.is_active ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {item.is_active ? "Active" : "Inactive"}
                </span>
              ),
            },
          ],
          "announcement_id"
        );

      case "customers":
        const handleExportCustomers = async () => {
          try {
            const response = await customersAPI.export("csv");
            const blob = new Blob([response.csv_data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = response.filename;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success(`Exported ${response.total_customers} customers!`);
          } catch (error) {
            toast.error(formatError(error, "Failed to export customers"));
          }
        };

        const customers = data.users.filter((u) => !u.is_admin);

        return (
          <div className="space-y-6">
            {/* Customer Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {customers.length}
                  </p>
                  <p className="text-sm text-gray-600">Total Customers</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {customers.filter((c) => !c.is_blocked).length}
                  </p>
                  <p className="text-sm text-gray-600">Active</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">
                    {customers.filter((c) => c.is_blocked).length}
                  </p>
                  <p className="text-sm text-gray-600">Blocked</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-amber-600">
                    {data.subscribers.length}
                  </p>
                  <p className="text-sm text-gray-600">Newsletter Subs</p>
                </CardContent>
              </Card>
            </div>

            {/* Customer Table */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Customer Database</h2>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleExportCustomers}
                      variant="outline"
                      className="border-purple-600 text-purple-600 hover:bg-purple-50"
                    >
                      <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                    <Button
                      onClick={() => openModal("customer")}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Customer
                    </Button>
                  </div>
                </div>

                {customers.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 text-lg">No customers yet</p>
                    <p className="text-gray-400 text-sm">
                      Customers will appear here when they create accounts
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-3 font-semibold">
                            Customer
                          </th>
                          <th className="text-left p-3 font-semibold">
                            Contact
                          </th>
                          <th className="text-center p-3 font-semibold">
                            Orders
                          </th>
                          <th className="text-center p-3 font-semibold">
                            Spent
                          </th>
                          <th className="text-center p-3 font-semibold">
                            Status
                          </th>
                          <th className="text-right p-3 font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((user) => (
                          <tr
                            key={user.user_id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                  {user.name?.charAt(0) || "?"}
                                </div>
                                <div>
                                  <p className="font-semibold">
                                    {user.name || "Unknown"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    ID: {user.user_id?.slice(-8)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <p className="text-sm">{user.email}</p>
                              <p className="text-xs text-gray-500">
                                {user.phone || "No phone"}
                              </p>
                            </td>
                            <td className="p-3 text-center">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                                {user.total_orders || 0}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className="font-semibold text-green-600">
                                ${(user.total_spent || 0).toFixed(2)}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  user.is_blocked
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {user.is_blocked ? "Blocked" : "Active"}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openModal("customer", user)}
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className={
                                    user.is_blocked
                                      ? "text-green-600"
                                      : "text-amber-600"
                                  }
                                  onClick={() => handleBlockUser(user)}
                                  title={user.is_blocked ? "Unblock" : "Block"}
                                >
                                  {user.is_blocked ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <Ban className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600"
                                  onClick={() =>
                                    handleDelete("user", user.user_id)
                                  }
                                  title="Delete"
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
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "admins":
        return (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">Admin Users</h2>
                  <p className="text-sm text-gray-500">
                    {adminTier === 1 ? (
                      <span className="flex items-center gap-1">
                        <Crown className="w-4 h-4 text-amber-500" /> You are a
                        Tier 1 Admin - you can add/remove other admins
                      </span>
                    ) : (
                      <span>You are a Tier 2 Admin</span>
                    )}
                  </p>
                </div>
                {adminTier === 1 && (
                  <Button
                    onClick={() => openModal("admin")}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Admin
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                {data.admins.map((admin) => (
                  <div
                    key={admin.user_id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold">
                        {admin.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{admin.name}</p>
                          {admin.admin_tier === 1 && (
                            <Crown className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{admin.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          admin.admin_tier === 1
                            ? "bg-amber-100 text-amber-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {admin.admin_tier === 1
                          ? "Tier 1 (Super Admin)"
                          : "Tier 2 (Admin)"}
                      </span>
                      {adminTier === 1 &&
                        admin.admin_tier !== 1 &&
                        admin.user_id !== currentUser?.user_id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleDelete("admin", admin.user_id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case "shipping":
        return renderDataTable(
          "shipping",
          data.shipping,
          [
            { key: "name", label: "Zone" },
            {
              key: "base_fee",
              label: "Base Fee",
              render: (item) => `$${item.base_fee}`,
            },
            {
              key: "free_threshold",
              label: "Free Above",
              render: (item) => `$${item.free_threshold}`,
            },
            {
              key: "is_active",
              label: "Status",
              render: (item) => (
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    item.is_active ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {item.is_active ? "Active" : "Inactive"}
                </span>
              ),
            },
          ],
          "zone_id"
        );

      case "newsletter":
        return (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Newsletter Subscribers ({data.subscribers.length})
                </h2>
                <Button
                  onClick={() => openModal("newsletter")}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Subscriber
                </Button>
              </div>
              {data.subscribers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No subscribers yet. Add your first subscriber or wait for
                  sign-ups.
                </p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Email</th>
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Subscribed</th>
                      <th className="text-right p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.subscribers.map((sub) => (
                      <tr
                        key={sub.subscriber_id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3 font-medium">{sub.email}</td>
                        <td className="p-3">{sub.name || "-"}</td>
                        <td className="p-3 text-sm text-gray-600">
                          {new Date(sub.subscribed_at).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() =>
                              handleDelete("subscriber", sub.subscriber_id)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        );

      case "bulk-import":
        const handleDownloadTemplate = async () => {
          try {
            const response = await bulkImportAPI.getTemplate();
            const blob = new Blob([response.csv_template], {
              type: "text/csv",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "product_import_template.csv";
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success("Template downloaded!");
          } catch (error) {
            toast.error(formatError(error, "Failed to download template"));
          }
        };

        const handleImportFile = async () => {
          if (!importFile) {
            toast.error("Please select a file first");
            return;
          }
          try {
            const result = await bulkImportAPI.importProducts(importFile);
            setImportResult(result);
            toast.success(`${result.imported} products imported successfully!`);
            fetchAllData();
          } catch (error) {
            toast.error(formatError(error, "Import failed"));
          }
        };

        return (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Bulk Import Products</h2>
              <div className="bg-gray-50 border-2 border-dashed rounded-lg p-8">
                <div className="text-center mb-6">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">
                    Upload CSV file to import products in bulk
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Download our template to see the required format
                  </p>
                  <Button
                    onClick={handleDownloadTemplate}
                    variant="outline"
                    className="mr-2"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download Template
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-center gap-4">
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setImportFile(e.target.files[0])}
                      className="max-w-xs"
                    />
                    <Button
                      onClick={handleImportFile}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      <Upload className="w-4 h-4 mr-2" /> Import Products
                    </Button>
                  </div>
                  {importFile && (
                    <p className="text-center text-sm text-gray-600 mt-2">
                      Selected: {importFile.name}
                    </p>
                  )}
                </div>

                {importResult && (
                  <div className="mt-6 p-4 bg-white rounded-lg border">
                    <h3 className="font-semibold text-green-600 mb-2">
                      Import Complete!
                    </h3>
                    <p>
                      {importResult.imported} products imported successfully
                    </p>
                    {importResult.errors?.length > 0 && (
                      <div className="mt-2">
                        <p className="text-red-600 font-semibold">Errors:</p>
                        <ul className="text-sm text-red-500">
                          {importResult.errors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Template Format
                </h3>
                <p className="text-sm text-blue-700">
                  The CSV should include these columns:
                </p>
                <code className="text-xs text-blue-600 block mt-2 bg-white p-2 rounded">
                  name, price, image, category, culture, country, region,
                  description, ingredients, storage_instructions, featured
                </code>
              </div>
            </CardContent>
          </Card>
        );

      case "themes":
        const handleActivateTheme = async (themeId) => {
          try {
            await themesAPI.activate(themeId);
            toast.success("Theme activated!");
            fetchAllData();
          } catch (error) {
            toast.error(formatError(error, "Failed to activate theme"));
          }
        };

        return (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Site Themes</h2>
              <p className="text-gray-600 mb-6">
                Choose a color theme for your storefront
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.themes.map((theme) => (
                  <div
                    key={theme.theme_id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      theme.is_active
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleActivateTheme(theme.theme_id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{theme.name}</h3>
                      {theme.is_active && (
                        <CheckCircle className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div className="flex gap-2 mb-3">
                      <div
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: theme.primary_color }}
                        title="Primary"
                      ></div>
                      <div
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: theme.secondary_color }}
                        title="Secondary"
                      ></div>
                      <div
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: theme.accent_color }}
                        title="Accent"
                      ></div>
                      <div
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: theme.background_color }}
                        title="Background"
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>Primary: {theme.primary_color}</p>
                      <p>Secondary: {theme.secondary_color}</p>
                      <p>Accent: {theme.accent_color}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case "franchise":
        return (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Franchise Applications</h2>
                <Button
                  onClick={() => openModal("franchise")}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Plus className="w-4 h-4 mr-2" /> New Application
                </Button>
              </div>
              {data.franchises.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No franchise applications yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {data.franchises.map((franchise) => (
                    <div
                      key={franchise.franchise_id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {franchise.name}
                          </h3>
                          <p className="text-gray-600">
                            {franchise.owner_name}
                          </p>
                          <div className="text-sm text-gray-500 mt-1">
                            <p>
                              {franchise.email} • {franchise.phone}
                            </p>
                            <p>
                              {franchise.address}, {franchise.city},{" "}
                              {franchise.province} {franchise.postal_code}
                            </p>
                          </div>
                          {franchise.notes && (
                            <p className="text-sm text-gray-600 mt-2 italic">
                              {franchise.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            className="text-sm border rounded px-2 py-1"
                            value={franchise.status}
                            onChange={async (e) => {
                              try {
                                await franchiseAPI.update(
                                  franchise.franchise_id,
                                  { status: e.target.value }
                                );
                                toast.success("Status updated");
                                fetchAllData();
                              } catch (error) {
                                toast.error(
                                  formatError(error, "Failed to update")
                                );
                              }
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                          </select>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openModal("franchise", franchise)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() =>
                              handleDelete("franchise", franchise.franchise_id)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            franchise.status === "active"
                              ? "bg-green-100 text-green-800"
                              : franchise.status === "approved"
                              ? "bg-blue-100 text-blue-800"
                              : franchise.status === "suspended"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {franchise.status?.charAt(0).toUpperCase() +
                            franchise.status?.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "settings":
        const handleSaveBranding = async () => {
          try {
            await brandingAPI.update(branding);
            toast.success("Branding settings saved!");
          } catch (error) {
            toast.error(formatError(error, "Failed to save branding settings"));
          }
        };

        const handleSaveBlogAutomation = async () => {
          try {
            await blogAutomationAPI.updateSettings(blogAutomation);
            toast.success("Blog automation settings saved!");
          } catch (error) {
            toast.error(
              formatError(error, "Failed to save automation settings")
            );
          }
        };

        const handleTestGenerateAI = async () => {
          setIsGeneratingAI(true);
          try {
            const keywords = blogAutomation.keywords || "";
            const response = await autoBlogAPI.generateAI({ keywords });
            setGeneratedBlog(response.generated_content);
            toast.success(
              "AI blog post generated! Review in the Blog section."
            );
          } catch (error) {
            toast.error(formatError(error, "Failed to generate AI blog"));
          } finally {
            setIsGeneratingAI(false);
          }
        };

        return (
          <div className="space-y-6">
            {/* Branding Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Image className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-bold">Branding</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Logo URL</Label>
                    <Input
                      value={branding.logo_url || ""}
                      onChange={(e) =>
                        setBranding({ ...branding, logo_url: e.target.value })
                      }
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your site logo (recommended: PNG with transparent
                      background, 200x60px)
                    </p>
                  </div>
                  {branding.logo_url && (
                    <div className="mt-2">
                      <Label>Logo Preview:</Label>
                      <div className="mt-2 p-4 bg-gray-100 rounded-lg inline-block">
                        <img
                          src={branding.logo_url}
                          alt="Logo preview"
                          className="h-12 object-contain"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <Label>Favicon URL</Label>
                    <Input
                      value={branding.favicon_url || ""}
                      onChange={(e) =>
                        setBranding({
                          ...branding,
                          favicon_url: e.target.value,
                        })
                      }
                      placeholder="https://example.com/favicon.ico"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Browser tab icon (recommended: 32x32px ICO or PNG)
                    </p>
                  </div>
                  <Button
                    onClick={handleSaveBranding}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Save className="w-4 h-4 mr-2" /> Save Branding
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Email & Notifications Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold">Email & Notifications</h2>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-800">
                        Email Integration ({emailStatus.provider || "Resend"})
                      </h3>
                      <p className="text-sm text-blue-700">
                        Transactional emails for orders, newsletters, and
                        notifications
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        emailStatus.configured
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {emailStatus.configured
                        ? "✓ Connected"
                        : "✗ Not Configured"}
                    </span>
                  </div>
                </div>

                {emailStatus.configured && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm">
                        <strong>Provider:</strong> {emailStatus.provider}
                      </p>
                      <p className="text-sm">
                        <strong>From Email:</strong> {emailStatus.from_email}
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <Label>Send Test Email</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="email"
                          placeholder="recipient@example.com"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={async () => {
                            if (!testEmail) {
                              toast.error("Please enter an email address");
                              return;
                            }
                            setIsSendingTestEmail(true);
                            try {
                              await emailAPI.sendTest({ to: testEmail });
                              toast.success("Test email sent successfully!");
                              setTestEmail("");
                            } catch (error) {
                              toast.error(
                                formatError(error, "Failed to send test email")
                              );
                            } finally {
                              setIsSendingTestEmail(false);
                            }
                          }}
                          disabled={isSendingTestEmail}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isSendingTestEmail ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          <span className="ml-2">Send Test</span>
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Automatic Emails Enabled:
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>✓ Order confirmation to customers</li>
                        <li>✓ Order status updates (shipped, delivered)</li>
                        <li>✓ Welcome email for newsletter subscribers</li>
                        <li>✓ New order alerts to admin</li>
                        <li>✓ Payment received notifications</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Blog Automation Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold">Blog Automation</h2>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-800">
                      AI-Powered Daily Blog Posts
                    </h3>
                  </div>
                  <p className="text-sm text-purple-700">
                    Automatically generate and publish SEO-optimized blog posts
                    about African and Latino products in Greater Moncton area
                    using AI.
                  </p>
                  <p className="text-xs text-purple-600 mt-2 font-medium">
                    Powered by OpenAI GPT-5 via Emergent LLM Key
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-base font-semibold">
                        Enable Daily Blog Automation
                      </Label>
                      <p className="text-sm text-gray-500">
                        {blogAutomation.enabled ? "✓ Active" : "Inactive"}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={blogAutomation.enabled || false}
                        onChange={(e) =>
                          setBlogAutomation({
                            ...blogAutomation,
                            enabled: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div>
                    <Label>Daily Post Time (24-hour format)</Label>
                    <Input
                      type="time"
                      value={blogAutomation.post_time || "09:00"}
                      onChange={(e) =>
                        setBlogAutomation({
                          ...blogAutomation,
                          post_time: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Blog will be generated and published daily at this time
                    </p>
                  </div>

                  <div>
                    <Label>Target Keywords (one per line)</Label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-lg min-h-[150px]"
                      value={blogAutomation.keywords || ""}
                      onChange={(e) =>
                        setBlogAutomation({
                          ...blogAutomation,
                          keywords: e.target.value,
                        })
                      }
                      placeholder="African products&#10;Latino products&#10;Moncton&#10;Tienda Latina Moncton&#10;Tienda Latina&#10;African Store Moncton&#10;Dieppe&#10;Riverview"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      AI will use these keywords to generate locally-targeted
                      content
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveBlogAutomation}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Save className="w-4 h-4 mr-2" /> Save Automation Settings
                    </Button>
                    <Button
                      onClick={handleTestGenerateAI}
                      variant="outline"
                      className="border-purple-600 text-purple-600 hover:bg-purple-50"
                      disabled={isGeneratingAI}
                    >
                      {isGeneratingAI ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />{" "}
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" /> Test Generate
                          Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* General Settings */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">General Settings</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Site Title</Label>
                    <Input
                      value={siteSettings.site_title || ""}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          site_title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input
                      value={siteSettings.contact_email || ""}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          contact_email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      value={siteSettings.phone_number || ""}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          phone_number: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Store Address</Label>
                    <Input
                      value={siteSettings.store_address || ""}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          store_address: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={handleUpdateSettings}
                  className="mt-4 bg-amber-600"
                >
                  Save Settings
                </Button>
              </CardContent>
            </Card>

            {/* Payment Settings - Toggle */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">💳 Online Payments</h2>
                    <p className="text-sm text-gray-600">
                      Enable or disable online payment methods (Stripe, PayPal)
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-medium ${
                        siteSettings.online_payments_enabled !== false
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {siteSettings.online_payments_enabled !== false
                        ? "ON"
                        : "OFF"}
                    </span>
                    <button
                      onClick={async () => {
                        const newValue =
                          siteSettings.online_payments_enabled === false
                            ? true
                            : false;
                        setSiteSettings({
                          ...siteSettings,
                          online_payments_enabled: newValue,
                        });
                        try {
                          await settingsAPI.update({
                            online_payments_enabled: newValue,
                          });
                          toast.success(
                            newValue
                              ? "Online payments enabled!"
                              : "Online payments disabled - Only Pay on Delivery available"
                          );
                        } catch (error) {
                          toast.error(
                            formatError(
                              error,
                              "Failed to update payment settings"
                            )
                          );
                        }
                      }}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        siteSettings.online_payments_enabled !== false
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                          siteSettings.online_payments_enabled !== false
                            ? "translate-x-7"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    siteSettings.online_payments_enabled !== false
                      ? "bg-green-50 border border-green-200"
                      : "bg-amber-50 border border-amber-200"
                  }`}
                >
                  {siteSettings.online_payments_enabled !== false ? (
                    <div className="flex items-center gap-2 text-green-700">
                      <span className="text-xl">✅</span>
                      <div>
                        <p className="font-medium">
                          All payment methods are available
                        </p>
                        <p className="text-sm">
                          Customers can pay with Stripe, PayPal, or Pay on
                          Delivery
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-700">
                      <span className="text-xl">💵</span>
                      <div>
                        <p className="font-medium">Pay on Delivery only</p>
                        <p className="text-sm">
                          Online payment methods are disabled. Customers can
                          only pay cash on delivery.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Settings */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Delivery Settings</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>Free Delivery Threshold ($)</Label>
                    <Input
                      type="number"
                      value={siteSettings.free_delivery_threshold || 50}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          free_delivery_threshold: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Base Fee ($)</Label>
                    <Input
                      type="number"
                      value={siteSettings.delivery_base_fee || 10}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          delivery_base_fee: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Per KM Fee ($)</Label>
                    <Input
                      type="number"
                      value={siteSettings.delivery_per_km_fee || 2}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          delivery_per_km_fee: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={handleUpdateSettings}
                  className="mt-4 bg-green-600"
                >
                  Save Delivery
                </Button>
              </CardContent>
            </Card>

            {/* Payment Credentials */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Payment Credentials</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Stripe API Key</Label>
                    <Input
                      type="password"
                      value={siteSettings.stripe_api_key || ""}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          stripe_api_key: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>PayPal Client ID</Label>
                    <Input
                      value={siteSettings.paypal_client_id || ""}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          paypal_client_id: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={handleUpdateSettings}
                  className="mt-4 bg-blue-600"
                >
                  Save Payment
                </Button>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Social Media</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      value={siteSettings.facebook_url || ""}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          facebook_url: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Instagram</Label>
                    <Input
                      value={siteSettings.instagram_url || ""}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          instagram_url: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Twitter</Label>
                    <Input
                      value={siteSettings.twitter_url || ""}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          twitter_url: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>YouTube</Label>
                    <Input
                      value={siteSettings.youtube_url || ""}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          youtube_url: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={handleUpdateSettings}
                  className="mt-4 bg-purple-600"
                >
                  Save Social
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <p>Select a section</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white py-4 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Manage your Afro-Latino marketplace
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveSection("notifications")}
              className="relative p-2 hover:bg-gray-800 rounded"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <span className="text-sm">
              Welcome, <strong>{currentUser?.name}</strong>
            </span>
            <Button onClick={fetchAllData} variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("user");
                setIsAuthenticated(false);
              }}
              className="text-white border-gray-600"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b shadow-sm overflow-x-auto">
        <div className="flex items-center px-4">
          {menuSections.map((item, idx) =>
            item.type === "divider" ? (
              <span
                key={idx}
                className="text-xs text-gray-400 font-semibold px-3 py-4 border-l first:border-l-0"
              >
                {item.label}
              </span>
            ) : (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-1 px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeSection === item.id
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            )
          )}
        </div>
      </div>

      <div className="p-6">{renderContent()}</div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${editingItem ? "Edit" : "Add"} ${modalType}`}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};
