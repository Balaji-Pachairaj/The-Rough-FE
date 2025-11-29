import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import.meta.env.VITE_APP_BASE_URL;

const EditSpecies = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [subSpecies, setSubSpecies] = useState([""]);
  const [loading, setLoading] = useState(false);

  // Fetch species by ID
  const fetchSpecies = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/species/${id}`
      );
      const data = response.data;

      setName(data.name || "");
      setSubSpecies(data.sub_species || [""]);
    } catch (err) {
      toast.error("Failed to load species data.");
    }
  };

  // Update sub-species
  const handleSubChange = (v, index) => {
    const updated = [...subSpecies];
    updated[index] = v;
    setSubSpecies(updated);
  };

  const addSubSpecies = () => setSubSpecies([...subSpecies, ""]);
  const removeSubSpecies = (i) =>
    setSubSpecies(subSpecies.filter((_, idx) => idx !== i));

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      sub_species: subSpecies.filter((s) => s.trim() !== ""),
    };

    try {
      setLoading(true);
      await axios.put(
        import.meta.env.VITE_APP_BASE_URL + `/api/species/update/${id}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Species updated successfully!");
      navigate("/speciesList");
    } catch (err) {
      toast.error("Failed to update species.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-4">Edit Species</h1>
        <p className="text-gray-600 mb-6">Modify the species details below.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Species Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter species name"
              className="w-full px-4 py-3 mt-2 border rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none"
              required
            />
          </div>

          {/* Sub Species */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Sub Species
              </label>

              <button
                type="button"
                onClick={addSubSpecies}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
              >
                + Add Sub Species
              </button>
            </div>

            <div className="space-y-3">
              {subSpecies.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <input
                    type="text"
                    value={s}
                    onChange={(e) => handleSubChange(e.target.value, i)}
                    placeholder={`Sub-species ${i + 1}`}
                    className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                  />

                  {subSpecies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubSpecies(i)}
                      className="w-12 h-12 flex items-center justify-center rounded-lg border text-red-500 hover:bg-red-50"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-medium ${
              loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            } transition`}
          >
            {loading ? "Updating..." : "Update Species"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSpecies;
