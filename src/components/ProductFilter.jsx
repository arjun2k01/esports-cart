import React, { useState } from "react";

// Assumes you get categories, tags, platforms, modes, price, etc. from DB or API and pass as prop
function ProductFilter({
  categories = [],
  tags = [],
  platforms = [],
  modes = [],
  minPrice = 0,
  maxPrice = 9999,
  onFilter,
  onSort
}) {
  const [query, setQuery] = useState("");
  const [selectedCats, setCats] = useState([]);
  const [selectedTags, setTagsState] = useState([]);
  const [selectedPlatforms, setPlatforms] = useState([]);
  const [selectedModes, setModes] = useState([]);
  const [price, setPrice] = useState([minPrice, maxPrice]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("relevance");

  const handleMultiSelect = (vals, setVals, value) => {
    if (vals.includes(value))
      setVals(vals.filter(v => v !== value));
    else
      setVals([...vals, value]);
  };

  const resetFilters = () => {
    setQuery("");
    setCats([]);
    setTagsState([]);
    setPlatforms([]);
    setModes([]);
    setPrice([minPrice, maxPrice]);
    setMinRating(0);
    setSort("relevance");
    onFilter?.({});
    onSort?.("relevance");
  };

  const handleApply = () => {
    onFilter({
      query,
      categories: selectedCats,
      tags: selectedTags,
      platforms: selectedPlatforms,
      modes: selectedModes,
      price,
      minRating,
    });
    onSort(sort);
  };

  return (
    <div className="rounded-lg bg-white dark:bg-gray-900 p-4 shadow flex flex-col">
      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Search games, teams, tournaments..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* Multi-select categories */}
      <div className="mb-3 flex flex-wrap gap-2 items-center">
        <span className="font-semibold text-xs">Categories:</span>
        {categories.map(cat => (
          <label key={cat} className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCats.includes(cat)}
              onChange={() => handleMultiSelect(selectedCats, setCats, cat)}
            />
            <span className="text-xs">{cat}</span>
          </label>
        ))}
      </div>

      {/* Tag selector (chips) */}
      {tags.length > 0 &&
        <div className="mb-3 flex flex-wrap gap-2 items-center">
          <span className="font-semibold text-xs">Tags:</span>
          {tags.map(tag => (
            <button
              key={tag}
              className={`badge badge-outline px-2 ${selectedTags.includes(tag) ? "badge-primary" : ""}`}
              onClick={() => handleMultiSelect(selectedTags, setTagsState, tag)}
              type="button"
            >
              {tag}
            </button>
          ))}
        </div>
      }

      {/* Platforms */}
      {platforms.length > 0 &&
        <div className="mb-3 flex flex-wrap gap-2 items-center">
          <span className="font-semibold text-xs">Platforms:</span>
          {platforms.map(pf => (
            <label key={pf} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(pf)}
                onChange={() => handleMultiSelect(selectedPlatforms, setPlatforms, pf)}
              />
              <span className="text-xs">{pf}</span>
            </label>
          ))}
        </div>
      }

      {/* Modes */}
      {modes.length > 0 &&
        <div className="mb-3 flex flex-wrap gap-2 items-center">
          <span className="font-semibold text-xs">Modes:</span>
          {modes.map(md => (
            <label key={md} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedModes.includes(md)}
                onChange={() => handleMultiSelect(selectedModes, setModes, md)}
              />
              <span className="text-xs">{md}</span>
            </label>
          ))}
        </div>
      }

      {/* Price Range */}
      <div className="mb-3 flex items-center gap-3">
        <span className="font-semibold text-xs">Price:</span>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={price[0]}
          onChange={e => setPrice([+e.target.value, price[1]])}
          className="range range-xs flex-1"
        />
        <span className="text-xs">{price[0]}</span>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={price[1]}
          onChange={e => setPrice([price[0], +e.target.value])}
          className="range range-xs flex-1"
        />
        <span className="text-xs">{price[1]}</span>
      </div>

      {/* Star Rating min */}
      <div className="mb-3 flex items-center gap-2">
        <span className="font-semibold text-xs">Min Rating:</span>
        {[0,1,2,3,4,5].map(r =>
          <button
            key={r}
            type="button"
            onClick={() => setMinRating(r)}
            className={`text-yellow-400 ${minRating >= r ? 'font-bold' : 'text-gray-400'}`}
          >
            ★
          </button>
        )}
        <span className="text-xs ml-2">{minRating}+</span>
      </div>

      {/* Sort */}
      <div className="mb-3">
        <label className="font-semibold text-xs mr-2">Sort by:</label>
        <select value={sort} onChange={e => setSort(e.target.value)} className="select select-sm select-bordered">
          <option value="relevance">Relevance</option>
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="top_seller">Top Seller</option>
        </select>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button className="btn btn-primary flex-1" onClick={handleApply}>Apply Filters</button>
        <button className="btn btn-outline flex-1" onClick={resetFilters}>Reset</button>
      </div>
    </div>
  );
}

export default ProductFilter;
