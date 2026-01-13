import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { recipesAPI } from "../services/api";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Clock, ChefHat, Search, Utensils } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

export const RecipesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCulture, setSelectedCulture] = useState("all");
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const params = {};
        if (selectedCulture !== "all") params.culture = selectedCulture;
        if (searchQuery) params.search = searchQuery;

        const response = await recipesAPI.getAll(params);
        setRecipes(response.recipes || []);
        setFilteredRecipes(response.recipes || []);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedCulture, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-600 to-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Afro-Latino Kitchen
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Discover authentic recipes and fusion dishes that celebrate the rich
            culinary heritage of Africa and Latin America
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setSelectedCulture("all")}
              variant={selectedCulture === "all" ? "default" : "outline"}
              className={
                selectedCulture === "all"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : ""
              }
            >
              All Recipes
            </Button>
            <Button
              onClick={() => setSelectedCulture("African")}
              variant={selectedCulture === "African" ? "default" : "outline"}
              className={
                selectedCulture === "African"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : ""
              }
            >
              African
            </Button>
            <Button
              onClick={() => setSelectedCulture("Latino")}
              variant={selectedCulture === "Latino" ? "default" : "outline"}
              className={
                selectedCulture === "Latino"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : ""
              }
            >
              Latino
            </Button>
            <Button
              onClick={() => setSelectedCulture("Fusion")}
              variant={selectedCulture === "Fusion" ? "default" : "outline"}
              className={
                selectedCulture === "Fusion"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : ""
              }
            >
              Fusion
            </Button>
          </div>
        </div>

        {/* Featured Recipe */}
        {filteredRecipes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Featured Recipe</h2>
            <Card className="overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-96">
                  <img
                    src={filteredRecipes[0].image}
                    alt={filteredRecipes[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                    {filteredRecipes[0].culture}
                  </div>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold mb-4">
                    {filteredRecipes[0].title}
                  </h3>
                  <p className="text-gray-700 mb-6 text-lg">
                    {filteredRecipes[0].description}
                  </p>
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>
                        {filteredRecipes[0].cook_time ||
                          filteredRecipes[0].cookTime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <ChefHat className="w-5 h-5" />
                      <span>{filteredRecipes[0].difficulty}</span>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        View Recipe
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-3xl font-bold text-amber-900">
                          {filteredRecipes[0].title}
                        </DialogTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />{" "}
                            {filteredRecipes[0].cook_time ||
                              filteredRecipes[0].cookTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <ChefHat className="w-4 h-4" />{" "}
                            {filteredRecipes[0].difficulty}
                          </span>
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                            {filteredRecipes[0].culture}
                          </span>
                        </div>
                      </DialogHeader>
                      <div className="mt-6">
                        <div className="relative h-64 w-full mb-8 rounded-xl overflow-hidden shadow-md">
                          <img
                            src={filteredRecipes[0].image}
                            alt={filteredRecipes[0].title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-100">
                            <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-900 border-b border-amber-200 pb-2">
                              <Utensils className="w-5 h-5" /> Ingredients
                            </h4>
                            <ul className="space-y-3">
                              {filteredRecipes[0].ingredients?.map(
                                (ingredient, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 text-gray-700"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                    {ingredient}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                          <div className="p-2">
                            <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-900 border-b border-gray-200 pb-2">
                              Instructions
                            </h4>
                            <ol className="space-y-4">
                              {filteredRecipes[0].instructions?.map(
                                (instruction, index) => (
                                  <li key={index} className="flex gap-4 group">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                      {index + 1}
                                    </span>
                                    <p className="text-gray-700 pt-1 leading-relaxed">
                                      {instruction}
                                    </p>
                                  </li>
                                )
                              )}
                            </ol>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </div>
            </Card>
          </div>
        )}

        {/* Recipe Grid */}
        <div>
          <h2 className="text-3xl font-bold mb-6">All Recipes</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading recipes...</p>
              </div>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No recipes found matching your search.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecipes.map((recipe) => (
                <Card
                  key={recipe.recipe_id || recipe.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                      {recipe.culture}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-amber-600 transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {recipe.description}
                    </p>
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.cook_time || recipe.cookTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChefHat className="w-4 h-4" />
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600"
                        >
                          View Recipe
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-amber-900">
                            {recipe.title}
                          </DialogTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />{" "}
                              {recipe.cook_time || recipe.cookTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <ChefHat className="w-4 h-4" />{" "}
                              {recipe.difficulty}
                            </span>
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                              {recipe.culture}
                            </span>
                          </div>
                        </DialogHeader>
                        <div className="mt-6">
                          <div className="relative h-64 w-full mb-8 rounded-xl overflow-hidden shadow-md">
                            <img
                              src={recipe.image}
                              alt={recipe.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-100">
                              <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-900 border-b border-amber-200 pb-2">
                                <Utensils className="w-5 h-5" /> Ingredients
                              </h4>
                              <ul className="space-y-3">
                                {recipe.ingredients?.map(
                                  (ingredient, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-2 text-gray-700"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                      {ingredient}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                            <div className="p-2">
                              <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-900 border-b border-gray-200 pb-2">
                                Instructions
                              </h4>
                              <ol className="space-y-4">
                                {recipe.instructions?.map(
                                  (instruction, index) => (
                                    <li
                                      key={index}
                                      className="flex gap-4 group"
                                    >
                                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                        {index + 1}
                                      </span>
                                      <p className="text-gray-700 pt-1 leading-relaxed">
                                        {instruction}
                                      </p>
                                    </li>
                                  )
                                )}
                              </ol>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
