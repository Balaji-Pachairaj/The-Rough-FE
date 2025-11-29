import React, { useState } from "react";
import axios from "axios";
import.meta.env.VITE_APP_BASE_URL;

const SpeciesAddForm = () => {
  const [name, setName] = useState("");
  const [subSpecies, setSubSpecies] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const addSubSpecies = () => setSubSpecies((s) => [...s, ""]);

  const handleSubChange = (value, index) => {
    setSubSpecies((s) => {
      const copy = [...s];
      copy[index] = value;
      return copy;
    });
  };

  const removeSubSpecies = (index) => {
    setSubSpecies((s) => s.filter((_, i) => i !== index));
  };

  const validPayload = () => {
    const trimmedSubs = subSpecies.map((x) => x.trim()).filter(Boolean);
    return name.trim() !== "" && trimmedSubs.length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validPayload()) {
      setMessage({
        type: "error",
        text: "Please provide name and at least one sub-species.",
      });
      return;
    }

    const payload = {
      name: name.trim(),
      sub_species: subSpecies.map((s) => s.trim()).filter(Boolean),
    };

    try {
      setLoading(true);
      setMessage(null);
      await axios.post(
        import.meta.env.VITE_APP_BASE_URL + "/api/species/create",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setMessage({ type: "success", text: "Species created successfully." });
      setName("");
      setSubSpecies([""]);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to create species.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
          Create Species
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Add a species name and one or more sub-species.
        </p>

        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded-md text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Species Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. First Species"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              required
            />
          </div>

          {/* Sub-species list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Sub-species
              </label>
              <button
                type="button"
                onClick={addSubSpecies}
                className="inline-flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg shadow-sm transition"
              >
                + Add
              </button>
            </div>

            <div className="space-y-3">
              {subSpecies.map((value, idx) => (
                <div key={idx} className="flex gap-3">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleSubChange(e.target.value, idx)}
                    placeholder={`Sub-species ${idx + 1}`}
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                    required={idx === 0} // at least first is required visually
                  />

                  {subSpecies.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeSubSpecies(idx)}
                      className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-200 text-red-600 hover:bg-red-50 transition"
                      aria-label={`Remove sub-species ${idx + 1}`}
                    >
                      ✕
                    </button>
                  ) : (
                    <div className="w-12" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!validPayload() || loading}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium shadow ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } transition`}
            >
              {loading ? (
                <svg
                  className="w-5 h-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-25"
                  />
                  <path
                    d="M4 12a8 8 0 018-8"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-75"
                  />
                </svg>
              ) : null}
              <span>{loading ? "Creating..." : "Create Species"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setName("");
                setSubSpecies([""]);
                setMessage(null);
              }}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            >
              Reset
            </button>
          </div>

          <p className="text-xs text-gray-400">
            Tip: press "+ Add" to add more sub-species inputs.
          </p>
        </form>
      </div>
    </div>
  );
};

export default SpeciesAddForm;
