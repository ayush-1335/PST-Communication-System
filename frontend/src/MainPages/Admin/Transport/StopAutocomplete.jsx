import { useState, useEffect } from "react";

const StopAutocomplete = ({ index, stop, handleStopChange }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  useEffect(() => {
    setQuery(stop.stopName || "");
  }, [stop.stopName]);

  const handleSearch = async (value) => {
    setQuery(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&apiKey=${API_KEY}`
      );

      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelect = (place) => {
    const { lat, lon, formatted } = place.properties;

    handleStopChange(index, "stopName", formatted);
    handleStopChange(index, "latitude", lat);
    handleStopChange(index, "longitude", lon);

    setQuery(formatted);
    setSuggestions([]);
  };

  return (
    <div className="relative w-64">
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search location"
        className="border px-2 py-1 rounded w-full"
      />

      {suggestions.length > 0 && (
        <div className="absolute bg-white border w-full max-h-40 overflow-y-auto z-10">
          {suggestions.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSelect(item)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {item.properties.formatted}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StopAutocomplete;