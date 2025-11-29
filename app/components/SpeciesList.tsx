import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import.meta.env.VITE_APP_BASE_URL;

const SpeciesList = () => {
  const [speciesList, setSpeciesList] = useState([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const fetchSpecies = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_APP_BASE_URL + "/api/species"
      );
      setSpeciesList(response.data);
    } catch (err) {
      toast.error("Failed to fetch species data");
    }
  };

  const toggleExpand = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    fetchSpecies();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full py-8 px-12">
        <div className="flex flex-row gap-4 items-center">
          <h1 className="text-[32px] font-bold underline underline-offset-8">
            Species List
          </h1>

          <Link
            to="/addSpecies"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium shadow bg-indigo-600 hover:bg-indigo-700 transition"
          >
            <span>Create Species</span>
          </Link>
        </div>

        {/* Species List */}
        <div className="mt-8 flex flex-col gap-4">
          {speciesList.length === 0 ? (
            <p className="text-gray-500">No species available.</p>
          ) : (
            speciesList.map((species: any, index: number) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={species.id}
                  className="w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow transition"
                >
                  {/* Header Button */}
                  <button
                    onClick={() => toggleExpand(index)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <h2 className="text-[22px] font-semibold">
                        {species.name}
                      </h2>

                      <span className="text-gray-600 text-[16px] px-3 py-1 bg-gray-100 rounded-full">
                        {species.sub_species.length} sub-species
                      </span>

                      <Link
                        to={`/Species/edit/${species._id}`}
                        className="inline-flex items-center text-[12px] gap-2 px-3 py-1 rounded-xl text-white font-medium shadow bg-gray-600 hover:bg-gray-700 transition"
                      >
                        <span>Edit Species</span>
                      </Link>
                    </div>

                    {/* Arrow Icon */}
                    <span
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {/* Sub Species Expand Section */}
                  <div
                    className={`transition-all duration-300  ${
                      isOpen
                        ? "max-h-96 py-4 overflow-auto"
                        : "max-h-0 overflow-hidden"
                    }`}
                  >
                    <div className="px-6 flex flex-col gap-2">
                      {species.sub_species.map(
                        (sub: string, subIndex: number) => (
                          <div
                            key={subIndex}
                            className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700"
                          >
                            {sub}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeciesList;
