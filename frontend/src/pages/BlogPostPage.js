import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { blogAPI } from "../services/api";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Calendar,
  User,
  Eye,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";

export const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await blogAPI.getBySlug(slug);
        setPost(data);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Post not found");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Post Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/blog">
            <Button className="bg-amber-600 hover:bg-amber-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px]">
        <img
          src={post.featured_image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Link
                to="/blog"
                className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-amber-600 hover:bg-amber-700 border-none">
                  {post.category}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{post.views || 0} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Excerpt */}
          <div className="text-xl text-gray-600 font-medium italic mb-10 border-l-4 border-amber-500 pl-6">
            {post.excerpt}
          </div>

          {/* Social Share (Floating side or top) */}
          <div className="flex items-center justify-between py-6 border-y border-gray-100 mb-10">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Share
              </span>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full bg-gray-50 hover:bg-sky-50 hover:text-sky-500 transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={copyLink}
                  className="p-2 rounded-full bg-gray-50 hover:bg-gray-200 transition-colors"
                >
                  <LinkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Main Body */}
          <div
            className="prose prose-lg prose-amber max-w-none text-gray-700 leading-relaxed
              prose-headings:font-bold prose-headings:text-gray-900
              prose-p:mb-6 prose-img:rounded-3xl prose-img:shadow-lg
              prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer of the post */}
          <div className="mt-16 pt-10 border-t border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xl">
                  {post.author[0]}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Written by</p>
                  <p className="font-bold text-gray-900">{post.author}</p>
                </div>
              </div>
              <Link to="/blog">
                <Button
                  variant="outline"
                  className="border-amber-600 text-amber-600 hover:bg-amber-50"
                >
                  Read More Stories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
